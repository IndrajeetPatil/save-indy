import { expect, test } from "vite-plus/test";

import { startAnalytics } from "./analytics.ts";

const TAG = "https://www.googletagmanager.com/gtag/js?id=G-3BQ49J7KYH";

// A detached document never fetches the scripts added to it.
const blankDocument = () => document.implementation.createHTMLDocument();

test.each(["localhost", "127.0.0.1"])("loads nothing on %s", (hostname) => {
  const root = blankDocument();
  const target: { dataLayer?: unknown[] } = {};

  expect(startAnalytics(root, hostname, target)).toBe(false);
  expect(root.scripts).toHaveLength(0);
  expect(target.dataLayer).toBeUndefined();
});

test("adds the tag on the live site", () => {
  const root = blankDocument();

  expect(startAnalytics(root, "www.indrapatil.com", {})).toBe(true);

  const [script] = root.scripts;

  expect(script?.src).toBe(TAG);
  expect(script?.async).toBe(true);
});

test("queues the commands as `arguments` objects, as gtag.js requires", () => {
  const dataLayer: unknown[] = [];

  startAnalytics(blankDocument(), "www.indrapatil.com", { dataLayer });

  expect(dataLayer.map((command) => Array.isArray(command))).toStrictEqual([
    false,
    false,
  ]);
  expect(dataLayer[0]).toHaveProperty("0", "js");
  expect(dataLayer[1]).toHaveProperty("0", "config");
  expect(dataLayer[1]).toHaveProperty("1", "G-3BQ49J7KYH");
});

test("keeps commands that were already queued", () => {
  const queued = ["earlier"];
  const target = { dataLayer: queued };

  startAnalytics(blankDocument(), "www.indrapatil.com", target);

  expect(target.dataLayer).toBe(queued);
  expect(queued).toHaveLength(3);
});
