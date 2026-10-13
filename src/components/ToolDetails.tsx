import { useLocation } from "react-router-dom";

interface ToolDetailsCopy {
  problem: string;
  when: string;
  steps: string[];
  example: string;
  output: string;
  limits: string;
  privacy: string;
}

const DETAILS: Record<string, ToolDetailsCopy> = {
  "/": {
    problem: "Large or poorly formatted images can slow a page, exceed an upload limit, or fill an email inbox.",
    when: "Use this when you need a practical balance between file size, visual quality, dimensions, and format.",
    steps: ["Add one or more images.", "Choose JPEG, PNG, or WebP and adjust quality or maximum dimensions.", "Compare the before and after sizes, then download one file or a ZIP."],
    example: "A 4 MB camera photo for a website can usually become a much smaller WebP while keeping its important detail.",
    output: "The result card shows the original size, new size, savings percentage, preview, and exact download filename.",
    limits: "Canvas processing depends on your device memory. Extremely large photographs may take longer or fail in an older browser.",
    privacy: "The image is decoded and processed in your browser. It is not sent to PixelTools or stored on a server.",
  },
  "/heic-to-jpg": {
    problem: "iPhone HEIC photos can fail to open in older Windows apps, websites, and print workflows.",
    when: "Use JPG for broad compatibility, or PNG when you need lossless output and transparency is relevant.",
    steps: ["Select one or more HEIC files.", "Choose JPG or PNG and review the converted previews.", "Download individual files or the batch ZIP."],
    example: "Convert HEIC photos before attaching them to a form that only accepts JPG files.",
    output: "Each result keeps the image dimensions and receives a matching .jpg or .png filename.",
    limits: "HEIC decoding is memory-intensive for very large photos. The browser must support the required image decoder.",
    privacy: "HEIC decoding and conversion happen locally; the original photos never leave your device.",
  },
  "/image-converter": {
    problem: "A project may require one image format even though your source files use another.",
    when: "Use WebP for modern websites, JPG for compatibility, and PNG when lossless detail or transparency matters.",
    steps: ["Add the source images.", "Select the output format and quality.", "Check the previews, then download the converted files or ZIP."],
    example: "Convert a folder of PNG screenshots to WebP before adding them to a documentation site.",
    output: "The tool preserves dimensions and creates a new file in the selected format; the source file is unchanged.",
    limits: "JPG cannot preserve transparency. Quality settings affect file size and visible detail, especially in photographs.",
    privacy: "Conversion uses the browser Canvas API and does not upload your files.",
  },
  "/resize-image": {
    problem: "Images that are too large for a profile, listing, form, or website need predictable dimensions.",
    when: "Use exact pixels for platform requirements, or percentage resizing when you want a quick proportional change.",
    steps: ["Add an image and choose exact width/height or a percentage.", "Keep the aspect-ratio lock on unless distortion is intentional.", "Preview and download the resized copy."],
    example: "Resize a 4000px photo to 1200px wide for a faster-loading article image.",
    output: "The download uses the selected output format and reports the final pixel dimensions.",
    limits: "Upscaling cannot restore detail that was not present in the original. Unlocking the ratio can stretch faces and logos.",
    privacy: "Resizing runs locally in your browser; no source image is uploaded.",
  },
  "/crop-image": {
    problem: "An image often contains extra background or needs a specific framing for a post, card, or thumbnail.",
    when: "Use the ratio presets when the destination requires 1:1, 4:3, or 16:9; use free crop for a custom frame.",
    steps: ["Add an image.", "Drag the crop box and choose a ratio when needed.", "Review the framing and download the crop."],
    example: "Crop a landscape photo to 16:9 for a video thumbnail without changing the original file.",
    output: "The output contains only the selected region and is downloaded as a new image.",
    limits: "Cropping removes pixels outside the box. Start with the largest source image available for the best result.",
    privacy: "Cropping is performed on-device in the browser.",
  },
  "/circle-crop": {
    problem: "Profile images and avatars often need a circular frame with transparency around the subject.",
    when: "Use this for profile photos, team icons, and stickers that should sit on any background.",
    steps: ["Add an image.", "Position and size the square crop around the subject.", "Download the transparent PNG."],
    example: "Turn a headshot into a round community avatar without adding a white background.",
    output: "The outside of the circle is transparent; the image inside the circle remains visible.",
    limits: "A circle cannot include every corner of a rectangular image. Transparent PNG files are larger than flattened JPGs.",
    privacy: "The source is processed locally and is never uploaded.",
  },
  "/rotate-image": {
    problem: "Phone orientation metadata can leave a photo sideways or mirrored in another app.",
    when: "Use the rotation buttons for 90-degree corrections and flip controls for mirrored scans or camera previews.",
    steps: ["Add an image.", "Choose rotate or flip until the preview is correct.", "Download the corrected copy."],
    example: "Fix a landscape photo that appears vertical after being attached to a document.",
    output: "The downloaded image has the visible orientation rendered into its pixels.",
    limits: "Rotation can change the output dimensions. It does not improve a low-resolution source.",
    privacy: "Orientation changes happen entirely in your browser.",
  },
  "/remove-exif": {
    problem: "Photos can contain hidden GPS coordinates, camera details, timestamps, and editing history.",
    when: "Use this before sharing a photo publicly or sending it to someone who does not need its capture metadata.",
    steps: ["Add the photo.", "Review the metadata summary when available.", "Download the cleaned copy and share that version."],
    example: "Remove a home's location from a listing photo before posting it publicly.",
    output: "The image pixels remain visually similar while common EXIF metadata is removed from the new file.",
    limits: "No tool can guarantee removal of every proprietary metadata block in every format. Check the destination app if privacy is critical.",
    privacy: "The original file is inspected locally and never uploaded.",
  },
  "/watermark-image": {
    problem: "A visible label can identify ownership or discourage casual reuse when an image is shared.",
    when: "Use a subtle watermark for previews, social posts, drafts, or client proofs; keep an unwatermarked master separately.",
    steps: ["Add an image and enter the watermark text.", "Choose position, color, size, and opacity.", "Check readability, then download the marked copy."],
    example: "Add a photographer's name to a proof sheet without covering the main subject.",
    output: "The text is rendered into a new image; the original remains unchanged.",
    limits: "A watermark is a deterrent, not copy protection. Low opacity can be hard to read and high opacity can hide detail.",
    privacy: "Watermarking is done locally in the browser.",
  },
  "/blur-image": {
    problem: "Faces, license plates, addresses, and private screens may need to be hidden before publication.",
    when: "Use strong blur or pixelation for sensitive details and inspect the whole result before sharing.",
    steps: ["Add an image and drag the selection over the sensitive region.", "Resize the box, choose blur or pixelate, and increase strength.", "Download the result; repeat with another pass for multiple regions."],
    example: "Pixelate a license plate in a street photo before posting it to a public forum.",
    output: "Only the selected region is altered; the rest of the image remains unchanged.",
    limits: "A light effect may leave details readable. Use a strong setting and verify the downloaded file, especially for faces and text.",
    privacy: "The image never leaves the browser, which is especially important for the sensitive content this tool is designed to hide.",
  },
  "/favicon-generator": {
    problem: "Browsers and devices request different icon sizes for tabs, bookmarks, and home-screen shortcuts.",
    when: "Use this when launching a site or replacing an incomplete favicon set.",
    steps: ["Choose an image, letter, or emoji source.", "Review the generated sizes and adjust the background if needed.", "Download the favicon package and add the provided links to your site head."],
    example: "Create 16px, 32px, 180px, 192px, and 512px assets from one square logo.",
    output: "The package includes size-specific PNGs and the ICO asset needed by many browsers.",
    limits: "Very detailed logos become hard to recognize at 16px; start with a simple, high-contrast mark.",
    privacy: "Source artwork is rendered locally and is not uploaded.",
  },
  "/qr-code-generator": {
    problem: "A QR code provides a fast phone-friendly path to a URL, Wi-Fi network, text, or contact detail.",
    when: "Use it for printed signs, menus, event materials, packaging, or a link shared from a screen.",
    steps: ["Choose the data type and enter the content.", "Set contrast and size, then scan-test the preview with a phone.", "Download PNG for most uses or SVG for scalable print artwork."],
    example: "Create a QR code for a signup page and test it from the final printed distance before publishing.",
    output: "The code stores the entered data directly; this generator does not create a tracking redirect or expiry date.",
    limits: "A QR code cannot fix an invalid URL. Low contrast, blur, or insufficient print size can make scanning fail.",
    privacy: "The code is generated in your browser and the entered value is not sent to PixelTools.",
  },
  "/color-palette": {
    problem: "Picking colors by eye from a reference image can be slow and inconsistent.",
    when: "Use this to start a brand palette, pull colors from a photograph, or inspect a design reference.",
    steps: ["Add an image.", "Review the dominant colors and click a swatch to copy its hex value.", "Export the palette as CSS variables or JSON for your project."],
    example: "Extract five colors from a product photo and use the exported CSS variables in a landing page.",
    output: "The result includes approximate dominant colors as hex codes, plus copy and export actions.",
    limits: "A dominant-color algorithm summarizes pixels; it does not understand brand meaning or accessibility contrast.",
    privacy: "Color extraction samples the image locally in your browser.",
  },
  "/image-to-pdf": {
    problem: "Multiple scans or photos are easier to submit, archive, or print as one ordered PDF.",
    when: "Use this for receipts, scanned pages, portfolios, and simple image-based handouts.",
    steps: ["Add images in the order they should appear.", "Choose page size, orientation, and margins.", "Preview the pages and download one PDF."],
    example: "Combine several receipt photos into one letter-size PDF for an expense submission.",
    output: "Each source image becomes one PDF page in the chosen order and page settings.",
    limits: "This creates an image-based PDF, not searchable text. Large images can produce a large file.",
    privacy: "PDF creation is performed locally; the images are not uploaded.",
  },
  "/image-to-base64": {
    problem: "Small images sometimes need to be embedded directly in HTML, CSS, JSON, or an API payload.",
    when: "Use Base64 for small icons, prototypes, and self-contained snippets; use normal image URLs for larger production assets.",
    steps: ["Add an image or paste a data URI.", "Choose encode or decode.", "Copy the result or download the decoded image."],
    example: "Convert a small SVG or PNG icon into a data URI for a CSS background declaration.",
    output: "Encoding returns a MIME-prefixed data URI; decoding returns an image file that can be downloaded.",
    limits: "Base64 increases payload size and can make HTML or CSS harder to cache. Validate untrusted strings before using them in an application.",
    privacy: "Encoding and decoding happen on-device in the browser.",
  },
};

export function ToolDetails() {
  const { pathname } = useLocation();
  const copy = DETAILS[pathname];
  if (!copy) return null;

  return (
    <section className="prose tool-details" aria-label="About this tool">
      <h2>How this tool helps</h2>
      <p>{copy.problem} {copy.when}</p>
      <h3>How to use it</h3>
      <ol>{copy.steps.map((step) => <li key={step}>{step}</li>)}</ol>
      <h3>Example</h3>
      <p>{copy.example}</p>
      <h3>What you get</h3>
      <p>{copy.output}</p>
      <h3>Good to know</h3>
      <p><strong>Limitations:</strong> {copy.limits}</p>
      <p><strong>Privacy:</strong> {copy.privacy}</p>
    </section>
  );
}
