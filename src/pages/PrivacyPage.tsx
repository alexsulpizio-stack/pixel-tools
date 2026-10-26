import { usePageMeta } from "../lib/usePageMeta";
import { ROUTE_META } from "../lib/routeMeta";

export default function PrivacyPage() {
  usePageMeta(ROUTE_META["/privacy"].title, ROUTE_META["/privacy"].description);

  return (
    <article className="prose">
      <h1>Privacy Policy</h1>
      <p>Last updated: October 26, 2026</p>

      <h2>Your files never leave your device</h2>
      <p>
        Every tool on PixelTools (image compression, favicon generation, QR codes, palette extraction, PDF conversion)
        runs entirely in your web browser. The tools do not upload the files or entered content you process to a processing server.
        This is separate from the website requests and optional analytics or advertising described below.
        If you deliberately attach a file to a public support issue, that file is shared with GitHub and anyone who can view it.
      </p>

      <h2>What we don't collect</h2>
      <p>
        Our tools do not require an account, name, or email address, and do not store processed file contents on our servers.
        Information you choose to share when contacting us through GitHub is handled through that service.
        Do not post private documents or personal information in public issues.
      </p>

      <h2>Advertising and cookies</h2>
      <p>
        PixelTools is free and may use Google AdSense to help support the site. When Google advertising services load,
        Google and its partners may place or read cookies and use web beacons, IP addresses, and other identifiers
        to deliver and measure ads, prevent fraud, and, depending on your choices, personalize advertising.
        Your browser may share information such as the page URL, device/browser information, and IP address with Google.
      </p>
      <p>
        When advertising or optional analytics are enabled, PixelTools asks for your consent before loading those
        services. You can decline these optional services in the consent prompt. Your choice is saved in browser local storage. Essential
        site functionality does not depend on accepting them.
      </p>
      <p>
        You may opt out of personalized advertising by visiting{" "}
        <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer">
          Google Ads Settings
        </a>
        . You can also opt out of third-party vendors' use of cookies for personalized advertising at{" "}
        <a href="https://www.aboutads.info" target="_blank" rel="noreferrer">
          www.aboutads.info
        </a>
        .
      </p>

      <p>
        Read <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noreferrer">
          how Google uses information from sites and apps that use its services
        </a> for details about Google's data use and available controls.
      </p>

      <h2>Affiliate links</h2>
      <p>
        Some guides include links to products or services we recommend. Those links may be affiliate links — if you
        buy through them, we may earn a commission at no extra cost to you. Recommendations are chosen because they
        fit the topic; we do not sell your data to affiliates.
      </p>

      <h2>Analytics</h2>
      <p>
        With your acceptance of optional services, we load Google Analytics to measure page views and tool events,
        such as processing and downloads. Events may include file counts, sizes, formats, and tool settings,
        but not the file contents. Google Analytics can use cookies and browser/device identifiers; this is not
        a claim that all measurement is anonymous. The analytics script is not loaded when you decline the prompt.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        If this policy changes, the new version will be published on this page with an updated date above.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy can be raised via the project's{" "}
        <a href="https://github.com/alexsulpizio-stack/pixel-tools" target="_blank" rel="noreferrer">
          GitHub repository
        </a>
        .
      </p>
    </article>
  );
}
