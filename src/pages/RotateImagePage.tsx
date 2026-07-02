import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Dropzone } from "../components/Dropzone";
import { AdSlot } from "../components/AdSlot";
import { usePageMeta } from "../lib/usePageMeta";
import { ROUTE_META } from "../lib/routeMeta";
import { canvasToBlob, downloadBlob, loadImage, withExtension } from "../lib/imageCanvas";

const FAQ = [
  { q: "My phone photo shows sideways — can this fix it?", a: "Yes. Rotate it 90° in the correct direction and download; the saved image will be upright everywhere." },
  { q: "What's the difference between rotate and flip?", a: "Rotate turns the image around its center (90/180/270°). Flip mirrors it horizontally or vertically, like a reflection." },
  { q: "Are my images uploaded?", a: "No. Rotating and flipping happen in your browser; your image never leaves your device." },
];

export default function RotateImagePage() {
  usePageMeta(ROUTE_META["/rotate-image"].title, ROUTE_META["/rotate-image"].description);

  const [file, setFile] = useState<File | null>(null);
  const [rotation, setRotation] = useState(0); // 0,90,180,270
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bitmapRef = useRef<ImageBitmap | null>(null);

  const onFiles = useCallback(async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    const { bitmap } = await loadImage(f);
    bitmapRef.current?.close();
    bitmapRef.current = bitmap;
    setFile(f);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const bitmap = bitmapRef.current;
    if (!canvas || !bitmap || !file) return;
    const swap = rotation === 90 || rotation === 270;
    const w = swap ? bitmap.height : bitmap.width;
    const h = swap ? bitmap.width : bitmap.height;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.drawImage(bitmap, -bitmap.width / 2, -bitmap.height / 2);
    ctx.restore();
  }, [file, rotation, flipH, flipV]);

  const download = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || !file) return;
    const type = file.type === "image/png" ? "image/png" : "image/jpeg";
    const ext = type === "image/png" ? "png" : "jpg";
    const blob = await canvasToBlob(canvas, type, 0.92);
    downloadBlob(blob, withExtension(`rotated-${file.name}`, ext));
  }, [file]);

  return (
    <>
      <section className="hero">
        <h1>Rotate & flip an image</h1>
        <p>
          Rotate by 90°, 180°, or 270°, and flip horizontally or vertically to fix sideways or mirrored
          photos. Free and private — everything runs in your browser.
        </p>
      </section>

      <AdSlot variant="banner" />

      <Dropzone onFiles={onFiles} />

      {file && (
        <>
          <div className="settings">
            <div className="settings__group">
              <span className="settings__label">Rotate</span>
              <div className="segmented">
                <button className="segmented__btn" onClick={() => setRotation((r) => (r + 270) % 360)}>↺ Left</button>
                <button className="segmented__btn" onClick={() => setRotation((r) => (r + 90) % 360)}>↻ Right</button>
                <button className="segmented__btn" onClick={() => setRotation((r) => (r + 180) % 360)}>180°</button>
              </div>
            </div>
            <div className="settings__group">
              <span className="settings__label">Flip</span>
              <div className="segmented">
                <button className={`segmented__btn ${flipH ? "segmented__btn--on" : ""}`} onClick={() => setFlipH((v) => !v)}>↔ Horizontal</button>
                <button className={`segmented__btn ${flipV ? "segmented__btn--on" : ""}`} onClick={() => setFlipV((v) => !v)}>↕ Vertical</button>
              </div>
            </div>
            <div className="settings__group">
              <span className="settings__label">Current</span>
              <p className="target-badge">{rotation}°{flipH ? " · flip H" : ""}{flipV ? " · flip V" : ""}</p>
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
        <h2>How to rotate or flip a photo</h2>
        <ul>
          <li><strong>1.</strong> Add your image.</li>
          <li><strong>2.</strong> Tap Left/Right to rotate in 90° steps, or 180° to turn it upside down. Use Flip to mirror it.</li>
          <li><strong>3.</strong> Download the corrected image.</li>
        </ul>
        <p>
          Sideways phone photos are usually caused by orientation metadata; rotating and re-saving here
          bakes in the correct orientation. You can then <Link to="/resize-image">resize</Link> or{" "}
          <Link to="/">compress</Link> it if needed.
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
