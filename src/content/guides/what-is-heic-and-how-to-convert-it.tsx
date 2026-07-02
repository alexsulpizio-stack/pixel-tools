import { Link } from "react-router-dom";

export default function WhatIsHeicGuide() {
  return (
    <>
      <h1>What Is HEIC and How to Convert It to JPG</h1>
      <p>
        You emailed some iPhone photos, and the person on the other end can't open them. The culprit is
        almost always <strong>HEIC</strong> — the format Apple uses by default. Here's what it is, why it
        causes trouble, and how to convert it safely.
      </p>

      <h2>What HEIC actually is</h2>
      <p>
        <strong>HEIC</strong> (High Efficiency Image Container) is Apple's name for images stored using
        the <strong>HEIF</strong> format with HEVC compression. Since iOS 11, iPhones and iPads save
        photos as HEIC because it packs the same visual quality into roughly <strong>half the file
        size</strong> of a JPEG. That's great for your phone's storage — less great for sharing.
      </p>

      <h2>Why HEIC won't open everywhere</h2>
      <p>
        HEIC is newer and patent-encumbered, so support is patchy outside Apple's ecosystem:
      </p>
      <ul>
        <li><strong>Windows</strong> needs an extra codec from the Microsoft Store to preview HEIC.</li>
        <li><strong>Many websites and apps</strong> reject HEIC uploads outright.</li>
        <li><strong>Older software</strong> and some Android devices can't read it at all.</li>
      </ul>
      <p>
        JPG, by contrast, opens literally everywhere — which is why converting is usually the fastest fix.
      </p>

      <h2>HEIC vs JPG: the trade-off</h2>
      <ul>
        <li><strong>Size:</strong> HEIC is smaller for the same quality.</li>
        <li><strong>Compatibility:</strong> JPG wins decisively.</li>
        <li><strong>Quality:</strong> Converting HEIC → JPG is visually lossless at high quality; converting to PNG is fully lossless but larger.</li>
      </ul>

      <h2>How to convert HEIC privately</h2>
      <p>
        Because these are personal photos, avoid random sites that upload your images to a server. Our{" "}
        <Link to="/heic-to-jpg">HEIC to JPG converter</Link> decodes the file directly in your browser
        using WebAssembly, so the photo <strong>never leaves your device</strong>. Drop in one or many
        HEIC files, pick JPG or PNG, and download.
      </p>
      <p>
        After converting, you can <Link to="/">compress</Link> or <Link to="/resize-image">resize</Link>{" "}
        the JPGs for email or the web, and <Link to="/remove-exif">strip their EXIF data</Link> to remove
        the location the photo was taken. To turn off HEIC on your iPhone entirely, go to{" "}
        <em>Settings → Camera → Formats</em> and choose <em>Most Compatible</em>.
      </p>
    </>
  );
}
