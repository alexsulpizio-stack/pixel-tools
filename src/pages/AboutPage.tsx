import { Link } from "react-router-dom";
import { usePageMeta } from "../lib/usePageMeta";
import { ROUTE_META } from "../lib/routeMeta";

export default function AboutPage() {
  usePageMeta(ROUTE_META["/about"].title, ROUTE_META["/about"].description);

  return (
    <article className="prose">
      <h1>About PixelTools</h1>

      <p>
        PixelTools is a collection of free, privacy-first utilities for working with images — compressing, resizing,
        converting, generating favicons and QR codes, extracting color palettes, and turning images into PDFs. Every
        tool is designed to be fast, simple, and require nothing more than a web browser.
      </p>

      <h2>Our mission</h2>
      <p>
        Image editing does not always need a server upload. PixelTools processes files locally so you can
        prepare photos and screenshots without transferring their contents to a processing service.
      </p>

      <h2>How we build the tools</h2>
      <p>
        Each utility is designed around a specific job: preparing an image for a form, making a page load faster,
        fixing a format mismatch, or protecting private information before sharing. We keep the controls explicit and
        show relevant output details such as file size, dimensions, format, and page ordering.
      </p>
      <p>
        The tools use standard browser capabilities such as the Canvas API and local file handling. That design keeps
        the workflow useful without an upload account, while the guides explain when
        a particular format or setting is appropriate and what it cannot do.
      </p>
      <p>
        PixelTools does all of its work locally, inside your browser, using modern web technology (the Canvas API and
        related standards). Your files never leave your device. There are no uploads, no accounts, no watermarks, and
        no processing-server round trip. Large files and batches are still limited by your browser and device memory;
        processing time depends on the file and device.
      </p>

      <h2>What you can do here</h2>
      <ul>
        <li>
          <Link to="/">Compress, resize &amp; convert images</Link> (JPG, PNG, WebP) with batch processing
        </li>
        <li>
          Compress an image to a <Link to="/compress-image-to-1mb">target file-size limit</Link> for upload forms
        </li>
        <li>
          Generate a complete <Link to="/favicon-generator">favicon package</Link> from an image, letter, or emoji
        </li>
        <li>
          Create <Link to="/qr-code-generator">static QR codes</Link> without a PixelTools tracking redirect or subscription expiry
        </li>
        <li>
          Extract a <Link to="/color-palette">color palette</Link> from any image
        </li>
        <li>
          Combine images into a <Link to="/image-to-pdf">PDF document</Link>
        </li>
      </ul>

      <h2>Who runs it</h2>
      <p>
        PixelTools is an independent, open-source project. The tools are free to use, and advertising may help
        support their maintenance. You can inspect the source, report issues, and follow changes on{" "}
        <a href="https://github.com/alexsulpizio-stack/pixel-tools" target="_blank" rel="noreferrer">
          GitHub
        </a>
        .
      </p>

      <h2>Get in touch</h2>
      <p>
        Have a question, a bug report, or an idea for a tool you'd like to see? We'd love to hear from you — visit the{" "}
        <Link to="/contact">Contact page</Link>. You can also read how we handle data on our{" "}
        <Link to="/privacy">Privacy page</Link>.
      </p>
    </article>
  );
}
