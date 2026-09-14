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
        Most "free" online image tools work by uploading your files to a remote server, processing them there, and
        sending the result back. That means your personal photos, ID documents, and screenshots pass through — and are
        often stored on — someone else's computer. We think that's unnecessary.
      </p>

      <h2>How we build the tools</h2>
      <p>
        Each utility is designed around a specific job: preparing an image for a form, making a page load faster,
        fixing a format mismatch, or protecting private information before sharing. We keep the controls explicit and
        show the output details that matter for that job, including file size, dimensions, format, ordering, or metadata.
      </p>
      <p>
        The tools use standard browser capabilities such as the Canvas API and local file handling. That design keeps
        the workflow useful without an upload account, while the guides explain when
        a particular format or setting is appropriate and what it cannot do.
      </p>
      <p>
        PixelTools does all of its work locally, inside your browser, using modern web technology (the Canvas API and
        related standards). Your files never leave your device. There are no uploads, no accounts, no watermarks, and
        no file-size limits. This makes the tools both more private and noticeably faster, since there's no waiting on a
        round trip to a server.
      </p>

      <h2>What you can do here</h2>
      <ul>
        <li>
          <Link to="/">Compress, resize &amp; convert images</Link> (JPG, PNG, WebP) with batch processing
        </li>
        <li>
          Compress an image to an <Link to="/compress-image-to-100kb">exact target file size</Link> for upload forms
        </li>
        <li>
          Generate a complete <Link to="/favicon-generator">favicon package</Link> from an image, letter, or emoji
        </li>
        <li>
          Create <Link to="/qr-code-generator">QR codes</Link> that never expire and aren't tracked
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
        PixelTools is an independent project built and maintained by a small independent team. It is funded by unobtrusive
        advertising so that every tool can stay completely free to use. The source code is openly available on{" "}
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
