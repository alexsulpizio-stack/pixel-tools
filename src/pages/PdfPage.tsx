import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Dropzone } from "../components/Dropzone";
import { AdSlot } from "../components/AdSlot";
import { TrackedToolLink } from "../components/TrackedToolLink";
import { usePageMeta } from "../lib/usePageMeta";
import { ROUTE_META } from "../lib/routeMeta";
import type { PageFormat } from "../lib/pdfBuilder";
import { formatBytes } from "../lib/imageProcessor";
import { trackEvent } from "../lib/integrations";

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
  const processingRef = useRef(false);
  const activeFileCount = useRef(0);
  const activeFormat = useRef<PageFormat>("fit");

  useEffect(() => {
    trackEvent("tool_view", { tool: "image_to_pdf" });
  }, []);

  useEffect(() => () => {
    if (processingRef.current) {
      trackEvent("processing_cancelled", {
        tool: "image_to_pdf",
        file_count: activeFileCount.current,
        page_format: activeFormat.current,
      });
      processingRef.current = false;
    }
  }, []);

  useEffect(() => () => items.forEach((i) => URL.revokeObjectURL(i.url)), [items]);

  const addFiles = useCallback((files: File[]) => {
    trackEvent("file_selected", {
      tool: "image_to_pdf",
      file_count: files.length,
      total_bytes: files.reduce((sum, file) => sum + file.size, 0),
    });
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
    trackEvent("processing_started", {
      tool: "image_to_pdf",
      file_count: items.length,
      page_format: format,
    });
    processingRef.current = true;
    activeFileCount.current = items.length;
    activeFormat.current = format;
    setBusy(true);
    setError("");
    try {
      const { buildPdf } = await import("../lib/pdfBuilder");
      const blob = await buildPdf(
        items.map((i) => i.file),
        { format, margin: format === "fit" ? 0 : margin }
      );
      processingRef.current = false;
      trackEvent("processing_completed", {
        tool: "image_to_pdf",
        file_count: items.length,
        page_format: format,
        output_bytes: blob.size,
      });
      trackEvent("download_clicked", {
        tool: "image_to_pdf",
        download_type: "pdf",
        file_count: items.length,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "images.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      processingRef.current = false;
      trackEvent("processing_failed", {
        tool: "image_to_pdf",
        file_count: items.length,
        page_format: format,
      });
      setError("Couldn't build the PDF from those images.");
    } finally {
      setBusy(false);
    }
  }, [items, format, margin]);

  return (
    <>
      <section className="hero">
        <h1>Convert JPG to PDF free — combine images into one PDF</h1>
        <p>
          Turn JPG, PNG, and WebP images into a single PDF for free. Reorder pages, choose a page size and margins,
          then download instantly — everything stays private in your browser.
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

      <section className="prose tool-prose">
        <h2>Convert JPG and other images to one PDF</h2>
        <p>
          Turning images into a PDF is the easiest way to share a set of photos, scans, or screenshots
          as one tidy document — for a job application, an expense report, a portfolio, or printing.
          This tool assembles JPG, PNG, WebP, GIF, BMP, and AVIF images into a multi-page PDF entirely
          in your browser, so nothing is uploaded.
        </p>
        <ul>
          <li><strong>1.</strong> Add your images — each one becomes a page.</li>
          <li><strong>2.</strong> Drag the arrows to reorder pages into the sequence you want.</li>
          <li><strong>3.</strong> Choose a page size: "Fit to image" matches each page to its image (ideal for screenshots), while A4 and Letter center images on a standard page for printing.</li>
          <li><strong>4.</strong> Download the finished PDF.</li>
        </ul>
        <p>
          If the source photos are large, it's worth{" "}
          <TrackedToolLink
            to="/"
            fromTool="image_to_pdf"
            toTool="compressor"
            destinationSlug="compressor"
          >
            compressing them first
          </TrackedToolLink>{" "}
          to keep the PDF small and easy to email — see our guide on{" "}
          <Link to="/guides/reduce-image-file-size-for-email-and-web">
            reducing image file size for email and web
          </Link>
          .
        </p>
      </section>

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
