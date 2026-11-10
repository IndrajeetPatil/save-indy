import {
  COLOURS,
  EXPLORER_BODY,
  PALETTE,
  SNAKE_BAND,
  SNAKE_HEAD,
  SNAKE_SEGMENT,
  SNAKE_TAIL,
  STAR,
} from "./art.ts";
import { context2d, makeCanvas, paintSprite, pixelLine } from "./pixels.ts";
import type { Point } from "./pixels.ts";

type Pose = "idle" | "whip" | "hurt" | "cheer" | "fainted";
type StandingPose = Exclude<Pose, "fainted">;

/** Sprite-local hand positions for each standing pose: left, then right. */
const HANDS: Record<StandingPose, readonly [Point, Point]> = {
  idle: [
    { x: 3, y: 18 },
    { x: 12, y: 18 },
  ],
  whip: [
    { x: -3, y: 6 },
    { x: 12, y: 18 },
  ],
  hurt: [
    { x: 1, y: 14 },
    { x: 14, y: 14 },
  ],
  cheer: [
    { x: 0, y: 3 },
    { x: 15, y: 3 },
  ],
};
const SHOULDERS: readonly [Point, Point] = [
  { x: 3, y: 12 },
  { x: 12, y: 12 },
];

/** Room around the body sprite for raised arms. */
const MARGIN = 5;
const EXPLORER_WIDTH = EXPLORER_BODY[0].length;
const EXPLORER_HEIGHT = EXPLORER_BODY.length;

const SNAKE_SEGMENTS = 24;
const SEGMENT_SPACING = 2;
const SNAKE_HEAD_WIDTH = SNAKE_HEAD[0].length;

interface Sprites {
  readonly body: HTMLCanvasElement;
  readonly head: HTMLCanvasElement;
  readonly segment: HTMLCanvasElement;
  readonly band: HTMLCanvasElement;
  readonly tail: HTMLCanvasElement;
  readonly star: HTMLCanvasElement;
  /** Scratch canvas for composing the explorer before tinting or rotating. */
  readonly figure: HTMLCanvasElement;
}

/**
 * Paint every sprite once.
 * @returns Canvases for each sprite.
 */
function paintSprites(): Sprites {
  return {
    body: paintSprite(EXPLORER_BODY, PALETTE),
    head: paintSprite(SNAKE_HEAD, PALETTE),
    segment: paintSprite(SNAKE_SEGMENT, PALETTE),
    band: paintSprite(SNAKE_BAND, PALETTE),
    tail: paintSprite(SNAKE_TAIL, PALETTE),
    star: paintSprite(STAR, PALETTE),
    figure: makeCanvas(EXPLORER_WIDTH + MARGIN * 2, EXPLORER_HEIGHT + MARGIN),
  };
}

function drawArm(context: CanvasRenderingContext2D, from: Point, to: Point) {
  context.fillStyle = COLOURS.outline;
  pixelLine(context, { from, to, size: 3 });
  context.fillRect(to.x - 2, to.y - 2, 4, 4);
  context.fillStyle = COLOURS.jacket;
  pixelLine(context, { from, to, size: 1 });
  context.fillStyle = COLOURS.skin;
  context.fillRect(to.x - 1, to.y - 1, 2, 2);
}

function tintRed(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  context.globalCompositeOperation = "source-atop";
  context.fillStyle = "rgba(220, 40, 30, 0.55)";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.globalCompositeOperation = "source-over";
}

function composeFigure(sprites: Sprites, pose: StandingPose) {
  const { figure } = sprites;
  const context = context2d(figure);
  context.clearRect(0, 0, figure.width, figure.height);
  context.drawImage(sprites.body, MARGIN, MARGIN);
  const shift = (point: Point) => ({
    x: point.x + MARGIN,
    y: point.y + MARGIN,
  });
  const [leftHand, rightHand] = HANDS[pose];
  drawArm(context, shift(SHOULDERS[0]), shift(leftHand));
  drawArm(context, shift(SHOULDERS[1]), shift(rightHand));
  if (pose === "hurt") {
    tintRed(context, figure);
  }
  return figure;
}

/**
 * @param position Top-left of the explorer's body sprite.
 * @returns Where the whip hand is, in scene coordinates.
 */
function whipHand(position: Point): Point {
  const [hand] = HANDS.whip;
  return { x: position.x + hand.x, y: position.y + hand.y };
}

function drawStars(
  context: CanvasRenderingContext2D,
  star: HTMLCanvasElement,
  orbit: { readonly centre: Point; readonly time: number },
) {
  const count = 3;
  for (let index = 0; index < count; index += 1) {
    const angle = orbit.time * 3 + (index * Math.PI * 2) / count;
    context.drawImage(
      star,
      Math.round(orbit.centre.x + Math.cos(angle) * 6 - 1),
      Math.round(orbit.centre.y + Math.sin(angle) * 2 - 1),
    );
  }
}

/**
 * Draw the explorer standing, or lying down with circling stars.
 * @param context Scene canvas.
 * @param sprites Painted sprites.
 * @param actor Pose, top-left of the standing body sprite, and clock.
 * @param actor.pose What the explorer is doing.
 * @param actor.position Top-left of the body sprite when standing.
 * @param actor.time Animation clock in seconds.
 */
function drawExplorer(
  context: CanvasRenderingContext2D,
  sprites: Sprites,
  actor: {
    readonly pose: Pose;
    readonly position: Point;
    readonly time: number;
  },
): void {
  const { pose, position, time } = actor;
  if (pose !== "fainted") {
    const figure = composeFigure(sprites, pose);
    context.drawImage(figure, position.x - MARGIN, position.y - MARGIN);
    return;
  }
  const figure = composeFigure(sprites, "idle");
  context.save();
  context.translate(position.x - 6, position.y + EXPLORER_HEIGHT + MARGIN);
  context.rotate(-Math.PI / 2);
  context.drawImage(figure, 0, 0);
  context.restore();
  drawStars(context, sprites.star, {
    centre: { x: position.x - 1, y: position.y + 13 },
    time,
  });
}

function drawTongue(context: CanvasRenderingContext2D, head: Point) {
  const x = Math.round(head.x) + SNAKE_HEAD_WIDTH;
  const y = Math.round(head.y) + 3;
  context.fillStyle = COLOURS.tongue;
  context.fillRect(x, y, 2, 1);
  context.fillRect(x + 2, y - 1, 1, 1);
  context.fillRect(x + 2, y + 1, 1, 1);
}

/**
 * Draw the snake slithering along the floor, head to the right.
 * @param context Scene canvas.
 * @param sprites Painted sprites.
 * @param snake Top-left of the head sprite and the animation clock.
 * @param snake.head Top-left of the head sprite.
 * @param snake.time Animation clock in seconds.
 */
function drawSnake(
  context: CanvasRenderingContext2D,
  sprites: Sprites,
  snake: { readonly head: Point; readonly time: number },
): void {
  const { head, time } = snake;
  const tailX = Math.round(head.x - SNAKE_SEGMENTS * SEGMENT_SPACING);
  context.drawImage(sprites.tail, tailX + 1, Math.round(head.y) + 2);
  for (let index = SNAKE_SEGMENTS - 1; index >= 1; index -= 1) {
    const wave = Math.sin(time * 5 - index * 0.5) * Math.min(index / 4, 2);
    const sprite = index % 4 === 0 ? sprites.band : sprites.segment;
    context.drawImage(
      sprite,
      Math.round(head.x - index * SEGMENT_SPACING),
      Math.round(head.y + 1 + wave),
    );
  }
  context.drawImage(sprites.head, Math.round(head.x), Math.round(head.y));
  if (time % 1.6 < 0.25) {
    drawTongue(context, head);
  }
}

export type { Pose, Sprites };
export { EXPLORER_HEIGHT, drawExplorer, drawSnake, paintSprites, whipHand };
