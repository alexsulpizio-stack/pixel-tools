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
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR4nGP4DwQACfsD/fteaysAAAAASUVORK5CYII=",
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

test("1 MB compressor checks the actual output against upload form rules", async ({ page }) => {
  await page.goto("/compress-image-to-1mb");
  await uploadAndWaitUntilImageDecodeIsPending(page);
  await page.evaluate(() => window.__pixelToolsQa?.releaseBitmap?.());

  const checker = page.getByRole("region", { name: "Upload requirements checker" });
  await expect(checker.getByText("Meets entered limits")).toBeVisible();
  await expect(checker.getByText(/File size:/)).toBeVisible();

  await checker.getByLabel("Required file format").selectOption("jpeg");
  await expect(checker.getByText("Does not meet all limits")).toBeVisible();
  await expect(checker.getByText(/required JPEG — change the output format and process again/)).toBeVisible();

  await checker.getByLabel("Minimum width (px)").fill("2");
  await expect(checker.getByText(/outside the entered range/)).toBeVisible();
});

test("format guide recommends an image format from the visitor's choices", async ({ page }) => {
  await page.goto("/guides/jpeg-vs-png-vs-webp");
  const advisor = page.getByRole("region", { name: "Choose a format for your image" });

  await advisor.getByLabel("Image type").selectOption("screenshot");
  await expect(advisor.getByText(/PNG for the clearest text/)).toBeVisible();

  await advisor.getByLabel("Where will it go?").selectOption("upload");
  await expect(advisor.getByText(/Use the required format; choose PNG/)).toBeVisible();

  await advisor.getByLabel("The background must stay transparent").check();
  await expect(advisor.getByText(/PNG is the safest fallback/)).toBeVisible();
});

test("PDF page planner reports measured image dimensions and placement", async ({ page }) => {
  await page.goto("/image-to-pdf");
  await page.locator('input[type="file"]').setInputFiles({
    name: "one-pixel.png",
    mimeType: "image/png",
    buffer: onePixelPng,
  });

  await expect(page.locator(".pdf-page__specs")).toContainText("1 × 1 px");
  await expect(page.locator(".pdf-page__specs")).toContainText("Placed at about 0.01 × 0.01 in");
  await page.getByRole("button", { name: "Letter" }).click();
  await expect(page.locator(".pdf-page__specs")).toContainText("Placed at about");
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
