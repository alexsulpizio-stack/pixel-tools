import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { pathToFileURL } from "node:url";
import { STATIC_ROUTE_META, type RouteMeta } from "../src/lib/routeMeta";
import { TARGET_PAGES } from "../src/lib/targetPages";
import { GUIDES_META } from "../src/content/guides";

const DIST = "dist";
const ORIGIN = "https://usepixeltools.com";

const template = readFileSync(join(DIST, "index.html"), "utf8");

// Server-render function, produced by the SSR build (vite build --ssr).
const { render } = (await import(
  pathToFileURL(join("dist-server", "entry-server.js")).href
)) as { render: (url: string) => string };

const targetMeta: RouteMeta[] = TARGET_PAGES.map((p) => ({
  path: `/${p.slug}`,
  title: p.title,
  description: p.description,
}));

const guideMeta: RouteMeta[] = GUIDES_META.map((g) => ({
  path: `/guides/${g.slug}`,
  title: g.title,
  description: g.description,
}));

const routes: RouteMeta[] = [...STATIC_ROUTE_META, ...targetMeta, ...guideMeta];

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function renderPage(meta: RouteMeta): string {
  const canonical = `${ORIGIN}${meta.path}`;
  const title = escapeHtml(meta.title);
  const desc = escapeAttr(meta.description);

  const withHead = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/>/,
      `<meta name="description" content="${desc}" />`
    )
    .replace(
      /<meta property="og:title" content="[\s\S]*?" \/>/,
      `<meta property="og:title" content="${escapeAttr(meta.title)}" />`
    )
    .replace(
      /<meta property="og:description" content="[\s\S]*?" \/>/,
      `<meta property="og:description" content="${desc}" />`
    )
    .replace(
      /<meta property="og:url" content="[\s\S]*?" \/>/,
      `<meta property="og:url" content="${canonical}" />`
    )
    .replace(
      /<link rel="canonical" href="[\s\S]*?" \/>/,
      `<link rel="canonical" href="${canonical}" />`
    );

  // Inject the server-rendered app so crawlers receive real, unique content
  // in the initial HTML (not an empty <div id="root">).
  const body = render(meta.path);
  return withHead.replace(
    /<div id="root">\s*<\/div>/,
    `<div id="root">${body}</div>`
  );
}

let count = 0;
for (const meta of routes) {
  const html = renderPage(meta);
  if (meta.path === "/") {
    writeFileSync(join(DIST, "index.html"), html);
  } else {
    // Flat <route>.html (not <route>/index.html) so Cloudflare Pages serves
    // /about at 200 with no trailing-slash 308 redirect, matching our canonical.
    const slug = meta.path.replace(/^\//, "");
    const dir = join(DIST, dirname(slug));
    if (dir !== DIST) mkdirSync(dir, { recursive: true });
    writeFileSync(join(DIST, `${slug}.html`), html);
  }
  count++;
}

// Sanity check: every route must end up with a unique canonical.
const canonicals = new Set(routes.map((r) => `${ORIGIN}${r.path}`));
if (canonicals.size !== routes.length) {
  throw new Error("Prerender produced duplicate canonicals — check route definitions.");
}

console.log(`Prerendered ${count} routes with per-page canonical tags.`);
