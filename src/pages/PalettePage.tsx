import { useCallback, useEffect, useRef, useState } from "react";
import { AdSlot } from "../components/AdSlot";
import { usePageMeta } from "../lib/usePageMeta";
import {
  contrastColor,
  extractPalette,
  toCssVariables,
  toJson,
  type PaletteColor,
} from "../lib/paletteExtractor";

const COLOR_COUNTS = [4, 6, 8, 12];

const FAQ: { q: string; a: string }[] = [
  {
    q: "How are the colors extracted?",
    a: "The image is analyzed with median-cut quantization — the same family of algorithm used by design tools — to find the most representative colors, sorted by how much of the image they cover.",
  },
  {
    q: "Is my image uploaded?",
    a: "No. The analysis runs entirely in your browser; your image never leaves your device.",
  },
  {
    q: "Can I use the palette in my code?",
    a: "Yes — export the palette as ready-to-paste CSS custom properties or a JSON array of hex values, or click any swatch to copy its hex code.",
  },
];

export default function PalettePage() {
  usePageMeta(
    "Color Palette Extractor — Get Colors from Any Image | PixelTools",
    "Extract the dominant color palette from any image. Click to copy hex codes, export as CSS variables or JSON. Free and private — runs in your browser."
  );

  const [file, setFile] = useState<File | null>(null);
  const [count, setCount] = useState(6);
  const [colors, setColors] = useState<PaletteColor[]>([]);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [copiedKey, setCopiedKey] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!file) return;
    let cancelled = false;
    setError("");
    extractPalette(file, count)
      .then((result) => {
        if (!cancelled) setColors(result);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't analyze that image.");
      });
    return () => {
      cancelled = true;
    };
  }, [file, count]);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const copy = useCallback(async (key: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(""), 1200);
  }, []);

  return (
    <>
      <section className="hero">
        <h1>Color palette extractor — colors from any image</h1>
        <p>
          Pull the dominant colors out of a photo, logo, or artwork. Click any swatch to copy its hex code, or export
          the whole palette as CSS variables or JSON.
        </p>
      </section>

      <AdSlot variant="banner" />

      <div
        className="dropzone"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files?.[0];
          if (f && f.type.startsWith("image/")) setFile(f);
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) setFile(f);
            e.target.value = "";
          }}
        />
        <div className="dropzone__icon">🎨</div>
        <p className="dropzone__title">{file ? file.name : "Drop an image here or click to browse"}</p>
        <p className="dropzone__hint">Analyzed locally — never uploaded</p>
      </div>

      {file && (
        <div className="settings">
          <div className="settings__group">
            <span className="settings__label">Number of colors</span>
            <div className="segmented">
              {COLOR_COUNTS.map((c) => (
                <button
                  key={c}
                  className={`segmented__btn ${count === c ? "segmented__btn--on" : ""}`}
                  onClick={() => setCount(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {error && <p className="error">{error}</p>}

      {colors.length > 0 && (
        <section className="results">
          <div className="palette">
            {previewUrl && <img className="palette__source" src={previewUrl} alt="Source" />}
            <div className="palette__swatches">
              {colors.map((c) => (
                <button
                  key={c.hex}
                  className="swatch"
                  style={{ background: c.hex, color: contrastColor(c.rgb) }}
                  onClick={() => copy(c.hex, c.hex)}
                  title={`Copy ${c.hex}`}
                >
                  <span className="swatch__hex">{copiedKey === c.hex ? "Copied ✓" : c.hex}</span>
                  <span className="swatch__pct">{Math.round(c.population * 100)}%</span>
                </button>
              ))}
            </div>
          </div>

          <div className="results__bar" style={{ marginTop: 14 }}>
            <p className="results__summary">Export palette</p>
            <div className="results__actions">
              <button className="btn btn--ghost" onClick={() => copy("css", toCssVariables(colors))}>
                {copiedKey === "css" ? "Copied ✓" : "Copy CSS variables"}
              </button>
              <button className="btn btn--ghost" onClick={() => copy("json", toJson(colors))}>
                {copiedKey === "json" ? "Copied ✓" : "Copy JSON"}
              </button>
            </div>
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
