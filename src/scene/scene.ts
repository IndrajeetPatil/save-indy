import {
  EXPLORER_HEIGHT,
  drawExplorer,
  drawSnake,
  paintSprites,
  whipHand,
} from "./actors.ts";
import type { Pose } from "./actors.ts";
import {
  FLOOR_Y,
  SCENE_HEIGHT,
  SCENE_WIDTH,
  paintBackground,
} from "./background.ts";
import { drawDust, drawSparkles, drawTorches, drawWhip } from "./effects.ts";
import { context2d } from "./pixels.ts";
import type { Point } from "./pixels.ts";

/** What just happened, which decides the animation to play. */
type Cue = "reset" | "correct" | "wrong" | "won" | "lost";

const EXPLORER = { x: 72, y: FLOOR_Y + 7 - EXPLORER_HEIGHT } as const;
const SNAKE_Y = FLOOR_Y + 4;
/** Head x at threat 0 (off-screen) and at threat 100 (biting Indy). */
const SNAKE_SAFE_X = -12;
const SNAKE_BITE_X = 64;
const SNAKE_FLED_X = -80;

const MOVE_SECONDS = 0.45;
const FLEE_SECONDS = 1.4;
const POSE_SECONDS = 0.5;
const WHIP_START = 0.06;
const WHIP_END = 0.32;
const SHAKE_SECONDS = 0.3;

const SPARKLE_ORIGIN = { x: EXPLORER.x - 8, y: EXPLORER.y - 6 } as const;

interface Tween {
  readonly from: number;
  readonly to: number;
  readonly start: number;
  readonly duration: number;
  readonly overshoot: boolean;
}

const snakeXForThreat = (threat: number) =>
  SNAKE_SAFE_X + ((SNAKE_BITE_X - SNAKE_SAFE_X) * threat) / 100;

/**
 * Ease out, optionally overshooting the target a little like a strike.
 * @param progress Linear progress from 0 to 1.
 * @param overshoot Whether to overshoot and settle back.
 * @returns Eased progress.
 */
function ease(progress: number, overshoot: boolean): number {
  if (!overshoot) {
    return 1 - (1 - progress) ** 3;
  }
  const back = 1.7;
  const shifted = progress - 1;
  return 1 + (back + 1) * shifted ** 3 + back * shifted ** 2;
}

/**
 * @param tween Snake movement.
 * @param seconds Current time.
 * @returns The snake head's x position at that time.
 */
function tweenValue(tween: Tween, seconds: number): number {
  const { from, to, start, duration, overshoot } = tween;
  const linear =
    duration === 0 ? 1 : Math.min(Math.max((seconds - start) / duration, 0), 1);
  return from + (to - from) * ease(linear, overshoot);
}

/**
 * @param cue What happened.
 * @param elapsed Seconds since it happened.
 * @returns Indy's pose.
 */
function poseFor(cue: Cue, elapsed: number): Pose {
  const reacting = elapsed < POSE_SECONDS;
  const poses: Record<Cue, Pose> = {
    reset: "idle",
    correct: reacting ? "whip" : "idle",
    wrong: reacting ? "hurt" : "idle",
    won: "cheer",
    lost: "fainted",
  };
  return poses[cue];
}

/**
 * @param time Animation clock in seconds.
 * @returns Indy's position, rising and falling gently as he breathes.
 */
function explorerAt(time: number): Point {
  const breathing = Math.floor(time * 1.6) % 2;
  return { x: EXPLORER.x, y: EXPLORER.y + breathing };
}

/**
 * @param cue What happened.
 * @param elapsed Seconds since it happened.
 * @returns How far the snake rears up while it strikes.
 */
function rearHeight(cue: Cue, elapsed: number): number {
  if (cue !== "wrong" || elapsed >= MOVE_SECONDS) {
    return 0;
  }
  return Math.round(Math.sin((elapsed / MOVE_SECONDS) * Math.PI) * 5);
}

function drawShadows(
  context: CanvasRenderingContext2D,
  snakeX: number,
  lying: boolean,
) {
  context.fillStyle = "rgba(0, 0, 0, 0.35)";
  const indyX = lying ? EXPLORER.x - 8 : EXPLORER.x + 1;
  context.fillRect(indyX, FLOOR_Y + 6, lying ? 30 : 14, 2);
  context.fillRect(Math.round(snakeX) - 44, SNAKE_Y + 5, 52, 1);
}

/**
 * The animated temple: Indy stands centre stage while the snake advances or
 * retreats with the threat level. Rendered at 160 x 120 and scaled with CSS.
 */
class Scene {
  readonly #context: CanvasRenderingContext2D;
  readonly #background = paintBackground();
  readonly #sprites = paintSprites();
  readonly #reducedMotion: boolean;
  #tween: Tween = {
    from: snakeXForThreat(50),
    to: snakeXForThreat(50),
    start: 0,
    duration: 0,
    overshoot: false,
  };
  #cue: Cue = "reset";
  #cueStart = Number.NEGATIVE_INFINITY;
  #now = 0;

  public constructor(canvas: HTMLCanvasElement, reducedMotion: boolean) {
    canvas.width = SCENE_WIDTH;
    canvas.height = SCENE_HEIGHT;
    this.#context = context2d(canvas);
    this.#context.imageSmoothingEnabled = false;
    this.#reducedMotion = reducedMotion;
  }

  /** @returns The snake head's current x position. */
  // fallow-ignore-next-line unused-class-member -- tests observe the tween here
  public get snakeX(): number {
    return tweenValue(this.#tween, this.#now);
  }

  /**
   * Animate to a new threat level.
   * @param threat Threat on the 0-100 scale.
   * @param cue What caused the change.
   */
  // fallow-ignore-next-line unused-class-member -- called via the Stage type
  public update(threat: number, cue: Cue): void {
    const instant = cue === "reset" || this.#reducedMotion;
    this.#tween = {
      from: tweenValue(this.#tween, this.#now),
      to: cue === "won" ? SNAKE_FLED_X : snakeXForThreat(threat),
      start: this.#now,
      duration: instant ? 0 : this.#moveSeconds(cue),
      overshoot: cue === "wrong",
    };
    this.#cue = cue;
    this.#cueStart = this.#now;
  }

  /** Render a frame on every display refresh. */
  public start(): void {
    const loop = (milliseconds: number) => {
      this.render(milliseconds / 1000);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  /**
   * Draw one frame.
   * @param seconds Time from a monotonic clock.
   */
  public render(seconds: number): void {
    this.#now = seconds;
    const context = this.#context;
    // Idle motion (slithering, flames, dust) freezes under reduced motion.
    const time = this.#reducedMotion ? 0 : seconds;
    const elapsed = seconds - this.#cueStart;
    const snakeHead = {
      x: tweenValue(this.#tween, seconds),
      y: SNAKE_Y - rearHeight(this.#cue, elapsed),
    };
    // Repaint the whole canvas before any shake offset, so the strip a shifted
    // frame leaves uncovered never shows an earlier frame.
    context.drawImage(this.#background, 0, 0);
    context.save();
    this.#shake(elapsed);
    context.drawImage(this.#background, 0, 0);
    drawTorches(context, time);
    drawShadows(context, snakeHead.x, this.#cue === "lost");
    drawSnake(context, this.#sprites, { head: snakeHead, time });
    drawExplorer(context, this.#sprites, {
      pose: poseFor(this.#cue, elapsed),
      position: explorerAt(time),
      time,
    });
    this.#crackWhip(elapsed, snakeHead);
    if (this.#cue === "won") {
      drawSparkles(context, SPARKLE_ORIGIN, time);
    }
    drawDust(context, time);
    context.restore();
  }

  #moveSeconds(cue: Cue): number {
    // The snake slinks away slowly in defeat, but moves fast while fighting.
    return cue === "won" && !this.#reducedMotion ? FLEE_SECONDS : MOVE_SECONDS;
  }

  #shake(elapsed: number): void {
    const shaking =
      this.#cue === "wrong" && !this.#reducedMotion && elapsed < SHAKE_SECONDS;
    if (shaking) {
      this.#context.translate(Math.round(Math.sin(elapsed * 90) * 2), 0);
    }
  }

  #crackWhip(elapsed: number, snakeHead: Point): void {
    const cracking =
      this.#cue === "correct" && elapsed >= WHIP_START && elapsed <= WHIP_END;
    if (cracking) {
      drawWhip(this.#context, {
        hand: whipHand(EXPLORER),
        tip: { x: snakeHead.x + 6, y: snakeHead.y + 1 },
        elapsed: elapsed - WHIP_START,
      });
    }
  }
}

export type { Cue };
export { Scene };
