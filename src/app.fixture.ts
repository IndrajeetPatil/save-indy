import { vi } from "vite-plus/test";
import type { Mock } from "vite-plus/test";

import page from "../index.html?raw";
import { startApp } from "./app.ts";
import type { Sound } from "./app.ts";
import { STEPS_TO_WIN } from "./config.ts";
import type { Question } from "./questions.ts";

const question = (
  index: number,
  level: Question["level"] = "beginner",
): Question => ({
  level,
  prompt: `What is \`${index}\`?`,
  answers: ["right", "wrong 1", "wrong 2", "wrong 3"],
  correct: "right",
  explanation: `It is \`${index}\`.`,
});

const BANK: readonly Question[] = [
  ...Array.from({ length: 12 }, (_slot, index) => question(index)),
  ...Array.from({ length: 3 }, (_slot, index) =>
    question(50 + index, "advanced"),
  ),
];

// Keeps answers in their written order, so the right one is always first.
const inOrder = (): number => 0;

const byId = (id: string): HTMLElement => {
  const element = document.querySelector<HTMLElement>(`#${id}`);
  if (element === null) {
    throw new Error(`#${id} is missing`);
  }
  return element;
};

const answers = (): HTMLButtonElement[] => [
  ...document.querySelectorAll<HTMLButtonElement>(".answer"),
];

const clickAnswer = (choice: string): void => {
  answers()
    .find((button) => button.dataset["choice"] === choice)
    ?.click();
};

const continueGame = (): void => {
  byId("next-button").click();
};

interface Fixture {
  readonly stage: {
    readonly update: Mock<(threat: number, cue: string) => void>;
  };
  readonly sound: Sound;
  readonly onMuteChange: Mock<(muted: boolean) => void>;
}

const setup = (): Fixture => {
  const parsed = new DOMParser().parseFromString(page, "text/html");
  document.body.replaceChildren(...parsed.body.childNodes);
  const stage = { update: vi.fn<(threat: number, cue: string) => void>() };
  const sound: Sound = {
    muted: false,
    whip: vi.fn<() => void>(),
    hiss: vi.fn<() => void>(),
    win: vi.fn<() => void>(),
    lose: vi.fn<() => void>(),
  };
  const onMuteChange = vi.fn<(muted: boolean) => void>();
  startApp({
    root: document,
    stage,
    sound,
    onMuteChange,
    bank: BANK,
    random: inOrder,
  });
  return { stage, sound, onMuteChange };
};

const start = (): void => {
  byId("start-form").querySelector<HTMLButtonElement>("button")?.click();
};

const playToEnd = (choice: string): void => {
  for (let turn = 0; turn < STEPS_TO_WIN; turn += 1) {
    clickAnswer(choice);
    continueGame();
  }
};

const press = (key: string, options: KeyboardEventInit = {}): void => {
  document.dispatchEvent(
    new KeyboardEvent("keydown", { key, bubbles: true, ...options }),
  );
};

export {
  answers,
  byId,
  clickAnswer,
  continueGame,
  playToEnd,
  press,
  setup,
  start,
};
