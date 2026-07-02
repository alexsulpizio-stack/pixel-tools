import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { Dropzone } from "../components/Dropzone";
import { AdSlot } from "../components/AdSlot";
import { usePageMeta } from "../lib/usePageMeta";
import { ROUTE_META } from "../lib/routeMeta";
import { downloadBlob, formatBytes } from "../lib/imageCanvas";

type Mode = "encode" | "decode";

const FAQ = [
  { q: "What is a data URI?", a: "A data URI embeds the file's bytes directly in the URL as Base64 text, so an image can live inside your HTML or CSS with no separate file request." },
  { q: "When should I inline images as Base64?", a: "For very small images — icons, tiny logos, 1px backgrounds — to save an HTTP request. Base64 is ~33% larger than the binary, so it's a bad idea for large images." },
  { q: "Is anything uploaded?", a: "No. Encoding and decoding happen entirely in your browser." },
];

export default function ImageBase64Page() {
  usePageMeta(ROUTE_META["/image-to-base64"].title, ROUTE_META["/image-to-base64"].description);

  const [mode, setMode] = useState<Mode>("encode");
  const [dataUri, setDataUri] = useState("");
  const [copied, setCopied] = useState("");
  const [decodeInput, setDecodeInput] = useState("");
  const [decodeError, setDecodeError] = useState("");

  const onFiles = useCallback((files: File[]) => {
    const f = files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setDataUri(String(reader.result));
    reader.readAsDataURL(f);
  }, []);

  const copy = useCallback(async (key: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 1200);
  }, []);

  const decoded = (() => {
    const v = decodeInput.trim();
    if (!v) return "";
    return v.startsWith("data:") ? v : `data:image/png;base64,${v}`;
  })();

  const downloadDecoded = useCallback(async () => {
    try {
      setDecodeError("");
      const res = await fetch(decoded);
      const blob = await res.blob();
      const ext = (blob.type.split("/")[1] || "png").split("+")[0];
      downloadBlob(blob, `decoded.${ext}`);
    } catch {
      setDecodeError("That doesn't look like valid Base64 image data.");
    }
  }, [decoded]);

  const cssSnippet = dataUri ? `background-image: url("${dataUri}");` : "";
  const imgSnippet = dataUri ? `<img src="${dataUri}" alt="" />` : "";

  return (
    <>
      <section className="hero">
        <h1>Image ⇄ Base64 converter</h1>
        <p>
          Convert an image into a Base64 data URI to inline in HTML or CSS, or decode a Base64 string
          back into a downloadable image. Fast, free, and private — all in your browser.
        </p>
      </section>

      <AdSlot variant="banner" />

      <div className="settings">
        <div className="settings__group">
          <span className="settings__label">Direction</span>
          <div className="segmented">
            <button className={`segmented__btn ${mode === "encode" ? "segmented__btn--on" : ""}`} onClick={() => setMode("encode")}>Image → Base64</button>
            <button className={`segmented__btn ${mode === "decode" ? "segmented__btn--on" : ""}`} onClick={() => setMode("decode")}>Base64 → Image</button>
          </div>
        </div>
      </div>

      {mode === "encode" ? (
        <>
          <Dropzone onFiles={onFiles} />
          {dataUri && (
            <section className="results">
              <div className="canvas-stage"><img src={dataUri} alt="Preview" className="canvas-stage__canvas" /></div>
              <div className="results__bar" style={{ marginTop: 14 }}>
                <p className="results__summary">Data URI · {formatBytes(dataUri.length)} of text</p>
                <div className="results__actions">
                  <button className="btn btn--primary" onClick={() => copy("uri", dataUri)}>{copied === "uri" ? "Copied ✓" : "Copy data URI"}</button>
                  <button className="btn btn--ghost" onClick={() => copy("css", cssSnippet)}>{copied === "css" ? "Copied ✓" : "Copy CSS"}</button>
                  <button className="btn btn--ghost" onClick={() => copy("img", imgSnippet)}>{copied === "img" ? "Copied ✓" : "Copy <img>"}</button>
                </div>
              </div>
              <div className="snippet"><pre>{dataUri.slice(0, 300)}{dataUri.length > 300 ? "…" : ""}</pre></div>
            </section>
          )}
        </>
      ) : (
        <>
          <div className="settings">
            <div className="settings__group settings__group--wide">
              <span className="settings__label">Paste Base64 or a data URI</span>
              <textarea className="textfield textfield--area" rows={5} value={decodeInput} onChange={(e) => setDecodeInput(e.target.value)} placeholder="data:image/png;base64,iVBORw0KGgo…" />
            </div>
          </div>
          {decodeError && <p className="error">{decodeError}</p>}
          {decoded && (
            <section className="results">
              <div className="canvas-stage"><img src={decoded} alt="Decoded" className="canvas-stage__canvas" onError={() => setDecodeError("That doesn't look like valid Base64 image data.")} /></div>
              <div className="results__bar" style={{ marginTop: 14 }}>
                <p className="results__summary">Decoded image</p>
                <div className="results__actions">
                  <button className="btn btn--primary" onClick={downloadDecoded}>⬇ Download image</button>
                </div>
              </div>
            </section>
          )}
        </>
      )}

      <section className="prose tool-prose">
        <h2>About Base64 images</h2>
        <p>
          Encoding an image as <strong>Base64</strong> turns its binary data into plain text you can
          embed directly in a stylesheet or HTML document as a <em>data URI</em>. This removes a network
          request, which can speed up loading for tiny assets like icons.
        </p>
        <p>
          The trade-off: Base64 text is about <strong>33% larger</strong> than the original file and
          can't be cached separately, so reserve it for small images. For photos, keep them as regular
          files and <Link to="/">compress</Link> them instead. Curious how formats compare? Read{" "}
          <Link to="/guides/jpeg-vs-png-vs-webp">JPEG vs PNG vs WebP</Link>.
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
