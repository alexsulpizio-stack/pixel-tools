import { Link } from "react-router-dom";

export default function HowToCompressWithoutLosingQuality() {
  return (
    <>
      <h1>How to Compress Images Without Losing Quality</h1>
      <p>
        "Compress without losing quality" is one of the most searched image questions on the web, and
        the honest answer has some nuance: most compression <em>does</em> discard data, but with the
        right format and settings you can cut a file by 60–80% with no difference the human eye can
        detect. This guide explains exactly how to do that, and why it works.
      </p>

      <h2>Lossy vs. lossless compression</h2>
      <p>
        There are two families of compression. <strong>Lossless</strong> (used by PNG and the lossless
        mode of WebP) rebuilds the original pixels perfectly — nothing is thrown away, so the savings
        are modest, usually 10–40% on photos. <strong>Lossy</strong> (JPEG and standard WebP) removes
        detail the eye is least sensitive to: subtle color shifts and high-frequency noise. Because
        human vision is far more sensitive to brightness than to fine color variation, a well-tuned
        lossy encoder can remove most of a file's bytes while looking identical.
      </p>
      <p>
        The practical takeaway: "without losing quality" really means "without <em>visible</em> quality
        loss." For photographs, lossy compression at a high quality setting is almost always the right
        choice. For text, line art, logos, and screenshots with sharp edges, lossless is safer because
        lossy compression creates visible "ringing" artifacts around hard edges.
      </p>

      <h2>The single most important setting: quality</h2>
      <p>
        Lossy formats expose a quality slider, usually from 0 to 100 (or 0 to 1). The relationship
        between quality and file size is not linear. The sweet spot for photos is roughly
        <strong> 75–85</strong>:
      </p>
      <ul>
        <li><strong>90–100:</strong> near-perfect, but files are large and the gains over 85 are tiny.</li>
        <li><strong>75–85:</strong> the ideal range — big size savings, no visible artifacts on photos.</li>
        <li><strong>60–75:</strong> still acceptable for thumbnails and background images.</li>
        <li><strong>Below 60:</strong> blocking and color banding start to show, especially in skies and gradients.</li>
      </ul>
      <p>
        Our <Link to="/">image compressor</Link> defaults to WebP at quality 0.8 (80) for exactly this
        reason. You can preview the result instantly and nudge the slider until you find the smallest
        size that still looks perfect to you.
      </p>

      <h2>Resize before you compress</h2>
      <p>
        The biggest hidden source of bloat is dimensions. A modern phone camera produces images around
        4000&nbsp;×&nbsp;3000 pixels (12&nbsp;megapixels), but a full-width web image rarely needs to be
        more than 1600–2000&nbsp;pixels wide, and a blog thumbnail needs maybe 600. Displaying a
        4000px image in a 800px slot wastes roughly 75% of the file. Always scale an image to the
        largest size it will actually be shown at, then compress. Resizing first often saves more than
        the compression itself.
      </p>

      <h2>Pick the right format</h2>
      <p>
        Format choice has a huge effect on the quality-to-size ratio. As a rule of thumb: use WebP for
        the best overall compression, JPEG for maximum compatibility, and PNG only when you need
        lossless quality or transparency. We cover the trade-offs in detail in{" "}
        <Link to="/guides/jpeg-vs-png-vs-webp">JPEG vs PNG vs WebP</Link>.
      </p>

      <h2>Step by step</h2>
      <ul>
        <li><strong>1.</strong> Decide the maximum size the image will be displayed at and resize to it.</li>
        <li><strong>2.</strong> Choose WebP (or JPEG for email and older software).</li>
        <li><strong>3.</strong> Set quality to about 80 and preview the result.</li>
        <li><strong>4.</strong> Lower the quality until you <em>just</em> start to see a difference, then step back up one notch.</li>
        <li><strong>5.</strong> Compare the before/after file size and download.</li>
      </ul>
      <p>
        You can do all of this for free and entirely in your browser — nothing is uploaded — with the{" "}
        <Link to="/">PixelTools compressor</Link>. If you need to hit a specific limit such as an
        upload cap, use a target-size tool like{" "}
        <Link to="/compress-image-to-100kb">compress image to 100KB</Link>, which automatically finds
        the highest quality that fits under your number.
      </p>

      <h2>Common mistakes</h2>
      <ul>
        <li><strong>Re-compressing a JPEG repeatedly.</strong> Each lossy save degrades the image further. Always compress from the original, not from a previously compressed copy.</li>
        <li><strong>Using PNG for photos.</strong> PNG is lossless, so photos stay huge. Reserve PNG for graphics with flat colors or transparency.</li>
        <li><strong>Skipping the resize step.</strong> Compression can't fix an image that's simply far larger in dimensions than it needs to be.</li>
      </ul>
    </>
  );
}
