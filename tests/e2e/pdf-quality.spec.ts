import { expect, test } from "@playwright/test";

const onePixelPng = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/FyoAAAAASUVORK5CYII=", "base64");
const image = (name: string) => ({ name, mimeType: "image/png", buffer: onePixelPng });

test("sample receipt workflow produces a real three-page Letter PDF", async ({ page }) => {
  await page.goto("/image-to-pdf");
  await page.getByRole("button", { name: "Load three sample receipts" }).click();
  await expect(page.locator(".pdf-page")).toHaveCount(3);
  await expect(page.locator(".pdf-page__specs").first()).toContainText("600 × 800 px");
  await page.getByRole("button", { name: "Move down", exact: true }).first().click();
  await expect(page.locator(".pdf-page__name").first()).toHaveText("sample-receipt-2.png");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: /Download PDF/ }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("images.pdf");
  await expect(page.getByRole("status")).toContainText("PDF ready: 3 pages");
  const href = await page.getByRole("link", { name: "Save PDF again" }).getAttribute("href");
  const pdf = await page.evaluate(async (url) => await (await fetch(url!)).text(), href);
  expect(pdf).toContain("%PDF-");
  expect(pdf).toMatch(/\/Count 3\b/);
  expect(pdf).toContain("/MediaBox [0 0 612. 792.]");
});

test("adding and reordering does not revoke retained image previews", async ({ page }) => {
  await page.goto("/image-to-pdf");
  await page.locator('input[type="file"]').setInputFiles(image("first.png"));
  const firstUrl = await page.locator(".pdf-page img").getAttribute("src");
  await page.locator('input[type="file"]').setInputFiles(image("second.png"));
  await page.getByRole("button", { name: "Move down", exact: true }).first().click();
  expect(await page.evaluate(async (url) => (await fetch(url!)).ok, firstUrl)).toBe(true);
  await page.getByRole("button", { name: "Clear", exact: true }).click();
  await expect(page.locator(".pdf-page")).toHaveCount(0);
});

test("clear cancels pending PDF download and recovers for another run", async ({ page }) => {
  await page.addInitScript(() => {
    const original = window.createImageBitmap.bind(window);
    let release: (() => void) | undefined;
    Object.assign(window, { releasePdfDecode: () => release?.() });
    window.createImageBitmap = ((...args: Parameters<typeof createImageBitmap>) => new Promise((resolve, reject) => {
      Object.assign(window, { pdfDecodePending: true });
      release = () => original(...args).then(resolve, reject);
    })) as typeof createImageBitmap;
  });
  await page.goto("/image-to-pdf");
  await page.locator('input[type="file"]').setInputFiles(image("first.png"));
  let downloads = 0;
  page.on("download", () => downloads++);
  await page.getByRole("button", { name: /Download PDF/ }).click();
  await expect(page.getByRole("button", { name: "Building…" })).toBeDisabled();
  await expect.poll(() => page.evaluate(() => Boolean((window as unknown as { pdfDecodePending: boolean }).pdfDecodePending))).toBe(true);
  await page.getByRole("button", { name: "Clear", exact: true }).click();
  await page.evaluate(() => (window as unknown as { releasePdfDecode: () => void }).releasePdfDecode());
  await expect(page.locator(".dropzone__title")).toHaveText("Drop images here or click to browse");
  await page.locator('input[type="file"]').setInputFiles(image("new.png"));
  await expect(page.locator(".pdf-page__name")).toHaveText("new.png");
  expect(downloads).toBe(0);
  await expect(page.getByRole("status")).toHaveCount(0);
});

test("corrupt image gives recovery guidance rather than a stuck build", async ({ page }) => {
  await page.goto("/image-to-pdf");
  await page.locator('input[type="file"]').setInputFiles({ name: "broken.png", mimeType: "image/png", buffer: Buffer.from("not an image") });
  await page.getByRole("button", { name: /Download PDF/ }).click();
  await expect(page.getByRole("alert")).toContainText("damaged or unsupported image");
  await expect(page.getByRole("button", { name: /Download PDF/ })).toBeEnabled();
  await page.getByRole("button", { name: "Load three sample receipts" }).click();
  await expect(page.getByRole("alert")).toHaveCount(0);
  await expect(page.locator(".pdf-page")).toHaveCount(3);
});
