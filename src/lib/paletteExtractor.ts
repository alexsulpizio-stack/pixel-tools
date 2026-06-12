export interface PaletteColor {
  hex: string;
  rgb: [number, number, number];
  /** Share of sampled pixels in this bucket, 0–1 */
  population: number;
}

type Pixel = [number, number, number];

const SAMPLE_SIZE = 96;

/** Median-cut quantization over a downsampled copy of the image. */
export async function extractPalette(file: File, colorCount: number): Promise<PaletteColor[]> {
  const bitmap = await createImageBitmap(file);
  const scale = SAMPLE_SIZE / Math.max(bitmap.width, bitmap.height);
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas 2D context unavailable");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  const data = ctx.getImageData(0, 0, w, h).data;
  const pixels: Pixel[] = [];
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 128) continue; // skip transparent pixels
    pixels.push([data[i], data[i + 1], data[i + 2]]);
  }
  if (pixels.length === 0) throw new Error("Image has no opaque pixels");

  let buckets: Pixel[][] = [pixels];
  while (buckets.length < colorCount) {
    // Split the largest bucket along its widest channel.
    buckets.sort((a, b) => b.length - a.length);
    const target = buckets.shift()!;
    if (target.length < 2) {
      buckets.push(target);
      break;
    }
    const channel = widestChannel(target);
    target.sort((a, b) => a[channel] - b[channel]);
    const mid = Math.floor(target.length / 2);
    buckets.push(target.slice(0, mid), target.slice(mid));
  }

  const total = pixels.length;
  return buckets
    .map((bucket) => {
      const avg: Pixel = [0, 0, 0];
      for (const p of bucket) {
        avg[0] += p[0];
        avg[1] += p[1];
        avg[2] += p[2];
      }
      const rgb: [number, number, number] = [
        Math.round(avg[0] / bucket.length),
        Math.round(avg[1] / bucket.length),
        Math.round(avg[2] / bucket.length),
      ];
      return { hex: rgbToHex(rgb), rgb, population: bucket.length / total };
    })
    .sort((a, b) => b.population - a.population);
}

function widestChannel(pixels: Pixel[]): 0 | 1 | 2 {
  const min: Pixel = [255, 255, 255];
  const max: Pixel = [0, 0, 0];
  for (const p of pixels) {
    for (const c of [0, 1, 2] as const) {
      if (p[c] < min[c]) min[c] = p[c];
      if (p[c] > max[c]) max[c] = p[c];
    }
  }
  const ranges = [max[0] - min[0], max[1] - min[1], max[2] - min[2]];
  return ranges.indexOf(Math.max(...ranges)) as 0 | 1 | 2;
}

function rgbToHex([r, g, b]: [number, number, number]): string {
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

/** Pick black or white text for contrast against the given color. */
export function contrastColor([r, g, b]: [number, number, number]): string {
  return r * 0.299 + g * 0.587 + b * 0.114 > 150 ? "#000000" : "#ffffff";
}

export function toCssVariables(colors: PaletteColor[]): string {
  const lines = colors.map((c, i) => `  --color-${i + 1}: ${c.hex};`);
  return `:root {\n${lines.join("\n")}\n}`;
}

export function toJson(colors: PaletteColor[]): string {
  return JSON.stringify(colors.map((c) => c.hex), null, 2);
}
