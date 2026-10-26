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
    a: "Yes. Each image becomes a page in the order shown. Use the arrow buttons to reorder pages. There is no fixed page-count limit, but large batches can exceed your browser’s memory; start with a few images on a phone.",
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

interface ImageDimensions {
  width: number;
  height: number;
}

const PAPER_POINTS: Record<"a4" | "letter", [number, number]> = {
  a4: [595.28, 841.89],
  letter: [612, 792],
};

function getPlacement(dimensions: ImageDimensions, format: PageFormat, margin: number) {
  const { width, height } = dimensions;
  if (format === "fit") {
    return { widthIn: width / 72, heightIn: height / 72, ppi: 72 };
  }

  const [portraitWidth, portraitHeight] = PAPER_POINTS[format];
  const pageWidth = width > height ? portraitHeight : portraitWidth;
  const pageHeight = width > height ? portraitWidth : portraitHeight;
  const scale = Math.min((pageWidth - margin * 2) / width, (pageHeight - margin * 2) / height);
  return {
    widthIn: (width * scale) / 72,
    heightIn: (height * scale) / 72,
    ppi: 72 / scale,
  };
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export default function PdfPage() {
  usePageMeta(ROUTE_META["/image-to-pdf"].title, ROUTE_META["/image-to-pdf"].description);

  const [items, setItems] = useState<Item[]>([]);
  const [imageDimensions, setImageDimensions] = useState<Record<string, ImageDimensions>>({});
  const [format, setFormat] = useState<PageFormat>("fit");
  const [margin, setMargin] = useState(24);
  const [busy, setBusy] = useState(false);
  const [loadingSample, setLoadingSample] = useState(false);
  const [error, setError] = useState("");
  const processingRef = useRef(false);
  const jobRef = useRef(0);
  const urlsRef = useRef(new Set<string>());
  const [output, setOutput] = useState<{ url: string; size: number; pages: number } | null>(null);
  const activeFileCount = useRef(0);
  const activeFormat = useRef<PageFormat>("fit");

  useEffect(() => {
    trackEvent("tool_view", { tool: "image_to_pdf" });
  }, []);

  useEffect(() => () => {
    jobRef.current++;
    urlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    urlsRef.current.clear();
    if (processingRef.current) {
      trackEvent("processing_cancelled", {
        tool: "image_to_pdf",
        file_count: activeFileCount.current,
        page_format: activeFormat.current,
      });
      processingRef.current = false;
    }
  }, []);

  const resetOutput = useCallback(() => {
    setOutput((previous) => {
      if (previous) { URL.revokeObjectURL(previous.url); urlsRef.current.delete(previous.url); }
      return null;
    });
  }, []);

  const clear = useCallback(() => {
    jobRef.current++;
    if (processingRef.current) {
      trackEvent("processing_cancelled", { tool: "image_to_pdf", file_count: activeFileCount.current, page_format: activeFormat.current });
    }
    processingRef.current = false;
    urlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    urlsRef.current.clear();
    setItems([]);
    setImageDimensions({});
    setOutput(null);
    setError("");
    setBusy(false);
    setLoadingSample(false);
  }, []);

  const addFiles = useCallback((files: File[]) => {
    if (processingRef.current) return;
    trackEvent("file_selected", {
      tool: "image_to_pdf",
      file_count: files.length,
      total_bytes: files.reduce((sum, file) => sum + file.size, 0),
    });
    resetOutput();
    setError("");
    const added = files.map((file) => {
      const url = URL.createObjectURL(file);
      urlsRef.current.add(url);
      return { file, url };
    });
    setItems((prev) => [...prev, ...added]);
  }, [resetOutput]);

  const move = useCallback((index: number, dir: -1 | 1) => {
    resetOutput();
    setItems((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }, [resetOutput]);

  const remove = useCallback((index: number) => {
    resetOutput();
    setItems((prev) => {
      URL.revokeObjectURL(prev[index].url);
      urlsRef.current.delete(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  }, [resetOutput]);

  const download = useCallback(async () => {
    if (processingRef.current || loadingSample || items.length === 0) return;
    const job = ++jobRef.current;
    resetOutput();
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
      if (job !== jobRef.current) return;
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
      urlsRef.current.add(url);
      setOutput({ url, size: blob.size, pages: items.length });
      const a = document.createElement("a");
      a.href = url;
      a.download = "images.pdf";
      a.click();
    } catch {
      if (job !== jobRef.current) return;
      processingRef.current = false;
      trackEvent("processing_failed", {
        tool: "image_to_pdf",
        file_count: items.length,
        page_format: format,
      });
      setError("Couldn't build the PDF. Remove any damaged or unsupported image, or try fewer/smaller files, then download again.");
    } finally {
      if (job === jobRef.current) setBusy(false);
    }
  }, [items, format, margin, resetOutput, loadingSample]);

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

      <Dropzone onFiles={addFiles} busy={busy || loadingSample} />

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
                    disabled={busy || loadingSample}
                    onClick={() => { resetOutput(); setFormat(f.value); }}
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
                    disabled={busy || format === "fit"}
                    className={`segmented__btn ${margin === m.value ? "segmented__btn--on" : ""}`}
                    onClick={() => { resetOutput(); setMargin(m.value); }}
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
                <button className="btn btn--primary" onClick={download} disabled={busy || loadingSample}>
                  {busy ? "Building…" : "⬇ Download PDF"}
                </button>
                <button className="btn btn--ghost" onClick={clear}>
                  Clear
                </button>
              </div>
            </div>

            <div className="pdf-pages">
              {items.map((item, i) => (
                <div className="pdf-page" key={item.url}>
                  <span className="pdf-page__num">{i + 1}</span>
                  <img
                    src={item.url}
                    alt={item.file.name}
                    onLoad={(event) => {
                      const image = event.currentTarget;
                      setImageDimensions((previous) => ({
                        ...previous,
                        [item.url]: { width: image.naturalWidth, height: image.naturalHeight },
                      }));
                    }}
                  />
                  <p className="pdf-page__name" title={item.file.name}>
                    {item.file.name}
                  </p>
                  {imageDimensions[item.url] && (() => {
                    const dimensions = imageDimensions[item.url];
                    const placement = getPlacement(dimensions, format, format === "fit" ? 0 : margin);
                    return (
                      <p className="pdf-page__specs">
                        {formatNumber(dimensions.width)} × {formatNumber(dimensions.height)} px
                        <br />
                        Placed at about {placement.widthIn.toFixed(2)} × {placement.heightIn.toFixed(2)} in · {Math.round(placement.ppi)} ppi
                      </p>
                    );
                  })()}
                  <div className="pdf-page__actions">
                    <button className="btn btn--ghost btn--sm" onClick={() => move(i, -1)} disabled={busy || i === 0} aria-label="Move up">
                      ←
                    </button>
                    <button
                      className="btn btn--ghost btn--sm"
                      onClick={() => move(i, 1)}
                      disabled={busy || i === items.length - 1}
                      aria-label="Move down"
                    >
                      →
                    </button>
                    <button className="btn btn--ghost btn--sm" onClick={() => remove(i)} disabled={busy || loadingSample} aria-label="Remove">
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <p className="pdf-preflight-note">
              Page placement is calculated from each image’s actual pixel dimensions. “Fit to image” creates a page sized to those pixels; A4 and Letter scale the image to the selected paper and margins. Check fine text in the downloaded PDF before submitting or printing.
            </p>
          </section>
        </>
      )}

      {error && <p className="error" role="alert">{error}</p>}
      {output && <p className="pdf-output" role="status">
        PDF ready: {output.pages} pages · {formatBytes(output.size)}. <a href={output.url} download="images.pdf">Save PDF again</a>
        {" "}If your phone opens a preview, use its Share or download menu to save the file. Keep this page open until saving finishes.
      </p>}

      <section className="prose tool-prose" aria-label="Try a sample PDF">
        <h2>Try it: combine three sample receipts into one PDF</h2>
        <p>Use our three clearly marked fictional receipts to try the full workflow without selecting personal files.
          Each sample is 600 × 800 pixels. They are demonstration images, not real purchases.</p>
        <button className="btn btn--ghost" disabled={busy || loadingSample} onClick={async () => {
          if (processingRef.current) return;
          const job = ++jobRef.current;
          setLoadingSample(true);
          try {
            const { createReceiptSamples } = await import("../lib/pdfSamples");
            const files = await createReceiptSamples();
            if (job !== jobRef.current) return;
            clear();
            setFormat("letter");
            setMargin(24);
            addFiles(files);
          } catch {
            if (job === jobRef.current) setError("Could not create the sample images. You can still choose your own JPG or PNG files.");
          } finally {
            if (job === jobRef.current) setLoadingSample(false);
          }
        }}>Load three sample receipts</button>
        <ol>
          <li>Load the samples. The example selects Letter paper with Small margins.</li>
          <li>Use the arrow buttons to put the receipts in your preferred order. Each becomes its own page.</li>
          <li>Choose Download PDF. The result shows the actual file size generated by your browser, not an estimated saving.</li>
          <li>Open images.pdf and check all three pages. The samples are deliberately low-resolution; use your original photos for important text.</li>
        </ol>
        <p>No account, payment, or added watermark is required. Real files stay on your device.
          The PDF contains images, not searchable text: this tool does not perform OCR. Output size depends on the input,
          and a larger source can produce a larger PDF. Device memory limits still apply.</p>
      </section>

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
          <li><strong>2.</strong> Click or tap the arrow buttons to reorder pages into the sequence you want.</li>
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
        <h2>Choose the right PDF page size</h2>
        <p>
          <strong>Fit to image</strong> makes a page match each image's pixel dimensions and is useful for
          screenshots, receipts, and digital records you will view on screen. Choose <strong>A4</strong> or
          <strong> Letter</strong> when the document will be printed or uploaded to a form that expects paper-sized
          pages. Landscape images get landscape pages automatically; portrait images stay portrait.
        </p>
        <p>
          A4 is common internationally, while US office printers and many US forms use Letter. The margin setting
          applies only to those standard page sizes: larger margins leave more white space around a photo and can
          help avoid printer edge clipping. “Fit to image” has no page margin because the page already follows the
          image boundary.
        </p>
        <h2>Before you turn JPG photos into one PDF</h2>
        <ul>
          <li>Arrange the thumbnails in reading order; every image becomes a separate PDF page.</li>
          <li>Remove accidental duplicates or blank scans before downloading.</li>
          <li>For a smaller attachment, resize or compress large photos first, then rebuild the PDF.</li>
          <li>Open the downloaded PDF once to check page order, orientation, and legibility before sending it.</li>
        </ul>
        <p>
          Transparent pixels in PNG or WebP images appear white in the PDF. The PDF builder converts page images
          to JPEG while assembling the document, so a transparent logo is flattened onto white. If you need a
          transparent graphic, keep the original image file as well as the PDF.
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
