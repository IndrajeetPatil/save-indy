import { describe, expect, test } from "vite-plus/test";

import { MAX_STAT, START_STAT, STAT_STEP, STEPS_TO_WIN } from "./config.ts";
import {
  answer,
  createGame,
  currentRound,
  lastAnswerCorrect,
  nextQuestion,
  outcome,
} from "./game.ts";
import type { GameState } from "./game.ts";
import type { Question } from "./questions.ts";

const question = (index: number, level: Question["level"] = "beginner") => ({
  level,
  prompt: `Question ${index}`,
  answers: ["right", "wrong 1", "wrong 2", "wrong 3"],
  correct: "right",
  explanation: `Because ${index}.`,
});

const BANK: readonly Question[] = [
  ...Array.from({ length: 12 }, (_slot, index) => question(index)),
  question(100, "advanced"),
];

const play = (state: GameState, choices: readonly string[]) => {
  let current = state;
  for (const choice of choices) {
    current = nextQuestion(answer(current, choice));
  }
  return current;
};

const byText = (first: string, second: string) => first.localeCompare(second);

describe(createGame, () => {
  test("asks only the chosen level's questions, starting even", () => {
    const state = createGame("beginner", BANK);

    expect(state.rounds).toHaveLength(12);
    expect(
      state.rounds.every((round) => round.question.level === "beginner"),
    ).toBe(true);
    expect(state).toMatchObject({
      threat: START_STAT,
      health: START_STAT,
      index: 0,
      correct: 0,
      choice: null,
    });
  });

  test("shuffles answers without losing any", () => {
    const { answers, question: asked } = currentRound(
      createGame("advanced", BANK),
    );

    expect(answers.toSorted(byText)).toStrictEqual(
      asked.answers.toSorted(byText),
    );
  });

  test("refuses a level without questions", () => {
    expect(() => createGame("intermediate", BANK)).toThrow(/intermediate/u);
  });
});

describe(answer, () => {
  test("a right answer lowers the threat and restores health", () => {
    const state = answer(createGame("beginner", BANK), "right");

    expect(state).toMatchObject({
      threat: START_STAT - STAT_STEP,
      health: START_STAT + STAT_STEP,
      correct: 1,
    });
    expect(lastAnswerCorrect(state)).toBe(true);
  });

  test("a wrong answer raises the threat, costs health, and is kept for review", () => {
    const start = createGame("beginner", BANK);
    const state = answer(start, "wrong 1");

    expect(state).toMatchObject({
      threat: START_STAT + STAT_STEP,
      health: START_STAT - STAT_STEP,
      missed: [currentRound(start).question],
    });
    expect(lastAnswerCorrect(state)).toBe(false);
  });

  test("ignores a second answer to the same question", () => {
    const once = answer(createGame("beginner", BANK), "right");

    expect(answer(once, "wrong 1")).toBe(once);
  });

  test("never pushes a stat past the top of the scale", () => {
    const high = { ...createGame("beginner", BANK), health: MAX_STAT };

    expect(answer(high, "right").health).toBe(MAX_STAT);
  });
});

describe(outcome, () => {
  test(`is a win after ${STEPS_TO_WIN} more right answers than wrong`, () => {
    const almost = play(
      createGame("beginner", BANK),
      Array.from({ length: STEPS_TO_WIN - 1 }, () => "right"),
    );

    expect(outcome(almost)).toBe("playing");
    expect(outcome(answer(almost, "right"))).toBe("won");
  });

  test(`is a loss after ${STEPS_TO_WIN} more wrong answers than right`, () => {
    const state = play(
      createGame("beginner", BANK),
      Array.from({ length: STEPS_TO_WIN }, () => "wrong 1"),
    );

    expect(outcome(state)).toBe("lost");
    expect(state.health).toBe(0);
  });

  test("runs out of questions when the last one leaves the game undecided", () => {
    const state = answer(createGame("advanced", BANK), "right");

    expect(outcome(state)).toBe("out-of-questions");
  });
});

describe(nextQuestion, () => {
  test("moves on only after an answer", () => {
    const start = createGame("beginner", BANK);

    expect(nextQuestion(start)).toBe(start);
    expect(nextQuestion(answer(start, "right"))).toMatchObject({
      index: 1,
      choice: null,
    });
  });

  test("stays put once the game is over", () => {
    const over = answer(createGame("advanced", BANK), "right");

    expect(nextQuestion(over)).toBe(over);
  });
});

describe(currentRound, () => {
  test("rejects an index past the last question", () => {
    const state = { ...createGame("advanced", BANK), index: 5 };

    expect(() => currentRound(state)).toThrow(RangeError);
  });
});
