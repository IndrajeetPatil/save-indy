import { describe, expect, test } from "vite-plus/test";

import { LEVELS, STEPS_TO_WIN } from "./config.ts";
import { QUESTIONS } from "./questions.ts";

const countBackticks = (text: string) => text.split("`").length - 1;

describe("question bank", () => {
  test.each([...QUESTIONS])(
    "$prompt has four distinct answers including the correct one",
    (question) => {
      expect(question.answers).toHaveLength(4);
      expect(new Set(question.answers).size).toBe(4);
      expect(question.answers).toContain(question.correct);
      expect(question.explanation.trim()).not.toBe("");
    },
  );

  test("prompts and explanations pair their code backticks", () => {
    const unbalanced = QUESTIONS.flatMap((question) => [
      question.prompt,
      question.explanation,
    ]).filter((text) => countBackticks(text) % 2 !== 0);

    expect(unbalanced).toStrictEqual([]);
  });

  test("prompts are unique", () => {
    const prompts = QUESTIONS.map((question) => question.prompt);

    expect(new Set(prompts).size).toBe(prompts.length);
  });

  test.each(LEVELS)(
    "%s has enough questions to decide a game either way",
    (level) => {
      const count = QUESTIONS.filter(
        (question) => question.level === level,
      ).length;

      // Alternating right and wrong answers is the longest undecided run.
      expect(count).toBeGreaterThanOrEqual(STEPS_TO_WIN * 2 - 1);
    },
  );
});
