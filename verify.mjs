import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require(
  "C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/.pnpm/playwright-core@1.59.1/node_modules/playwright-core",
);

const root = path.dirname(fileURLToPath(import.meta.url));
const pagePath = path.join(root, "index.html").replace(/\\/g, "/");

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 });

await page.goto(`file:///${pagePath}`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2500);

const title = await page.title();
await page.screenshot({ path: path.join(root, "preview-desktop.png"), fullPage: true });
await page.locator("#products").scrollIntoViewIfNeeded();
await page.waitForTimeout(1000);
const before = await page.locator(".product-card:not(.hidden)").count();
const loadedImages = await page.locator("img").evaluateAll((imgs) =>
  imgs.map((img) => ({
    src: img.currentSrc,
    loaded: img.complete && img.naturalWidth > 0,
    width: img.naturalWidth,
    height: img.naturalHeight,
  })),
);
await page.locator('[data-filter="qa"]').click();
await page.waitForTimeout(150);
const after = await page.locator(".product-card:not(.hidden)").count();

await page.locator('[data-add-quote="QA & Positioning Tools"]').click();
await page.waitForTimeout(150);
const quoteCount = await page.locator("#quoteCount").innerText();

await page.screenshot({ path: path.join(root, "preview-interaction.png"), fullPage: true });
await page.setViewportSize({ width: 390, height: 900 });
await page.goto(`file:///${pagePath}`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2500);
await page.screenshot({ path: path.join(root, "preview-mobile.png"), fullPage: true });
await browser.close();

console.log(
  JSON.stringify(
    {
      title,
      visibleCardsBeforeFilter: before,
      visibleCardsAfterQaFilter: after,
      quoteCount,
      loadedImages,
    },
    null,
    2,
  ),
);
