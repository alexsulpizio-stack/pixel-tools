import { useState } from "react";

type ImageKind = "photo" | "screenshot" | "logo";
type Destination = "website" | "upload";

function getAdvice(kind: ImageKind, destination: Destination, transparent: boolean) {
  if (destination === "upload") {
    if (transparent) {
      return {
        format: "Use the format the form accepts; PNG is the safest fallback.",
        reason: "JPEG removes transparency. WebP can preserve it, but some upload forms reject WebP even when the image is valid.",
      };
    }
    if (kind === "screenshot") {
      return {
        format: "Use the required format; choose PNG when the form allows it.",
        reason: "PNG keeps small text and sharp interface edges crisp. If the form requires JPEG, export as JPEG and inspect fine text before submitting.",
      };
    }
    return {
      format: "Use the required format; choose JPEG for broad compatibility.",
      reason: "Many older forms accept JPEG but reject WebP. A smaller file still fails if its actual format is not allowed.",
    };
  }

  if (transparent) {
    return {
      format: "WebP for a modern website; PNG when you need the safest editing handoff.",
      reason: "Both can preserve transparent pixels. Keep the transparency when exporting; JPEG always replaces it with a solid background.",
    };
  }
  if (kind === "screenshot") {
    return {
      format: "PNG for the clearest text; lossless WebP if your site supports it.",
      reason: "Small labels and one-pixel lines can soften with lossy compression. Compare at the size visitors will see.",
    };
  }
  if (kind === "logo") {
    return {
      format: "SVG for a vector original; otherwise PNG or lossless WebP.",
      reason: "A vector stays sharp at different sizes. For a raster logo, avoid lossy compression around high-contrast edges.",
    };
  }
  return {
    format: "WebP is a strong default for a modern website; keep JPEG for compatibility.",
    reason: "WebP often gives photos a smaller file at comparable appearance. Check the result at its displayed size before replacing the original.",
  };
}

export function FormatAdvisor() {
  const [kind, setKind] = useState<ImageKind>("photo");
  const [destination, setDestination] = useState<Destination>("website");
  const [transparent, setTransparent] = useState(false);
  const advice = getAdvice(kind, destination, transparent);

  return (
    <section className="format-advisor" aria-labelledby="format-advisor-title">
      <h2 id="format-advisor-title">Choose a format for your image</h2>
      <p>Pick the image and destination to get a practical starting point. Follow a recipient’s file rules when they specify a format.</p>
      <div className="format-advisor__controls">
        <label>
          Image type
          <select value={kind} onChange={(event) => setKind(event.target.value as ImageKind)}>
            <option value="photo">Photograph</option>
            <option value="screenshot">Screenshot, diagram, or text</option>
            <option value="logo">Logo or graphic</option>
          </select>
        </label>
        <label>
          Where will it go?
          <select value={destination} onChange={(event) => setDestination(event.target.value as Destination)}>
            <option value="website">A modern website</option>
            <option value="upload">An upload form, email, or document</option>
          </select>
        </label>
        <label className="format-advisor__check">
          <input type="checkbox" checked={transparent} onChange={(event) => setTransparent(event.target.checked)} />
          The background must stay transparent
        </label>
      </div>
      <div className="format-advisor__result" aria-live="polite">
        <strong>{advice.format}</strong>
        <p>{advice.reason}</p>
      </div>
    </section>
  );
}
