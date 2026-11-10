import { expect } from "@playwright/test";
import type { Page } from "@playwright/test";

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

export { answerQuestion, playToEnd, startGame };
