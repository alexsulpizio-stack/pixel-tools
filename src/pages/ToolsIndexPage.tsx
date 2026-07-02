import { Link } from "react-router-dom";
import { AdSlot } from "../components/AdSlot";
import { usePageMeta } from "../lib/usePageMeta";
import { ROUTE_META } from "../lib/routeMeta";
import { TOOLS_META } from "../content/tools";

export default function ToolsIndexPage() {
  usePageMeta(ROUTE_META["/tools"].title, ROUTE_META["/tools"].description);

  return (
    <>
      <section className="hero">
        <h1>All image tools</h1>
        <p>
          A growing set of free, private image utilities that run entirely in your browser — no uploads,
          no sign-up, no watermarks.
        </p>
      </section>

      <AdSlot variant="banner" />

      <section className="guide-cards">
        <div className="guide-cards__grid">
          {TOOLS_META.map((t) => (
            <Link key={t.path} to={t.path} className="guide-card tool-card">
              <span className="tool-card__emoji">{t.emoji}</span>
              <h3>{t.name}</h3>
              <p>{t.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="prose">
        <h2>Learn more in our guides</h2>
        <ul>
          <li><Link to="/guides/how-to-compress-images-without-losing-quality">How to compress images without losing quality</Link></li>
          <li><Link to="/guides/jpeg-vs-png-vs-webp">JPEG vs PNG vs WebP</Link></li>
          <li><Link to="/guides/favicon-sizes-guide">Favicon sizes in 2026</Link></li>
          <li><Link to="/guides">Browse all guides →</Link></li>
        </ul>
      </section>

      <AdSlot variant="box" />
    </>
  );
}
