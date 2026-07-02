import { Link } from "react-router-dom";

export default function RemoveExifGuide() {
  return (
    <>
      <h1>How to Remove Location & EXIF Data From Photos</h1>
      <p>
        Every photo you take carries an invisible passenger: metadata. It's useful for organizing your
        own library, but it can quietly reveal far more than you intend when you share an image online.
        Here's what's hidden in your photos and how to remove it.
      </p>

      <h2>What is EXIF metadata?</h2>
      <p>
        <strong>EXIF</strong> (Exchangeable Image File Format) is a block of data cameras and phones embed
        inside each photo. It commonly includes:
      </p>
      <ul>
        <li><strong>GPS coordinates</strong> — the exact latitude and longitude where the photo was taken.</li>
        <li><strong>Date and time</strong> — down to the second.</li>
        <li><strong>Device details</strong> — camera or phone make and model.</li>
        <li><strong>Camera settings</strong> — lens, aperture, shutter speed, ISO.</li>
      </ul>

      <h2>The real privacy risk</h2>
      <p>
        The GPS field is the dangerous one. A photo taken at home, posted to a forum or marketplace
        listing, can broadcast your home address to anyone who downloads it and opens the file's
        properties. The same applies to photos of children, workplaces, or anywhere you'd rather not
        pin on a map. Many social networks strip metadata on upload — but not all do, and files sent by
        email, chat, or shared directly usually keep it intact.
      </p>

      <h2>How removal works</h2>
      <p>
        The simplest, most reliable way to strip metadata is to <strong>re-encode the image</strong>: the
        pixels are redrawn into a fresh file that contains no EXIF block. The picture looks identical;
        the hidden data is simply gone. Our <Link to="/remove-exif">remove EXIF tool</Link> does exactly
        this, and because it runs in your browser, the sensitive photo is never uploaded to a server in
        the first place — which matters when the whole point is privacy.
      </p>

      <h2>A safe sharing checklist</h2>
      <ul>
        <li><strong>1.</strong> Strip EXIF before posting anywhere you don't fully trust.</li>
        <li><strong>2.</strong> <Link to="/resize-image">Resize</Link> to the dimensions you actually need — smaller images carry less risk and load faster.</li>
        <li><strong>3.</strong> <Link to="/">Compress</Link> for a final size reduction.</li>
      </ul>
      <p>
        Do those three and you're sharing a lean, anonymous image that looks exactly like the original.
      </p>
    </>
  );
}
