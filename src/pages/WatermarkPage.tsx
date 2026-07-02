import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Dropzone } from "../components/Dropzone";
import { AdSlot } from "../components/AdSlot";
import { usePageMeta } from "../lib/usePageMeta";
import { ROUTE_META } from "../lib/routeMeta";
import { canvasToBlob, downloadBlob, loadImage, withExtension } from "../lib/imageCanvas";

type Pos = "tl" | "tc" | "tr" | "cl" | "cc" | "cr" | "bl" | "bc" | "br";

const POSITIONS: { value: Pos; label: string }[] = [
  { value: "tl", label: "↖" }, { value: "tc", label: "↑" }, { value: "tr", label: "↗" },
  { value: "cl", label: "←" }, { value: "cc", label: "•" }, { value: "cr", label: "→" },
  { value: "bl", label: "↙" }, { value: "bc", label: "↓" }, { value: "br", label: "↘" },
];

const FAQ = [
  { q: "Can I add a logo image instead of text?", a: "This tool adds a text watermark, which is the most common need for names, URLs, and copyright notices. For a logo, export it as text-free art and overlay it in an editor." },
  { q: "Will the watermark be removable?", a: "A tiled, semi-transparent watermark across the whole image is much harder to remove than a single corner mark. Use the 'tile' option for stronger protection." },
  { q: "Are my images uploaded?", a: "No. The watermark is drawn onto your image in your browser; nothing is uploaded." },
];

export default function WatermarkPage() {
  usePageMeta(ROUTE_META["/watermark-image"].title, ROUTE_META["/watermark-image"].description);

  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("© Your Name");
  const [pos, setPos] = useState<Pos>("br");
  const [sizePct, setSizePct] = useState(6);
  const [opacity, setOpacity] = useState(50);
  const [color, setColor] = useState("#ffffff");
  const [tiled, setTiled] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bitmapRef = useRef<ImageBitmap | null>(null);

  const onFiles = useCallback(async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    const { bitmap } = await loadImage(f);
    bitmapRef.current?.close();
    bitmapRef.current = bitmap;
    setFile(f);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const bitmap = bitmapRef.current;
    if (!canvas || !bitmap || !file) return;
    const w = bitmap.width;
    const h = bitmap.height;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(bitmap, 0, 0);

    const fontPx = Math.max(10, (w * sizePct) / 100);
    ctx.font = `600 ${fontPx}px system-ui, -apple-system, Segoe UI, Roboto, sans-serif`;
    ctx.fillStyle = color;
    ctx.globalAlpha = opacity / 100;
    ctx.shadowColor = "rgba(0,0,0,0.35)";
    ctx.shadowBlur = fontPx * 0.08;

    if (tiled) {
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const stepX = ctx.measureText(text).width + fontPx * 2;
      const stepY = fontPx * 3;
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate((-30 * Math.PI) / 180);
      for (let y = -h; y < h; y += stepY) {
        for (let x = -w; x < w; x += stepX) {
          ctx.fillText(text, x, y);
        }
      }
      ctx.restore();
    } else {
      const pad = fontPx * 0.6;
      ctx.textBaseline = "alphabetic";
      const left = pos[1] === "l", right = pos[1] === "r";
      const top = pos[0] === "t", bottom = pos[0] === "b";
      ctx.textAlign = left ? "left" : right ? "right" : "center";
      const x = left ? pad : right ? w - pad : w / 2;
      const y = top ? pad + fontPx : bottom ? h - pad : h / 2 + fontPx / 3;
      ctx.fillText(text, x, y);
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }, [file, text, pos, sizePct, opacity, color, tiled]);

  const download = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || !file) return;
    const type = file.type === "image/png" ? "image/png" : "image/jpeg";
    const ext = type === "image/png" ? "png" : "jpg";
    const blob = await canvasToBlob(canvas, type, 0.92);
    downloadBlob(blob, withExtension(`watermarked-${file.name}`, ext));
  }, [file]);

  return (
    <>
      <section className="hero">
        <h1>Add a watermark to your photos</h1>
        <p>
          Stamp your name, URL, or a copyright notice onto images with control over position, size,
          color, and opacity. Free and private — everything runs in your browser.
        </p>
      </section>

      <AdSlot variant="banner" />

      <Dropzone onFiles={onFiles} />

      {file && (
        <>
          <div className="settings">
            <div className="settings__group settings__group--wide">
              <span className="settings__label">Watermark text</span>
              <input className="textfield" value={text} onChange={(e) => setText(e.target.value)} placeholder="© Your Name" />
            </div>
            <div className="settings__group">
              <span className="settings__label">Position</span>
              <div className="posgrid">
                {POSITIONS.map((p) => (
                  <button key={p.value} className={`posgrid__btn ${pos === p.value ? "posgrid__btn--on" : ""}`} disabled={tiled} onClick={() => setPos(p.value)}>{p.label}</button>
                ))}
              </div>
            </div>
            <div className="settings__group">
              <span className="settings__label">Size: {sizePct}%</span>
              <input type="range" min={2} max={20} value={sizePct} onChange={(e) => setSizePct(Number(e.target.value))} />
            </div>
            <div className="settings__group">
              <span className="settings__label">Opacity: {opacity}%</span>
              <input type="range" min={5} max={100} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} />
            </div>
            <div className="settings__group">
              <span className="settings__label">Color</span>
              <input className="colorpick" type="color" value={color} onChange={(e) => setColor(e.target.value)} />
            </div>
            <div className="settings__group">
              <span className="settings__label">Tile across image</span>
              <label className="checkrow">
                <input type="checkbox" checked={tiled} onChange={(e) => setTiled(e.target.checked)} /> Repeat (harder to remove)
              </label>
            </div>
          </div>

          <section className="results">
            <div className="results__bar">
              <p className="results__summary">Live preview</p>
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
        <h2>How to watermark an image</h2>
        <ul>
          <li><strong>1.</strong> Add your photo.</li>
          <li><strong>2.</strong> Type your watermark text and choose where it sits.</li>
          <li><strong>3.</strong> Adjust size and opacity — a subtle, semi-transparent mark looks professional; tiling protects the whole image.</li>
          <li><strong>4.</strong> Download the watermarked photo.</li>
        </ul>
        <p>
          For more on protecting and preparing images for sharing, see{" "}
          <Link to="/guides/how-to-watermark-your-photos">how to watermark your photos</Link>, and
          remember to <Link to="/remove-exif">remove EXIF data</Link> before posting publicly.
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
