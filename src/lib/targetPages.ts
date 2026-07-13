import type { TargetOutput } from "./targetCompress";

export interface TargetSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

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
  /** Substantial, unique written content shown on the page. */
  body: TargetSection[];
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
    body: [
      {
        heading: "Where a 20 KB limit comes from",
        paragraphs: [
          "20 KB is one of the smallest limits you'll run into, and it almost always points to a tiny display size. The image will be shown at avatar or icon dimensions, so the platform enforces a hard cap to keep thousands of these little images from slowing pages down.",
          "You'll typically meet it in places like these:",
        ],
        bullets: [
          "Forum and message-board avatars (phpBB, vBulletin, and older community software).",
          "Profile pictures on legacy accounts and intranet systems.",
          "App store or dashboard icons that must be uploaded under a size cap.",
          "Signature images on old-school email and forum setups.",
        ],
      },
      {
        heading: "How to keep a 20 KB image looking sharp",
        paragraphs: [
          "The single biggest lever at this size is dimensions. A picture displayed at 150–300 px wide simply doesn't need thousands of pixels, and shrinking it there recovers far more space than quality tweaks alone. This tool does that automatically, but you'll get the cleanest result if the source is already cropped tight to its subject.",
          "WebP is the best format for tiny targets because it holds detail at low file sizes better than JPEG — switch to JPEG only if the site you're uploading to rejects anything that isn't a .jpg. Simple, flat images (logos, icons, headshots on plain backgrounds) compress much smaller than busy photos with lots of texture or noise.",
        ],
      },
    ],
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
    body: [
      {
        heading: "Common places you'll see a 50 KB cap",
        paragraphs: [
          "50 KB is a sweet spot for small on-screen images: big enough to look crisp at thumbnail and signature sizes, small enough that a page full of them still loads instantly. That's why it turns up so often on forms and content systems.",
        ],
        bullets: [
          "Email signature logos and headshots.",
          "Blog and article thumbnails or author photos.",
          "Job-application and government portals with a modest photo limit.",
          "Small product or catalogue images on lightweight sites.",
        ],
      },
      {
        heading: "Will a 50 KB image still look good?",
        paragraphs: [
          "For anything shown small to medium on screen, yes. 50 KB in WebP comfortably holds a sharp image around 600–800 px wide — plenty for a signature, thumbnail, or profile photo. What it won't do is survive being blown up to full-screen or sent to print, because there simply isn't enough data for that.",
          "If your result looks soft, it usually means the source was very large or highly detailed. Cropping to just the important part before compressing, or accepting slightly smaller dimensions, will sharpen things up. The live preview shows the exact result before you download, so you can judge it yourself.",
        ],
      },
    ],
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
    body: [
      {
        heading: "Why 100 KB is the web's favourite limit",
        paragraphs: [
          "100 KB sits right at the point where a photo still looks good on screen but stays cheap to store and fast to serve. For a platform handling millions of uploads, that balance keeps both bandwidth bills and page-load times under control — so it has become the default cap across a huge range of sites.",
          "You'll be asked for an image under 100 KB in situations like these:",
        ],
        bullets: [
          "Job application and recruitment portals.",
          "Government and tax e-services.",
          "University and school admission systems.",
          "CMS and website uploads where editors want fast pages.",
        ],
      },
      {
        heading: "Getting the best quality under 100 KB",
        paragraphs: [
          "100 KB is generous enough that most photos come through looking great, especially in WebP. If a site only accepts JPEG, switch the output format — you'll use a little more of your budget on the same image, but it will still fit comfortably in most cases.",
          "For the sharpest result, resize to the dimensions you actually need first (1000–1200 px wide covers almost any web use) rather than compressing a full-resolution phone photo. Smaller starting dimensions mean the compressor can spend its 100 KB budget on quality instead of raw pixel count.",
        ],
      },
    ],
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
    body: [
      {
        heading: "The 200 KB limit and identity documents",
        paragraphs: [
          "A lot of official systems settle on 200 KB because it's enough to keep a face or document clearly legible at the dimensions they require, while still being small enough to store and review at scale. That's why you'll meet it on some of the most sensitive uploads you'll ever do.",
        ],
        bullets: [
          "Passport, visa, and national ID photo uploads.",
          "Exam and competitive-test registration portals.",
          "Bank and KYC (know-your-customer) document submissions.",
          "Marketplace and classifieds listing photos.",
        ],
      },
      {
        heading: "Why doing this in your browser matters here",
        paragraphs: [
          "Most 'free' online compressors upload your file to their servers to process it. For a holiday snap that's no big deal — for a scan of your passport or a photo of your face attached to an ID application, it means handing a copy of a sensitive document to a company you know nothing about.",
          "This tool never uploads anything. The compression runs locally on your device using the browser's Canvas API, so your ID photo stays with you. Keep the required dimensions (commonly 600–1200 px for ID photos) and check the preview to confirm the face and any text remain sharp before you submit.",
        ],
      },
    ],
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
    body: [
      {
        heading: "A high-quality tier for larger photos",
        paragraphs: [
          "500 KB is the comfortable end of the compression scale. There's enough room to keep a full-width, detailed photo looking crisp, which is why it's favoured by platforms that care about how images look rather than squeezing every last kilobyte.",
        ],
        bullets: [
          "Real-estate and property listing photos.",
          "Classifieds and marketplace galleries.",
          "Blog hero images and portfolio shots.",
          "CMS uploads where quality matters more than raw speed.",
        ],
      },
      {
        heading: "How much quality do you actually lose?",
        paragraphs: [
          "Usually none that you can see. 500 KB in WebP holds a sharp 1920 px photo with room to spare, so on any screen the compressed version is essentially indistinguishable from the original. The savings come almost entirely from throwing away data your eyes can't perceive — not from visible degradation.",
          "The only time you'd notice is with heavy cropping afterwards or a large print, where the missing detail finally becomes visible. For web and on-screen use, 500 KB is effectively lossless in practice.",
        ],
      },
    ],
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
    intro: "Email providers, chat apps, and many forums cap uploads around 1 MB or a few MB. One modern phone photo can blow past that on its own. This tool brings any image under 1 MB with virtually no visible quality loss.",
    body: [
      {
        heading: "When 1 MB is the limit",
        paragraphs: [
          "1 MB is a practical ceiling for sending images around rather than displaying them on a busy web page. It keeps attachments and messages quick to send and receive, so it shows up wherever files move between people.",
        ],
        bullets: [
          "Email attachments where you're mindful of the recipient's inbox.",
          "Chat and community apps with per-file upload caps.",
          "Forums and support tickets that limit attachment size.",
          "Shared drives and wikis with per-file quotas.",
        ],
      },
      {
        heading: "Why your phone photo is so much bigger than 1 MB",
        paragraphs: [
          "Modern phone cameras capture 12–50 megapixels and often store extra data like HDR layers and depth maps. A single shot can easily be 3–8 MB. Almost none of that extra weight is visible once the image is viewed on a screen at normal size.",
          "Recompressing to 1 MB keeps what your eyes actually see and discards the rest, so the result looks the same in a message or document while being a fraction of the size. At this generous target you can keep large dimensions (1920–2560 px) and still fit comfortably.",
        ],
      },
    ],
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
    body: [
      {
        heading: "When it has to be a JPEG",
        paragraphs: [
          "Plenty of upload forms don't just check the file size — they check the extension and reject anything that isn't .jpg or .jpeg. Newer formats like WebP compress better, but they're no help if the form refuses them outright. This page always outputs a genuine JPEG under 50 KB so it sails through those checks.",
        ],
        bullets: [
          "Legacy government and institutional portals.",
          "Older content-management and HR systems.",
          "Embedded devices and hardware that only read JPEG.",
          "Forms that explicitly say 'JPG only'.",
        ],
      },
      {
        heading: "Getting a clean JPEG at 50 KB",
        paragraphs: [
          "JPEG is a lossy format, so 50 KB is reached by lowering quality and, if needed, trimming dimensions. For a photo shown small — a thumbnail, signature, or profile image — this is plenty and the result stays sharp. Faces and simple scenes hold up best; images with fine text or heavy detail are the hardest to keep clean at this size.",
          "If your JPEG looks blocky, the source was probably very large. Resizing it closer to its display size before compressing gives the encoder more room to keep quality within the 50 KB budget.",
        ],
      },
    ],
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
    body: [
      {
        heading: "The world's most-requested JPEG size",
        paragraphs: [
          "If a form specifies both a format and a size, 'JPEG, under 100 KB' is far and away the most common combination. It's the default for official systems that need a clearly legible photo but can't afford to store large files across millions of applicants.",
        ],
        bullets: [
          "University and college admission portals.",
          "Tax filing and government e-service uploads.",
          "Recruitment and HR document systems.",
          "Exam and licensing registration forms.",
        ],
      },
      {
        heading: "How this page guarantees a compliant file",
        paragraphs: [
          "The output is always a real .jpg, and the tool works down from high quality until the file fits under 100 KB — first by adjusting compression, then by reducing dimensions if it has to. That means you get the sharpest possible photo that still meets the limit, without trial and error.",
          "100 KB is comfortable for JPEG at typical document dimensions (around 600–1200 px), so ID and passport-style photos stay clear enough to pass a manual check. The preview lets you confirm legibility before you download and submit.",
        ],
      },
    ],
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
    body: [
      {
        heading: "A JPEG limit built for documents",
        paragraphs: [
          "200 KB gives a JPEG enough headroom to keep faces and printed text genuinely sharp, which is why it's the choice of systems that will actually inspect what you upload. It's the standard on many higher-stakes forms.",
        ],
        bullets: [
          "Visa and immigration application portals.",
          "Competitive exam and recruitment registration.",
          "HR onboarding and verification systems.",
          "Insurance and banking document uploads.",
        ],
      },
      {
        heading: "Keeping documents legible and private",
        paragraphs: [
          "At 200 KB a JPEG holds plenty of detail for ID and document photos at their usual required dimensions (600–1200 px), so signatures, small print, and facial features stay clear. Always glance at the preview to confirm nothing important has been softened before you submit.",
          "Because the file is processed on your device and never uploaded, you can compress sensitive scans — passports, certificates, bank statements — without handing them to a third-party server. That privacy is exactly what these document uploads call for.",
        ],
      },
    ],
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
    body: [
      {
        heading: "Why PNG behaves differently",
        paragraphs: [
          "PNG is a lossless format — there's no quality slider to turn down, because it's designed to reproduce every pixel exactly. That's perfect for screenshots, logos, diagrams, and anything with sharp edges or transparency, but it means the only reliable way to shrink a PNG under a hard limit is to reduce its pixel dimensions.",
          "This tool automates that: it scales the image down step by step until it fits under 100 KB, while keeping the transparent background intact. Flat graphics with few colours shrink easily; detailed screenshots with lots of color variation are the hardest to squeeze.",
        ],
      },
      {
        heading: "When to switch this PNG to WebP instead",
        paragraphs: [
          "If you need the file smaller without losing dimensions — or the PNG just won't fit at the size you need — switch the output to WebP. WebP supports transparency just like PNG but compresses dramatically better, often producing a file a fraction of the size at the same dimensions.",
          "Stick with PNG only when the destination specifically requires a .png file. For everything else, WebP will usually give you a smaller, sharper result. JPEG is the one format to avoid here, since it can't store transparency and will flatten it onto a white background.",
        ],
      },
    ],
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
