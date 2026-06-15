import { useCallback, useEffect, useRef, useState } from "react";
import JSZip from "jszip";
import { AdSlot } from "../components/AdSlot";
import { usePageMeta } from "../lib/usePageMeta";
import { ROUTE_META } from "../lib/routeMeta";
import {
  generateFromImage,
  generateFromText,
  releaseBundle,
  HTML_SNIPPET,
  WEBMANIFEST,
  type FaviconBundle,
  type IconShape,
  type TextIconSettings,
} from "../lib/faviconGenerator";

type Mode = "image" | "text";

const SHAPES: { value: IconShape; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "rounded", label: "Rounded" },
  { value: "circle", label: "Circle" },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "What sizes does a website favicon need?",
    a: "A favicon.ico with 16, 32, and 48px versions covers browser tabs and bookmarks. Add a 180px apple-touch-icon for iOS home screens and 192/512px PNGs for Android and PWAs. This generator produces all of them.",
  },
  {
    q: "Is the .ico file a real multi-size icon?",
    a: "Yes — the favicon.ico contains 16, 32, and 48 pixel versions in one file, so browsers pick the sharpest size for the context.",
  },
  {
    q: "Is my logo uploaded anywhere?",
    a: "No. The favicon is generated entirely in your browser — your image never leaves your device.",
  },
  {
    q: "How do I install the favicon on my site?",
    a: "Unzip the download into your site's root folder and paste the provided HTML tags into your page's <head>. The ZIP includes a ready-made site.webmanifest too.",
  },
];

export default function FaviconPage() {
  usePageMeta(ROUTE_META["/favicon-generator"].title, ROUTE_META["/favicon-generator"].description);

  const [mode, setMode] = useState<Mode>("text");
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [shape, setShape] = useState<IconShape>("rounded");
  const [text, setText] = useState("P");
  const [background, setBackground] = useState("#4f6ef7");
  const [color, setColor] = useState("#ffffff");
  const [bundle, setBundle] = useState<FaviconBundle | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bundleRef = useRef<FaviconBundle | null>(null);
  bundleRef.current = bundle;

  // Regenerate live whenever inputs change.
  useEffect(() => {
    let cancelled = false;
    const textSettings: TextIconSettings = { text: text.slice(0, 2) || "?", background, color, shape };

    (async () => {
      try {
        setError("");
        const next =
          mode === "image"
            ? sourceFile
              ? await generateFromImage(sourceFile, shape)
              : null
            : await generateFromText(textSettings);
        if (cancelled) {
          if (next) releaseBundle(next);
          return;
        }
        if (bundleRef.current) releaseBundle(bundleRef.current);
        setBundle(next);
      } catch {
        if (!cancelled) setError("Couldn't generate icons from that input.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [mode, sourceFile, shape, text, background, color]);

  const downloadZip = useCallback(async () => {
    const b = bundleRef.current;
    if (!b) return;
    const zip = new JSZip();
    zip.file("favicon.ico", b.ico);
    b.assets.forEach((a) => zip.file(a.name, a.blob));
    zip.file("site.webmanifest", WEBMANIFEST);
    zip.file("install-instructions.txt", `1. Copy all files to your website's root folder.\n2. Add these tags inside <head>:\n\n${HTML_SNIPPET}\n`);
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "favicon-package.zip";
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const copySnippet = useCallback(async () => {
    await navigator.clipboard.writeText(HTML_SNIPPET);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, []);

  const preview512 = bundle?.assets.find((a) => a.size === 512);

  return (
    <>
      <section className="hero">
        <h1>Favicon generator — image, letter, or emoji</h1>
        <p>
          Creates the complete set: a real multi-size favicon.ico, Apple touch icon, Android icons, and the manifest —
          generated privately in your browser.
        </p>
      </section>

      <AdSlot variant="banner" />

      <div className="settings">
        <div className="settings__group">
          <span className="settings__label">Source</span>
          <div className="segmented">
            <button className={`segmented__btn ${mode === "text" ? "segmented__btn--on" : ""}`} onClick={() => setMode("text")}>
              Text / Emoji
            </button>
            <button className={`segmented__btn ${mode === "image" ? "segmented__btn--on" : ""}`} onClick={() => setMode("image")}>
              Image
            </button>
          </div>
        </div>

        {mode === "text" ? (
          <>
            <div className="settings__group">
              <span className="settings__label">Text (1–2 chars or emoji)</span>
              <input
                className="textfield"
                type="text"
                value={text}
                maxLength={2}
                onChange={(e) => setText(e.target.value)}
                placeholder="P or 🚀"
              />
            </div>
            <div className="settings__group">
              <span className="settings__label">Colors</span>
              <div className="colorrow">
                <label>
                  <input type="color" value={background} onChange={(e) => setBackground(e.target.value)} /> Background
                </label>
                <label>
                  <input type="color" value={color} onChange={(e) => setColor(e.target.value)} /> Text
                </label>
              </div>
            </div>
          </>
        ) : (
          <div className="settings__group">
            <span className="settings__label">Image (square works best)</span>
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              hidden
              onChange={(e) => setSourceFile(e.target.files?.[0] ?? null)}
            />
            <button className="btn btn--ghost" onClick={() => inputRef.current?.click()}>
              {sourceFile ? sourceFile.name : "Choose image…"}
            </button>
          </div>
        )}

        <div className="settings__group">
          <span className="settings__label">Shape</span>
          <div className="segmented">
            {SHAPES.map((s) => (
              <button
                key={s.value}
                className={`segmented__btn ${shape === s.value ? "segmented__btn--on" : ""}`}
                onClick={() => setShape(s.value)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      {bundle && (
        <section className="results">
          <div className="results__bar">
            <p className="results__summary">
              {bundle.assets.length} PNG sizes + multi-size favicon.ico + site.webmanifest
            </p>
            <div className="results__actions">
              <button className="btn btn--primary" onClick={downloadZip}>
                ⬇ Download package (.zip)
              </button>
            </div>
          </div>

          <div className="favicon-preview">
            <div className="favicon-preview__hero">
              {preview512 && <img src={preview512.previewUrl} alt="Favicon preview" />}
            </div>
            <div className="favicon-preview__sizes">
              {bundle.assets.map((a) => (
                <figure key={a.name}>
                  <img src={a.previewUrl} alt={a.name} style={{ width: Math.min(a.size, 64), height: Math.min(a.size, 64) }} />
                  <figcaption>{a.size}px</figcaption>
                </figure>
              ))}
            </div>
            <div className="favicon-preview__tab" title="Browser tab simulation">
              {bundle.assets[1] && <img src={bundle.assets[1].previewUrl} alt="" />}
              <span>Your site — browser tab preview</span>
            </div>
          </div>

          <div className="snippet">
            <div className="snippet__head">
              <span className="settings__label">Paste into your &lt;head&gt;</span>
              <button className="btn btn--ghost btn--sm" onClick={copySnippet}>
                {copied ? "Copied ✓" : "Copy"}
              </button>
            </div>
            <pre>{HTML_SNIPPET}</pre>
          </div>
        </section>
      )}

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
