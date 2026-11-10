import { COLOURS } from "./art.ts";
import { SCENE_WIDTH, TORCHES } from "./background.ts";
import { pixelLine } from "./pixels.ts";
import type { Point } from "./pixels.ts";

/** How long the whip takes to reach the snake, in seconds. */
const WHIP_REACH_SECONDS = 0.12;
const WHIP_SEGMENTS = 12;
const WHIP_ARC = 14;

/**
 * Draw flickering torch flames and the warm light they cast.
 * @param context Scene canvas.
 * @param time Animation clock in seconds.
 */
function drawTorches(context: CanvasRenderingContext2D, time: number): void {
  for (const [index, torch] of TORCHES.entries()) {
    const flicker =
      Math.sin(time * 9 + index * 2) + Math.sin(time * 23 + index);
    const glow = context.createRadialGradient(
      torch.x,
      torch.y,
      1,
      torch.x,
      torch.y,
      30 + flicker * 2,
    );
    glow.addColorStop(0, "rgba(255, 170, 70, 0.32)");
    glow.addColorStop(1, "rgba(255, 170, 70, 0)");
    context.fillStyle = glow;
    context.fillRect(torch.x - 34, torch.y - 34, 68, 68);
    const tip = Math.round(flicker / 2);
    context.fillStyle = COLOURS.flameOuter;
    context.fillRect(torch.x - 2, torch.y - 3, 5, 5);
    context.fillRect(torch.x - 1, torch.y - 6 + tip, 3, 3);
    context.fillStyle = COLOURS.flameInner;
    context.fillRect(torch.x - 1, torch.y - 2, 3, 3);
    context.fillRect(torch.x, torch.y - 4 + tip, 1, 2);
  }
}

function drawSpark(context: CanvasRenderingContext2D, tip: Point): void {
  context.fillStyle = COLOURS.spark;
  pixelLine(context, {
    from: { x: tip.x - 3, y: tip.y },
    to: { x: tip.x + 3, y: tip.y },
    size: 1,
  });
  pixelLine(context, {
    from: { x: tip.x, y: tip.y - 3 },
    to: { x: tip.x, y: tip.y + 3 },
    size: 1,
  });
}

/**
 * Draw the whip unfurling in an arc from Indy's hand, cracking at the tip.
 * @param context Scene canvas.
 * @param whip Hand and tip positions and the seconds since the swing began.
 * @param whip.hand Where the whip starts.
 * @param whip.tip Where the whip cracks.
 * @param whip.elapsed Seconds since the whip started to unfurl.
 */
function drawWhip(
  context: CanvasRenderingContext2D,
  whip: { readonly hand: Point; readonly tip: Point; readonly elapsed: number },
): void {
  const { hand, tip, elapsed } = whip;
  const reach = Math.min(elapsed / WHIP_REACH_SECONDS, 1);
  context.fillStyle = COLOURS.whip;
  let previous = hand;
  for (let step = 1; step <= Math.round(WHIP_SEGMENTS * reach); step += 1) {
    const progress = step / WHIP_SEGMENTS;
    const point = {
      x: hand.x + (tip.x - hand.x) * progress,
      y:
        hand.y +
        (tip.y - hand.y) * progress -
        Math.sin(progress * Math.PI) * WHIP_ARC,
    };
    pixelLine(context, { from: previous, to: point, size: 1 });
    previous = point;
  }
  if (reach === 1) {
    drawSpark(context, tip);
  }
}

/**
 * Draw twinkling gold sparkles around a point.
 * @param context Scene canvas.
 * @param origin Top-left of the sparkle area.
 * @param time Animation clock in seconds.
 */
function drawSparkles(
  context: CanvasRenderingContext2D,
  origin: Point,
  time: number,
): void {
  context.fillStyle = COLOURS.star;
  for (let index = 0; index < 10; index += 1) {
    if (Math.sin(time * 6 + index * 1.7) > 0.2) {
      const x = origin.x + ((index * 37) % 34);
      const y = origin.y + ((index * 23) % 30);
      context.fillRect(x, y, 1, 1);
    }
  }
}

/**
 * Draw dust motes drifting through the torchlight.
 * @param context Scene canvas.
 * @param time Animation clock in seconds.
 */
function drawDust(context: CanvasRenderingContext2D, time: number): void {
  context.fillStyle = COLOURS.dust;
  for (let index = 0; index < 14; index += 1) {
    const x = (index * 53 + time * (3 + (index % 3))) % SCENE_WIDTH;
    const y = 30 + ((index * 29) % 56) + Math.sin(time + index) * 2;
    context.fillRect(Math.round(x), Math.round(y), 1, 1);
  }
}

export { drawDust, drawSparkles, drawTorches, drawWhip };
