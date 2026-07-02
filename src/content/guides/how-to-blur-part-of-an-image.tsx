import { Link } from "react-router-dom";

export default function BlurGuide() {
  return (
    <>
      <h1>How to Blur Out Faces, Plates & Text in a Photo</h1>
      <p>
        Before you post a photo, it's worth hiding anything you don't want the whole internet to see: a
        bystander's face, a license plate, a house number, an email on a screenshot. Here's how to do it
        properly — and why a gentle blur sometimes isn't enough.
      </p>

      <h2>Blur vs pixelate</h2>
      <p>
        Both hide detail, and both are fine for most purposes:
      </p>
      <ul>
        <li><strong>Blur</strong> smears the area into a soft smudge. It looks natural and clean.</li>
        <li><strong>Pixelate</strong> replaces the area with large blocks of color — the classic "censored" look that reads clearly as intentionally hidden.</li>
      </ul>
      <p>
        Our <Link to="/blur-image">blur tool</Link> offers both; just drag a box over the area and pick
        an effect.
      </p>

      <h2>Make it strong enough to be irreversible</h2>
      <p>
        This matters: a <em>light</em> blur or coarse pixelation can sometimes be partially reversed,
        especially for predictable content like numbers or text. When you're hiding something genuinely
        sensitive:
      </p>
      <ul>
        <li><strong>Turn the strength up.</strong> Over-blur rather than under-blur.</li>
        <li><strong>Cover generously.</strong> Extend the box a little beyond the edges of what you're hiding.</li>
        <li><strong>Don't rely on faint pixelation for text</strong> — heavy blur or a solid block is safer for numbers and words.</li>
      </ul>

      <h2>Hiding multiple areas</h2>
      <p>
        To blur several spots, hide the first area and download, then re-upload the result and blur the
        next. Each pass bakes the previous blur permanently into the image, so there's no way to peel it
        back.
      </p>

      <h2>Keep the process private</h2>
      <p>
        You're hiding sensitive information, so the last thing you want is to upload the original to a
        server. Our tool applies the blur entirely in your browser — the untouched image never leaves
        your device. As a final step before sharing, also{" "}
        <Link to="/remove-exif">remove the photo's EXIF metadata</Link>, which can otherwise reveal the
        exact GPS location where it was taken.
      </p>
    </>
  );
}
