import type { ComponentType } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { AdSlot } from "../components/AdSlot";
import { usePageMeta } from "../lib/usePageMeta";
import { GUIDES_BY_SLUG, GUIDES_META } from "../content/guides";
import HowToCompress from "../content/guides/how-to-compress-images-without-losing-quality";
import Formats from "../content/guides/jpeg-vs-png-vs-webp";
import FaviconSizes from "../content/guides/favicon-sizes-guide";
import ReduceFileSize from "../content/guides/reduce-image-file-size-for-email-and-web";
import QrCodes from "../content/guides/qr-codes-explained";
import ResizeGuide from "../content/guides/resize-image-to-exact-dimensions";
import CircleCropGuide from "../content/guides/crop-photo-into-a-circle";
import RemoveExifGuide from "../content/guides/remove-exif-location-data-from-photos";
import DataUriGuide from "../content/guides/data-uri-base64-images-explained";

const ARTICLES: Record<string, ComponentType> = {
  "how-to-compress-images-without-losing-quality": HowToCompress,
  "jpeg-vs-png-vs-webp": Formats,
  "favicon-sizes-guide": FaviconSizes,
  "reduce-image-file-size-for-email-and-web": ReduceFileSize,
  "qr-codes-explained": QrCodes,
  "resize-image-to-exact-dimensions": ResizeGuide,
  "crop-photo-into-a-circle": CircleCropGuide,
  "remove-exif-location-data-from-photos": RemoveExifGuide,
  "data-uri-base64-images-explained": DataUriGuide,
};

export default function GuidePage() {
  const { slug = "" } = useParams();
  const meta = GUIDES_BY_SLUG[slug];
  const Article = ARTICLES[slug];

  usePageMeta(
    meta?.title ?? "Guide not found | PixelTools",
    meta?.description ?? "The guide you were looking for could not be found."
  );

  if (!meta || !Article) {
    return <Navigate to="/guides" replace />;
  }

  const related = GUIDES_META.filter((g) => g.slug !== slug).slice(0, 3);

  return (
    <>
      <p className="breadcrumb">
        <Link to="/guides">← All guides</Link>
      </p>

      <AdSlot variant="banner" />

      <article className="prose">
        <Article />
        <p className="prose__meta">Last reviewed {meta.updated} · {meta.readingMinutes} min read</p>
      </article>

      <section className="guide-cards" aria-label="Related guides">
        <h2>Keep reading</h2>
        <div className="guide-cards__grid">
          {related.map((g) => (
            <Link key={g.slug} to={`/guides/${g.slug}`} className="guide-card">
              <h3>{g.title.replace(" | PixelTools", "")}</h3>
              <p>{g.excerpt}</p>
              <span className="guide-card__meta">{g.readingMinutes} min read</span>
            </Link>
          ))}
        </div>
      </section>

      <AdSlot variant="box" />
    </>
  );
}
