import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Dropzone } from "../components/Dropzone";
import { AdSlot } from "../components/AdSlot";
import { usePageMeta } from "../lib/usePageMeta";
import { compressToTarget, type TargetOutput, type TargetResult } from "../lib/targetCompress";
import { formatBytes } from "../lib/imageProcessor";
import { TARGET_PAGES, formatTargetLabel, type TargetPageConfig } from "../lib/targetPages";

const OUTPUTS: { value: TargetOutput; label: string }[] = [
  { value: "webp", label: "WebP (smallest)" },
  { value: "jpeg", label: "JPEG (max compatibility)" },
  { value: "png", label: "PNG (lossless)" },
];

interface TargetSizePageProps {
  config: TargetPageConfig;
}

export default function TargetSizePage({ config }: TargetSizePageProps) {
  usePageMeta(config.title, config.description);

  const [output, setOutput] = useState<TargetOutput>(config.output);
  const [results, setResults] = useState<TargetResult[]>([]);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const resultsRef = useRef<TargetResult[]>([]);
  resultsRef.current = results;

  const targetBytes = config.targetKB * 1024;

  // Reset state when navigating between size pages (same component instance).
  useEffect(() => {
    resultsRef.current.forEach((r) => URL.revokeObjectURL(r.previewUrl));
    setResults([]);
    setErrors([]);
    setOutput(config.output);
  }, [config]);

  const addFiles = useCallback(
    async (files: File[]) => {
      setBusy(true);
      const next: TargetResult[] = [];
      const failed: string[] = [];
      for (const file of files) {
        try {
          next.push(await compressToTarget(file, targetBytes, output));
        } catch {
          failed.push(file.name);
        }
      }
      setResults((prev) => [...prev, ...next]);
      setErrors(failed);
      setBusy(false);
    },
    [targetBytes, output]
  );

  const download = useCallback((r: TargetResult) => {
    const a = document.createElement("a");
    a.href = r.previewUrl;
    a.download = r.name;
    a.click();
  }, []);

  const label = formatTargetLabel(config.targetKB);

  return (
    <>
      <section className="hero">
        <h1>{config.h1}</h1>
        <p>{config.intro}</p>
      </section>

      <AdSlot variant="banner" />

      <Dropzone onFiles={addFiles} busy={busy} />

      <div className="settings">
        <div className="settings__group">
          <span className="settings__label">Target size</span>
          <p className="target-badge">≤ {label}</p>
        </div>
        <div className="settings__group">
          <span className="settings__label">Output format</span>
          <div className="segmented">
            {OUTPUTS.map((o) => (
              <button
                key={o.value}
                className={`segmented__btn ${output === o.value ? "segmented__btn--on" : ""}`}
                onClick={() => setOutput(o.value)}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {errors.length > 0 && <p className="error">Couldn't process: {errors.join(", ")}</p>}

      {results.length > 0 && (
        <section className="results">
          <div className="results__grid">
            {results.map((r) => (
              <div className="card" key={r.previewUrl}>
                <img className="card__thumb" src={r.previewUrl} alt={r.name} loading="lazy" />
                <div className="card__body">
                  <p className="card__name" title={r.name}>
                    {r.name}
                  </p>
                  <p className="card__meta">
                    {r.width}×{r.height} · {formatBytes(r.originalSize)} → <strong>{formatBytes(r.blob.size)}</strong>
                  </p>
                  <span className={`badge ${r.hitTarget ? "badge--good" : "badge--bad"}`}>
                    {r.hitTarget ? `Under ${label} ✓` : `Closest possible: ${formatBytes(r.blob.size)}`}
                  </span>
                </div>
                <div className="card__actions">
                  <button className="btn btn--primary btn--sm" onClick={() => download(r)}>
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="size-links">
        <h2>Other target sizes</h2>
        <div className="size-links__row">
          {TARGET_PAGES.filter((p) => p.slug !== config.slug).map((p) => (
            <Link key={p.slug} to={`/${p.slug}`} className="size-links__chip">
              {p.h1.replace("Compress ", "").replace(" to ", " → ")}
            </Link>
          ))}
          <Link to="/" className="size-links__chip">
            Full compressor →
          </Link>
        </div>
      </section>

      <section className="faq" id="faq">
        <h2>Frequently asked questions</h2>
        {config.faq.map((item) => (
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
