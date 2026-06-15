import { Link } from "react-router-dom";
import { usePageMeta } from "../lib/usePageMeta";

const CONTACT_EMAIL = "alex.sulpizio@gmail.com";

export default function ContactPage() {
  usePageMeta(
    "Contact PixelTools — Questions, Feedback & Bug Reports",
    "Get in touch with PixelTools. Send questions, feedback, feature requests, or bug reports by email or via GitHub."
  );

  return (
    <article className="prose">
      <h1>Contact Us</h1>

      <p>
        We're glad you're here. Whether you've found a bug, have a question about how a tool works, want to suggest a
        new tool, or just want to say hello, we read every message.
      </p>

      <h2>Email</h2>
      <p>
        The best way to reach us is by email:{" "}
        <a href={`mailto:${CONTACT_EMAIL}?subject=PixelTools%20feedback`}>{CONTACT_EMAIL}</a>. We aim to respond within a
        few business days.
      </p>

      <h2>Report a bug or request a feature</h2>
      <p>
        PixelTools is open source. If you're comfortable with GitHub, the fastest way to report a bug or request a
        feature is to open an issue on our{" "}
        <a href="https://github.com/alexsulpizio-stack/pixel-tools/issues" target="_blank" rel="noreferrer">
          GitHub repository
        </a>
        . Otherwise, just email us the details and we'll take it from there.
      </p>

      <h2>A note on your files</h2>
      <p>
        Because every PixelTools utility runs entirely in your browser, we never receive or store the images you
        process — so if something isn't working, we can't see your files on our end. When reporting a problem, it helps
        to tell us which tool you were using, your browser and device, and what you expected to happen. You can learn
        more on our <Link to="/privacy">Privacy page</Link>.
      </p>

      <h2>More about us</h2>
      <p>
        Curious who's behind PixelTools and why it works the way it does? Read more on our{" "}
        <Link to="/about">About page</Link>.
      </p>
    </article>
  );
}
