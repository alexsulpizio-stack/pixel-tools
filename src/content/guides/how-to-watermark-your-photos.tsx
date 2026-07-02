import { Link } from "react-router-dom";

export default function WatermarkGuide() {
  return (
    <>
      <h1>How to Watermark Your Photos (Without Ruining Them)</h1>
      <p>
        A watermark deters casual theft and reminds people where an image came from. Done badly, it's an
        ugly stamp that wrecks your own work. Here's how to add one that protects the image while keeping
        it presentable.
      </p>

      <h2>Text or logo?</h2>
      <p>
        A <strong>text watermark</strong> — your name, website, or a copyright line — is the simplest and
        most common. It's readable, scalable, and works on any photo. A logo watermark looks polished but
        needs a transparent PNG and an editor to place it. For most people, clean text is plenty; our{" "}
        <Link to="/watermark-image">watermark tool</Link> adds it in seconds.
      </p>

      <h2>Placement</h2>
      <ul>
        <li><strong>Corners</strong> are unobtrusive and keep the subject clear — the bottom-right is the classic choice.</li>
        <li><strong>Across the center</strong> is harder to crop out but covers the image, so use low opacity.</li>
        <li><strong>Tiled</strong> (repeated across the whole photo) is the most theft-resistant, since there's no clean area to crop or clone away.</li>
      </ul>

      <h2>Opacity and size</h2>
      <p>
        The goal is <em>present but not distracting</em>. Aim for around <strong>40–60% opacity</strong>{" "}
        so the watermark reads without dominating. Keep the text modest — a mark that's a small fraction
        of the image width looks professional; one that spans the whole photo looks amateurish (unless
        you're deliberately tiling at low opacity).
      </p>

      <h2>Protecting against removal</h2>
      <p>
        Any single-spot watermark can be cropped or cloned out by a determined editor. To make removal
        genuinely painful:
      </p>
      <ul>
        <li><strong>Tile it</strong> so it overlaps the subject in multiple places.</li>
        <li><strong>Use partial transparency</strong> so it blends into detail rather than sitting on a flat area.</li>
        <li><strong>Upload smaller images</strong> — there's less to work with, and less value in stealing.</li>
      </ul>

      <h2>Before you post</h2>
      <p>
        Watermarking is about sharing publicly, so finish the job: <Link to="/resize-image">resize</Link>{" "}
        to a sensible dimension, <Link to="/">compress</Link> for fast loading, and{" "}
        <Link to="/remove-exif">remove EXIF data</Link> so the file doesn't quietly reveal where you took
        the photo.
      </p>
    </>
  );
}
