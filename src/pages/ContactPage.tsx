import { Link } from "react-router-dom";
import { usePageMeta } from "../lib/usePageMeta";
import { ROUTE_META } from "../lib/routeMeta";

export default function ContactPage() {
  usePageMeta(ROUTE_META["/contact"].title, ROUTE_META["/contact"].description);

  return (
    <article className="prose">
      <h1>Contact PixelTools</h1>

      <p>
        GitHub Issues is the official public contact channel for PixelTools. Use it for support questions, bug reports,
        feature requests, feedback, or general questions about the site.
      </p>

      <p>
        <a
          href="https://github.com/alexsulpizio-stack/pixel-tools/issues/new"
          target="_blank"
          rel="noreferrer"
          className="btn btn--primary"
        >
          Contact PixelTools on GitHub
        </a>
      </p>

      <h2>What to include</h2>
      <p>
        For a technical problem, include the PixelTools tool you were using, your browser and device, what you expected
        to happen, what actually happened, and the steps that reproduce the problem. For a feature request or general
        question, just describe what you need as clearly as you can.
      </p>

      <h2>Please protect your privacy</h2>
      <p>
        GitHub Issues are public. Do not post private photos, personal documents, passwords, account information, or
        other sensitive material. PixelTools processes images locally in your browser, so we normally do not need a
        copy of your original file to investigate a problem. See our <Link to="/privacy">Privacy Policy</Link> for more
        information.
      </p>

      <h2>Need help using a tool?</h2>
      <p>
        Start with the <Link to="/support">Help &amp; Support page</Link> for common troubleshooting. You can also browse
        <Link to="/tools"> all PixelTools tools</Link> or learn more about the project on the <Link to="/about">About page</Link>.
      </p>
    </article>
  );
}
