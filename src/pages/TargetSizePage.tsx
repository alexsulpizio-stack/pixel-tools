import { useCallback, useEffect, useRef, useState } from "react";
import { Dropzone } from "../components/Dropzone";
import { AdSlot } from "../components/AdSlot";
import { TrackedToolLink } from "../components/TrackedToolLink";
import { usePageMeta } from "../lib/usePageMeta";
import { compressToTarget, type TargetOutput, type TargetResult } from "../lib/targetCompress";
import { formatBytes } from "../lib/imageProcessor";
import { TARGET_PAGES, formatTargetLabel, type TargetPageConfig } from "../lib/targetPages";
import { trackEvent } from "../lib/integrations";

const OUTPUTS: { value: TargetOutput; label: string }[] = [
  { value: "webp", label: "WebP (smallest)" },
  { value: "jpeg", label: "JPEG (max compatibility)" },
  { value: "png", label: "PNG (lossless)" },
];

interface TargetSizePageProps {
  config: TargetPageConfig;
}

export default function TargetSizePage({ config }: TargetSizePageProps) {
  return <TargetSizeTool key={config.slug} config={config} />;
}

function ResultRequirementHelper({
  config,
  result,
  output,
}: {
  config: TargetPageConfig;
  result: TargetResult;
  output: TargetOutput;
}) {
  if (config.targetKB === 100) {
    return (
      <section className="prose tool-prose" aria-label="100 KB upload requirement check">
        <h2>{result.hitTarget ? "Ready for a 100 KB upload" : "100 KB upload check"}</h2>
        <p>
          <strong>File size:</strong> {formatBytes(result.blob.size)} {result.hitTarget ? "✓" : "— still above 100 KB"}<br />
          <strong>Format:</strong> {output === "jpeg" ? "JPEG" : output.toUpperCase()}<br />
          <strong>Dimensions:</strong> {result.width}×{result.height}
        </p>
        {output !== "jpeg" && (
          <p>
            <strong>Does your form require JPG?</strong> Some upload forms accept only .jpg or .jpeg files even when the
            size is correct. Switch the output format to JPEG above and recompress before submitting.
          </p>
        )}
      </section>
    );
  }

  if (config.targetKB === 200) {
    return (
      <section className="prose tool-prose" aria-label="200 KB document upload check">
        <h2>200 KB check</h2>
        <p>
          <strong>File size:</strong> {formatBytes(result.blob.size)} {result.hitTarget ? "✓" : "— still above 200 KB"}<br />
          <strong>Dimensions:</strong> {result.width}×{result.height}<br />
          <strong>Format:</strong> {output === "jpeg" ? "JPEG" : output.toUpperCase()}
        </p>
        <p>
          Before submitting an ID, passport, visa, exam, or other official photo, compare these dimensions and the file
          type with the requirements from the organization receiving it. A 200 KB file-size limit does not guarantee
          that the image also meets that organization's dimension, aspect-ratio, background, or format rules.
        </p>
      </section>
    );
  }

  return null;
}

function UploadRequirementsChecker({
  results,
  defaultMaxKB,
}: {
  results: TargetResult[];
  defaultMaxKB: number;
}) {
  const [maxKB, setMaxKB] = useState(String(defaultMaxKB));
  const [requiredFormat, setRequiredFormat] = useState<"any" | TargetOutput>("any");
  const [minWidth, setMinWidth] = useState("");
  const [maxWidth, setMaxWidth] = useState("");
  const [minHeight, setMinHeight] = useState("");
  const [maxHeight, setMaxHeight] = useState("");

  const numberOrNull = (value: string) => {
    if (value.trim() === "") return null;
    const number = Number(value);
    return Number.isFinite(number) && number > 0 ? number : null;
  };
  const maxBytes = numberOrNull(maxKB) === null ? null : Number(maxKB) * 1024;
  const minW = numberOrNull(minWidth);
  const maxW = numberOrNull(maxWidth);
  const minH = numberOrNull(minHeight);
  const maxH = numberOrNull(maxHeight);
  const hasDimensionRule = minW !== null || maxW !== null || minH !== null || maxH !== null;
  const hasAnyRule = maxBytes !== null || requiredFormat !== "any" || hasDimensionRule;

  const formatName = (mime: string) => {
    if (mime === "image/jpeg") return "JPEG (.jpg)";
    if (mime === "image/png") return "PNG (.png)";
    if (mime === "image/webp") return "WebP (.webp)";
    return mime || "Unknown format";
  };

  return (
    <section className="upload-checker" aria-label="Upload requirements checker">
      <h2>Check your image against an upload form</h2>
      <p>
        Enter the limits shown by the receiving site. This checks the actual files produced above; it does not upload
        your images or change the receiving site's rules.
      </p>

      <div className="upload-checker__fields">
        <label>
          Maximum file size (KB)
          <input
            aria-label="Maximum file size (KB)"
            type="number"
            min="1"
            step="1"
            value={maxKB}
            onChange={(event) => setMaxKB(event.target.value)}
          />
        </label>
        <label>
          Required file format
          <select
            aria-label="Required file format"
            value={requiredFormat}
            onChange={(event) => setRequiredFormat(event.target.value as "any" | TargetOutput)}
          >
            <option value="any">No format restriction</option>
            <option value="jpeg">JPEG (.jpg or .jpeg)</option>
            <option value="png">PNG (.png)</option>
            <option value="webp">WebP (.webp)</option>
          </select>
        </label>
        <label>
          Minimum width (px)
          <input aria-label="Minimum width (px)" type="number" min="1" step="1" value={minWidth} onChange={(event) => setMinWidth(event.target.value)} />
        </label>
        <label>
          Maximum width (px)
          <input aria-label="Maximum width (px)" type="number" min="1" step="1" value={maxWidth} onChange={(event) => setMaxWidth(event.target.value)} />
        </label>
        <label>
          Minimum height (px)
          <input aria-label="Minimum height (px)" type="number" min="1" step="1" value={minHeight} onChange={(event) => setMinHeight(event.target.value)} />
        </label>
        <label>
          Maximum height (px)
          <input aria-label="Maximum height (px)" type="number" min="1" step="1" value={maxHeight} onChange={(event) => setMaxHeight(event.target.value)} />
        </label>
      </div>

      <div className="upload-checker__results" aria-live="polite">
        {results.map((result) => {
          const actualFormat = formatName(result.blob.type);
          const sizePass = maxBytes === null || result.blob.size <= maxBytes;
          const formatPass = requiredFormat === "any" || result.blob.type === `image/${requiredFormat}`;
          const dimensionsPass =
            (minW === null || result.width >= minW) &&
            (maxW === null || result.width <= maxW) &&
            (minH === null || result.height >= minH) &&
            (maxH === null || result.height <= maxH);
          const allPass = hasAnyRule && sizePass && formatPass && dimensionsPass;

          return (
            <article className="upload-checker__result" key={result.previewUrl}>
              <div className="upload-checker__result-head">
                <strong title={result.name}>{result.name}</strong>
                <span className={`badge ${allPass ? "badge--good" : "badge--bad"}`}>
                  {!hasAnyRule ? "Enter a limit to check" : allPass ? "Meets entered limits" : "Does not meet all limits"}
                </span>
              </div>
              <ul>
                {maxBytes !== null && (
                  <li className={sizePass ? "upload-checker__pass" : "upload-checker__fail"}>
                    File size: {formatBytes(result.blob.size)} / {maxKB} KB maximum {sizePass ? "✓" : "— too large"}
                  </li>
                )}
                {requiredFormat !== "any" && (
                  <li className={formatPass ? "upload-checker__pass" : "upload-checker__fail"}>
                    Format: {actualFormat}; required {requiredFormat.toUpperCase()} {formatPass ? "✓" : "— change the output format and process again"}
                  </li>
                )}
                {hasDimensionRule && (
                  <li className={dimensionsPass ? "upload-checker__pass" : "upload-checker__fail"}>
                    Dimensions: {result.width}×{result.height} px
                    {minW !== null && ` · width at least ${minW}px`}
                    {maxW !== null && ` · width at most ${maxW}px`}
                    {minH !== null && ` · height at least ${minH}px`}
                    {maxH !== null && ` · height at most ${maxH}px`}
                    {dimensionsPass ? " ✓" : " — outside the entered range"}
                  </li>
                )}
                {!hasAnyRule && <li>Enter the file size, format, or pixel-dimension limits from the upload form.</li>}
              </ul>
            </article>
          );
        })}
      </div>
      <p className="upload-checker__note">
        A passing check only confirms the limits entered here. The receiving site may also require an aspect ratio,
        color profile, background, or other rules that are not checked here.
      </p>
    </section>
  );
}

function TargetSizeTool({ config }: TargetSizePageProps) {
  usePageMeta(config.title, config.description, !config.indexable);

  const [output, setOutput] = useState<TargetOutput>(config.output);
  const [results, setResults] = useState<TargetResult[]>([]);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const resultsRef = useRef<TargetResult[]>([]);
  const generation = useRef(0);
  const processing = useRef(false);
  const activeFileCount = useRef(0);
  const activeOutput = useRef<TargetOutput>(config.output);

  const targetBytes = config.targetKB * 1024;

  useEffect(() => {
    trackEvent("tool_view", {
      tool: "target_size",
      target_kb: config.targetKB,
      target_slug: config.slug,
    });
  }, [config.slug, config.targetKB]);

  useEffect(() => () => {
    if (processing.current) {
      trackEvent("processing_cancelled", {
        tool: "target_size",
        target_kb: config.targetKB,
        target_slug: config.slug,
        file_count: activeFileCount.current,
        output_format: activeOutput.current,
      });
      processing.current = false;
    }
    generation.current++;
    resultsRef.current.forEach((r) => URL.revokeObjectURL(r.previewUrl));
    resultsRef.current = [];
  }, [config.slug, config.targetKB]);

  const addFiles = useCallback(
    async (files: File[]) => {
      if (processing.current) return;
      trackEvent("file_selected", {
        tool: "target_size",
        target_kb: config.targetKB,
        target_slug: config.slug,
        file_count: files.length,
        total_bytes: files.reduce((sum, file) => sum + file.size, 0),
      });
      trackEvent("processing_started", {
        tool: "target_size",
        target_kb: config.targetKB,
        target_slug: config.slug,
        file_count: files.length,
        output_format: output,
      });
      processing.current = true;
      activeFileCount.current = files.length;
      activeOutput.current = output;
      const job = generation.current;
      setBusy(true);
      setErrors([]);
      const next: TargetResult[] = [];
      const failed: string[] = [];
      for (const file of files) {
        try {
          next.push(await compressToTarget(file, targetBytes, output));
        } catch {
          failed.push(file.name);
        }
        if (job !== generation.current) {
          next.forEach((r) => URL.revokeObjectURL(r.previewUrl));
          return;
        }
      }
      resultsRef.current = [...resultsRef.current, ...next];
      setResults(resultsRef.current);
      setErrors(failed);
      processing.current = false;
      setBusy(false);
      if (failed.length > 0) {
        trackEvent("processing_failed", {
          tool: "target_size",
          target_kb: config.targetKB,
          target_slug: config.slug,
          file_count: files.length,
          failed_count: failed.length,
          success_count: next.length,
          output_format: output,
        });
      }
      trackEvent("processing_completed", {
        tool: "target_size",
        target_kb: config.targetKB,
        target_slug: config.slug,
        file_count: files.length,
        success_count: next.length,
        failed_count: failed.length,
        output_format: output,
      });
    },
    [config.slug, config.targetKB, targetBytes, output]
  );

  const download = useCallback((r: TargetResult) => {
    trackEvent("download_clicked", {
      tool: "target_size",
      target_kb: config.targetKB,
      target_slug: config.slug,
      download_type: "single_image",
      output_bytes: r.blob.size,
      hit_target: r.hitTarget,
    });
    const a = document.createElement("a");
    a.href = r.previewUrl;
    a.download = r.name;
    a.click();
  }, [config.slug, config.targetKB]);

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
                disabled={busy}
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
          <ResultRequirementHelper config={config} result={results[results.length - 1]} output={output} />
          {config.targetKB === 1024 && <UploadRequirementsChecker results={results} defaultMaxKB={config.targetKB} />}
        </section>
      )}

      <section className="prose tool-prose">
        {config.body.map((section) => (
          <div key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs?.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            {section.bullets && (
              <ul>
                {section.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </section>

      <section className="size-links">
        <h2>Other target sizes</h2>
        <div className="size-links__row">
          {TARGET_PAGES.filter((p) => p.indexable && p.slug !== config.slug).map((p) => (
            <TrackedToolLink
              key={p.slug}
              to={`/${p.slug}`}
              className="size-links__chip"
              fromTool="target_size"
              toTool="target_size"
              destinationSlug={p.slug}
            >
              {p.h1.replace("Compress ", "").replace(" to ", " → ")}
            </TrackedToolLink>
          ))}
          <TrackedToolLink
            to="/"
            className="size-links__chip"
            fromTool="target_size"
            toTool="compressor"
            destinationSlug="compressor"
          >
            Full compressor →
          </TrackedToolLink>
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
