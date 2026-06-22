import { Link } from "react-router-dom";

export default function ReduceImageFileSize() {
  return (
    <>
      <h1>How to Reduce Image File Size for Email and the Web</h1>
      <p>
        Whether you're fighting an attachment limit or a slow-loading page, the goal is the same: a
        smaller file that still looks good. This guide covers the real size limits you're up against
        and the fastest way to get under them.
      </p>

      <h2>Why your images are so big</h2>
      <p>
        Photos straight from a phone or camera are large for two reasons: high <strong>resolution</strong>{" "}
        (12&nbsp;megapixels and up) and minimal in-camera compression to preserve editing latitude. A
        single photo can easily be 5–12&nbsp;MB. That's wonderful for printing and terrible for email
        and web pages, where you almost never need that much data.
      </p>

      <h2>Email attachment limits</h2>
      <ul>
        <li><strong>Gmail:</strong> 25&nbsp;MB per message (larger files switch to a Google Drive link).</li>
        <li><strong>Outlook / Microsoft 365:</strong> 20–25&nbsp;MB, though many corporate servers cap inbound mail at 10&nbsp;MB.</li>
        <li><strong>Practical advice:</strong> keep total attachments under 10&nbsp;MB so they pass through every server in between.</li>
      </ul>
      <p>
        For a handful of photos, compressing each to 300–800&nbsp;KB keeps the whole email small and
        fast to download — with no visible quality loss for on-screen viewing.
      </p>

      <h2>Web page targets</h2>
      <p>
        Page speed is a ranking factor and a bounce-rate factor. Sensible targets:
      </p>
      <ul>
        <li><strong>Hero / full-width images:</strong> 1600–2000px wide, 150–400&nbsp;KB as WebP.</li>
        <li><strong>In-content images:</strong> 800–1200px wide, 50–150&nbsp;KB.</li>
        <li><strong>Thumbnails:</strong> 300–600px wide, 10–40&nbsp;KB.</li>
      </ul>

      <h2>The two-step method</h2>
      <p>
        Reducing file size is almost always a combination of resizing and compressing:
      </p>
      <ul>
        <li><strong>1. Resize</strong> the image down to the largest dimension it will actually be displayed at. This alone often cuts the file by 70%+.</li>
        <li><strong>2. Compress</strong> in WebP or JPEG at quality ~80. See <Link to="/guides/how-to-compress-images-without-losing-quality">compressing without losing quality</Link> for the details.</li>
      </ul>
      <p>
        You can do both, for any number of images at once, with the free{" "}
        <Link to="/">PixelTools compressor</Link> — set a maximum dimension, pick a format, and download
        a ZIP. Everything runs locally in your browser, so even sensitive photos never leave your device.
      </p>

      <h2>When you need an exact number</h2>
      <p>
        Some upload forms enforce a hard cap — "max 2&nbsp;MB" or "under 500&nbsp;KB." Rather than
        guessing at quality settings, use a target-size tool that automatically finds the best quality
        that fits:
      </p>
      <ul>
        <li><Link to="/compress-image-to-50kb">Compress image to 50KB</Link></li>
        <li><Link to="/compress-image-to-100kb">Compress image to 100KB</Link></li>
        <li><Link to="/compress-image-to-200kb">Compress image to 200KB</Link></li>
        <li><Link to="/compress-image-to-500kb">Compress image to 500KB</Link></li>
      </ul>
      <p>
        Each one binary-searches the quality setting — and downscales if needed — to land just under
        your target while keeping the image as sharp as possible.
      </p>
    </>
  );
}
