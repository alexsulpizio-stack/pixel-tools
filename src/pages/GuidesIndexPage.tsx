import { Link } from "react-router-dom";
import { AdSlot } from "../components/AdSlot";
import { usePageMeta } from "../lib/usePageMeta";
import { ROUTE_META } from "../lib/routeMeta";
import { GUIDES_META } from "../content/guides";

export default function GuidesIndexPage() {
  usePageMeta(ROUTE_META["/guides"].title, ROUTE_META["/guides"].description);

  return (
    <>
      <section className="hero">
        <h1>Guides</h1>
        <p>
          Practical, no-fluff guides on compressing, converting, and working with images and QR codes —
          written by the people who built the tools.
        </p>
      </section>

      <AdSlot variant="banner" />

      <section className="guide-cards">
        <div className="guide-cards__grid">
          {GUIDES_META.map((g) => (
            <Link key={g.slug} to={`/guides/${g.slug}`} className="guide-card">
              <h3>{g.title.replace(" | PixelTools", "")}</h3>
              <p>{g.excerpt}</p>
              <span className="guide-card__meta">{g.readingMinutes} min read</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="prose">
        <h2>Jump straight to a tool</h2>
        <ul>
          <li><Link to="/">Image compressor, resizer & converter</Link></li>
          <li><Link to="/favicon-generator">Favicon generator</Link></li>
          <li><Link to="/qr-code-generator">QR code generator</Link></li>
          <li><Link to="/color-palette">Color palette extractor</Link></li>
          <li><Link to="/image-to-pdf">Image to PDF converter</Link></li>
        </ul>
      </section>

      <AdSlot variant="box" />
    </>
  );
}
