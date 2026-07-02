import { Link } from "react-router-dom";

export default function DataUriGuide() {
  return (
    <>
      <h1>Data URIs Explained: When to Use Base64 Images</h1>
      <p>
        You've probably seen a giant string like <code>data:image/png;base64,iVBORw0KGgo…</code> in
        someone's CSS and wondered what it was. That's a <strong>data URI</strong> — an image embedded
        directly in text instead of loaded from a file. Here's how it works and when it's actually worth
        using.
      </p>

      <h2>What Base64 and data URIs are</h2>
      <p>
        Computers store images as binary. <strong>Base64</strong> is a way to represent that binary data
        using only plain text characters, so it can be pasted into an HTML or CSS file. A{" "}
        <strong>data URI</strong> wraps that text with a small prefix describing the file type:
      </p>
      <ul>
        <li><code>data:</code> — this is inline data, not a URL.</li>
        <li><code>image/png</code> — the MIME type.</li>
        <li><code>;base64,</code> — how the data is encoded.</li>
        <li>the long string — the image itself, as text.</li>
      </ul>
      <p>
        You can generate one from any image with our <Link to="/image-to-base64">image to Base64 tool</Link>,
        which also gives you ready-to-paste <code>&lt;img&gt;</code> and CSS <code>background-image</code> snippets.
      </p>

      <h2>The upside: fewer requests</h2>
      <p>
        Normally each image is a separate download the browser has to request. Inlining a tiny image as a
        data URI folds it into a file the browser already has, removing that extra round-trip. For small,
        frequently used assets — icons, a 1px gradient, a small logo — this can shave loading time.
      </p>

      <h2>The downside: size and caching</h2>
      <p>
        Base64 text is about <strong>33% larger</strong> than the original binary. Worse, an inlined
        image can't be cached on its own — it's re-downloaded every time the HTML or CSS around it
        changes, and it can't be shared across pages. Inline a large photo and you bloat every page that
        includes that stylesheet.
      </p>

      <h2>The simple rule</h2>
      <ul>
        <li><strong>Inline it</strong> if the image is tiny (a few KB), used site-wide, and rarely changes.</li>
        <li><strong>Keep it a file</strong> for anything larger — especially photos.</li>
      </ul>
      <p>
        For photos, don't reach for Base64 at all: keep them as real image files and{" "}
        <Link to="/">compress</Link> them, choosing the right format with{" "}
        <Link to="/guides/jpeg-vs-png-vs-webp">JPEG vs PNG vs WebP</Link>. Need to go the other way and
        turn a Base64 string back into a file? The same <Link to="/image-to-base64">converter</Link>{" "}
        decodes it for you.
      </p>
    </>
  );
}
