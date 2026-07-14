import { Link, useLocation } from "react-router-dom";
import { RELATED, TARGET_RELATED, type Relation } from "../content/related";
import { TOOLS_META } from "../content/tools";
import { GUIDES_BY_SLUG } from "../content/guides";
import { TARGET_PAGES } from "../lib/targetPages";

const TOOLS_BY_PATH = new Map(TOOLS_META.map((t) => [t.path, t]));
const TARGET_PATHS = new Set(TARGET_PAGES.map((p) => `/${p.slug}`));

const stripBrand = (title: string) => title.replace(/\s*[|—-]\s*PixelTools.*$/, "").trim();

/**
 * Curated "Related tools / Related guides" block shown at the foot of every
 * content page. Lives in the shared layout so it appears (and is server-
 * rendered) on all tool, guide, and target-size pages automatically.
 */
export function RelatedLinks() {
  const { pathname } = useLocation();

  const relation: Relation | undefined =
    RELATED[pathname] ?? (TARGET_PATHS.has(pathname) ? TARGET_RELATED : undefined);

  if (!relation) return null;

  const tools = relation.tools
    .map((p) => TOOLS_BY_PATH.get(p))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  const guides = relation.guides
    .map((path) => {
      const slug = path.replace(/^\/guides\//, "");
      const meta = GUIDES_BY_SLUG[slug];
      return meta ? { path, title: stripBrand(meta.title), excerpt: meta.excerpt } : null;
    })
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  if (tools.length === 0 && guides.length === 0) return null;

  return (
    <aside className="related" aria-label="Related tools and guides">
      {tools.length > 0 && (
        <section className="related__section">
          <h2 className="related__title">Related tools</h2>
          <div className="guide-cards__grid">
            {tools.map((t) => (
              <Link key={t.path} to={t.path} className="guide-card tool-card">
                <span className="tool-card__emoji">{t.emoji}</span>
                <h3>{t.name}</h3>
                <p>{t.blurb}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {guides.length > 0 && (
        <section className="related__section">
          <h2 className="related__title">Related guides</h2>
          <ul className="related__guides">
            {guides.map((gd) => (
              <li key={gd.path}>
                <Link to={gd.path}>{gd.title}</Link>
                <span className="related__excerpt">{gd.excerpt}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </aside>
  );
}
