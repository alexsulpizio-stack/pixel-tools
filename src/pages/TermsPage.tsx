import { Link } from "react-router-dom";
import { usePageMeta } from "../lib/usePageMeta";
import { ROUTE_META } from "../lib/routeMeta";

export default function TermsPage() {
  usePageMeta(ROUTE_META["/terms"].title, ROUTE_META["/terms"].description);

  return (
    <article className="prose">
      <h1>Terms of Use</h1>
      <p>Last updated: September 9, 2026</p>

      <p>
        These Terms of Use govern your use of PixelTools and the free browser-based tools available at
        usepixeltools.com. By using the site, you agree to these terms. If you do not agree, please do not use the
        site.
      </p>

      <h2>Use of PixelTools</h2>
      <p>
        PixelTools provides image and document utilities for personal, educational, and commercial use. You are
        responsible for making sure you have the right to process, modify, convert, or download any content you use
        with the tools and for complying with applicable laws.
      </p>

      <h2>Your files and content</h2>
      <p>
        PixelTools is designed so supported file processing happens locally in your browser. We do not claim ownership
        of the files or content you process with the tools. For more detail about how the site handles data, see our
        <Link to="/privacy"> Privacy Policy</Link>.
      </p>

      <h2>No account required</h2>
      <p>
        You do not need to create an account to use PixelTools. Because there is no account system for the tools, you
        are responsible for keeping your own copies of any original files and downloaded results.
      </p>

      <h2>Service availability</h2>
      <p>
        We aim to keep PixelTools available and reliable, but we do not guarantee uninterrupted access or that every
        tool will work with every browser, device, file, or format. Features may be changed, improved, limited, or
        discontinued over time.
      </p>

      <h2>No warranty</h2>
      <p>
        PixelTools is provided on an "as is" and "as available" basis. To the fullest extent permitted by law, we make
        no warranties, express or implied, about the accuracy, reliability, availability, or suitability of the site or
        its output for a particular purpose. You should verify important results before relying on them.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, PixelTools and its operators will not be liable for indirect,
        incidental, special, consequential, or punitive damages, or for loss of data, profits, or business arising from
        use of or inability to use the site. Nothing in these terms limits liability where doing so would be unlawful.
      </p>

      <h2>Third-party services and links</h2>
      <p>
        PixelTools may link to third-party websites or use third-party services for functions such as analytics,
        advertising, hosting, or affiliate links. Those services are governed by their own terms and privacy policies.
        A link does not imply endorsement of every statement, product, or service on the destination site.
      </p>

      <h2>Advertising and affiliate relationships</h2>
      <p>
        PixelTools may display advertising and may include affiliate links. If you follow an affiliate link and make a
        purchase, PixelTools may earn a commission at no extra cost to you. Advertising and affiliate relationships do
        not change your ownership of files processed with the tools.
      </p>

      <h2>Acceptable use</h2>
      <p>
        Do not use PixelTools to violate the law, infringe intellectual property rights, interfere with the site or its
        infrastructure, attempt unauthorized access, distribute malicious code, or abuse the service in a way that
        harms other users or the operation of the site.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        We may update these terms as PixelTools changes. The current version will be published on this page with the
        updated date shown above. Continued use of the site after an update means you accept the revised terms.
      </p>

      <h2>Questions</h2>
      <p>
        Questions about these terms can be raised through our <Link to="/contact">Contact page</Link>. For help using a
        tool, visit <Link to="/support">Help &amp; Support</Link>.
      </p>
    </article>
  );
}
