import { defineConfig } from "@playwright/test";

// Playwright's web server needs a known URL to poll, so it cannot take an
// ephemeral port; callers can move it off the default.
const PORT = process.env["PLAYWRIGHT_PORT"] ?? "4173";
const BASE_URL = `http://localhost:${PORT}`;
const isCI = Boolean(process.env["CI"]);

export default defineConfig({
  testDir: "./e2e-tests",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  // Spread rather than assign `undefined`: `exactOptionalPropertyTypes`
  // rejects an explicit undefined.
  ...(isCI ? { workers: 4 } : {}),
  reporter: isCI
    ? [["dot"], ["github"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],
  expect: { timeout: 10_000 },
  use: {
    baseURL: BASE_URL,
    viewport: { width: 1280, height: 800 },
    locale: "en-US",
    timezoneId: "UTC",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
  // Exercise the production build, including its Content Security Policy.
  webServer: {
    command: `vp preview --host 127.0.0.1 --port ${PORT} --strictPort`,
    url: BASE_URL,
    reuseExistingServer: false,
  },
});
