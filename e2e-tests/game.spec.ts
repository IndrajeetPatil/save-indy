import { expect, test } from "@playwright/test";

import {
  answerQuestion,
  audioSessionType,
  audioStates,
  fetchAsset,
  fileName,
  playToEnd,
  press,
  startGame,
  trackAudioContexts,
} from "./game-fixture.ts";

test("a perfect round saves Indy, played with the keyboard alone", async ({
  page,
}) => {
  const errors = await startGame(page);

  await playToEnd(page, true);

  await expect(
    page.getByRole("heading", { name: "You saved Indy!" }),
  ).toBeFocused();
  await expect(page.locator("#summary")).toHaveText(
    "Beginner: 5/5 correct (100%)",
  );
  await expect(page.getByRole("heading", { name: "Revisit" })).toBeHidden();
  expect(errors).toStrictEqual([]);
});

test("a losing round lists every missed question with its answer", async ({
  page,
}) => {
  const errors = await startGame(page, "Advanced");

  await playToEnd(page, false);

  await expect(
    page.getByRole("heading", { name: "The snake got Indy!" }),
  ).toBeVisible();
  await expect(page.locator("#review-list > li")).toHaveCount(5);
  await expect(
    page.getByRole("meter", { name: "Indy's health" }),
  ).toHaveAttribute("aria-valuenow", "0");
  expect(errors).toStrictEqual([]);
});

test("a wrong answer reveals the right one and explains it", async ({
  page,
}) => {
  await startGame(page);

  await answerQuestion(page, false);

  await expect(page.locator(".answer.is-wrong")).toHaveCount(1);
  await expect(page.locator(".answer.is-correct")).toHaveCount(1);
  await expect(page.locator("#explanation")).not.toBeEmpty();
  await expect(page.locator("#answers button:enabled")).toHaveCount(0);
  await expect(page.getByRole("meter", { name: "Threat" })).toHaveAttribute(
    "aria-valuenow",
    "60",
  );
});

test("the mute setting survives a reload", async ({ page }) => {
  await page.goto("/");
  const mute = page.getByRole("button", { name: "Mute sound" });

  await mute.click();
  await page.reload();

  await expect(mute).toHaveAttribute("aria-pressed", "true");
});

test("the production page enforces a strict Content Security Policy", async ({
  page,
}) => {
  await page.goto("/");

  const policy = await page
    .locator("meta[http-equiv='Content-Security-Policy']")
    .getAttribute("content");

  expect(policy).toContain("script-src 'self'");
  expect(policy).toContain("object-src 'none'");
});

test("the old game URL redirects to the home page", async ({ page }) => {
  await page.goto("/game/index.html");

  await expect(page).toHaveURL(/\/$/u);
  await expect(
    page.getByRole("button", { name: "Start", exact: true }),
  ).toBeVisible();
});

test("sound starts on the first tap or click, as mobile browsers require", async ({
  page,
  hasTouch,
}) => {
  await trackAudioContexts(page);
  await startGame(page);
  const firstAnswer = page.locator("#answers button").first();

  await press(firstAnswer, hasTouch);

  await expect.poll(async () => audioStates(page)).toStrictEqual(["running"]);
});

test("sound plays even when the iPhone's silent switch is on", async ({
  page,
  hasTouch,
  browserName,
}) => {
  test.skip(browserName !== "webkit", "Only Safari has an audio session");
  await startGame(page);

  await press(page.locator("#answers button").first(), hasTouch);

  expect(await audioSessionType(page)).toBe("playback");
});

test("the social card image exists at the advertised address", async ({
  page,
}) => {
  await page.goto("/");
  const image = await page
    .locator("meta[property='og:image']")
    .getAttribute("content");
  const twitterImage = await page
    .locator("meta[name='twitter:image']")
    .getAttribute("content");

  // The page is served from the site root locally, so request the file name.
  const asset = await fetchAsset(page, `/${fileName(image)}`);

  expect(twitterImage).toBe(image);
  expect(asset).toStrictEqual({ status: 200, contentType: "image/png" });
});
