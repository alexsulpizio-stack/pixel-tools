/**
 * Curated internal-linking map. Each key is a route path (tool paths, or a
 * guide path like "/guides/<slug>"); the value lists closely related tools and
 * guides. Rendered by <RelatedLinks> in the shared layout so every content page
 * links out to relevant siblings — good for crawl depth, and for visitors.
 *
 * Keep links relevant, not exhaustive: a few strong, on-topic links beat many
 * weak ones.
 */
export interface Relation {
  tools: string[];
  guides: string[];
}

const g = (slug: string) => `/guides/${slug}`;

export const RELATED: Record<string, Relation> = {
  // ---- Tools ----
  "/": {
    tools: ["/resize-image", "/image-converter", "/image-to-pdf", "/remove-exif"],
    guides: [
      g("how-to-compress-images-without-losing-quality"),
      g("reduce-image-file-size-for-email-and-web"),
      g("jpeg-vs-png-vs-webp"),
    ],
  },
  "/heic-to-jpg": {
    tools: ["/image-converter", "/", "/resize-image"],
    guides: [g("what-is-heic-and-how-to-convert-it"), g("jpeg-vs-png-vs-webp")],
  },
  "/image-converter": {
    tools: ["/", "/heic-to-jpg", "/resize-image"],
    guides: [g("jpeg-vs-png-vs-webp"), g("convert-png-to-webp"), g("how-to-compress-images-without-losing-quality")],
  },
  "/resize-image": {
    tools: ["/", "/crop-image", "/image-converter"],
    guides: [g("resize-image-to-exact-dimensions"), g("reduce-image-file-size-for-email-and-web")],
  },
  "/crop-image": {
    tools: ["/circle-crop", "/resize-image", "/rotate-image"],
    guides: [g("crop-photo-into-a-circle"), g("resize-image-to-exact-dimensions")],
  },
  "/circle-crop": {
    tools: ["/crop-image", "/favicon-generator", "/resize-image"],
    guides: [g("crop-photo-into-a-circle"), g("favicon-sizes-guide")],
  },
  "/rotate-image": {
    tools: ["/crop-image", "/resize-image", "/"],
    guides: [g("resize-image-to-exact-dimensions"), g("how-to-compress-images-without-losing-quality")],
  },
  "/remove-exif": {
    tools: ["/blur-image", "/watermark-image", "/"],
    guides: [g("remove-exif-location-data-from-photos"), g("how-to-blur-part-of-an-image")],
  },
  "/watermark-image": {
    tools: ["/remove-exif", "/blur-image", "/"],
    guides: [g("how-to-watermark-your-photos"), g("remove-exif-location-data-from-photos")],
  },
  "/blur-image": {
    tools: ["/remove-exif", "/watermark-image", "/crop-image"],
    guides: [g("how-to-blur-part-of-an-image"), g("remove-exif-location-data-from-photos")],
  },
  "/favicon-generator": {
    tools: ["/circle-crop", "/image-converter", "/qr-code-generator"],
    guides: [g("favicon-sizes-guide"), g("jpeg-vs-png-vs-webp")],
  },
  "/qr-code-generator": {
    tools: ["/favicon-generator", "/image-to-pdf", "/"],
    guides: [g("qr-codes-explained")],
  },
  "/color-palette": {
    tools: ["/image-converter", "/", "/favicon-generator"],
    guides: [g("jpeg-vs-png-vs-webp")],
  },
  "/image-to-pdf": {
    tools: ["/", "/image-converter", "/resize-image"],
    guides: [g("reduce-image-file-size-for-email-and-web"), g("how-to-compress-images-without-losing-quality")],
  },
  "/image-to-base64": {
    tools: ["/image-converter", "/", "/resize-image"],
    guides: [g("data-uri-base64-images-explained"), g("jpeg-vs-png-vs-webp")],
  },

  // ---- Guides ----
  [g("how-to-compress-images-without-losing-quality")]: {
    tools: ["/", "/image-converter", "/resize-image"],
    guides: [g("jpeg-vs-png-vs-webp"), g("reduce-image-file-size-for-email-and-web"), g("convert-png-to-webp")],
  },
  [g("jpeg-vs-png-vs-webp")]: {
    tools: ["/image-converter", "/", "/heic-to-jpg"],
    guides: [g("convert-png-to-webp"), g("how-to-compress-images-without-losing-quality"), g("what-is-heic-and-how-to-convert-it")],
  },
  [g("favicon-sizes-guide")]: {
    tools: ["/favicon-generator", "/circle-crop", "/image-converter"],
    guides: [g("crop-photo-into-a-circle"), g("jpeg-vs-png-vs-webp")],
  },
  [g("reduce-image-file-size-for-email-and-web")]: {
    tools: ["/", "/resize-image", "/image-to-pdf"],
    guides: [g("how-to-compress-images-without-losing-quality"), g("resize-image-to-exact-dimensions")],
  },
  [g("qr-codes-explained")]: {
    tools: ["/qr-code-generator", "/favicon-generator", "/image-to-pdf"],
    guides: [g("favicon-sizes-guide")],
  },
  [g("resize-image-to-exact-dimensions")]: {
    tools: ["/resize-image", "/crop-image", "/"],
    guides: [g("reduce-image-file-size-for-email-and-web"), g("how-to-compress-images-without-losing-quality")],
  },
  [g("crop-photo-into-a-circle")]: {
    tools: ["/circle-crop", "/crop-image", "/favicon-generator"],
    guides: [g("favicon-sizes-guide"), g("resize-image-to-exact-dimensions")],
  },
  [g("remove-exif-location-data-from-photos")]: {
    tools: ["/remove-exif", "/blur-image", "/watermark-image"],
    guides: [g("how-to-blur-part-of-an-image"), g("how-to-watermark-your-photos")],
  },
  [g("data-uri-base64-images-explained")]: {
    tools: ["/image-to-base64", "/image-converter", "/"],
    guides: [g("jpeg-vs-png-vs-webp"), g("how-to-compress-images-without-losing-quality")],
  },
  [g("what-is-heic-and-how-to-convert-it")]: {
    tools: ["/heic-to-jpg", "/image-converter", "/"],
    guides: [g("jpeg-vs-png-vs-webp"), g("convert-png-to-webp")],
  },
  [g("how-to-watermark-your-photos")]: {
    tools: ["/watermark-image", "/remove-exif", "/blur-image"],
    guides: [g("remove-exif-location-data-from-photos"), g("how-to-blur-part-of-an-image")],
  },
  [g("how-to-blur-part-of-an-image")]: {
    tools: ["/blur-image", "/remove-exif", "/watermark-image"],
    guides: [g("remove-exif-location-data-from-photos"), g("how-to-watermark-your-photos")],
  },
  [g("convert-png-to-webp")]: {
    tools: ["/image-converter", "/", "/heic-to-jpg"],
    guides: [g("jpeg-vs-png-vs-webp"), g("how-to-compress-images-without-losing-quality")],
  },
};

/** Fallback for the templated compress-to-size landing pages. */
export const TARGET_RELATED: Relation = {
  tools: ["/", "/resize-image", "/image-converter", "/image-to-pdf"],
  guides: [
    g("how-to-compress-images-without-losing-quality"),
    g("reduce-image-file-size-for-email-and-web"),
    g("jpeg-vs-png-vs-webp"),
  ],
};
