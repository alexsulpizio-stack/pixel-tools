import { useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Dropzone } from "../components/Dropzone";
import { AdSlot } from "../components/AdSlot";
import { usePageMeta } from "../lib/usePageMeta";
import { ROUTE_META } from "../lib/routeMeta";
import { canvasToBlob, downloadBlob, loadImage, withExtension } from "../lib/imageCanvas";

interface Rect { x: number; y: number; w: number; h: number } // fractions 0..1
type Corner = "nw" | "ne" | "sw" | "se";

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const MIN = 0.05;

const RATIOS: { label: string; value: number | null }[] = [
  { label: "Free", value: null },
  { label: "1:1", value: 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "16:9", value: 16 / 9 },
  { label: "3:2", value: 3 / 2 },
];

const FAQ = [
  { q: "Can I crop to a square for Instagram?", a: "Yes — click the 1:1 preset for a centered square, then drag to position it, and download." },
  { q: "Is the crop done at full resolution?", a: "Yes. The on-screen box is just a guide; the download is cropped from the original full-resolution image." },
  { q: "Are my images uploaded?", a: "No. Cropping runs in your browser; the image never leaves your device." },
];

export default function CropImagePage() {
  usePageMeta(ROUTE_META["/crop-image"].title, ROUTE_META["/crop-image"].description);

  const [file, setFile] = useState<File | null>(null);
  const [src, setSrc] = useState("");
  const [nat, setNat] = useState<{ w: number; h: number } | null>(null);
  const [sel, setSel] = useState<Rect>({ x: 0.1, y: 0.1, w: 0.8, h: 0.8 });
  const imgRef = useRef<HTMLImageElement>(null);
  const bitmapRef = useRef<ImageBitmap | null>(null);
  const drag = useRef<{ mode: "move" | Corner; px: number; py: number; start: Rect; rw: number; rh: number } | null>(null);

  const onFiles = useCallback(async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    const { bitmap, width, height } = await loadImage(f);
    bitmapRef.current?.close();
    bitmapRef.current = bitmap;
    setFile(f);
    setNat({ w: width, h: height });
    setSrc((prev) => { if (prev) URL.revokeObjectURL(prev); return URL.createObjectURL(f); });
    setSel({ x: 0.1, y: 0.1, w: 0.8, h: 0.8 });
  }, []);

  const applyRatio = (t: number | null) => {
    if (!t || !nat) { return; }
    let fw = 1, fh = (nat.w / nat.h) / t;
    if (fh > 1) { fh = 1; fw = (nat.h * t) / nat.w; }
    setSel({ x: (1 - fw) / 2, y: (1 - fh) / 2, w: fw, h: fh });
  };

  const startDrag = (mode: "move" | Corner) => (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = imgRef.current?.getBoundingClientRect();
    if (!rect) return;
    drag.current = { mode, px: e.clientX, py: e.clientY, start: sel, rw: rect.width, rh: rect.height };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const onMove = (e: PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dfx = (e.clientX - d.px) / d.rw;
    const dfy = (e.clientY - d.py) / d.rh;
    let { x, y, w, h } = d.start;
    if (d.mode === "move") {
      x = clamp(x + dfx, 0, 1 - w);
      y = clamp(y + dfy, 0, 1 - h);
    } else {
      if (d.mode === "nw") { const nx = clamp(x + dfx, 0, x + w - MIN); w += x - nx; x = nx; const ny = clamp(y + dfy, 0, y + h - MIN); h += y - ny; y = ny; }
      if (d.mode === "ne") { w = clamp(w + dfx, MIN, 1 - x); const ny = clamp(y + dfy, 0, y + h - MIN); h += y - ny; y = ny; }
      if (d.mode === "sw") { const nx = clamp(x + dfx, 0, x + w - MIN); w += x - nx; x = nx; h = clamp(h + dfy, MIN, 1 - y); }
      if (d.mode === "se") { w = clamp(w + dfx, MIN, 1 - x); h = clamp(h + dfy, MIN, 1 - y); }
    }
    setSel({ x, y, w, h });
  };

  const onUp = () => {
    drag.current = null;
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
  };

  const cropW = nat ? Math.round(sel.w * nat.w) : 0;
  const cropH = nat ? Math.round(sel.h * nat.h) : 0;

  const download = useCallback(async () => {
    const bitmap = bitmapRef.current;
    if (!bitmap || !nat || !file) return;
    const sx = sel.x * nat.w, sy = sel.y * nat.h, sw = sel.w * nat.w, sh = sel.h * nat.h;
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(sw));
    canvas.height = Math.max(1, Math.round(sh));
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(bitmap, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    const blob = await canvasToBlob(canvas, "image/png");
    downloadBlob(blob, withExtension(`cropped-${file.name}`, "png"));
  }, [sel, nat, file]);

  const pct = (n: number) => `${n * 100}%`;

  return (
    <>
      <section className="hero">
        <h1>Crop an image online</h1>
        <p>
          Drag the box to select the area you want, use an aspect-ratio preset if you need one, and
          download the cropped image. Runs entirely in your browser — nothing is uploaded.
        </p>
      </section>

      <AdSlot variant="banner" />

      <Dropzone onFiles={onFiles} />

      {src && nat && (
        <>
          <div className="settings">
            <div className="settings__group">
              <span className="settings__label">Aspect ratio</span>
              <div className="segmented">
                {RATIOS.map((r) => (
                  <button key={r.label} className="segmented__btn" onClick={() => (r.value === null ? setSel({ x: 0.05, y: 0.05, w: 0.9, h: 0.9 }) : applyRatio(r.value))}>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="settings__group">
              <span className="settings__label">Crop size</span>
              <p className="target-badge">{cropW}×{cropH}px</p>
            </div>
          </div>

          <section className="results">
            <div className="results__bar">
              <p className="results__summary">Drag the box or its corners to adjust</p>
              <div className="results__actions">
                <button className="btn btn--primary" onClick={download}>⬇ Download crop (PNG)</button>
              </div>
            </div>
            <div className="crop-stage">
              <div className="crop-wrap">
                <img ref={imgRef} src={src} alt="To crop" className="crop-img" draggable={false} />
                <div className="crop-shade" style={{ left: pct(sel.x), top: pct(sel.y), width: pct(sel.w), height: pct(sel.h) }} onPointerDown={startDrag("move")}>
                  <span className="crop-handle crop-handle--nw" onPointerDown={startDrag("nw")} />
                  <span className="crop-handle crop-handle--ne" onPointerDown={startDrag("ne")} />
                  <span className="crop-handle crop-handle--sw" onPointerDown={startDrag("sw")} />
                  <span className="crop-handle crop-handle--se" onPointerDown={startDrag("se")} />
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      <section className="prose tool-prose">
        <h2>How to crop a photo</h2>
        <ul>
          <li><strong>1.</strong> Add an image.</li>
          <li><strong>2.</strong> Drag inside the box to move it, or drag a corner to resize. Pick a ratio preset (like 1:1 for a square) if you need a specific shape.</li>
          <li><strong>3.</strong> Click download — the crop is taken from the full-resolution original.</li>
        </ul>
        <p>
          Want a round avatar instead of a rectangle? Use the{" "}
          <Link to="/circle-crop">circle crop tool</Link>. Need to change the overall size afterwards?
          Try the <Link to="/resize-image">image resizer</Link>.
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
