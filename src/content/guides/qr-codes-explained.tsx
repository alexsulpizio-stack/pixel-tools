import { Link } from "react-router-dom";

export default function QrCodesExplained() {
  return (
    <>
      <h1>QR Codes Explained: Error Correction, Sizes & Best Practices</h1>
      <p>
        QR codes look simple, but a few details decide whether yours scans reliably or frustrates
        everyone who points a camera at it. Here's what's actually happening inside the square, and how
        to make one that works on a business card, a poster, or a packaging label.
      </p>

      <h2>Static vs. dynamic — and why codes "expire"</h2>
      <p>
        A <strong>static</strong> QR code encodes your data directly in the pattern. If it holds a URL,
        that URL is literally drawn into the squares; it will work forever and can never be turned off
        by anyone. A <strong>dynamic</strong> QR code instead encodes a short redirect link owned by a
        third-party service, which then forwards to your real destination. Dynamic codes let you edit
        the destination and track scans — but if that service shuts down, changes its pricing, or you
        stop paying, every code you printed stops working. This is why people complain that "QR codes
        expire": it's the redirect service expiring, not the code.
      </p>
      <p>
        For anything you print and can't easily reissue, prefer a static code. The{" "}
        <Link to="/qr-code-generator">PixelTools QR generator</Link> produces static codes with no
        account, no shortener, and no tracking — so they never expire.
      </p>

      <h2>Error correction (L, M, Q, H)</h2>
      <p>
        QR codes include redundant data so they still scan when partially damaged or dirty. You choose
        how much:
      </p>
      <ul>
        <li><strong>L — 7%</strong> recovery. Maximum data capacity; use for clean digital displays.</li>
        <li><strong>M — 15%</strong> recovery. The sensible default for most uses.</li>
        <li><strong>Q — 25%</strong> recovery. Good for print that may get scuffed.</li>
        <li><strong>H — 30%</strong> recovery. Use when placing a logo over the center, or for small/outdoor labels.</li>
      </ul>
      <p>
        Higher correction means a denser code for the same data, so don't default to H unnecessarily —
        it makes the pattern harder to scan when small. The trade-off is real: more resilience, less
        capacity.
      </p>

      <h2>Sizing for print</h2>
      <p>
        The rule of thumb is a <strong>10:1 distance-to-size ratio</strong>: a code meant to be scanned
        from 1&nbsp;meter away should be at least 10&nbsp;cm across. For a business card scanned at
        ~30&nbsp;cm, about 2&nbsp;cm (roughly 0.8&nbsp;inch) is the practical minimum. Always include a
        "quiet zone" — clear margin — of at least four module widths around the code, or scanners may
        fail to detect its boundaries.
      </p>

      <h2>PNG or SVG?</h2>
      <p>
        Export <strong>PNG</strong> for digital use — websites, slide decks, documents — where you know
        the display size. Export <strong>SVG</strong> for print: it's vector, so it scales to any size
        without becoming blurry, which matters for posters and packaging. Our generator offers both,
        plus custom foreground and background colors.
      </p>

      <h2>Best practices that prevent failed scans</h2>
      <ul>
        <li><strong>Keep strong contrast.</strong> Dark code on a light background scans best; avoid light-on-dark and low-contrast color pairs.</li>
        <li><strong>Don't over-stylize.</strong> Heavy gradients, rounded "dots," and busy backgrounds reduce reliability.</li>
        <li><strong>Test before you print.</strong> Scan with multiple phones and both the native camera and a dedicated app.</li>
        <li><strong>Add a logo only with high error correction.</strong> Keep it under ~20% of the code area and use level Q or H.</li>
      </ul>
      <p>
        Ready to make one? Open the <Link to="/qr-code-generator">QR code generator</Link> — it's free,
        runs entirely in your browser, and the codes never expire.
      </p>
    </>
  );
}
