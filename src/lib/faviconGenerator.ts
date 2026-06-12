export type IconShape = "square" | "rounded" | "circle";

export interface TextIconSettings {
  text: string;
  background: string;
  color: string;
  shape: IconShape;
}

export interface FaviconAsset {
  name: string;
  size: number;
  blob: Blob;
  previewUrl: string;
}

export interface FaviconBundle {
  assets: FaviconAsset[];
  ico: Blob;
}

/** Sizes shipped in the bundle; 16/32/48 also go inside favicon.ico. */
const PNG_SIZES: { size: number; name: string }[] = [
  { size: 16, name: "favicon-16x16.png" },
  { size: 32, name: "favicon-32x32.png" },
  { size: 48, name: "favicon-48x48.png" },
  { size: 180, name: "apple-touch-icon.png" },
  { size: 192, name: "android-chrome-192x192.png" },
  { size: 512, name: "android-chrome-512x512.png" },
];

const ICO_SIZES = [16, 32, 48];

function makeCanvas(size: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");
  return [canvas, ctx];
}

function clipShape(ctx: CanvasRenderingContext2D, size: number, shape: IconShape) {
  if (shape === "square") return;
  ctx.beginPath();
  if (shape === "circle") {
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  } else {
    const r = size * 0.2;
    ctx.roundRect(0, 0, size, size, r);
  }
  ctx.clip();
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("PNG encoding failed"))), "image/png")
  );
}

async function renderImageIcon(bitmap: ImageBitmap, size: number, shape: IconShape): Promise<Blob> {
  const [canvas, ctx] = makeCanvas(size);
  clipShape(ctx, size, shape);
  ctx.imageSmoothingQuality = "high";
  // Cover-fit: crop the source to a centered square.
  const side = Math.min(bitmap.width, bitmap.height);
  const sx = (bitmap.width - side) / 2;
  const sy = (bitmap.height - side) / 2;
  ctx.drawImage(bitmap, sx, sy, side, side, 0, 0, size, size);
  return canvasToBlob(canvas);
}

async function renderTextIcon(settings: TextIconSettings, size: number): Promise<Blob> {
  const [canvas, ctx] = makeCanvas(size);
  clipShape(ctx, size, settings.shape);
  ctx.fillStyle = settings.background;
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = settings.color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const fontSize = settings.text.length > 1 ? size * 0.5 : size * 0.62;
  ctx.font = `700 ${fontSize}px "Segoe UI", system-ui, sans-serif`;
  // Slight vertical nudge: optical centering for latin glyphs.
  ctx.fillText(settings.text, size / 2, size / 2 + size * 0.03);
  return canvasToBlob(canvas);
}

/**
 * Assemble a .ico container from PNG blobs. Modern .ico files may embed PNG
 * data directly (supported everywhere since Windows Vista / all browsers).
 * Layout: ICONDIR (6 bytes) + N × ICONDIRENTRY (16 bytes) + PNG payloads.
 */
async function buildIco(pngs: { size: number; blob: Blob }[]): Promise<Blob> {
  const buffers = await Promise.all(pngs.map((p) => p.blob.arrayBuffer()));
  const headerSize = 6 + 16 * pngs.length;
  const total = headerSize + buffers.reduce((s, b) => s + b.byteLength, 0);
  const out = new ArrayBuffer(total);
  const view = new DataView(out);
  const bytes = new Uint8Array(out);

  view.setUint16(0, 0, true); // reserved
  view.setUint16(2, 1, true); // type: icon
  view.setUint16(4, pngs.length, true);

  let offset = headerSize;
  pngs.forEach((p, i) => {
    const entry = 6 + i * 16;
    const len = buffers[i].byteLength;
    view.setUint8(entry, p.size >= 256 ? 0 : p.size); // width
    view.setUint8(entry + 1, p.size >= 256 ? 0 : p.size); // height
    view.setUint8(entry + 2, 0); // palette
    view.setUint8(entry + 3, 0); // reserved
    view.setUint16(entry + 4, 1, true); // color planes
    view.setUint16(entry + 6, 32, true); // bits per pixel
    view.setUint32(entry + 8, len, true); // payload size
    view.setUint32(entry + 12, offset, true); // payload offset
    bytes.set(new Uint8Array(buffers[i]), offset);
    offset += len;
  });

  return new Blob([out], { type: "image/x-icon" });
}

async function buildBundle(render: (size: number) => Promise<Blob>): Promise<FaviconBundle> {
  const assets: FaviconAsset[] = [];
  for (const { size, name } of PNG_SIZES) {
    const blob = await render(size);
    assets.push({ name, size, blob, previewUrl: URL.createObjectURL(blob) });
  }
  const icoPngs = ICO_SIZES.map((size) => {
    const asset = assets.find((a) => a.size === size);
    if (!asset) throw new Error(`Missing ${size}px asset for ICO`);
    return { size, blob: asset.blob };
  });
  return { assets, ico: await buildIco(icoPngs) };
}

export async function generateFromImage(file: File, shape: IconShape): Promise<FaviconBundle> {
  const bitmap = await createImageBitmap(file);
  try {
    return await buildBundle((size) => renderImageIcon(bitmap, size, shape));
  } finally {
    bitmap.close();
  }
}

export async function generateFromText(settings: TextIconSettings): Promise<FaviconBundle> {
  return buildBundle((size) => renderTextIcon(settings, size));
}

export function releaseBundle(bundle: FaviconBundle) {
  bundle.assets.forEach((a) => URL.revokeObjectURL(a.previewUrl));
}

export const WEBMANIFEST = JSON.stringify(
  {
    name: "",
    short_name: "",
    icons: [
      { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    theme_color: "#ffffff",
    background_color: "#ffffff",
    display: "standalone",
  },
  null,
  2
);

export const HTML_SNIPPET = `<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">`;
