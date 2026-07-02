/** Shared Canvas helpers used by the image tools. Everything runs locally. */

export interface LoadedImage {
  bitmap: ImageBitmap;
  width: number;
  height: number;
}

export async function loadImage(file: File | Blob): Promise<LoadedImage> {
  const bitmap = await createImageBitmap(file);
  return { bitmap, width: bitmap.width, height: bitmap.height };
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type = "image/png",
  quality?: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Canvas export failed"))),
      type,
      quality
    );
  });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** Replace a file's extension, e.g. "photo.png" + "jpg" -> "photo.jpg". */
export function withExtension(name: string, ext: string): string {
  return name.replace(/\.[^.]+$/, "") + "." + ext;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
