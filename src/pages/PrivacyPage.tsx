import { usePageMeta } from "../lib/usePageMeta";

export default function PrivacyPage() {
  usePageMeta(
    "Privacy Policy | PixelTools",
    "PixelTools privacy policy: your files are processed locally in your browser and never uploaded. Details on cookies and advertising."
  );

  return (
    <article className="prose">
      <h1>Privacy Policy</h1>
      <p>Last updated: June 11, 2026</p>

      <h2>Your files never leave your device</h2>
      <p>
        Every tool on PixelTools (image compression, favicon generation, QR codes, palette extraction, PDF conversion)
        runs entirely in your web browser. The images and data you process are never uploaded to, stored on, or seen by
        our servers — or anyone else's. We could not access your files even if we wanted to, because no file transfer
        takes place.
      </p>

      <h2>What we don't collect</h2>
      <p>
        We do not require accounts, do not collect names or email addresses, and do not store any content you process
        with our tools.
      </p>

      <h2>Advertising and cookies</h2>
      <p>
        PixelTools is free and supported by advertising. We use Google AdSense to display ads. Google and its partners
        may use cookies and similar technologies to serve ads based on your prior visits to this and other websites.
        Google's use of advertising cookies enables it and its partners to serve ads based on your visits to this site
        and/or other sites on the Internet.
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

      <h2>Analytics</h2>
      <p>
        We may use privacy-respecting, aggregate analytics (such as page view counts) to understand which tools are
        useful. This data is not tied to your identity.
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
