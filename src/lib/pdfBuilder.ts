import { jsPDF } from "jspdf";

export type PageFormat = "fit" | "a4" | "letter";

export interface PdfSettings {
  format: PageFormat;
  /** Page margin in points (only applies to fixed formats) */
  margin: number;
}

// Page dimensions in points (72/inch), portrait.
const PAGE_SIZES: Record<Exclude<PageFormat, "fit">, [number, number]> = {
  a4: [595.28, 841.89],
  letter: [612, 792],
};

interface LoadedImage {
  dataUrl: string;
  width: number;
  height: number;
}

async function loadAsJpeg(file: File): Promise<LoadedImage> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");
  // White underlay so transparent PNGs don't render black in the PDF.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();
  return { dataUrl: canvas.toDataURL("image/jpeg", 0.92), width: canvas.width, height: canvas.height };
}

export async function buildPdf(files: File[], settings: PdfSettings): Promise<Blob> {
  if (files.length === 0) throw new Error("No images");

  let doc: jsPDF | null = null;

  for (const file of files) {
    const img = await loadAsJpeg(file);

    if (settings.format === "fit") {
      // Page exactly matches the image (px treated as pt).
      const orientation = img.width > img.height ? "l" : "p";
      if (!doc) {
        doc = new jsPDF({ unit: "pt", format: [img.width, img.height], orientation });
      } else {
        doc.addPage([img.width, img.height], orientation);
      }
      doc.addImage(img.dataUrl, "JPEG", 0, 0, img.width, img.height);
    } else {
      const [pw, ph] = PAGE_SIZES[settings.format];
      // Rotate the page to match the image's aspect for less wasted space.
      const landscape = img.width > img.height;
      const pageW = landscape ? ph : pw;
      const pageH = landscape ? pw : ph;
      if (!doc) {
        doc = new jsPDF({ unit: "pt", format: settings.format, orientation: landscape ? "l" : "p" });
      } else {
        doc.addPage(settings.format, landscape ? "l" : "p");
      }
      const maxW = pageW - settings.margin * 2;
      const maxH = pageH - settings.margin * 2;
      const scale = Math.min(maxW / img.width, maxH / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      doc.addImage(img.dataUrl, "JPEG", (pageW - w) / 2, (pageH - h) / 2, w, h);
    }
  }

  return doc!.output("blob");
}
