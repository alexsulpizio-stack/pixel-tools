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
];

export const ROUTE_META: Record<string, RouteMeta> = Object.fromEntries(
  STATIC_ROUTE_META.map((m) => [m.path, m])
);
