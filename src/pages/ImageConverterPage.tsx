import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { Dropzone } from "../components/Dropzone";
import { AdSlot } from "../components/AdSlot";
import { usePageMeta } from "../lib/usePageMeta";
import { ROUTE_META } from "../lib/routeMeta";
import { canvasToBlob, downloadBlob, formatBytes, loadImage, withExtension } from "../lib/imageCanvas";

type Fmt = "image/webp" | "image/jpeg" | "image/png";

const FORMATS: { value: Fmt; label: string; ext: string }[] = [
  { value: "image/webp", label: "WebP", ext: "webp" },
  { value: "image/jpeg", label: "JPG", ext: "jpg" },
  { value: "image/png", label: "PNG", ext: "png" },
];

interface Result {
  name: string;
  originalSize: number;
  blob: Blob;
  url: string;
}

const FAQ = [
  { q: "Which format should I choose?", a: "WebP for the web — it's the smallest at great quality and supports transparency. JPG for maximum compatibility with older software. PNG when you need lossless quality or transparency." },
  { q: "Does converting to JPG remove transparency?", a: "Yes — JPG has no transparency, so transparent areas are filled with white. Use WebP or PNG if you need to keep transparency." },
  { q: "Are my images uploaded?", a: "No. Conversion happens in your browser with the Canvas API; your files never leave your device." },
];

export default function ImageConverterPage() {
  usePageMeta(ROUTE_META["/image-converter"].title, ROUTE_META["/image-converter"].description);

  const [format, setFormat] = useState<Fmt>("image/webp");
  const [quality, setQuality] = useState(85);
  const [results, setResults] = useState<Result[]>([]);
  const [busy, setBusy] = useState(false);

  const lossy = format !== "image/png";

  const onFiles = useCallback(
    async (files: File[]) => {
      setBusy(true);
      const meta = FORMATS.find((f) => f.value === format)!;
      const out: Result[] = [];
      for (const f of files) {
        try {
          const { bitmap } = await loadImage(f);
          const canvas = document.createElement("canvas");
          canvas.width = bitmap.width;
          canvas.height = bitmap.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) continue;
          if (format === "image/jpeg") { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, canvas.width, canvas.height); }
          ctx.drawImage(bitmap, 0, 0);
          bitmap.close();
          const blob = await canvasToBlob(canvas, format, quality / 100);
          out.push({ name: withExtension(f.name, meta.ext), originalSize: f.size, blob, url: URL.createObjectURL(blob) });
        } catch { /* skip */ }
      }
      setResults((prev) => [...prev, ...out]);
      setBusy(false);
    },
    [format, quality]
  );

  return (
    <>
      <section className="hero">
        <h1>Image converter — JPG, PNG & WebP</h1>
        <p>
          Convert images between JPG, PNG, and WebP in batches, right in your browser. Adjust quality,
          keep transparency where it's supported, and download. No uploads, no sign-up.
        </p>
      </section>

      <AdSlot variant="banner" />

      <div className="settings">
        <div className="settings__group">
          <span className="settings__label">Convert to</span>
          <div className="segmented">
            {FORMATS.map((f) => (
              <button key={f.value} className={`segmented__btn ${format === f.value ? "segmented__btn--on" : ""}`} onClick={() => setFormat(f.value)}>{f.label}</button>
            ))}
          </div>
        </div>
        <div className={`settings__group ${lossy ? "" : "settings__group--disabled"}`}>
          <span className="settings__label">Quality: {quality}%</span>
          <input type="range" min={40} max={100} value={quality} disabled={!lossy} onChange={(e) => setQuality(Number(e.target.value))} />
          <span className="settings__note">{lossy ? "Lower = smaller file" : "PNG is lossless"}</span>
        </div>
      </div>

      <Dropzone onFiles={onFiles} busy={busy} />

      {results.length > 0 && (
        <section className="results">
          <div className="results__bar">
            <p className="results__summary">{results.length} converted image{results.length > 1 ? "s" : ""}</p>
          </div>
          <div className="results__grid">
            {results.map((r) => {
              const pct = Math.round((1 - r.blob.size / r.originalSize) * 100);
              return (
                <div className="card" key={r.url}>
                  <img className="card__thumb" src={r.url} alt={r.name} loading="lazy" />
                  <div className="card__body">
                    <p className="card__name" title={r.name}>{r.name}</p>
                    <p className="card__meta">{formatBytes(r.originalSize)} → <strong>{formatBytes(r.blob.size)}</strong></p>
                    {pct > 0 && <span className="badge badge--good">{pct}% smaller</span>}
                  </div>
                  <div className="card__actions">
                    <button className="btn btn--primary btn--sm" onClick={() => downloadBlob(r.blob, r.name)}>Download</button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="prose tool-prose">
        <h2>How to convert an image</h2>
        <ul>
          <li><strong>1.</strong> Pick your target format — WebP for the web, JPG for compatibility, PNG for lossless/transparency.</li>
          <li><strong>2.</strong> Set a quality level for the lossy formats.</li>
          <li><strong>3.</strong> Drop your images and download the converted files.</li>
        </ul>
        <p>
          Not sure which format to pick? Our guide on{" "}
          <Link to="/guides/jpeg-vs-png-vs-webp">JPEG vs PNG vs WebP</Link> breaks it down, and{" "}
          <Link to="/guides/convert-png-to-webp">converting PNG to WebP</Link> covers the most common
          case. Coming from an iPhone photo? Use the{" "}
          <Link to="/heic-to-jpg">HEIC to JPG converter</Link> first.
        </p>
      </section>

      <section className="faq" id="faq">
        <h2>Frequently asked questions</h2>
        {FAQ.map((item) => (
          <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>
        ))}
      </section>

      <AdSlot variant="box" />
    </>
  );
}
