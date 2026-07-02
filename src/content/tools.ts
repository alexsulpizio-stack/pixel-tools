export interface ToolMeta {
  path: string;
  name: string;
  blurb: string;
  emoji: string;
}

/** All tools, used by the /tools hub and cross-links. */
export const TOOLS_META: ToolMeta[] = [
  { path: "/", name: "Image Compressor", blurb: "Compress, resize & convert JPG, PNG, WebP in batches.", emoji: "🗜️" },
  { path: "/resize-image", name: "Resize Image", blurb: "Resize to exact pixels or by percentage, ratio locked.", emoji: "📐" },
  { path: "/crop-image", name: "Crop Image", blurb: "Drag to crop, with 1:1, 4:3 and 16:9 presets.", emoji: "✂️" },
  { path: "/circle-crop", name: "Circle Crop", blurb: "Round profile pictures with a transparent background.", emoji: "⭕" },
  { path: "/rotate-image", name: "Rotate & Flip", blurb: "Fix sideways or mirrored photos in one click.", emoji: "🔄" },
  { path: "/remove-exif", name: "Remove EXIF Data", blurb: "Strip GPS location & metadata before you share.", emoji: "🛡️" },
  { path: "/favicon-generator", name: "Favicon Generator", blurb: "Full favicon set from an image, letter, or emoji.", emoji: "⭐" },
  { path: "/qr-code-generator", name: "QR Code Generator", blurb: "PNG & SVG codes that never expire, no tracking.", emoji: "🔳" },
  { path: "/color-palette", name: "Color Palette Extractor", blurb: "Pull dominant colors from any image as hex/CSS.", emoji: "🎨" },
  { path: "/image-to-pdf", name: "Image to PDF", blurb: "Combine images into a single multi-page PDF.", emoji: "📄" },
  { path: "/image-to-base64", name: "Image ⇄ Base64", blurb: "Encode images to data URIs, or decode them back.", emoji: "🔤" },
];
