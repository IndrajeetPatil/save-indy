import { beforeEach, describe, expect, test } from "vite-plus/test";

import {
  answers,
  byId,
  clickAnswer,
  continueGame,
  press,
  setup,
  start,
} from "./app.fixture.ts";

beforeEach(() => {
  document.body.replaceChildren();
});

describe("start screen", () => {
  test("offers every level with its question count", () => {
    setup();

    const levels = [...document.querySelectorAll(".level-card")].map(
      (card) => card.textContent,
    );

    expect(levels).toStrictEqual([
      expect.stringContaining("12 questions"),
      expect.stringContaining("0 questions"),
      expect.stringContaining("3 questions"),
    ]);
    expect(byId("start-screen").hidden).toBe(false);
  });

  test("starts the chosen level and focuses the question", () => {
    const { stage } = setup();
    document
      .querySelector<HTMLInputElement>("input[value='advanced']")
      ?.click();

    start();

    expect(byId("question-screen").hidden).toBe(false);
    expect(byId("progress").textContent).toContain("Advanced");
    expect(document.activeElement).toBe(byId("question"));
    expect(byId("question").querySelector("code")?.textContent).toMatch(/^5/u);
    expect(stage.update).toHaveBeenLastCalledWith(50, "reset");
  });
});

describe("answering", () => {
  test("a right answer cracks the whip and updates the stats", () => {
    const { stage, sound } = setup();
    start();

    clickAnswer("right");

    expect(sound.whip).toHaveBeenCalledOnce();
    expect(stage.update).toHaveBeenLastCalledWith(40, "correct");
    expect({
      threat: byId("threat-meter").getAttribute("aria-valuenow"),
      health: byId("health-meter").getAttribute("aria-valuenow"),
    }).toStrictEqual({ threat: "40", health: "60" });
  });

  test("an answer locks the choices and explains", () => {
    setup();
    start();

    clickAnswer("right");

    expect({
      verdict: byId("verdict").textContent.startsWith("Correct!"),
      explanation: byId("explanation").textContent,
      announced: byId("announcer").textContent.endsWith("It is 0."),
    }).toStrictEqual({
      verdict: true,
      explanation: "It is 0.",
      announced: true,
    });
    expect(answers().every((button) => button.disabled)).toBe(true);
    expect(document.activeElement).toBe(byId("next-button"));
  });

  test("a wrong answer lets the snake lunge and shows the right answer", () => {
    const { stage, sound } = setup();
    start();

    clickAnswer("wrong 2");

    expect(sound.hiss).toHaveBeenCalledOnce();
    expect(stage.update).toHaveBeenLastCalledWith(60, "wrong");
    expect(document.querySelector(".is-wrong")?.textContent).toContain(
      "wrong 2",
    );
    expect(document.querySelector(".is-correct")?.textContent).toContain(
      "right",
    );
  });

  test("number keys pick answers while focus is in the question", () => {
    const { sound } = setup();
    start();
    press("1", { ctrlKey: true });
    press("x");

    expect(sound.whip).not.toHaveBeenCalled();

    press("1");

    expect(sound.whip).toHaveBeenCalledOnce();
  });

  test("number keys do nothing while focus is elsewhere", () => {
    const { sound } = setup();
    press("1");
    start();
    byId("mute-toggle").focus();

    press("1");

    expect(sound.whip).not.toHaveBeenCalled();
    expect(byId("feedback").hidden).toBe(true);
  });

  test("names the right answer after a miss, not just by colour", () => {
    setup();
    start();

    clickAnswer("wrong 2");

    expect({
      reveal: byId("right-answer").textContent,
      revealShown: byId("right-answer").hidden,
      right: document.querySelector(".is-correct")?.textContent,
      wrong: document.querySelector(".is-wrong")?.textContent,
      announced: byId("announcer").textContent.includes("Right answer: right"),
    }).toStrictEqual({
      reveal: "Right answer: right",
      revealShown: false,
      right: "right (right answer)",
      wrong: "wrong 2 (your answer)",
      announced: true,
    });
  });

  test("keeps the reveal hidden after a right answer", () => {
    setup();
    start();

    clickAnswer("right");

    expect(byId("right-answer").hidden).toBe(true);
  });

  test("moves on to the next question", () => {
    setup();
    start();
    clickAnswer("right");

    continueGame();

    expect(byId("progress").textContent).toBe("Beginner · Q2 · correct: 1");
    expect(byId("feedback").hidden).toBe(true);
    expect(answers().some((button) => button.disabled)).toBe(false);
  });
});

describe("sound toggle", () => {
  test("shows the speaker icon that matches the setting", () => {
    setup();
    const mute = byId("mute-toggle");
    const iconPath = () => mute.querySelector("path")?.getAttribute("d");
    const soundOn = iconPath();

    mute.click();

    expect(iconPath()).not.toBe(soundOn);
    expect(document.querySelector("[data-icon]")).toBeNull();
  });

  test("mutes and unmutes, remembering the choice", () => {
    const { sound, onMuteChange } = setup();
    const mute = byId("mute-toggle");

    mute.click();

    expect(sound.muted).toBe(true);
    expect(mute.getAttribute("aria-pressed")).toBe("true");
    expect(onMuteChange).toHaveBeenLastCalledWith(true);

    mute.click();

    expect(mute.getAttribute("aria-pressed")).toBe("false");
    expect(onMuteChange).toHaveBeenLastCalledWith(false);
  });
});
