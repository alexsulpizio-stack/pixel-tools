export interface RouteMeta {
  path: string;
  title: string;
  description: string;
}

/**
 * Single source of truth for per-route <title>/<meta description>/canonical.
 * Used at runtime by usePageMeta (client navigation) and at build time by
 * scripts/prerender.ts to bake correct head tags into static HTML per route,
 * so search engines see a unique canonical for every page.
 */
export const STATIC_ROUTE_META: RouteMeta[] = [
  {
    path: "/",
    title: "PixelTools — Free Online Image Compressor, Resizer & Converter",
    description:
      "Compress, resize, and convert images (JPG, PNG, WebP) for free — right in your browser. No uploads, no sign-up, 100% private. Batch processing and ZIP download included.",
  },
  {
    path: "/favicon-generator",
    title: "Free Favicon Generator — Create favicon.ico from Image, Text or Emoji | PixelTools",
    description:
      "Generate a complete favicon set (favicon.ico, apple-touch-icon, Android icons) from any image, letter, or emoji. Free, private, in-browser — no uploads.",
  },
  {
    path: "/qr-code-generator",
    title: "Free QR Code Generator — PNG & SVG, No Expiry, No Tracking | PixelTools",
    description:
      "Create QR codes for URLs, Wi-Fi, text and more. Custom colors, high-res PNG and SVG download. Free, no sign-up, no expiry, generated privately in your browser.",
  },
  {
    path: "/color-palette",
    title: "Color Palette Extractor — Get Colors from Any Image | PixelTools",
    description:
      "Extract the dominant color palette from any image. Click to copy hex codes, export as CSS variables or JSON. Free and private — runs in your browser.",
  },
  {
    path: "/image-to-pdf",
    title: "Image to PDF Converter — JPG & PNG to PDF Free | PixelTools",
    description:
      "Convert JPG, PNG, and WebP images to PDF for free. Combine multiple images into one PDF, choose page size and margins. Private — runs entirely in your browser.",
  },
  {
    path: "/privacy",
    title: "Privacy Policy | PixelTools",
    description:
      "PixelTools privacy policy: your files are processed locally in your browser and never uploaded. Details on cookies and advertising.",
  },
  {
    path: "/about",
    title: "About PixelTools — Free, Private, In-Browser Image Tools",
    description:
      "Learn about PixelTools: a collection of free image utilities that run entirely in your browser, so your files are never uploaded. Our mission and how it works.",
  },
  {
    path: "/contact",
    title: "Contact PixelTools — Questions, Feedback & Bug Reports",
    description:
      "Get in touch with PixelTools. Send questions, feedback, feature requests, or bug reports by email or via GitHub.",
  },
  {
    path: "/guides",
    title: "Image & QR Code Guides — Tips, Formats & How-tos | PixelTools",
    description:
      "Practical, no-fluff guides on compressing and converting images, choosing formats, favicon sizes, and QR codes — from the team behind the PixelTools utilities.",
  },
  {
    path: "/tools",
    title: "Free Online Image Tools — Compress, Resize, Crop & More | PixelTools",
    description:
      "A full set of free, private, in-browser image tools: compress, resize, crop, rotate, circle-crop, favicon and QR generators, remove EXIF, image to Base64, and more. No uploads.",
  },
  {
    path: "/resize-image",
    title: "Resize Image Online — Exact Pixels or Percent, Free | PixelTools",
    description:
      "Resize any image to exact width and height in pixels, or by percentage, right in your browser. Lock the aspect ratio, keep quality, and download instantly. No uploads.",
  },
  {
    path: "/crop-image",
    title: "Crop Image Online Free — Drag to Crop, No Upload | PixelTools",
    description:
      "Crop photos online for free by dragging a selection box, with handy aspect-ratio presets (1:1, 4:3, 16:9). Runs entirely in your browser — nothing is uploaded.",
  },
  {
    path: "/circle-crop",
    title: "Circle Crop — Make a Round Profile Picture (PNG) | PixelTools",
    description:
      "Crop any image into a perfect circle with a transparent background — ideal for profile pictures and avatars. Free, private, and downloads as a PNG. No uploads.",
  },
  {
    path: "/rotate-image",
    title: "Rotate & Flip Image Online Free — Fix Sideways Photos | PixelTools",
    description:
      "Rotate images 90°, 180°, or 270° and flip them horizontally or vertically. Fix sideways or mirrored photos in your browser for free. Nothing is uploaded.",
  },
  {
    path: "/remove-exif",
    title: "Remove EXIF & Metadata from Photos — Free & Private | PixelTools",
    description:
      "Strip EXIF metadata — including GPS location, camera model, and timestamps — from your photos. Runs entirely in your browser, so images are never uploaded.",
  },
  {
    path: "/image-to-base64",
    title: "Image to Base64 & Base64 to Image — Free Encoder | PixelTools",
    description:
      "Convert an image to a Base64 data URI for CSS or HTML, or decode a Base64 string back into an image. Fast, free, and private — everything runs in your browser.",
  },
  {
    path: "/heic-to-jpg",
    title: "HEIC to JPG Converter — Free, Private, No Upload | PixelTools",
    description:
      "Convert iPhone HEIC photos to JPG or PNG right in your browser. Batch convert, keep full quality, and download — nothing is uploaded, so your photos stay private.",
  },
  {
    path: "/image-converter",
    title: "Free Image Converter — JPG, PNG & WebP, No Upload | PixelTools",
    description:
      "Convert images between JPG, PNG, and WebP in batches, directly in your browser. Adjust quality, keep transparency, and download a ZIP. No uploads, no sign-up.",
  },
  {
    path: "/watermark-image",
    title: "Add a Watermark to Photos Online Free — No Upload | PixelTools",
    description:
      "Add a text watermark to your images with control over position, size, color, and opacity. Batch-friendly and fully private — everything runs in your browser.",
  },
  {
    path: "/blur-image",
    title: "Blur or Pixelate Part of an Image — Free & Private | PixelTools",
    description:
      "Blur or pixelate faces, license plates, or sensitive text in a photo by dragging a box over the area. Runs entirely in your browser, so images are never uploaded.",
  },
];

export const ROUTE_META: Record<string, RouteMeta> = Object.fromEntries(
  STATIC_ROUTE_META.map((m) => [m.path, m])
);
