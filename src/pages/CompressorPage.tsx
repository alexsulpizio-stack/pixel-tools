import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import JSZip from "jszip";
import { TARGET_PAGES, formatTargetLabel } from "../lib/targetPages";
import { Dropzone } from "../components/Dropzone";
import { SettingsPanel } from "../components/SettingsPanel";
import { ResultCard } from "../components/ResultCard";
import { AdSlot } from "../components/AdSlot";
import { usePageMeta } from "../lib/usePageMeta";
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
  usePageMeta(
    "PixelTools — Free Online Image Compressor, Resizer & Converter",
    "Compress, resize, and convert images (JPG, PNG, WebP) for free — right in your browser. No uploads, no sign-up, 100% private."
  );

  const [settings, setSettings] = useState<ProcessSettings>(DEFAULT_SETTINGS);
  const [results, setResults] = useState<ProcessedImage[]>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const resultsRef = useRef<ProcessedImage[]>([]);
  resultsRef.current = results;

  // Reprocess source files whenever settings change so results always match the controls.
  useEffect(() => {
    if (pendingFiles.length === 0) return;
    let cancelled = false;
    setBusy(true);
    setErrors([]);

    (async () => {
      const processed: ProcessedImage[] = [];
      const failed: string[] = [];
      for (const file of pendingFiles) {
        try {
          processed.push(await processImage(file, settings));
        } catch {
          failed.push(file.name);
        }
        if (cancelled) return;
      }
      resultsRef.current.forEach((r) => URL.revokeObjectURL(r.previewUrl));
      setResults(processed);
      setErrors(failed);
      setBusy(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [pendingFiles, settings]);

  const addFiles = useCallback((files: File[]) => {
    setPendingFiles((prev) => {
      const known = new Set(prev.map((f) => `${f.name}:${f.size}`));
      return [...prev, ...files.filter((f) => !known.has(`${f.name}:${f.size}`))];
    });
  }, []);

  const removeResult = useCallback((id: string) => {
    setResults((prev) => {
      const target = prev.find((r) => r.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
        setPendingFiles((files) => files.filter((f) => f !== target.originalFile));
      }
      return prev.filter((r) => r.id !== id);
    });
  }, []);

  const clearAll = useCallback(() => {
    resultsRef.current.forEach((r) => URL.revokeObjectURL(r.previewUrl));
    setResults([]);
    setPendingFiles([]);
    setErrors([]);
  }, []);

  const downloadAll = useCallback(async () => {
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

      {errors.length > 0 && <p className="error">Couldn't process: {errors.join(", ")}</p>}

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
