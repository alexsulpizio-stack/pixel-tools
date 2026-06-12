import { useCallback, useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { AdSlot } from "../components/AdSlot";
import { usePageMeta } from "../lib/usePageMeta";

type EcLevel = "L" | "M" | "Q" | "H";

const EC_LEVELS: { value: EcLevel; label: string; hint: string }[] = [
  { value: "L", label: "L", hint: "7% recovery" },
  { value: "M", label: "M", hint: "15% recovery" },
  { value: "Q", label: "Q", hint: "25% recovery" },
  { value: "H", label: "H", hint: "30% recovery" },
];

const SIZES = [256, 512, 1024];

const FAQ: { q: string; a: string }[] = [
  {
    q: "Do these QR codes expire?",
    a: "Never. The QR code encodes your text directly — there's no shortener or tracking service in between, so it works forever and can't be taken down.",
  },
  {
    q: "What can I encode?",
    a: "Anything text-based: URLs, Wi-Fi credentials (WIFI:T:WPA;S:network;P:password;;), phone numbers (tel:), email (mailto:), plain text, or vCard contact details.",
  },
  {
    q: "Which error correction level should I use?",
    a: "M (15%) is a good default. Use H (30%) if the code will be printed small, displayed in poor conditions, or have a logo placed over the center.",
  },
  {
    q: "PNG or SVG?",
    a: "PNG for digital use (websites, documents, presentations). SVG scales infinitely, making it best for print — business cards, posters, packaging.",
  },
];

export default function QrPage() {
  usePageMeta(
    "Free QR Code Generator — PNG & SVG, No Expiry, No Tracking | PixelTools",
    "Create QR codes for URLs, Wi-Fi, text and more. Custom colors, high-res PNG and SVG download. Free, no sign-up, no expiry, generated privately in your browser."
  );

  const [value, setValue] = useState("https://usepixeltools.com");
  const [dark, setDark] = useState("#000000");
  const [light, setLight] = useState("#ffffff");
  const [ecLevel, setEcLevel] = useState<EcLevel>("M");
  const [size, setSize] = useState(512);
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!value.trim()) {
      setError("Enter some text or a URL to encode.");
      return;
    }
    QRCode.toCanvas(canvas, value, {
      width: size,
      margin: 2,
      errorCorrectionLevel: ecLevel,
      color: { dark, light },
    })
      .then(() => setError(""))
      .catch(() => setError("That content is too long to fit in a QR code."));
  }, [value, dark, light, ecLevel, size]);

  const downloadPng = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "qr-code.png";
    a.click();
  }, []);

  const downloadSvg = useCallback(async () => {
    const svg = await QRCode.toString(value, {
      type: "svg",
      margin: 2,
      errorCorrectionLevel: ecLevel,
      color: { dark, light },
    });
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qr-code.svg";
    a.click();
    URL.revokeObjectURL(url);
  }, [value, dark, light, ecLevel]);

  return (
    <>
      <section className="hero">
        <h1>QR code generator — free, no expiry, no tracking</h1>
        <p>
          Encode URLs, Wi-Fi credentials, or any text. Custom colors, print-ready SVG and high-res PNG. Generated
          locally — nothing is sent to a server, and codes never expire.
        </p>
      </section>

      <AdSlot variant="banner" />

      <div className="settings">
        <div className="settings__group settings__group--wide">
          <span className="settings__label">Content</span>
          <textarea
            className="textfield textfield--area"
            value={value}
            rows={3}
            onChange={(e) => setValue(e.target.value)}
            placeholder="https://example.com or any text"
          />
        </div>

        <div className="settings__group">
          <span className="settings__label">Colors</span>
          <div className="colorrow">
            <label>
              <input type="color" value={dark} onChange={(e) => setDark(e.target.value)} /> Code
            </label>
            <label>
              <input type="color" value={light} onChange={(e) => setLight(e.target.value)} /> Background
            </label>
          </div>
        </div>

        <div className="settings__group">
          <span className="settings__label">Error correction</span>
          <div className="segmented">
            {EC_LEVELS.map((l) => (
              <button
                key={l.value}
                title={l.hint}
                className={`segmented__btn ${ecLevel === l.value ? "segmented__btn--on" : ""}`}
                onClick={() => setEcLevel(l.value)}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div className="settings__group">
          <span className="settings__label">PNG size</span>
          <div className="segmented">
            {SIZES.map((s) => (
              <button
                key={s}
                className={`segmented__btn ${size === s ? "segmented__btn--on" : ""}`}
                onClick={() => setSize(s)}
              >
                {s}px
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      <section className="results">
        <div className="qr-stage">
          <canvas ref={canvasRef} className="qr-stage__canvas" aria-label="Generated QR code" />
          <div className="results__actions">
            <button className="btn btn--primary" onClick={downloadPng} disabled={!!error}>
              ⬇ PNG
            </button>
            <button className="btn btn--primary" onClick={downloadSvg} disabled={!!error}>
              ⬇ SVG
            </button>
          </div>
        </div>
      </section>

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
