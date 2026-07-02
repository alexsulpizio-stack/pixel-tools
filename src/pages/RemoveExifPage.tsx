import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { Dropzone } from "../components/Dropzone";
import { AdSlot } from "../components/AdSlot";
import { usePageMeta } from "../lib/usePageMeta";
import { ROUTE_META } from "../lib/routeMeta";
import { canvasToBlob, downloadBlob, formatBytes, loadImage, withExtension } from "../lib/imageCanvas";

interface Cleaned {
  name: string;
  originalSize: number;
  blob: Blob;
  url: string;
}

const FAQ = [
  { q: "What metadata is removed?", a: "Re-encoding the image through a canvas discards all EXIF data — GPS coordinates, camera make and model, lens, exposure settings, and the original date and time." },
  { q: "Why does this matter for privacy?", a: "Photos taken on phones often embed the exact GPS location and timestamp. Sharing them can unintentionally reveal where you live, work, or were at a given moment." },
  { q: "Does it change how the photo looks?", a: "No visible change. Pixels are preserved; only the hidden metadata is dropped. Output is a clean JPEG or PNG." },
  { q: "Are my images uploaded?", a: "Never. Stripping metadata happens entirely in your browser, which is exactly why it's safe for sensitive photos." },
];

export default function RemoveExifPage() {
  usePageMeta(ROUTE_META["/remove-exif"].title, ROUTE_META["/remove-exif"].description);

  const [results, setResults] = useState<Cleaned[]>([]);
  const [busy, setBusy] = useState(false);

  const onFiles = useCallback(async (files: File[]) => {
    setBusy(true);
    const out: Cleaned[] = [];
    for (const f of files) {
      try {
        const { bitmap } = await loadImage(f);
        const canvas = document.createElement("canvas");
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) continue;
        const isPng = f.type === "image/png";
        if (!isPng) { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, canvas.width, canvas.height); }
        ctx.drawImage(bitmap, 0, 0);
        bitmap.close();
        const type = isPng ? "image/png" : "image/jpeg";
        const blob = await canvasToBlob(canvas, type, 0.95);
        out.push({ name: withExtension(`clean-${f.name}`, isPng ? "png" : "jpg"), originalSize: f.size, blob, url: URL.createObjectURL(blob) });
      } catch { /* skip */ }
    }
    setResults((prev) => [...prev, ...out]);
    setBusy(false);
  }, []);

  return (
    <>
      <section className="hero">
        <h1>Remove EXIF & metadata from photos</h1>
        <p>
          Strip hidden data — GPS location, camera model, and timestamps — from your images before you
          share them. Everything runs in your browser, so your photos are never uploaded.
        </p>
      </section>

      <AdSlot variant="banner" />

      <Dropzone onFiles={onFiles} busy={busy} />

      {results.length > 0 && (
        <section className="results">
          <div className="results__bar">
            <p className="results__summary">{results.length} cleaned image{results.length > 1 ? "s" : ""} · metadata removed</p>
          </div>
          <div className="results__grid">
            {results.map((r) => (
              <div className="card" key={r.url}>
                <img className="card__thumb" src={r.url} alt={r.name} loading="lazy" />
                <div className="card__body">
                  <p className="card__name" title={r.name}>{r.name}</p>
                  <p className="card__meta">{formatBytes(r.originalSize)} → <strong>{formatBytes(r.blob.size)}</strong></p>
                  <span className="badge badge--good">EXIF removed ✓</span>
                </div>
                <div className="card__actions">
                  <button className="btn btn--primary btn--sm" onClick={() => downloadBlob(r.blob, r.name)}>Download</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="prose tool-prose">
        <h2>Why remove image metadata?</h2>
        <p>
          Most photos carry <strong>EXIF metadata</strong> — a hidden record embedded by the camera. On
          phones this frequently includes the <strong>exact GPS coordinates</strong> where the photo was
          taken, the date and time, and the device model. When you post or send that photo, anyone who
          downloads it can read that data and learn where you were.
        </p>
        <ul>
          <li><strong>1.</strong> Drop in one or more photos.</li>
          <li><strong>2.</strong> Each is instantly re-encoded, discarding all metadata while keeping the picture identical.</li>
          <li><strong>3.</strong> Download the clean copies.</li>
        </ul>
        <p>
          Because this runs locally, it's genuinely private — appropriate even for sensitive images. You
          can also <Link to="/">compress</Link> or <Link to="/resize-image">resize</Link> the cleaned
          photos before sharing.
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
