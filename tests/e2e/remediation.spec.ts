import { expect, test } from "@playwright/test";

declare global {
  interface Window {
    __pixelToolsQa?: {
      bitmapCalls: number;
      releaseBitmap: (() => void) | null;
    };
  }
}

const onePixelPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/FyoAAAAASUVORK5CYII=",
  "base64"
);

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("pixeltools-consent-v1", "accepted");

    const qaState = { bitmapCalls: 0, releaseBitmap: null as (() => void) | null };
    window.__pixelToolsQa = qaState;

    const nativeCreateImageBitmap = window.createImageBitmap.bind(window);
    window.createImageBitmap = ((...args: Parameters<typeof createImageBitmap>) => {
      qaState.bitmapCalls++;
      return new Promise((resolve, reject) => {
        qaState.releaseBitmap = () => {
          nativeCreateImageBitmap(...args).then(resolve, reject);
        };
      });
    }) as typeof createImageBitmap;
  });
});

async function uploadAndWaitUntilImageDecodeIsPending(page: import("@playwright/test").Page) {
  await page.locator('input[type="file"]').setInputFiles({
    name: "browser-check.png",
    mimeType: "image/png",
    buffer: onePixelPng,
  });
  await expect(page.locator(".dropzone__title")).toHaveText("Processing…");
  await expect.poll(() => page.evaluate(() => window.__pixelToolsQa?.bitmapCalls ?? 0)).toBe(1);
}

test("clearing an in-progress compressor batch restores the idle state", async ({ page }) => {
  await page.goto("/");
  await uploadAndWaitUntilImageDecodeIsPending(page);

  await page.getByRole("button", { name: "Clear" }).click();
  await expect(page.locator(".dropzone__title")).toHaveText("Drop images here or click to browse");
  await expect(page.locator(".results")).toHaveCount(0);

  await page.evaluate(() => window.__pixelToolsQa?.releaseBitmap?.());
  await expect(page.locator(".dropzone__title")).toHaveText("Drop images here or click to browse");
  await expect(page.locator(".results")).toHaveCount(0);
});

test("changing target size during processing does not show the old result", async ({ page }) => {
  await page.goto("/compress-image-to-50kb");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Compress image to 50 KB");
  await uploadAndWaitUntilImageDecodeIsPending(page);

  const otherTargets = page.locator("section.size-links").filter({ has: page.getByRole("heading", { name: "Other target sizes" }) });
  await otherTargets.getByRole("link", { name: /1 MB/ }).click();

  await expect(page).toHaveURL(/\/compress-image-to-1mb$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Compress image to 1 MB");
  await page.evaluate(() => window.__pixelToolsQa?.releaseBitmap?.());
  await expect(page.locator(".dropzone__title")).toHaveText("Drop images here or click to browse");
  await expect(page.locator(".results")).toHaveCount(0);
});

test("localhost does not request or inject AdSense after consent", async ({ page }) => {
  const adRequests: string[] = [];
  page.on("request", (request) => {
    if (/adsbygoogle|pagead2\.googlesyndication\.com/i.test(request.url())) adRequests.push(request.url());
  });

  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator('script[src*="adsbygoogle.js"]')).toHaveCount(0);
  expect(adRequests).toEqual([]);
});
