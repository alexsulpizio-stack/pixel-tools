import type { TargetOutput } from "./targetCompress";

export interface TargetPageConfig {
  slug: string;
  targetKB: number;
  /** Default output format for this page */
  output: TargetOutput;
  /** Accept hint shown in UI, e.g. "JPG, PNG, WebP" */
  title: string;
  description: string;
  h1: string;
  intro: string;
  faq: { q: string; a: string }[];
}

const SHARED_FAQ = (kb: number): { q: string; a: string }[] => [
  {
    q: "Is my image uploaded to a server?",
    a: "No. Compression happens entirely in your browser using the Canvas API — your image never leaves your device, which is also why it's instant.",
  },
  {
    q: `What if my image can't reach ${kb} KB?`,
    a: `The tool first lowers the compression quality, and if that's not enough it gradually reduces the dimensions until the file fits under ${kb} KB. Extremely detailed images may lose visible quality at very small targets — the preview shows you exactly what you'll get.`,
  },
  {
    q: "Is this free? Is there a watermark?",
    a: "Completely free, no watermark, no sign-up, no file limit. The site is supported by ads.",
  },
];

export const TARGET_PAGES: TargetPageConfig[] = [
  {
    slug: "compress-image-to-20kb",
    targetKB: 20,
    output: "webp",
    title: "Compress Image to 20KB Online Free — Exact Size | PixelTools",
    description: "Reduce any image to under 20KB for free, right in your browser. Perfect for avatars, forum profile pictures, and app icons. No upload, no watermark.",
    h1: "Compress image to 20 KB",
    intro: "A 20 KB limit usually means avatars, forum profile pictures, or strict legacy upload forms. At this size, small dimensions matter more than anything — this tool automatically balances quality and dimensions to land under 20 KB with the best possible result.",
    faq: [
      {
        q: "What's the best format for a 20 KB image?",
        a: "WebP gives the best quality at tiny sizes and works in all modern browsers. If the site you're uploading to only accepts JPG, switch the output format to JPEG.",
      },
      ...SHARED_FAQ(20),
    ],
  },
  {
    slug: "compress-image-to-50kb",
    targetKB: 50,
    output: "webp",
    title: "Compress Image to 50KB Online Free — Exact Size | PixelTools",
    description: "Shrink any photo to under 50KB free in your browser. Great for email signatures, web thumbnails, and online application forms. No upload required.",
    h1: "Compress image to 50 KB",
    intro: "50 KB is the classic limit for email signature images, web thumbnails, and many government or job application portals. A photo straight off your phone is often 100× larger — this tool gets it under the limit in one step while keeping it as sharp as possible.",
    faq: [
      {
        q: "Will a 50 KB photo still look good?",
        a: "For on-screen use at small-to-medium sizes, yes — 50 KB is plenty for a sharp thumbnail or signature image. It won't hold print quality or full-screen detail.",
      },
      ...SHARED_FAQ(50),
    ],
  },
  {
    slug: "compress-image-to-100kb",
    targetKB: 100,
    output: "webp",
    title: "Compress Image to 100KB Online Free — Exact Size | PixelTools",
    description: "Compress any image to under 100KB for free — in your browser, no upload. Ideal for job portals, government forms, and website images.",
    h1: "Compress image to 100 KB",
    intro: "Under-100 KB is the most common upload requirement on the web — job application portals, government e-services, school systems, and CMS platforms all use it. This tool hits the limit automatically: drop your image, get a file guaranteed under 100 KB.",
    faq: [
      {
        q: "Why do so many websites require images under 100 KB?",
        a: "It keeps their storage and bandwidth costs predictable and their pages fast. 100 KB is roughly the sweet spot where a photo still looks good on screen but loads quickly on any connection.",
      },
      ...SHARED_FAQ(100),
    ],
  },
  {
    slug: "compress-image-to-200kb",
    targetKB: 200,
    output: "webp",
    title: "Compress Image to 200KB Online Free — Exact Size | PixelTools",
    description: "Reduce any photo to under 200KB free, in your browser. Common requirement for passport, visa, and ID photo uploads. No upload to servers, fully private.",
    h1: "Compress image to 200 KB",
    intro: "200 KB limits show up constantly on passport, visa, and ID photo uploads, exam registrations, and marketplace listings. Because this tool runs entirely in your browser, your identity documents never touch anyone's server — which matters for exactly these use cases.",
    faq: [
      {
        q: "Is this safe for passport and ID photos?",
        a: "Safer than the alternatives: your photo is processed on your own device and never uploaded anywhere. Most 'free' compressor sites send your document photo to their servers — this one can't, by design.",
      },
      ...SHARED_FAQ(200),
    ],
  },
  {
    slug: "compress-image-to-500kb",
    targetKB: 500,
    output: "webp",
    title: "Compress Image to 500KB Online Free — Exact Size | PixelTools",
    description: "Compress photos to under 500KB free in your browser. Fits real-estate listings, classifieds, and CMS upload limits while keeping high quality.",
    h1: "Compress image to 500 KB",
    intro: "At 500 KB you can keep a photo looking essentially perfect on screen — this is the generous tier used by real-estate listings, classifieds sites, and most CMS platforms. Modern phone photos are typically 3–8 MB, so they still need a 90% reduction to fit.",
    faq: [
      {
        q: "How much quality do I lose at 500 KB?",
        a: "Usually none that you can see on screen. 500 KB in WebP comfortably holds a sharp 1920px photo. Only large prints or heavy cropping would reveal the difference.",
      },
      ...SHARED_FAQ(500),
    ],
  },
  {
    slug: "compress-image-to-1mb",
    targetKB: 1024,
    output: "webp",
    title: "Compress Image to 1MB Online Free — Exact Size | PixelTools",
    description: "Shrink any image to under 1MB for free in your browser. Perfect for email attachments, Discord uploads, and forum limits. Private — no upload.",
    h1: "Compress image to 1 MB",
    intro: "Email providers, Discord (without Nitro), and many forums cap uploads around 1 MB or a few MB. One modern phone photo can blow past that on its own. This tool brings any image under 1 MB with virtually no visible quality loss.",
    faq: [
      {
        q: "Why is my phone photo so much bigger than 1 MB?",
        a: "Modern phone cameras shoot 12–50 megapixels and store extra data like depth maps. Most of that is invisible on screen — recompressing to 1 MB keeps what your eyes see and drops the rest.",
      },
      ...SHARED_FAQ(1024),
    ],
  },
  {
    slug: "compress-jpeg-to-50kb",
    targetKB: 50,
    output: "jpeg",
    title: "Compress JPEG to 50KB Online Free — Exact Size | PixelTools",
    description: "Compress JPG/JPEG photos to under 50KB free, in your browser. Output stays JPEG for maximum compatibility. No upload, no watermark.",
    h1: "Compress JPEG to 50 KB",
    intro: "Need a JPG under 50 KB specifically — not WebP, not PNG? This page keeps the output in JPEG format for systems that only accept .jpg files: older portals, embedded systems, and strict government forms.",
    faq: [
      {
        q: "Why keep JPEG instead of converting to WebP?",
        a: "WebP compresses better, but plenty of upload forms validate the file extension and reject anything that isn't .jpg/.jpeg. This page guarantees a genuine JPEG file under your size limit.",
      },
      ...SHARED_FAQ(50),
    ],
  },
  {
    slug: "compress-jpeg-to-100kb",
    targetKB: 100,
    output: "jpeg",
    title: "Compress JPEG to 100KB Online Free — Exact Size | PixelTools",
    description: "Reduce JPG/JPEG file size to under 100KB free in your browser. Stays in JPEG format for picky upload forms. Private — never uploaded.",
    h1: "Compress JPEG to 100 KB",
    intro: "The under-100 KB JPEG is the standard ask of application portals worldwide — from university admissions to tax filings. This tool outputs a true .jpg file under 100 KB, sized and compressed automatically for the best quality that fits.",
    faq: [
      {
        q: "My form says 'JPEG only, max 100 KB'. Will this work?",
        a: "Yes — that exact requirement is what this page is built for. The output is a standard JPEG under 100 KB that any upload form will accept.",
      },
      ...SHARED_FAQ(100),
    ],
  },
  {
    slug: "compress-jpeg-to-200kb",
    targetKB: 200,
    output: "jpeg",
    title: "Compress JPEG to 200KB Online Free — Exact Size | PixelTools",
    description: "Compress JPG photos to under 200KB free — in your browser, output stays JPEG. Common for visa applications and document uploads. Fully private.",
    h1: "Compress JPEG to 200 KB",
    intro: "Visa applications, exam registrations, and HR systems often want a JPEG under 200 KB. Since everything here runs on your own device, your documents and photos stay private while you get a compliant .jpg file.",
    faq: [
      {
        q: "Does the photo stay sharp enough for document checks?",
        a: "Yes — 200 KB holds plenty of detail for ID and document photos at typical required dimensions (600–1200px). The preview lets you confirm legibility before downloading.",
      },
      ...SHARED_FAQ(200),
    ],
  },
  {
    slug: "compress-png-to-100kb",
    targetKB: 100,
    output: "png",
    title: "Compress PNG to 100KB Online Free — Keep PNG Format | PixelTools",
    description: "Reduce PNG file size to under 100KB free in your browser. Keeps PNG format and transparency, or convert to WebP for smaller files. No upload.",
    h1: "Compress PNG to 100 KB",
    intro: "PNGs are lossless, so hitting a size limit works differently: this tool scales your PNG down until it fits under 100 KB while preserving transparency. Need it even smaller with no dimension loss? Switch the output to WebP — it keeps transparency too and compresses far better.",
    faq: [
      {
        q: "Will my PNG keep its transparency?",
        a: "Yes — both PNG and WebP output preserve transparent backgrounds. Only JPEG flattens transparency onto white.",
      },
      {
        q: "Why does PNG compression reduce dimensions instead of quality?",
        a: "PNG is a lossless format — there's no quality dial to turn. The reliable way to shrink a PNG below a hard limit is reducing its pixel dimensions, which is what this tool automates.",
      },
      ...SHARED_FAQ(100),
    ],
  },
];

export function formatTargetLabel(kb: number): string {
  return kb >= 1024 ? `${Math.round(kb / 1024)} MB` : `${kb} KB`;
}
