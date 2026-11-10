import { beforeEach, describe, expect, test } from "vite-plus/test";

import {
  byId,
  clickAnswer,
  continueGame,
  playToEnd,
  setup,
  start,
} from "./app.fixture.ts";
import { STEPS_TO_WIN } from "./config.ts";

beforeEach(() => {
  document.body.replaceChildren();
});

describe("end screen", () => {
  test("celebrates a win", () => {
    const { stage, sound } = setup();
    start();

    playToEnd("right");

    expect(sound.win).toHaveBeenCalledOnce();
    expect(stage.update).toHaveBeenCalledWith(0, "won");
    expect(document.activeElement).toBe(byId("result"));
  });

  test("summarises a perfect round with nothing to revisit", () => {
    setup();
    start();

    playToEnd("right");

    expect({
      shown: byId("end-screen").checkVisibility(),
      result: byId("result").textContent,
      summary: byId("summary").textContent,
      review: byId("review").checkVisibility(),
    }).toStrictEqual({
      shown: true,
      result: "You saved Indy!",
      summary: "Beginner: 5/5 correct (100%)",
      review: false,
    });
  });

  test("lists the missed questions after a loss", () => {
    const { sound } = setup();
    start();

    playToEnd("wrong 1");

    expect(sound.lose).toHaveBeenCalledOnce();
    expect(byId("result").textContent).toBe("The snake got Indy!");
    expect(byId("review").hidden).toBe(false);
    expect(byId("review-list").children).toHaveLength(STEPS_TO_WIN);
    expect(byId("review-list").textContent).toContain("Answer: right");
  });

  test("admits when the questions run out", () => {
    setup();
    document
      .querySelector<HTMLInputElement>("input[value='advanced']")
      ?.click();
    start();

    for (const choice of ["right", "wrong 1", "right"]) {
      clickAnswer(choice);
      continueGame();
    }

    expect(byId("result").textContent).toMatch(/^Out of questions/u);
  });

  test("plays the same level again", () => {
    const { stage } = setup();
    start();
    playToEnd("right");

    byId("play-again").click();

    expect(byId("question-screen").hidden).toBe(false);
    expect(byId("progress").textContent).toBe("Beginner · Q1 · correct: 0");
    expect(stage.update).toHaveBeenLastCalledWith(50, "reset");
  });

  test("returns to the level picker", () => {
    setup();
    start();
    playToEnd("right");

    byId("change-level").click();

    expect(byId("start-screen").hidden).toBe(false);
    expect(document.activeElement).toBe(
      document.querySelector("input[value='beginner']"),
    );
  });
});
