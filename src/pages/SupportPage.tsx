import { Link } from "react-router-dom";
import { usePageMeta } from "../lib/usePageMeta";
import { ROUTE_META } from "../lib/routeMeta";

const SUPPORT_TOPICS = [
  {
    title: "A tool won't accept my image",
    body:
      "Make sure the file is a format the tool supports. Most PixelTools image tools work with JPG, PNG, and WebP, while some tools also support GIF, BMP, AVIF, or HEIC. If a file still fails, try opening it in another app and saving a fresh copy before trying again.",
  },
  {
    title: "Processing seems stuck",
    body:
      "Very large images can take longer on older phones or computers because processing happens locally on your device. Try one image at a time, close other memory-heavy tabs, and reload the page before trying again.",
  },
  {
    title: "My download didn't start",
    body:
      "Your browser may be blocking automatic downloads. Check the download or pop-up indicator near the address bar, allow downloads for usepixeltools.com, then try the Download button again.",
  },
  {
    title: "The result looks different than expected",
    body:
      "Compression, resizing, conversion, and PDF page settings can change the final appearance or dimensions. Review the tool's settings before downloading, and use a higher quality level when image detail matters more than file size.",
  },
];

export default function SupportPage() {
  usePageMeta(ROUTE_META["/support"].title, ROUTE_META["/support"].description);

  return (
    <article className="prose">
      <h1>PixelTools Help & Support</h1>

      <p>
        Need help using PixelTools? Start here for common fixes, privacy answers, and the best way to report a problem.
        PixelTools runs its image processing directly in your browser, so most issues can be resolved without sending
        your files anywhere.
      </p>

      <h2>Quick troubleshooting</h2>
      {SUPPORT_TOPICS.map((topic) => (
        <section key={topic.title}>
          <h3>{topic.title}</h3>
          <p>{topic.body}</p>
        </section>
      ))}

      <h2>Are my images uploaded?</h2>
      <p>
        No. PixelTools processes your images locally in your browser. We do not receive or store the files you choose
        for the image tools. That also means we cannot inspect a problem file from our side unless you deliberately
        choose to share it when reporting a bug. Read the full details on our <Link to="/privacy">Privacy Policy</Link>.
      </p>

      <h2>How to report a bug</h2>
      <p>
        If a tool still isn't working, tell us which tool you used, what you expected to happen, what actually
        happened, and which browser and device you were using. PixelTools is open source, and bug reports and feature
        requests can be submitted through our{" "}
        <a href="https://github.com/alexsulpizio-stack/pixel-tools/issues" target="_blank" rel="noreferrer">
          GitHub issues page
        </a>
        . Please do not post private or sensitive images in a public issue.
      </p>

      <h2>Need a specific tool?</h2>
      <p>
        Browse <Link to="/tools">all PixelTools utilities</Link> for compression, resizing, cropping, conversion, PDF,
        metadata removal, QR codes, favicons, and more. If the tool you need isn't available, you can request it through
        the same GitHub issues page.
      </p>

      <h2>Still need help?</h2>
      <p>
        Visit the <Link to="/contact">Contact page</Link> for the best ways to reach us, or read more about the project
        on the <Link to="/about">About page</Link>.
      </p>
    </article>
  );
}
