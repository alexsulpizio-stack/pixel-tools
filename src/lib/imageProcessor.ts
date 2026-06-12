export type OutputFormat = "original" | "jpeg" | "png" | "webp";

export interface ProcessSettings {
  format: OutputFormat;
  /** 0–1, applies to lossy formats (jpeg/webp) */
  quality: number;
  /** Longest-edge cap in px; 0 = keep original dimensions */
  maxDimension: number;
}

export interface ProcessedImage {
  id: string;
  originalFile: File;
  originalSize: number;
  originalWidth: number;
  originalHeight: number;
  blob: Blob;
  outputSize: number;
  outputWidth: number;
  outputHeight: number;
  outputName: string;
  previewUrl: string;
}

const MIME_BY_FORMAT: Record<Exclude<OutputFormat, "original">, string> = {
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/bmp", "image/avif"];

function targetDimensions(w: number, h: number, maxDimension: number): { width: number; height: number } {
  if (maxDimension <= 0 || Math.max(w, h) <= maxDimension) return { width: w, height: h };
  const scale = maxDimension / Math.max(w, h);
  return { width: Math.max(1, Math.round(w * scale)), height: Math.max(1, Math.round(h * scale)) };
}

function resolveMime(file: File, format: OutputFormat): string {
  if (format !== "original") return MIME_BY_FORMAT[format];
  // GIF/BMP/AVIF can't be re-encoded as themselves via canvas; fall back to PNG.
  return file.type === "image/jpeg" || file.type === "image/webp" ? file.type : "image/png";
}

function outputFileName(file: File, mime: string): string {
  const base = file.name.replace(/\.[^.]+$/, "");
  return `${base}.${EXT_BY_MIME[mime] ?? "png"}`;
}

export async function processImage(file: File, settings: ProcessSettings): Promise<ProcessedImage> {
  const bitmap = await createImageBitmap(file);
  const originalWidth = bitmap.width;
  const originalHeight = bitmap.height;
  const { width, height } = targetDimensions(originalWidth, originalHeight, settings.maxDimension);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  const mime = resolveMime(file, settings.format);
  // Lossy formats have no alpha; composite onto white so transparency doesn't turn black.
  if (mime === "image/jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
  }
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Encoding failed"))),
      mime,
      mime === "image/png" ? undefined : settings.quality
    );
  });

  return {
    id: crypto.randomUUID(),
    originalFile: file,
    originalSize: file.size,
    originalWidth,
    originalHeight,
    blob,
    outputSize: blob.size,
    outputWidth: width,
    outputHeight: height,
    outputName: outputFileName(file, mime),
    previewUrl: URL.createObjectURL(blob),
  };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function savingsPercent(original: number, output: number): number {
  if (original === 0) return 0;
  return Math.round((1 - output / original) * 100);
}
