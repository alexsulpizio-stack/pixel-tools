import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Dropzone } from "../components/Dropzone";
import { AdSlot } from "../components/AdSlot";
import { usePageMeta } from "../lib/usePageMeta";
import { ROUTE_META } from "../lib/routeMeta";
import { canvasToBlob, downloadBlob, loadImage, withExtension } from "../lib/imageCanvas";

const FAQ = [
  { q: "Does the circle have a transparent background?", a: "Yes. The corners outside the circle are fully transparent, and the file is saved as a PNG so the transparency is preserved — perfect for profile pictures." },
  { q: "What if my photo isn't square?", a: "The largest centered square is used automatically, then cropped to a circle. Crop to reframe first with the crop tool if you want a different area." },
  { q: "Are my images uploaded?", a: "No. The circle crop is rendered in your browser and never leaves your device." },
];

export default function CircleCropPage() {
  usePageMeta(ROUTE_META["/circle-crop"].title, ROUTE_META["/circle-crop"].description);

  const [file, setFile] = useState<File | null>(null);
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
    const size = Math.min(bitmap.width, bitmap.height);
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    const sx = (bitmap.width - size) / 2;
    const sy = (bitmap.height - size) / 2;
    ctx.drawImage(bitmap, sx, sy, size, size, 0, 0, size, size);
    ctx.restore();
  }, [file]);

  const download = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || !file) return;
    const blob = await canvasToBlob(canvas, "image/png");
    downloadBlob(blob, withExtension(`circle-${file.name}`, "png"));
  }, [file]);

  return (
    <>
      <section className="hero">
        <h1>Circle crop — round profile picture</h1>
        <p>
          Turn any photo into a circular image with a transparent background, ready to use as a profile
          picture or avatar. Free, private, and saved as a PNG. Nothing is uploaded.
        </p>
      </section>

      <AdSlot variant="banner" />

      <Dropzone onFiles={onFiles} />

      {file && (
        <section className="results">
          <div className="results__bar">
            <p className="results__summary">Cropped to a circle with transparent corners</p>
            <div className="results__actions">
              <button className="btn btn--primary" onClick={download}>⬇ Download PNG</button>
            </div>
          </div>
          <div className="canvas-stage canvas-stage--checker">
            <canvas ref={canvasRef} className="canvas-stage__canvas canvas-stage__canvas--round" />
          </div>
        </section>
      )}

      <section className="prose tool-prose">
        <h2>How to make a circular image</h2>
        <ul>
          <li><strong>1.</strong> Upload a photo — a square from the center is used automatically.</li>
          <li><strong>2.</strong> Preview the round result on the checkerboard (which represents transparency).</li>
          <li><strong>3.</strong> Download the PNG — the transparent corners mean it drops cleanly onto any background.</li>
        </ul>
        <p>
          Need to choose exactly which part of the photo ends up in the circle? <Link to="/crop-image">Crop it first</Link>, then run it through here. Turning it into a site icon? See the{" "}
          <Link to="/favicon-generator">favicon generator</Link>.
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
