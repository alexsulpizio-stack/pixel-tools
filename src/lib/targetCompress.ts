export type TargetOutput = "jpeg" | "webp" | "png";

export interface TargetResult {
  blob: Blob;
  previewUrl: string;
  name: string;
  originalSize: number;
  width: number;
  height: number;
  /** True when we hit the target; false when even maximum compression couldn't reach it */
  hitTarget: boolean;
}

const MIME: Record<TargetOutput, string> = {
  jpeg: "image/jpeg",
  webp: "image/webp",
  png: "image/png",
};

const EXT: Record<TargetOutput, string> = { jpeg: "jpg", webp: "webp", png: "png" };

function draw(bitmap: ImageBitmap, width: number, height: number, whiteBg: boolean): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  if (whiteBg) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
  }
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, width, height);
  return canvas;
}

function encode(canvas: HTMLCanvasElement, mime: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Encoding failed"))), mime, quality)
  );
}

/**
 * Compress an image to fit under targetBytes.
 * Lossy formats: binary-search the quality setting; if even the lowest
 * quality is too large, progressively downscale dimensions and retry.
 * PNG (lossless): downscale dimensions only.
 */
export async function compressToTarget(file: File, targetBytes: number, output: TargetOutput): Promise<TargetResult> {
  const bitmap = await createImageBitmap(file);
  const mime = MIME[output];
  const whiteBg = output === "jpeg";

  let scale = 1;
  let best: Blob | null = null;
  let bestW = bitmap.width;
  let bestH = bitmap.height;

  for (let attempt = 0; attempt < 6; attempt++) {
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = draw(bitmap, w, h, whiteBg);

    if (output === "png") {
      const blob = await encode(canvas, mime);
      best = blob;
      bestW = w;
      bestH = h;
      if (blob.size <= targetBytes) break;
      scale *= Math.max(0.4, Math.sqrt(targetBytes / blob.size) * 0.95);
      continue;
    }

    // Lossy: binary search quality at this scale.
    let lo = 0.02;
    let hi = 0.95;
    let fit: Blob | null = null;
    for (let i = 0; i < 8; i++) {
      const q = (lo + hi) / 2;
      const blob = await encode(canvas, mime, q);
      if (blob.size <= targetBytes) {
        fit = blob;
        lo = q;
      } else {
        hi = q;
      }
    }
    if (fit) {
      best = fit;
      bestW = w;
      bestH = h;
      break;
    }
    // Even minimum quality was too big — keep the smallest so far and shrink dimensions.
    const minBlob = await encode(canvas, mime, 0.02);
    best = minBlob;
    bestW = w;
    bestH = h;
    scale *= Math.max(0.4, Math.sqrt(targetBytes / minBlob.size) * 0.9);
  }

  bitmap.close();
  const blob = best!;
  const base = file.name.replace(/\.[^.]+$/, "");
  return {
    blob,
    previewUrl: URL.createObjectURL(blob),
    name: `${base}-${Math.round(targetBytes / 1024)}kb.${EXT[output]}`,
    originalSize: file.size,
    width: bestW,
    height: bestH,
    hitTarget: blob.size <= targetBytes,
  };
}
