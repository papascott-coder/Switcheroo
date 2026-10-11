import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const outDir = "/workspace/screenshots/demo-video-long";
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  recordVideo: { dir: outDir, size: { width: 390, height: 844 } },
});
const page = await context.newPage();
await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
await page.waitForTimeout(3500);
await page.getByRole("button", { name: /Stamp this/i }).click();
await page.waitForTimeout(2500);
await page.getByRole("button", { name: /Handed over/i }).click();
await page.waitForTimeout(2500);
await page.getByRole("button", { name: /Mike/i }).click();
await page.waitForTimeout(2500);
await page.getByRole("button", { name: /Bump with Mike/i }).click();
await page.waitForTimeout(2500);
await page.getByRole("button", { name: /Tap to continue/i }).click();
await page.waitForTimeout(4000);
const video = page.video();
await context.close();
await browser.close();
console.log(await video.path());
