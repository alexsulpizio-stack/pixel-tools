import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Dropzone } from "../components/Dropzone";
import { AdSlot } from "../components/AdSlot";
import { usePageMeta } from "../lib/usePageMeta";
import { ROUTE_META } from "../lib/routeMeta";
import { canvasToBlob, downloadBlob, loadImage, withExtension } from "../lib/imageCanvas";

interface Rect { x: number; y: number; w: number; h: number }
type Corner = "nw" | "ne" | "sw" | "se";
type Mode = "blur" | "pixelate";

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const MIN = 0.05;

const FAQ = [
  { q: "Can I blur more than one area?", a: "Blur one region and download, then re-upload the result and blur the next area. Each pass stacks on the previous one." },
  { q: "Is blur or pixelate more private?", a: "Both hide detail. Use a strong setting — a light blur on a face or plate can sometimes be reversed, so err on the side of heavier blur/pixelation for sensitive content." },
  { q: "Are my images uploaded?", a: "No. The blur is applied in your browser; the image never leaves your device — which is the point when you're hiding sensitive information." },
];

export default function BlurImagePage() {
  usePageMeta(ROUTE_META["/blur-image"].title, ROUTE_META["/blur-image"].description);

  const [file, setFile] = useState<File | null>(null);
  const [nat, setNat] = useState<{ w: number; h: number } | null>(null);
  const [sel, setSel] = useState<Rect>({ x: 0.3, y: 0.3, w: 0.4, h: 0.4 });
  const [mode, setMode] = useState<Mode>("blur");
  const [strength, setStrength] = useState(50);
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
    setSel({ x: 0.3, y: 0.3, w: 0.4, h: 0.4 });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const bitmap = bitmapRef.current;
    if (!canvas || !bitmap || !nat) return;
    const w = nat.w, h = nat.h;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.filter = "none";
    ctx.drawImage(bitmap, 0, 0);

    const sx = sel.x * w, sy = sel.y * h, sw = sel.w * w, sh = sel.h * h;
    if (sw < 1 || sh < 1) return;

    ctx.save();
    ctx.beginPath();
    ctx.rect(sx, sy, sw, sh);
    ctx.clip();
    if (mode === "blur") {
      const px = Math.round((strength / 100) * (Math.min(w, h) * 0.08));
      ctx.filter = `blur(${Math.max(2, px)}px)`;
      ctx.drawImage(bitmap, 0, 0);
    } else {
      const block = Math.max(2, Math.round((strength / 100) * 40));
      const smallW = Math.max(1, Math.round(sw / block));
      const smallH = Math.max(1, Math.round(sh / block));
      const tmp = document.createElement("canvas");
      tmp.width = smallW; tmp.height = smallH;
      const tctx = tmp.getContext("2d");
      if (tctx) {
        tctx.drawImage(bitmap, sx, sy, sw, sh, 0, 0, smallW, smallH);
        ctx.filter = "none";
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(tmp, 0, 0, smallW, smallH, sx, sy, sw, sh);
        ctx.imageSmoothingEnabled = true;
      }
    }
    ctx.restore();
    ctx.filter = "none";
  }, [file, nat, sel, mode, strength]);

  const startDrag = (m: "move" | Corner) => (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    drag.current = { mode: m, px: e.clientX, py: e.clientY, start: sel, rw: rect.width, rh: rect.height };
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

  const download = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || !file) return;
    const type = file.type === "image/png" ? "image/png" : "image/jpeg";
    const ext = type === "image/png" ? "png" : "jpg";
    const blob = await canvasToBlob(canvas, type, 0.92);
    downloadBlob(blob, withExtension(`blurred-${file.name}`, ext));
  }, [file]);

  const pct = (n: number) => `${n * 100}%`;

  return (
    <>
      <section className="hero">
        <h1>Blur or pixelate part of an image</h1>
        <p>
          Hide faces, license plates, or sensitive text by dragging a box over the area and blurring or
          pixelating it. Runs entirely in your browser — your image is never uploaded.
        </p>
      </section>

      <AdSlot variant="banner" />

      <Dropzone onFiles={onFiles} />

      {file && nat && (
        <>
          <div className="settings">
            <div className="settings__group">
              <span className="settings__label">Effect</span>
              <div className="segmented">
                <button className={`segmented__btn ${mode === "blur" ? "segmented__btn--on" : ""}`} onClick={() => setMode("blur")}>Blur</button>
                <button className={`segmented__btn ${mode === "pixelate" ? "segmented__btn--on" : ""}`} onClick={() => setMode("pixelate")}>Pixelate</button>
              </div>
            </div>
            <div className="settings__group">
              <span className="settings__label">Strength: {strength}%</span>
              <input type="range" min={10} max={100} value={strength} onChange={(e) => setStrength(Number(e.target.value))} />
            </div>
          </div>

          <section className="results">
            <div className="results__bar">
              <p className="results__summary">Drag the box over the area to hide</p>
              <div className="results__actions">
                <button className="btn btn--primary" onClick={download}>⬇ Download</button>
              </div>
            </div>
            <div className="crop-stage">
              <div className="crop-wrap">
                <canvas ref={canvasRef} className="crop-img" />
                <div className="crop-shade crop-shade--clear" style={{ left: pct(sel.x), top: pct(sel.y), width: pct(sel.w), height: pct(sel.h) }} onPointerDown={startDrag("move")}>
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
        <h2>How to blur out sensitive parts of a photo</h2>
        <ul>
          <li><strong>1.</strong> Add your image.</li>
          <li><strong>2.</strong> Drag the box over the face, plate, or text you want to hide, and resize it with the corners.</li>
          <li><strong>3.</strong> Choose blur or pixelate and turn up the strength for sensitive content.</li>
          <li><strong>4.</strong> Download. To hide several areas, download and re-upload to blur the next one.</li>
        </ul>
        <p>
          For a full walkthrough see{" "}
          <Link to="/guides/how-to-blur-part-of-an-image">how to blur part of an image</Link>. Sharing
          publicly? Also <Link to="/remove-exif">strip the photo's EXIF data</Link> so it doesn't leak
          your location.
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
