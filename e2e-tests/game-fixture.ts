import { expect } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";

import { QUESTIONS } from "../src/questions.ts";

type Level = "Beginner" | "Intermediate" | "Advanced";

/** Questions as the page shows them: backtick code spans become plain text. */
const CORRECT_BY_PROMPT = new Map(
  QUESTIONS.map((question) => [
    question.prompt.replaceAll("`", ""),
    question.correct,
  ]),
);

/**
 * Open the game and start a round, collecting console errors and CSP reports.
 * @param page Playwright page.
 * @param level Level to play.
 * @returns Console errors seen so far, updated as the test continues.
 */
async function startGame(
  page: Page,
  level: Level = "Beginner",
): Promise<string[]> {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text());
    }
  });
  page.on("pageerror", (error) => {
    errors.push(error.message);
  });
  await page.goto("/");
  await page.getByRole("radio", { name: new RegExp(level, "u") }).check();
  await page.getByRole("button", { name: "Start the adventure" }).click();
  await expect(page.getByRole("heading", { level: 2 })).toBeFocused();
  return errors;
}

/**
 * Answer the question on screen.
 * @param page Playwright page.
 * @param right Whether to pick the right answer.
 */
async function answerQuestion(page: Page, right: boolean): Promise<void> {
  const prompt = await page.locator("#question").textContent();
  const correct = CORRECT_BY_PROMPT.get(prompt ?? "");
  expect(correct, `known question: ${prompt}`).toBeDefined();
  const buttons = page.locator("#answers button");
  const choices = await buttons.evaluateAll((elements) =>
    elements.map((element) => element.dataset["choice"]),
  );
  const index = choices.findIndex((choice) => (choice === correct) === right);
  await page.keyboard.press(String(index + 1));
}

/**
 * Keep answering until the round ends.
 * @param page Playwright page.
 * @param right Whether to answer every question right or wrong.
 */
async function playToEnd(page: Page, right: boolean): Promise<void> {
  const endScreen = page.locator("#end-screen");
  while (!(await endScreen.isVisible())) {
    await answerQuestion(page, right);
    await page
      .getByRole("button", { name: /Next question|See the result/u })
      .press("Enter");
  }
}

declare global {
  // Set by `trackAudioContexts` before the page's scripts run.
  var audioContexts: AudioContext[] | undefined;
}

/**
 * Record every AudioContext the page creates, before its scripts run.
 * @param page Playwright page.
 */
async function trackAudioContexts(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const contexts: AudioContext[] = [];
    globalThis.audioContexts = contexts;
    globalThis.AudioContext = class extends AudioContext {
      public constructor(options?: AudioContextOptions) {
        super(options);
        contexts.push(this);
      }
    };
  });
}

/**
 * @param page Playwright page set up with `trackAudioContexts`.
 * @returns The state of every AudioContext the page created.
 */
async function audioStates(page: Page): Promise<string[]> {
  return page.evaluate(() =>
    (globalThis.audioContexts ?? []).map((context) => context.state),
  );
}

/**
 * @param url An absolute URL, or `null`.
 * @returns The last path segment of the URL.
 */
function fileName(url: string | null): string {
  return new URL(url ?? "about:blank").pathname.split("/").at(-1) ?? "";
}

/**
 * Load a file the way a browser would.
 * @param page Playwright page.
 * @param path Site-relative path.
 * @returns The response status and content type.
 */
async function fetchAsset(
  page: Page,
  path: string,
): Promise<{ status: number | undefined; contentType: string | undefined }> {
  const response = await page.goto(path);
  return {
    status: response?.status(),
    contentType: response?.headers()["content-type"],
  };
}

/**
 * Tap on touch devices and click elsewhere, as a player would.
 * @param target Element to activate.
 * @param hasTouch Whether the browser emulates a touch screen.
 */
async function press(target: Locator, hasTouch: boolean): Promise<void> {
  await (hasTouch ? target.tap() : target.click());
}

export {
  answerQuestion,
  audioStates,
  fetchAsset,
  fileName,
  playToEnd,
  press,
  startGame,
  trackAudioContexts,
};
