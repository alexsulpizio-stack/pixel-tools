import { Link } from "react-router-dom";

export default function ConvertPngToWebpGuide() {
  return (
    <>
      <h1>How to Convert PNG to WebP (and When You Shouldn't)</h1>
      <p>
        PNG is everywhere, but it's often the wrong choice for the web — it produces large files. WebP
        usually delivers the same result at a fraction of the size, with transparency intact. Here's when
        to make the switch and how.
      </p>

      <h2>Why WebP beats PNG for the web</h2>
      <p>
        WebP supports both lossless and lossy compression <em>and</em> an alpha channel for transparency.
        In practice that means:
      </p>
      <ul>
        <li><strong>25–35% smaller</strong> than PNG when using WebP's lossless mode.</li>
        <li><strong>Up to 80% smaller</strong> when a little lossy compression is acceptable.</li>
        <li><strong>Transparency preserved</strong>, so it's a true drop-in replacement for transparent PNGs.</li>
      </ul>
      <p>
        Smaller images mean faster pages and better Core Web Vitals — which also helps SEO.
      </p>

      <h2>Browser support</h2>
      <p>
        WebP is supported by every current major browser — Chrome, Edge, Firefox, and Safari. Unless you
        must support very old software, you can use WebP confidently on the web today.
      </p>

      <h2>How to convert</h2>
      <p>
        Drop your PNGs into our <Link to="/image-converter">image converter</Link>, choose WebP, set a
        quality level (85% is a great default for photos; use the top of the range for graphics with hard
        edges), and download. Everything runs in your browser — nothing is uploaded.
      </p>

      <h2>When to keep PNG instead</h2>
      <ul>
        <li><strong>You need maximum compatibility</strong> with old or niche software that predates WebP.</li>
        <li><strong>You're sharing a file for editing</strong> where the recipient expects PNG.</li>
        <li><strong>The image is a tiny UI asset</strong> where the size difference is negligible.</li>
      </ul>
      <p>
        For a broader comparison of when each format wins, read{" "}
        <Link to="/guides/jpeg-vs-png-vs-webp">JPEG vs PNG vs WebP</Link>. And if your source is an
        iPhone photo, convert it with the <Link to="/heic-to-jpg">HEIC to JPG tool</Link> first, then to
        WebP.
      </p>
    </>
  );
}
