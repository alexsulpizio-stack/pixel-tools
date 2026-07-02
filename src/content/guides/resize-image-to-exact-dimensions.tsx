import { Link } from "react-router-dom";

export default function ResizeImageGuide() {
  return (
    <>
      <h1>How to Resize an Image to Exact Pixel Dimensions</h1>
      <p>
        Resizing sounds trivial — make the picture bigger or smaller — but a few small ideas separate a
        crisp result from a stretched, blurry mess. Here's how image dimensions actually work and how to
        get the exact size you need.
      </p>

      <h2>Pixels, not inches</h2>
      <p>
        On screens, an image's size is measured in <strong>pixels</strong>: width × height. A 1920×1080
        image is 1920 pixels wide and 1080 tall. "DPI" and inches only matter for print; for anything on
        the web, think purely in pixels.
      </p>

      <h2>Keep the aspect ratio (or things stretch)</h2>
      <p>
        The <strong>aspect ratio</strong> is the relationship between width and height. A 4000×3000 photo
        has a 4:3 ratio. If you set the width to 800 but leave the height at 3000, the image squashes
        horizontally and everyone looks strange. The fix: change one dimension and let the other scale
        proportionally. That's why our <Link to="/resize-image">image resizer</Link> locks the ratio by
        default — enter a width and the height follows automatically.
      </p>

      <h2>Downscaling is safe, upscaling is not</h2>
      <p>
        Making an image <em>smaller</em> throws away pixels the eye won't miss — it's effectively
        lossless and usually improves file size dramatically. Making an image <em>larger</em> than its
        original dimensions forces the software to invent detail that was never captured, so it looks
        soft and mushy. Rule of thumb: never upscale a photo you plan to present at full quality.
      </p>

      <h2>Good target dimensions</h2>
      <ul>
        <li><strong>Full-width web hero:</strong> 1600–2000px wide is plenty, even on large monitors.</li>
        <li><strong>Blog / in-article image:</strong> 1000–1200px wide.</li>
        <li><strong>Thumbnail:</strong> 300–400px wide.</li>
        <li><strong>Instagram square:</strong> 1080×1080px.</li>
        <li><strong>Instagram portrait:</strong> 1080×1350px.</li>
        <li><strong>YouTube thumbnail:</strong> 1280×720px.</li>
        <li><strong>Email:</strong> keep the widest dimension around 600px.</li>
      </ul>

      <h2>Resize, then compress</h2>
      <p>
        Resizing to sensible dimensions is the single biggest file-size win — a photo displayed at 800px
        doesn't need to be 4000px wide. After resizing, run the result through the{" "}
        <Link to="/">compressor</Link> to squeeze out the rest. For the full workflow, see{" "}
        <Link to="/guides/reduce-image-file-size-for-email-and-web">how to reduce image file size</Link>{" "}
        and <Link to="/guides/jpeg-vs-png-vs-webp">JPEG vs PNG vs WebP</Link>.
      </p>
    </>
  );
}
