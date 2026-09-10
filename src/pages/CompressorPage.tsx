import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import JSZip from "jszip";
import { TARGET_PAGES, formatTargetLabel } from "../lib/targetPages";
import { ROUTE_META } from "../lib/routeMeta";
import { Dropzone } from "../components/Dropzone";
import { SettingsPanel } from "../components/SettingsPanel";
import { ResultCard } from "../components/ResultCard";
import { AdSlot } from "../components/AdSlot";
import { usePageMeta } from "../lib/usePageMeta";
import { trackEvent } from "../lib/integrations";
import {
  formatBytes,
  processImage,
  savingsPercent,
  type ProcessedImage,
  type ProcessSettings,
} from "../lib/imageProcessor";

const DEFAULT_SETTINGS: ProcessSettings = {
  format: "webp",
  quality: 0.8,
  maxDimension: 0,
};

const FAQ: { q: string; a: string }[] = [
  {
    q: "Are my images uploaded to a server?",
    a: "No. Everything happens locally in your browser using the Canvas API. Your images never leave your device, which also makes processing instant.",
  },
  {
    q: "Which format should I pick?",
    a: "WebP usually gives the smallest files at great quality and is supported by all modern browsers. Use JPEG for maximum compatibility, and PNG when you need lossless quality or transparency.",
  },
  {
    q: "Is there a file size or count limit?",
    a: "No hard limit — batch as many images as you like. Very large images (50MP+) may take a few seconds each depending on your device.",
  },
  {
    q: "Is this really free?",
    a: "Yes. The site is supported by ads, so every tool stays free with no sign-up and no watermarks.",
  },
];

export default function CompressorPage() {
  usePageMeta(ROUTE_META["/"].title, ROUTE_META["/"].description);

  const [settings, setSettings] = useState<ProcessSettings>(DEFAULT_SETTINGS);
  const [results, setResults] = useState<ProcessedImage[]>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [completed, setCompleted] = useState<{ files: File[]; settings: ProcessSettings } | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const resultsRef = useRef<ProcessedImage[]>([]);
  const busy = pendingFiles.length > 0 && (completed?.files !== pendingFiles || completed?.settings !== settings);

  useEffect(() => {
    trackEvent("tool_view", { tool: "compressor" });
  }, []);

  useEffect(() => () => {
    resultsRef.current.forEach((r) => URL.revokeObjectURL(r.previewUrl));
    resultsRef.current = [];
  }, []);

  // Reprocess source files whenever settings change so results always match the controls.
  useEffect(() => {
    if (pendingFiles.length === 0) return;
    let cancelled = false;
    let finished = false;
    const processed: ProcessedImage[] = [];

    trackEvent("processing_started", {
      tool: "compressor",
      file_count: pendingFiles.length,
      output_format: settings.format,
    });

    (async () => {
      const failed: string[] = [];
      for (const file of pendingFiles) {
        try {
          const result = await processImage(file, settings);
          if (cancelled) {
            URL.revokeObjectURL(result.previewUrl);
            return;
          }
          processed.push(result);
        } catch {
          failed.push(file.name);
        }
        if (cancelled) return;
      }
      resultsRef.current.forEach((r) => URL.revokeObjectURL(r.previewUrl));
      resultsRef.current = processed;
      setResults(processed);
      setErrors(failed);
      setCompleted({ files: pendingFiles, settings });
      if (failed.length > 0) {
        trackEvent("processing_failed", {
          tool: "compressor",
          file_count: pendingFiles.length,
          failed_count: failed.length,
          success_count: processed.length,
          output_format: settings.format,
        });
      }
      trackEvent("processing_completed", {
        tool: "compressor",
        file_count: pendingFiles.length,
        success_count: processed.length,
        failed_count: failed.length,
        output_format: settings.format,
      });
      finished = true;
    })();

    return () => {
      cancelled = true;
      if (!finished) {
        trackEvent("processing_cancelled", {
          tool: "compressor",
          file_count: pendingFiles.length,
          processed_count: processed.length,
          output_format: settings.format,
        });
      }
      // Completed results belong to the page; unfinished results belong to this job.
      if (resultsRef.current !== processed) {
        processed.forEach((r) => URL.revokeObjectURL(r.previewUrl));
      }
    };
  }, [pendingFiles, settings]);

  const addFiles = useCallback((files: File[]) => {
    trackEvent("file_selected", {
      tool: "compressor",
      file_count: files.length,
      total_bytes: files.reduce((sum, file) => sum + file.size, 0),
    });
    setPendingFiles((prev) => {
      const known = new Set(prev.map((f) => `${f.name}:${f.size}`));
      return [...prev, ...files.filter((f) => !known.has(`${f.name}:${f.size}`))];
    });
  }, []);

  const removeResult = useCallback((id: string) => {
    const target = resultsRef.current.find((r) => r.id === id);
    if (!target) return;
    URL.revokeObjectURL(target.previewUrl);
    resultsRef.current = resultsRef.current.filter((r) => r.id !== id);
    setResults(resultsRef.current);
    setPendingFiles((files) => files.filter((f) => f !== target.originalFile));
  }, []);

  const clearAll = useCallback(() => {
    resultsRef.current.forEach((r) => URL.revokeObjectURL(r.previewUrl));
    resultsRef.current = [];
    setResults([]);
    setPendingFiles([]);
    setErrors([]);
  }, []);

  const downloadAll = useCallback(async () => {
    trackEvent("download_clicked", {
      tool: "compressor",
      download_type: "zip",
      file_count: resultsRef.current.length,
    });
    const zip = new JSZip();
    const usedNames = new Set<string>();
    for (const r of resultsRef.current) {
      let name = r.outputName;
      for (let i = 2; usedNames.has(name); i++) {
        name = r.outputName.replace(/(\.[^.]+)$/, `-${i}$1`);
      }
      usedNames.add(name);
      zip.file(name, r.blob);
    }
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pixeltools-images.zip";
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const totalOriginal = results.reduce((s, r) => s + r.originalSize, 0);
  const totalOutput = results.reduce((s, r) => s + r.outputSize, 0);

  return (
    <>
      <section className="hero">
        <h1>Compress, resize & convert images — free and private</h1>
        <p>
          Everything runs in your browser. No uploads, no sign-up, no watermarks. Batch-process unlimited images and
          download them all as a ZIP.
        </p>
      </section>

      <AdSlot variant="banner" />

      <Dropzone onFiles={addFiles} busy={busy} />

      <SettingsPanel settings={settings} onChange={setSettings} />

      {!busy && errors.length > 0 && <p className="error">Couldn't process: {errors.join(", ")}</p>}

      {busy && results.length === 0 && <button className="btn btn--ghost" onClick={clearAll}>Clear</button>}

      {results.length > 0 && (
        <section className="results">
          <div className="results__bar">
            <p className="results__summary">
              {results.length} image{results.length > 1 ? "s" : ""} · {formatBytes(totalOriginal)} →{" "}
              <strong>{formatBytes(totalOutput)}</strong>{" "}
              <span className="badge badge--good">−{savingsPercent(totalOriginal, totalOutput)}%</span>
            </p>
            <div className="results__actions">
              <button className="btn btn--primary" onClick={downloadAll} disabled={busy}>
                ⬇ Download all (.zip)
              </button>
              <button className="btn btn--ghost" onClick={clearAll}>
                Clear
              </button>
            </div>
          </div>
          <div className="results__grid">
            {results.map((r) => (
              <ResultCard key={r.id} image={r} onRemove={removeResult} />
            ))}
          </div>
        </section>
      )}

      <section className="size-links">
        <h2>Need an exact file size?</h2>
        <div className="size-links__row">
          {TARGET_PAGES.map((p) => (
            <Link key={p.slug} to={`/${p.slug}`} className="size-links__chip">
              {p.output === "webp" ? "Image" : p.output.toUpperCase()} → {formatTargetLabel(p.targetKB)}
            </Link>
          ))}
        </div>
      </section>

      <section className="prose tool-prose">
        <h2>How to compress, resize, and convert images</h2>
        <ul>
          <li><strong>1.</strong> Drag your images onto the box above, or click to browse. Add as many as you like — they're processed in a batch.</li>
          <li><strong>2.</strong> Pick an output format. WebP gives the smallest files at great quality; JPEG is best for maximum compatibility; PNG keeps lossless quality and transparency.</li>
          <li><strong>3.</strong> Set a quality level and an optional maximum dimension. The preview and file-size savings update instantly so you can find the smallest size that still looks perfect.</li>
          <li><strong>4.</strong> Download a single image, or grab everything as a ZIP.</li>
        </ul>
        <p>
          Every step happens locally in your browser using the Canvas API — your images are never
          uploaded to a server, which keeps even sensitive photos private and makes processing
          instant. There's no sign-up, no watermark, and no limit on how many images you convert.
        </p>
        <p>
          New to image optimization? Start with{" "}
          <Link to="/guides/how-to-compress-images-without-losing-quality">
            how to compress images without losing quality
          </Link>{" "}
          and{" "}
          <Link to="/guides/jpeg-vs-png-vs-webp">JPEG vs PNG vs WebP</Link>, or browse all{" "}
          <Link to="/guides">PixelTools guides</Link>.
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
