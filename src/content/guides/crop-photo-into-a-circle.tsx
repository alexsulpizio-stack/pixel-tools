import { Link } from "react-router-dom";

export default function CircleCropGuide() {
  return (
    <>
      <h1>How to Crop a Photo Into a Circle for a Profile Picture</h1>
      <p>
        Round avatars are everywhere — but most apps only <em>display</em> your photo in a circle while
        the file itself is still a square. When you need a genuinely circular image (for overlays, email
        signatures, slide decks, or apps that don't auto-mask), you need transparency. Here's how it
        works.
      </p>

      <h2>Why the format matters: PNG, not JPEG</h2>
      <p>
        A circle inside a rectangle leaves four corners that must be <strong>transparent</strong> — and
        only formats that support an alpha channel can store transparency. <strong>PNG</strong> can;
        <strong> JPEG cannot</strong>. Save a circular crop as a JPEG and the corners turn solid white or
        black. Always export circular images as PNG, which is exactly what our{" "}
        <Link to="/circle-crop">circle crop tool</Link> does.
      </p>

      <h2>Frame the face first</h2>
      <p>
        A circle crops in from the corners, so anything near the edges of a square gets cut. For a
        headshot:
      </p>
      <ul>
        <li><strong>Center the face</strong> roughly in the middle of the frame.</li>
        <li><strong>Leave breathing room</strong> — don't crop so tight that the top of the head or chin gets clipped by the circle.</li>
        <li><strong>Start square.</strong> If your photo is very wide or tall, <Link to="/crop-image">crop it to a square</Link> around the subject first, then circle-crop.</li>
      </ul>

      <h2>Recommended profile picture sizes</h2>
      <ul>
        <li><strong>Most social platforms:</strong> 400×400px is a safe, sharp minimum.</li>
        <li><strong>High-DPI / retina displays:</strong> 800×800px looks crisper on modern screens.</li>
        <li><strong>Favicons and tiny avatars:</strong> the image will be shown small, so keep detail simple.</li>
      </ul>
      <p>
        Because a circle crop is square, just resize the square to your target before or after cropping
        with the <Link to="/resize-image">resizer</Link>.
      </p>

      <h2>Keep it private</h2>
      <p>
        Profile photos are personal, and many carry hidden location data from your phone. Our circle crop
        runs entirely in your browser, so the image is never uploaded — and you can{" "}
        <Link to="/remove-exif">strip EXIF metadata</Link> too before posting it anywhere.
      </p>
    </>
  );
}
