import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Dropzone } from "../components/Dropzone";
import { AdSlot } from "../components/AdSlot";
import { usePageMeta } from "../lib/usePageMeta";
import { ROUTE_META } from "../lib/routeMeta";
import { canvasToBlob, downloadBlob, formatBytes, loadImage, withExtension } from "../lib/imageCanvas";

type Fmt = "image/png" | "image/jpeg" | "image/webp";

const FORMATS: { value: Fmt; label: string; ext: string }[] = [
  { value: "image/webp", label: "WebP", ext: "webp" },
  { value: "image/jpeg", label: "JPEG", ext: "jpg" },
  { value: "image/png", label: "PNG", ext: "png" },
];

const FAQ = [
  { q: "Will resizing reduce quality?", a: "Shrinking an image is essentially lossless to the eye. Enlarging beyond the original dimensions will look softer, since there's no extra detail to invent." },
  { q: "Does it keep the aspect ratio?", a: "By default yes — changing width updates height automatically. Turn off the lock to stretch to exact dimensions." },
  { q: "Are my images uploaded?", a: "No. Resizing happens in your browser with the Canvas API; your image never leaves your device." },
];

export default function ResizeImagePage() {
  usePageMeta(ROUTE_META["/resize-image"].title, ROUTE_META["/resize-image"].description);

  const [file, setFile] = useState<File | null>(null);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [lock, setLock] = useState(true);
  const [format, setFormat] = useState<Fmt>("image/webp");
  const [outSize, setOutSize] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bitmapRef = useRef<ImageBitmap | null>(null);

  const onFiles = useCallback(async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    const { bitmap, width: w, height: h } = await loadImage(f);
    bitmapRef.current?.close();
    bitmapRef.current = bitmap;
    setFile(f);
    setNatural({ w, h });
    setWidth(w);
    setHeight(h);
  }, []);

  const ratio = natural ? natural.w / natural.h : 1;

  const onWidth = (v: number) => {
    setWidth(v);
    if (lock && natural) setHeight(Math.max(1, Math.round(v / ratio)));
  };
  const onHeight = (v: number) => {
    setHeight(v);
    if (lock && natural) setWidth(Math.max(1, Math.round(v * ratio)));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const bitmap = bitmapRef.current;
    if (!canvas || !bitmap || width < 1 || height < 1) return;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingQuality = "high";
    if (format === "image/jpeg") {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, width, height);
    }
    ctx.drawImage(bitmap, 0, 0, width, height);
    canvasToBlob(canvas, format, 0.9).then((b) => setOutSize(b.size)).catch(() => {});
  }, [width, height, format, file]);

  const download = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || !file) return;
    const ext = FORMATS.find((f) => f.value === format)!.ext;
    const blob = await canvasToBlob(canvas, format, 0.9);
    downloadBlob(blob, withExtension(`resized-${file.name}`, ext));
  }, [file, format]);

  return (
    <>
      <section className="hero">
        <h1>Resize an image to exact dimensions</h1>
        <p>
          Set an exact width and height in pixels (or scale by percentage), keep the aspect ratio
          locked, and download — all in your browser. No uploads, no sign-up.
        </p>
      </section>

      <AdSlot variant="banner" />

      <Dropzone onFiles={onFiles} />

      {natural && (
        <>
          <div className="settings">
            <div className="settings__group">
              <span className="settings__label">Width (px)</span>
              <input className="textfield" type="number" min={1} value={width} onChange={(e) => onWidth(Number(e.target.value))} />
            </div>
            <div className="settings__group">
              <span className="settings__label">Height (px)</span>
              <input className="textfield" type="number" min={1} value={height} onChange={(e) => onHeight(Number(e.target.value))} />
            </div>
            <div className="settings__group">
              <span className="settings__label">Aspect ratio</span>
              <label className="checkrow">
                <input type="checkbox" checked={lock} onChange={(e) => setLock(e.target.checked)} /> Lock to original
              </label>
            </div>
            <div className="settings__group">
              <span className="settings__label">Scale</span>
              <div className="segmented">
                {[25, 50, 75].map((p) => (
                  <button key={p} className="segmented__btn" onClick={() => { setWidth(Math.round(natural.w * p / 100)); setHeight(Math.round(natural.h * p / 100)); }}>
                    {p}%
                  </button>
                ))}
                <button className="segmented__btn" onClick={() => { setWidth(natural.w); setHeight(natural.h); }}>Reset</button>
              </div>
            </div>
            <div className="settings__group">
              <span className="settings__label">Format</span>
              <div className="segmented">
                {FORMATS.map((f) => (
                  <button key={f.value} className={`segmented__btn ${format === f.value ? "segmented__btn--on" : ""}`} onClick={() => setFormat(f.value)}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <section className="results">
            <div className="results__bar">
              <p className="results__summary">
                {natural.w}×{natural.h} → <strong>{width}×{height}</strong>{outSize > 0 && <> · {formatBytes(outSize)}</>}
              </p>
              <div className="results__actions">
                <button className="btn btn--primary" onClick={download}>⬇ Download</button>
              </div>
            </div>
            <div className="canvas-stage">
              <canvas ref={canvasRef} className="canvas-stage__canvas" />
            </div>
          </section>
        </>
      )}

      <section className="prose tool-prose">
        <h2>How to resize an image</h2>
        <ul>
          <li><strong>1.</strong> Drop in a JPG, PNG, or WebP image.</li>
          <li><strong>2.</strong> Type the exact width or height you need, or use a percentage button to scale down.</li>
          <li><strong>3.</strong> Keep "Lock to original" on to preserve proportions and avoid stretching.</li>
          <li><strong>4.</strong> Pick a format and download.</li>
        </ul>
        <p>
          Resizing is the fastest way to cut file size — a photo shown at 800px wide doesn't need to be
          4000px. For getting under a specific file-size limit, use the{" "}
          <Link to="/">compressor</Link>, and see{" "}
          <Link to="/guides/reduce-image-file-size-for-email-and-web">reducing image file size</Link> for the full method.
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
