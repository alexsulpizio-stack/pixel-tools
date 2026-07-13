import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { pathToFileURL } from "node:url";
import { STATIC_ROUTE_META, type RouteMeta } from "../src/lib/routeMeta";
import { TARGET_PAGES } from "../src/lib/targetPages";
import { GUIDES_META } from "../src/content/guides";
import { TOOLS_META } from "../src/content/tools";

const DIST = "dist";
const ORIGIN = "https://usepixeltools.com";

const ORG_ID = `${ORIGIN}/#organization`;
const SITE_ID = `${ORIGIN}/#website`;

const TARGET_BY_PATH = new Map(TARGET_PAGES.map((p) => [`/${p.slug}`, p]));
const GUIDE_BY_PATH = new Map(GUIDES_META.map((g) => [`/guides/${g.slug}`, g]));
const TOOL_BY_PATH = new Map(TOOLS_META.map((t) => [t.path, t]));
const STATIC_NAME: Record<string, string> = {
  "/tools": "All tools",
  "/guides": "Guides",
  "/about": "About",
  "/contact": "Contact",
  "/privacy": "Privacy",
};

const stripBrand = (title: string) => title.replace(/\s*[|—-]\s*PixelTools.*$/, "").trim();

/** Build a JSON-LD <script> with an @graph appropriate for the route. */
function buildJsonLd(meta: RouteMeta): string {
  const url = `${ORIGIN}${meta.path}`;
  const graph: Record<string, unknown>[] = [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: "PixelTools",
      url: `${ORIGIN}/`,
      logo: `${ORIGIN}/favicon.svg`,
    },
    {
      "@type": "WebSite",
      "@id": SITE_ID,
      url: `${ORIGIN}/`,
      name: "PixelTools",
      publisher: { "@id": ORG_ID },
    },
  ];

  // Breadcrumbs for every non-home page.
  const crumb = (name: string, item: string, position: number) => ({
    "@type": "ListItem",
    position,
    name,
    item,
  });
  if (meta.path !== "/") {
    const items = [crumb("Home", `${ORIGIN}/`, 1)];
    const guide = GUIDE_BY_PATH.get(meta.path);
    const target = TARGET_BY_PATH.get(meta.path);
    const tool = TOOL_BY_PATH.get(meta.path);
    if (guide) {
      items.push(crumb("Guides", `${ORIGIN}/guides`, 2));
      items.push(crumb(stripBrand(guide.title), url, 3));
    } else if (target) {
      items.push(crumb("All tools", `${ORIGIN}/tools`, 2));
      items.push(crumb(target.h1, url, 3));
    } else if (tool) {
      items.push(crumb("All tools", `${ORIGIN}/tools`, 2));
      items.push(crumb(tool.name, url, 3));
    } else {
      items.push(crumb(STATIC_NAME[meta.path] ?? stripBrand(meta.title), url, 2));
    }
    graph.push({ "@type": "BreadcrumbList", itemListElement: items });
  }

  // Page-type-specific node.
  const guide = GUIDE_BY_PATH.get(meta.path);
  const target = TARGET_BY_PATH.get(meta.path);
  const tool = TOOL_BY_PATH.get(meta.path);
  if (guide) {
    graph.push({
      "@type": "Article",
      headline: stripBrand(guide.title),
      description: guide.description,
      datePublished: guide.updated,
      dateModified: guide.updated,
      author: { "@id": ORG_ID },
      publisher: { "@id": ORG_ID },
      mainEntityOfPage: url,
    });
  } else if (tool || meta.path === "/") {
    const name = tool ? tool.name : "PixelTools Image Compressor";
    graph.push({
      "@type": "SoftwareApplication",
      name,
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Web browser",
      url,
      description: meta.description,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    });
  }

  // FAQ schema where we have the data centralized (target-size pages).
  if (target) {
    graph.push({
      "@type": "SoftwareApplication",
      name: target.h1,
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Web browser",
      url,
      description: meta.description,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    });
    graph.push({
      "@type": "FAQPage",
      mainEntity: target.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }

  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(
    /</g,
    "\\u003c"
  );
  return `<script type="application/ld+json">${json}</script>`;
}

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
    )
    .replace(/<\/head>/, `  ${buildJsonLd(meta)}\n  </head>`);

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
