import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { STATIC_ROUTE_META, type RouteMeta } from "../src/lib/routeMeta";
import { TARGET_PAGES } from "../src/lib/targetPages";

const DIST = "dist";
const ORIGIN = "https://usepixeltools.com";

const template = readFileSync(join(DIST, "index.html"), "utf8");

const targetMeta: RouteMeta[] = TARGET_PAGES.map((p) => ({
  path: `/${p.slug}`,
  title: p.title,
  description: p.description,
}));

const routes: RouteMeta[] = [...STATIC_ROUTE_META, ...targetMeta];

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function renderHead(meta: RouteMeta): string {
  const canonical = `${ORIGIN}${meta.path}`;
  const title = escapeHtml(meta.title);
  const desc = escapeAttr(meta.description);

  return template
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
}

let count = 0;
for (const meta of routes) {
  const html = renderHead(meta);
  if (meta.path === "/") {
    writeFileSync(join(DIST, "index.html"), html);
  } else {
    const dir = join(DIST, meta.path.replace(/^\//, ""));
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "index.html"), html);
  }
  count++;
}

// Sanity check: every route must end up with a unique canonical.
const canonicals = new Set(routes.map((r) => `${ORIGIN}${r.path}`));
if (canonicals.size !== routes.length) {
  throw new Error("Prerender produced duplicate canonicals — check route definitions.");
}

console.log(`Prerendered ${count} routes with per-page canonical tags.`);
