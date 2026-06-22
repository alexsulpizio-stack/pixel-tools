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
];

export const GUIDES_BY_SLUG: Record<string, GuideMeta> = Object.fromEntries(
  GUIDES_META.map((g) => [g.slug, g])
);
