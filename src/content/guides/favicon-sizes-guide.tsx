import { Link } from "react-router-dom";

export default function FaviconSizesGuide() {
  return (
    <>
      <h1>Favicon Sizes in 2026: Every File You Actually Need</h1>
      <p>
        A favicon is the small icon that represents your site in browser tabs, bookmarks, history,
        search results, and on phone home screens. The advice online is a mess of legacy sizes from a
        decade ago. Here's what actually matters in 2026 — a short list, not the 20-file dumps some
        generators still produce.
      </p>

      <h2>What size should a favicon be?</h2>
      <p>
        Short answer: a favicon isn't a single size — it's a small set. The most important dimension
        is <strong>32×32 pixels</strong> for modern browser tabs, with <strong>16×16</strong> for
        legacy displays; both live inside one <code>favicon.ico</code>. For phones and installable web
        apps you also want a <strong>180×180</strong> Apple touch icon and <strong>192×192</strong> and{" "}
        <strong>512×512</strong> PNGs. Here are the favicon dimensions that actually matter in 2026:
      </p>
      <table>
        <thead>
          <tr>
            <th>Size (px)</th>
            <th>File</th>
            <th>Where it's used</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>16×16</td>
            <td><code>favicon.ico</code></td>
            <td>Legacy browser tabs and the address bar</td>
          </tr>
          <tr>
            <td>32×32</td>
            <td><code>favicon.ico</code></td>
            <td>Modern browser tabs and bookmarks — the key size</td>
          </tr>
          <tr>
            <td>48×48</td>
            <td><code>favicon.ico</code></td>
            <td>Windows site shortcuts and taskbar</td>
          </tr>
          <tr>
            <td>180×180</td>
            <td><code>apple-touch-icon.png</code></td>
            <td>iOS home-screen icon</td>
          </tr>
          <tr>
            <td>192×192</td>
            <td><code>icon-192.png</code></td>
            <td>Android home screen (via web manifest)</td>
          </tr>
          <tr>
            <td>512×512</td>
            <td><code>icon-512.png</code></td>
            <td>PWA install and splash screens</td>
          </tr>
          <tr>
            <td>Scalable</td>
            <td><code>icon.svg</code></td>
            <td>Modern browsers, any size, light/dark variants</td>
          </tr>
        </tbody>
      </table>
      <p>
        You don't have to make these by hand — our{" "}
        <Link to="/favicon-generator">favicon generator</Link> exports every size above (plus the{" "}
        <code>.ico</code>, manifest, and HTML snippet) from a single image, letter, or emoji.
      </p>

      <h2>The files that matter today</h2>
      <ul>
        <li>
          <strong>favicon.ico (16, 32, 48px):</strong> a single multi-resolution <code>.ico</code>{" "}
          file is still the most compatible base. Browsers pick the sharpest size for tabs and bookmarks.
        </li>
        <li>
          <strong>icon-192.png and icon-512.png:</strong> used by Android and Progressive Web Apps,
          referenced from a web manifest. The 512px version is also the source for splash screens.
        </li>
        <li>
          <strong>apple-touch-icon.png (180px):</strong> shown when someone adds your site to an iOS
          home screen. iOS ignores <code>.ico</code>, so this is required for a sharp Apple icon.
        </li>
        <li>
          <strong>An SVG icon (optional but recommended):</strong> a single scalable file modern
          browsers can use at any size, and it supports light/dark variants.
        </li>
      </ul>
      <p>
        That's it. You do not need separate 57px, 72px, 114px, or 144px Apple icons anymore — those
        targeted long-obsolete iOS versions.
      </p>

      <h2>The HTML to add</h2>
      <p>Place these tags in the <code>&lt;head&gt;</code> of every page:</p>
      <ul>
        <li><code>&lt;link rel="icon" href="/favicon.ico" sizes="any"&gt;</code></li>
        <li><code>&lt;link rel="icon" type="image/svg+xml" href="/icon.svg"&gt;</code></li>
        <li><code>&lt;link rel="apple-touch-icon" href="/apple-touch-icon.png"&gt;</code></li>
        <li><code>&lt;link rel="manifest" href="/site.webmanifest"&gt;</code></li>
      </ul>
      <p>
        The manifest then references your 192 and 512px PNGs for Android and PWA installs. Our{" "}
        <Link to="/favicon-generator">favicon generator</Link> produces every one of these files —
        plus the manifest and a ready-to-paste snippet — from a single image, letter, or emoji.
      </p>

      <h2>Designing an icon that reads at 16px</h2>
      <p>
        The hardest part of a favicon isn't the export, it's the design. At 16&nbsp;×&nbsp;16 pixels
        there's room for one idea, not your full logo. Tips that help:
      </p>
      <ul>
        <li><strong>Simplify.</strong> Drop wordmarks and fine detail; use a single glyph, monogram, or shape.</li>
        <li><strong>High contrast.</strong> The icon sits on tabs of unknown color; a solid background keeps it legible.</li>
        <li><strong>Test small.</strong> Shrink your design to 16px and check it's still recognizable before committing.</li>
      </ul>
      <p>
        If you don't have a logo yet, a single letter or emoji on a colored background makes a perfectly
        good favicon — the generator can build one in seconds.
      </p>

      <h2>Common mistakes</h2>
      <ul>
        <li><strong>Only providing a PNG named favicon.png.</strong> Some browsers still expect <code>favicon.ico</code>; provide both.</li>
        <li><strong>Forgetting the apple-touch-icon.</strong> Without it, iOS generates a blurry screenshot of your page instead of your icon.</li>
        <li><strong>Caching.</strong> Browsers cache favicons aggressively. After updating, hard-refresh or test in a private window.</li>
      </ul>
    </>
  );
}
