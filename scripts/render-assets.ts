// Render the PNG icons and the social preview image from the game itself:
// the icons from public/favicon.svg, and the preview from the live scene in a
// production build. Run `vp build` first, then `vp run render-assets`.
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright";
import type { Page } from "playwright";

const PORT = 4174;
const BASE_URL = `http://127.0.0.1:${PORT}/`;
const PUBLIC_DIR = new URL("../public/", import.meta.url);
const BACKGROUND = "#2b1d14";
const SERVER_ATTEMPTS = 50;
const SERVER_POLL_MS = 100;
/** Lets the torches and the snake settle into a lively frame. */
const SETTLE_MS = 700;
/** Maskable icons must keep their content inside the central 80% circle. */
const MASKABLE_CONTENT_SHARE = 0.7;

const ICONS = [
  { file: "favicon-32.png", size: 32 },
  { file: "apple-touch-icon.png", size: 180 },
  { file: "icon-192.png", size: 192 },
  { file: "icon-512.png", size: 512 },
] as const;
const MASKABLE = { file: "icon-maskable-512.png", size: 512 } as const;
const PREVIEW = { file: "og-image.png", width: 1200, height: 630 } as const;

async function waitForServer(): Promise<void> {
  for (let attempt = 0; attempt < SERVER_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(BASE_URL);
      if (response.ok) {
        return;
      }
    } catch {
      // Not listening yet.
    }
    await delay(SERVER_POLL_MS);
  }
  throw new Error(`Preview server did not start at ${BASE_URL}`);
}

async function renderIcon(
  page: Page,
  svg: string,
  icon: {
    readonly file: string;
    readonly size: number;
    readonly share: number;
  },
): Promise<void> {
  const inner = Math.round(icon.size * icon.share);
  await page.setViewportSize({ width: icon.size, height: icon.size });
  await page.setContent(
    `<body style="margin:0;display:grid;place-items:center;width:${icon.size}px;height:${icon.size}px;background:${icon.share < 1 ? BACKGROUND : "transparent"}">
      <img alt="" style="width:${inner}px;height:${inner}px;image-rendering:pixelated" src="data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}">
    </body>`,
  );
  await page.screenshot({
    path: fileURLToPath(new URL(icon.file, PUBLIC_DIR)),
    omitBackground: icon.share === 1,
  });
}

async function renderPreview(page: Page): Promise<void> {
  await page.setViewportSize({ width: PREVIEW.width, height: PREVIEW.height });
  await page.goto(BASE_URL);
  await page.evaluate(async () => document.fonts.ready);
  await page.waitForTimeout(SETTLE_MS);
  await page.evaluate(
    ({ width, height }) => {
      const canvas = document.querySelector("canvas");
      const card = document.createElement("div");
      card.id = "preview-card";
      card.style.cssText = `position:fixed;inset:0;z-index:10;width:${width}px;height:${height}px;display:grid;grid-template-columns:auto 1fr;gap:48px;align-items:center;padding:56px;box-sizing:border-box;background:radial-gradient(circle at 70% 0%,#3a2618,#17110d 70%)`;
      const image = document.createElement("img");
      image.src = canvas?.toDataURL() ?? "";
      image.style.cssText =
        "width:640px;height:480px;image-rendering:pixelated;border:6px solid #0b0806;outline:4px solid #6b5039";
      const text = document.createElement("div");
      const title = document.createElement("p");
      title.textContent = "Save Indy!";
      title.style.cssText =
        "margin:0 0 28px;font:56px/1.3 'Press Start 2P';color:#f0c75a;text-shadow:4px 4px 0 #6b3d12,8px 8px 0 #0b0806";
      const tagline = document.createElement("p");
      tagline.textContent =
        "Answer JavaScript questions to drive the snake back.";
      tagline.style.cssText =
        "margin:0;font:600 30px/1.4 system-ui,sans-serif;color:#f6ecdc";
      text.append(title, tagline);
      card.append(image, text);
      document.body.append(card);
    },
    { width: PREVIEW.width, height: PREVIEW.height },
  );
  await page.locator("#preview-card").screenshot({
    path: fileURLToPath(new URL(PREVIEW.file, PUBLIC_DIR)),
  });
}

const server = spawn(
  "vp",
  ["preview", "--host", "127.0.0.1", "--port", String(PORT), "--strictPort"],
  { stdio: "ignore" },
);
const browser = await chromium.launch();
try {
  await waitForServer();
  const page = await browser.newPage();
  const svg = await readFile(new URL("favicon.svg", PUBLIC_DIR), "utf8");
  for (const icon of ICONS) {
    await renderIcon(page, svg, { ...icon, share: 1 });
  }
  await renderIcon(page, svg, { ...MASKABLE, share: MASKABLE_CONTENT_SHARE });
  await renderPreview(page);
  console.log("Rendered icons and og-image.png into public/.");
} finally {
  await browser.close();
  server.kill();
}
