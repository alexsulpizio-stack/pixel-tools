import { useCallback, useEffect, useState } from "react";
import { Dropzone } from "../components/Dropzone";
import { AdSlot } from "../components/AdSlot";
import { usePageMeta } from "../lib/usePageMeta";
import { ROUTE_META } from "../lib/routeMeta";
import type { PageFormat } from "../lib/pdfBuilder";
import { formatBytes } from "../lib/imageProcessor";

const FORMATS: { value: PageFormat; label: string }[] = [
  { value: "fit", label: "Fit to image" },
  { value: "a4", label: "A4" },
  { value: "letter", label: "Letter" },
];

const MARGINS: { value: number; label: string }[] = [
  { value: 0, label: "None" },
  { value: 24, label: "Small" },
  { value: 48, label: "Medium" },
  { value: 72, label: "Large" },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "Are my images or the PDF uploaded anywhere?",
    a: "No. The PDF is assembled entirely in your browser — your images and the finished document never leave your device.",
  },
  {
    q: "Can I combine multiple images into one PDF?",
    a: "Yes — add as many images as you like; each becomes its own page in the order shown. Use the arrows to reorder pages before downloading.",
  },
  {
    q: "What do the page size options mean?",
    a: "\"Fit to image\" makes each PDF page exactly the size of its image — best for screenshots and digital documents. A4 and Letter center each image on a standard page — best for printing.",
  },
  {
    q: "What image formats are supported?",
    a: "JPG, PNG, WebP, GIF, BMP, and AVIF. Transparent areas are rendered on a white background.",
  },
];

interface Item {
  file: File;
  url: string;
}

export default function PdfPage() {
  usePageMeta(ROUTE_META["/image-to-pdf"].title, ROUTE_META["/image-to-pdf"].description);

  const [items, setItems] = useState<Item[]>([]);
  const [format, setFormat] = useState<PageFormat>("fit");
  const [margin, setMargin] = useState(24);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => () => items.forEach((i) => URL.revokeObjectURL(i.url)), [items]);

  const addFiles = useCallback((files: File[]) => {
    setItems((prev) => [...prev, ...files.map((file) => ({ file, url: URL.createObjectURL(file) }))]);
  }, []);

  const move = useCallback((index: number, dir: -1 | 1) => {
    setItems((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }, []);

  const remove = useCallback((index: number) => {
    setItems((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const download = useCallback(async () => {
    setBusy(true);
    setError("");
    try {
      // jspdf is heavy; load it only when actually building a PDF.
      const { buildPdf } = await import("../lib/pdfBuilder");
      const blob = await buildPdf(
        items.map((i) => i.file),
        { format, margin: format === "fit" ? 0 : margin }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "images.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Couldn't build the PDF from those images.");
    } finally {
      setBusy(false);
    }
  }, [items, format, margin]);

  return (
    <>
      <section className="hero">
        <h1>Image to PDF — combine JPG & PNG into one PDF</h1>
        <p>
          Each image becomes a page. Reorder freely, pick a page size, and download — assembled privately in your
          browser, nothing uploaded.
        </p>
      </section>

      <AdSlot variant="banner" />

      <Dropzone onFiles={addFiles} busy={busy} />

      {items.length > 0 && (
        <>
          <div className="settings">
            <div className="settings__group">
              <span className="settings__label">Page size</span>
              <div className="segmented">
                {FORMATS.map((f) => (
                  <button
                    key={f.value}
                    className={`segmented__btn ${format === f.value ? "segmented__btn--on" : ""}`}
                    onClick={() => setFormat(f.value)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={`settings__group ${format === "fit" ? "settings__group--disabled" : ""}`}>
              <span className="settings__label">Margin</span>
              <div className="segmented">
                {MARGINS.map((m) => (
                  <button
                    key={m.value}
                    disabled={format === "fit"}
                    className={`segmented__btn ${margin === m.value ? "segmented__btn--on" : ""}`}
                    onClick={() => setMargin(m.value)}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <section className="results">
            <div className="results__bar">
              <p className="results__summary">
                {items.length} page{items.length > 1 ? "s" : ""} ·{" "}
                {formatBytes(items.reduce((s, i) => s + i.file.size, 0))} of images
              </p>
              <div className="results__actions">
                <button className="btn btn--primary" onClick={download} disabled={busy}>
                  {busy ? "Building…" : "⬇ Download PDF"}
                </button>
                <button className="btn btn--ghost" onClick={() => setItems([])}>
                  Clear
                </button>
              </div>
            </div>

            <div className="pdf-pages">
              {items.map((item, i) => (
                <div className="pdf-page" key={item.url}>
                  <span className="pdf-page__num">{i + 1}</span>
                  <img src={item.url} alt={item.file.name} />
                  <p className="pdf-page__name" title={item.file.name}>
                    {item.file.name}
                  </p>
                  <div className="pdf-page__actions">
                    <button className="btn btn--ghost btn--sm" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">
                      ←
                    </button>
                    <button
                      className="btn btn--ghost btn--sm"
                      onClick={() => move(i, 1)}
                      disabled={i === items.length - 1}
                      aria-label="Move down"
                    >
                      →
                    </button>
                    <button className="btn btn--ghost btn--sm" onClick={() => remove(i)} aria-label="Remove">
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {error && <p className="error">{error}</p>}

      <section className="faq" id="faq">
        <h2>Frequently asked questions</h2>
        {FAQ.map((item) => (
          <details key={item.q}>
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </section>

      <AdSlot variant="box" />
    </>
  );
}
