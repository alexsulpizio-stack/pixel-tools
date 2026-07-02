export interface GuideMeta {
  slug: string;
  title: string;
  /** Used for <meta name="description"> and the og tags. */
  description: string;
  /** Short summary shown on the guides index cards. */
  excerpt: string;
  /** ISO date the article was last reviewed. */
  updated: string;
  /** Minutes to read, shown on cards. */
  readingMinutes: number;
}

/**
 * Single source of truth for guide articles. Plain data so it can be imported
 * by both the React app and scripts/prerender.ts (no React at module load).
 * Article bodies live in src/content/guides/<slug>.tsx and are mapped to slugs
 * in src/pages/GuidePage.tsx.
 */
export const GUIDES_META: GuideMeta[] = [
  {
    slug: "how-to-compress-images-without-losing-quality",
    title: "How to Compress Images Without Losing Quality (2026 Guide) | PixelTools",
    description:
      "A practical guide to shrinking image file sizes while keeping them sharp: how lossy and lossless compression work, the right format and quality settings, and step-by-step instructions.",
    excerpt:
      "What 'quality' really means, when lossy compression is invisible to the eye, and the exact settings to shrink photos by 70%+ without a visible difference.",
    updated: "2026-06-21",
    readingMinutes: 7,
  },
  {
    slug: "jpeg-vs-png-vs-webp",
    title: "JPEG vs PNG vs WebP: Which Image Format Should You Use? | PixelTools",
    description:
      "A clear comparison of JPEG, PNG, and WebP — how each compresses, when to use it, transparency and browser support, and a simple decision checklist for the web.",
    excerpt:
      "Photos, logos, screenshots, transparency, animation — a side-by-side breakdown of the three formats that matter, with a quick decision rule for each case.",
    updated: "2026-06-21",
    readingMinutes: 6,
  },
  {
    slug: "favicon-sizes-guide",
    title: "Favicon Sizes in 2026: Every File You Actually Need | PixelTools",
    description:
      "Which favicon sizes and files modern browsers, iOS, Android, and PWAs require in 2026, the HTML to add, and common mistakes that leave a blurry or missing icon.",
    excerpt:
      "favicon.ico, apple-touch-icon, Android and PWA icons — the complete, no-nonsense list of sizes that matter today and the exact <head> markup to install them.",
    updated: "2026-06-21",
    readingMinutes: 6,
  },
  {
    slug: "reduce-image-file-size-for-email-and-web",
    title: "How to Reduce Image File Size for Email and the Web | PixelTools",
    description:
      "Hit attachment limits and faster page loads: target file sizes for email and web, how to resize and compress correctly, and how to reach an exact KB target.",
    excerpt:
      "Why your photos are 8 MB, the real limits for Gmail and Outlook, sensible dimensions for web pages, and how to compress to an exact size like 100 KB.",
    updated: "2026-06-21",
    readingMinutes: 5,
  },
  {
    slug: "qr-codes-explained",
    title: "QR Codes Explained: Error Correction, Sizes & Best Practices | PixelTools",
    description:
      "How QR codes actually work, what error correction levels mean, choosing PNG vs SVG, sizing for print, and the dynamic-vs-static trade-off that can break your code.",
    excerpt:
      "Why some QR codes expire (and yours shouldn't), what L/M/Q/H error correction does, minimum print sizes, and how to add a logo without breaking the scan.",
    updated: "2026-06-21",
    readingMinutes: 6,
  },
  {
    slug: "resize-image-to-exact-dimensions",
    title: "How to Resize an Image to Exact Pixel Dimensions | PixelTools",
    description:
      "Resize images to exact width and height without stretching: how aspect ratio works, when upscaling hurts, and the right dimensions for web, social, and print.",
    excerpt:
      "Why images stretch, how to keep the aspect ratio, when upscaling goes wrong, and a cheat sheet of good dimensions for the web and social platforms.",
    updated: "2026-07-01",
    readingMinutes: 5,
  },
  {
    slug: "crop-photo-into-a-circle",
    title: "How to Crop a Photo Into a Circle for a Profile Picture | PixelTools",
    description:
      "Make a round profile picture with a transparent background: why PNG matters, how to frame a face, and the ideal avatar sizes for common platforms.",
    excerpt:
      "The transparent-background trick that makes circular avatars work everywhere, how to frame the shot, and recommended profile-picture sizes.",
    updated: "2026-07-01",
    readingMinutes: 4,
  },
  {
    slug: "remove-exif-location-data-from-photos",
    title: "How to Remove Location & EXIF Data From Photos | PixelTools",
    description:
      "Photos can reveal where you live via hidden GPS metadata. Learn what EXIF stores, the privacy risk, and how to strip it before sharing — without uploading anything.",
    excerpt:
      "What EXIF metadata quietly records (including your GPS location), why it's a real privacy risk, and how to remove it locally before you post.",
    updated: "2026-07-01",
    readingMinutes: 5,
  },
  {
    slug: "data-uri-base64-images-explained",
    title: "Data URIs Explained: When to Use Base64 Images | PixelTools",
    description:
      "What a Base64 data URI is, how to inline images in HTML and CSS, the ~33% size overhead, and when inlining actually speeds up your site versus slowing it down.",
    excerpt:
      "Inlining images as Base64 can cut requests — or bloat your CSS. Here's how data URIs work and the simple rule for when to use them.",
    updated: "2026-07-01",
    readingMinutes: 5,
  },
  {
    slug: "what-is-heic-and-how-to-convert-it",
    title: "What Is HEIC and How to Convert It to JPG | PixelTools",
    description:
      "Why iPhones save photos as HEIC, why Windows and many apps can't open them, and how to convert HEIC to JPG or PNG privately without uploading your photos.",
    excerpt:
      "The reason your iPhone photos won't open on a PC — what HEIC is, its pros and cons, and the safest way to convert it to JPG.",
    updated: "2026-07-01",
    readingMinutes: 5,
  },
  {
    slug: "how-to-watermark-your-photos",
    title: "How to Watermark Your Photos (Without Ruining Them) | PixelTools",
    description:
      "Watermarks that protect your work without wrecking the image: text vs logo, placement, opacity, and why a tiled watermark is far harder to remove.",
    excerpt:
      "Where to place a watermark, how transparent it should be, and why tiling beats a single corner mark for protecting your images.",
    updated: "2026-07-01",
    readingMinutes: 4,
  },
  {
    slug: "how-to-blur-part-of-an-image",
    title: "How to Blur Out Faces, Plates & Text in a Photo | PixelTools",
    description:
      "Hide sensitive details in a photo before sharing: blur vs pixelate, how strong it needs to be to be irreversible, and how to do it privately in your browser.",
    excerpt:
      "How to properly hide a face, license plate, or private text in an image — and why a light blur isn't always enough.",
    updated: "2026-07-01",
    readingMinutes: 4,
  },
  {
    slug: "convert-png-to-webp",
    title: "How to Convert PNG to WebP (and When You Shouldn't) | PixelTools",
    description:
      "WebP can shrink PNGs by 25–80% with transparency intact. Here's how to convert, the quality trade-offs, browser support, and when to stick with PNG.",
    excerpt:
      "WebP usually beats PNG on size while keeping transparency. When it's worth switching, and the few cases where PNG still wins.",
    updated: "2026-07-01",
    readingMinutes: 5,
  },
];

export const GUIDES_BY_SLUG: Record<string, GuideMeta> = Object.fromEntries(
  GUIDES_META.map((g) => [g.slug, g])
);
