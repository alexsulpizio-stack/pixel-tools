import { Link } from "react-router-dom";

export default function JpegVsPngVsWebp() {
  return (
    <>
      <h1>JPEG vs PNG vs WebP: Which Image Format Should You Use?</h1>
      <p>
        Three formats cover almost every image you'll deal with on the web. Choosing the right one is
        the difference between a crisp 40&nbsp;KB image and a blurry 2&nbsp;MB one. Here's how they
        differ and a simple rule for each situation.
      </p>

      <h2>JPEG — the photo workhorse</h2>
      <p>
        JPEG (or JPG — same thing) uses lossy compression tuned for photographs. It excels at images
        with smooth gradients and lots of color variation: landscapes, portraits, product photos. Its
        weaknesses are sharp edges, where it produces visible "ringing," and transparency, which it
        doesn't support at all. JPEG is supported by literally everything — every browser, email
        client, printer, and operating system on earth — which is why it's still the safe default for
        attachments and uploads to older systems.
      </p>
      <p><strong>Use JPEG for:</strong> photographs, especially when you need universal compatibility.</p>

      <h2>PNG — lossless and transparent</h2>
      <p>
        PNG is lossless: it reproduces every pixel exactly. That makes it perfect for images with
        crisp edges and flat areas of color — logos, icons, screenshots, charts, and any graphic with
        text. It also supports a full alpha channel, so it's the standard for transparent images. The
        catch is file size: because it never discards data, a PNG photograph can be 5–10× larger than
        the equivalent JPEG. Using PNG for photos is the single most common cause of bloated pages.
      </p>
      <p><strong>Use PNG for:</strong> logos, icons, screenshots, line art, and anything needing transparency.</p>

      <h2>WebP — the modern all-rounder</h2>
      <p>
        WebP, developed by Google, supports <em>both</em> lossy and lossless modes plus transparency
        and animation in a single format. In practice WebP files are typically 25–35% smaller than a
        JPEG of the same visual quality, and significantly smaller than PNG for transparent graphics.
        Browser support is now effectively universal — every major browser has supported it for years.
        The only place you might avoid it is very old software or some email clients that still don't
        recognize it.
      </p>
      <p><strong>Use WebP for:</strong> almost everything on a modern website, when you want the smallest files.</p>

      <h2>Quick decision rule</h2>
      <ul>
        <li><strong>Photo on a website?</strong> → WebP.</li>
        <li><strong>Photo for email or an old system?</strong> → JPEG.</li>
        <li><strong>Logo, icon, screenshot, or chart?</strong> → PNG (or lossless WebP).</li>
        <li><strong>Needs transparency?</strong> → WebP or PNG.</li>
        <li><strong>Needs animation?</strong> → WebP (or keep an existing GIF).</li>
      </ul>

      <h2>A note on file extensions and "converting"</h2>
      <p>
        Renaming a file from <code>.png</code> to <code>.jpg</code> does <strong>not</strong> convert
        it — the data inside is still PNG, and most software will reject it. Real conversion re-encodes
        the pixels in the new format. You can convert between JPEG, PNG, and WebP for free in your
        browser with the <Link to="/">PixelTools converter</Link>; just pick the output format before
        downloading. To learn how to keep quality high while shrinking the result, see{" "}
        <Link to="/guides/how-to-compress-images-without-losing-quality">
          how to compress images without losing quality
        </Link>
        .
      </p>
    </>
  );
}
