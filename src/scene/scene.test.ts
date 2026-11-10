import { describe, expect, test, vi } from "vite-plus/test";

import { SCENE_HEIGHT, SCENE_WIDTH, paintBackground } from "./background.ts";
import { Scene } from "./scene.ts";
import type { Cue } from "./scene.ts";

const makeScene = (reducedMotion = false) => {
  const canvas = document.createElement("canvas");
  return { canvas, scene: new Scene(canvas, reducedMotion) };
};

const countTransparent = (data: Uint8ClampedArray | readonly number[]) =>
  data.filter((value, index) => index % 4 === 3 && value < 255).length;

/** Threat that each cue animates towards. */
const THREAT_FOR: Record<Cue, number> = {
  reset: 70,
  correct: 70,
  wrong: 70,
  won: 0,
  lost: 70,
};

const pixels = (canvas: HTMLCanvasElement) =>
  canvas.getContext("2d")?.getImageData(0, 0, canvas.width, canvas.height)
    .data ?? [];

describe(paintBackground, () => {
  test("is fully opaque, so no earlier frame can show through", () => {
    const background = paintBackground();

    expect(countTransparent(pixels(background))).toBe(0);
  });
});

describe(Scene, () => {
  test("renders at the logical pixel-art resolution", () => {
    const { canvas, scene } = makeScene();

    scene.render(0);

    expect([canvas.width, canvas.height]).toStrictEqual([
      SCENE_WIDTH,
      SCENE_HEIGHT,
    ]);
  });

  test("moves the snake closer as the threat rises and back as it falls", () => {
    const { scene } = makeScene();
    scene.render(0);
    const start = scene.snakeX;

    scene.update(80, "wrong");
    scene.render(5);
    const closer = scene.snakeX;
    scene.update(20, "correct");
    scene.render(10);

    expect(closer).toBeGreaterThan(start);
    expect(scene.snakeX).toBeLessThan(start);
  });

  test("animates moves over time unless motion is reduced", () => {
    const animated = makeScene().scene;
    const reduced = makeScene(true).scene;
    for (const { scene } of [{ scene: animated }, { scene: reduced }]) {
      scene.render(0);
      scene.update(100, "wrong");
      scene.render(0.05);
    }

    expect(reduced.snakeX).toBeGreaterThan(animated.snakeX);
  });

  test("chases the snake off-screen when Indy wins", () => {
    const { scene } = makeScene();
    scene.render(0);

    scene.update(0, "won");
    scene.render(10);

    expect(scene.snakeX).toBeLessThan(-SCENE_WIDTH / 4);
  });

  test.each<Cue>(["reset", "correct", "wrong", "won", "lost"])(
    "draws every moment of the %s animation",
    (cue) => {
      const { canvas, scene } = makeScene();
      scene.render(0);
      const before = pixels(canvas).join(",");

      scene.update(THREAT_FOR[cue], cue);
      for (let seconds = 0; seconds <= 1.5; seconds += 0.05) {
        scene.render(seconds);
      }

      expect(pixels(canvas).join(",")).not.toBe(before);
    },
  );

  test("draws continuously once started", async () => {
    const { canvas, scene } = makeScene();
    scene.start();

    await vi.waitFor(() => {
      expect(countTransparent(pixels(canvas))).toBe(0);
    });
  });
});
