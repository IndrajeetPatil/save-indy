import { expect, test } from "@playwright/test";

// Search engines, AI assistants and social networks read the page without
// playing it, so these check the static HTML and the files they fetch.

const CANONICAL = "https://www.indrapatil.com/save-indy/";

const parseJson = (text: string): unknown => JSON.parse(text);

test("describes the game with structured data", async ({ page }) => {
  await page.goto("/");
  const blocks = await page
    .locator("script[type='application/ld+json']")
    .allTextContents();
  const [game, breadcrumbs] = blocks.map((block) => parseJson(block));

  expect(game).toMatchObject({
    "@type": "VideoGame",
    url: CANONICAL,
    image: `${CANONICAL}og-image.png`,
  });
  expect(breadcrumbs).toMatchObject({
    "@type": "BreadcrumbList",
    itemListElement: [{ position: 1 }, { position: 2, item: CANONICAL }],
  });
});

test("serves the sitemap and llms.txt", async ({ page }) => {
  const sitemap = await page.goto("/sitemap.xml");
  const sitemapText = await sitemap?.text();
  const llms = await page.goto("/llms.txt");
  const llmsText = await llms?.text();

  expect(sitemapText).toContain(`<loc>${CANONICAL}</loc>`);
  expect(sitemapText).toContain(`<loc>${CANONICAL}privacy/</loc>`);
  expect(llmsText).toMatch(/^# Save Indy!/u);
  expect(llmsText).toContain(`${CANONICAL}privacy/`);
});

test("serves the privacy and legal notice page", async ({ page }) => {
  await page.goto("/privacy/");

  await expect(
    page.getByRole("heading", { name: "Privacy & Legal Notice" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Play", exact: true }),
  ).toBeVisible();

  // The footer link on the home page navigates to privacy.
  await page.goto("/");
  await page.getByRole("link", { name: "Privacy" }).click();
  await expect(page).toHaveURL(/\/privacy\/$/u);
});

test("ships a noindex 404 page that links back to the game", async ({
  page,
}) => {
  await page.goto("/404.html");

  await expect(page.locator("meta[name='robots']")).toHaveAttribute(
    "content",
    "noindex, follow",
  );
  await expect(
    page.getByRole("link", { name: "Play Save Indy!" }),
  ).toHaveAttribute("href", CANONICAL);
});

test("loads no analytics on localhost", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", (request) => {
    requests.push(request.url());
  });

  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Start", exact: true }),
  ).toBeVisible();

  expect(
    requests.filter((url) => url.includes("googletagmanager")),
  ).toStrictEqual([]);
});
