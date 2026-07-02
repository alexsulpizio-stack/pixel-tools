import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { Dropzone } from "../components/Dropzone";
import { AdSlot } from "../components/AdSlot";
import { usePageMeta } from "../lib/usePageMeta";
import { ROUTE_META } from "../lib/routeMeta";
import { downloadBlob, formatBytes, withExtension } from "../lib/imageCanvas";

type Out = "image/jpeg" | "image/png";

interface Converted {
  name: string;
  originalSize: number;
  blob: Blob;
  url: string;
}

const isHeic = (f: File) =>
  /image\/hei[cf]/i.test(f.type) || /\.(heic|heif)$/i.test(f.name);

const FAQ = [
  { q: "Why are my iPhone photos in HEIC?", a: "Since iOS 11, iPhones save photos as HEIC (High Efficiency Image Container) by default — it stores the same quality in about half the space of JPEG, but many apps and Windows PCs can't open it." },
  { q: "Is quality lost when converting?", a: "Converting to PNG is lossless. Converting to JPG is very high quality at the default setting; any loss is imperceptible for normal use." },
  { q: "Do my photos get uploaded?", a: "No. The HEIC is decoded in your browser using WebAssembly, so the photo never leaves your device — ideal for personal pictures." },
  { q: "Can I convert many at once?", a: "Yes. Drop in multiple HEIC files and download each result. Large batches take a little longer because decoding HEIC is CPU-intensive." },
];

export default function HeicToJpgPage() {
  usePageMeta(ROUTE_META["/heic-to-jpg"].title, ROUTE_META["/heic-to-jpg"].description);

  const [format, setFormat] = useState<Out>("image/jpeg");
  const [results, setResults] = useState<Converted[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onFiles = useCallback(
    async (files: File[]) => {
      setBusy(true);
      setError("");
      try {
        const { default: heic2any } = await import("heic2any");
        const ext = format === "image/png" ? "png" : "jpg";
        const out: Converted[] = [];
        for (const f of files) {
          try {
            const converted = (await heic2any({ blob: f, toType: format, quality: 0.92 })) as Blob | Blob[];
            const blob = Array.isArray(converted) ? converted[0] : converted;
            out.push({
              name: withExtension(f.name, ext),
              originalSize: f.size,
              blob,
              url: URL.createObjectURL(blob),
            });
          } catch {
            setError("One or more files couldn't be decoded. Make sure they're genuine HEIC/HEIF photos.");
          }
        }
        setResults((prev) => [...prev, ...out]);
      } catch {
        setError("Couldn't load the HEIC decoder. Check your connection and try again.");
      } finally {
        setBusy(false);
      }
    },
    [format]
  );

  return (
    <>
      <section className="hero">
        <h1>HEIC to JPG converter</h1>
        <p>
          Convert iPhone HEIC photos to standard JPG or PNG that opens everywhere. Batch convert in your
          browser — no uploads, no sign-up, and your photos never leave your device.
        </p>
      </section>

      <AdSlot variant="banner" />

      <div className="settings">
        <div className="settings__group">
          <span className="settings__label">Convert to</span>
          <div className="segmented">
            <button className={`segmented__btn ${format === "image/jpeg" ? "segmented__btn--on" : ""}`} onClick={() => setFormat("image/jpeg")}>JPG</button>
            <button className={`segmented__btn ${format === "image/png" ? "segmented__btn--on" : ""}`} onClick={() => setFormat("image/png")}>PNG</button>
          </div>
        </div>
      </div>

      <Dropzone
        onFiles={onFiles}
        busy={busy}
        accept=".heic,.heif,image/heic,image/heif"
        validate={isHeic}
        hint="HEIC · HEIF — decoded locally in your browser, never uploaded"
      />

      {error && <p className="error">{error}</p>}

      {results.length > 0 && (
        <section className="results">
          <div className="results__bar">
            <p className="results__summary">{results.length} converted photo{results.length > 1 ? "s" : ""}</p>
          </div>
          <div className="results__grid">
            {results.map((r) => (
              <div className="card" key={r.url}>
                <img className="card__thumb" src={r.url} alt={r.name} loading="lazy" />
                <div className="card__body">
                  <p className="card__name" title={r.name}>{r.name}</p>
                  <p className="card__meta">{formatBytes(r.originalSize)} → <strong>{formatBytes(r.blob.size)}</strong></p>
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
        <h2>How to convert HEIC to JPG</h2>
        <ul>
          <li><strong>1.</strong> Choose JPG (best compatibility) or PNG (lossless).</li>
          <li><strong>2.</strong> Drop in one or more <code>.heic</code> files from your iPhone.</li>
          <li><strong>3.</strong> Each photo is decoded in your browser and shown as a standard image.</li>
          <li><strong>4.</strong> Download the converted files.</li>
        </ul>
        <p>
          Want to shrink the results too? Run them through the <Link to="/">compressor</Link> or{" "}
          <Link to="/resize-image">resizer</Link> afterwards. New to HEIC? Read{" "}
          <Link to="/guides/what-is-heic-and-how-to-convert-it">what HEIC is and how to convert it</Link>.
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
