import { COLOURS, IDOL, PALETTE } from "./art.ts";
import { context2d, makeCanvas, paintSprite, seededRandom } from "./pixels.ts";
import type { Point } from "./pixels.ts";

/** Logical canvas size; CSS scales it up with crisp, square pixels. */
const SCENE_WIDTH = 160;
const SCENE_HEIGHT = 120;
const FLOOR_Y = 92;

/** Torch flame centres, used for the static brackets and the live flames. */
const TORCHES = [
  { x: 14, y: 44 },
  { x: 146, y: 44 },
] as const;

const STONES = ["#5f5852", "#57504a", "#4d4741", "#655d56"] as const;
const STONE_HIGHLIGHT = "rgba(255, 245, 230, 0.12)";
const STONE_SHADOW = "rgba(0, 0, 0, 0.25)";
const BRICK_WIDTH = 14;
const BRICK_HEIGHT = 6;
const PILLAR_WIDTH = 16;
const PILLARS = [6, 138] as const;
const DOOR = { centre: 84, top: 30, radius: 18 } as const;
const PEDESTAL = { x: 124, top: 76, width: 16 } as const;

type Paint = CanvasRenderingContext2D;

function paintBrick(context: Paint, at: Point, stone: string): void {
  context.fillStyle = stone;
  context.fillRect(at.x + 1, at.y + 1, BRICK_WIDTH - 1, BRICK_HEIGHT - 1);
  context.fillStyle = STONE_HIGHLIGHT;
  context.fillRect(at.x + 1, at.y + 1, BRICK_WIDTH - 1, 1);
  context.fillStyle = STONE_SHADOW;
  context.fillRect(at.x + 1, at.y + BRICK_HEIGHT - 1, BRICK_WIDTH - 1, 1);
}

function pickStone(random: () => number): string {
  return STONES[Math.floor(random() * STONES.length)] ?? STONES[0];
}

function paintWall(context: Paint, random: () => number): void {
  context.fillStyle = COLOURS.mortar;
  context.fillRect(0, 0, SCENE_WIDTH, FLOOR_Y);
  for (let row = 0; row * BRICK_HEIGHT < FLOOR_Y; row += 1) {
    const offset = (row % 2) * (-BRICK_WIDTH / 2);
    for (let x = offset; x < SCENE_WIDTH; x += BRICK_WIDTH) {
      paintBrick(context, { x, y: row * BRICK_HEIGHT }, pickStone(random));
    }
  }
}

function paintFrieze(context: Paint): void {
  context.fillStyle = "#332c27";
  context.fillRect(0, 12, SCENE_WIDTH, 8);
  context.fillStyle = "#8c7a52";
  for (let x = 0; x < SCENE_WIDTH; x += 8) {
    // A worn zig-zag glyph band.
    context.fillRect(x, 15, 2, 2);
    context.fillRect(x + 2, 13, 2, 2);
    context.fillRect(x + 4, 15, 2, 2);
    context.fillRect(x + 6, 17, 2, 2);
  }
  context.fillStyle = STONE_SHADOW;
  context.fillRect(0, 20, SCENE_WIDTH, 1);
}

function paintDoorway(context: Paint): void {
  const { centre, top, radius } = DOOR;
  for (let x = centre - radius; x <= centre + radius; x += 1) {
    const rise = Math.sqrt(radius ** 2 - (x - centre) ** 2);
    const y = Math.round(top + radius - rise);
    context.fillStyle = COLOURS.stoneLight;
    context.fillRect(x - 1, y - 2, 3, FLOOR_Y - y + 2);
  }
  for (let x = centre - radius + 2; x <= centre + radius - 2; x += 1) {
    const rise = Math.sqrt((radius - 2) ** 2 - (x - centre) ** 2);
    const y = Math.round(top + radius - rise);
    context.fillStyle = COLOURS.doorway;
    context.fillRect(x, y, 1, FLOOR_Y - y);
  }
}

function paintPillar(context: Paint, x: number): void {
  context.fillStyle = "#6b625a";
  context.fillRect(x, 0, PILLAR_WIDTH, FLOOR_Y);
  context.fillStyle = "#857a70";
  context.fillRect(x + 1, 0, 2, FLOOR_Y);
  context.fillStyle = "#4a433d";
  context.fillRect(x + PILLAR_WIDTH - 3, 0, 3, FLOOR_Y);
  context.fillStyle = STONE_SHADOW;
  for (let y = 30; y < FLOOR_Y - 8; y += 12) {
    context.fillRect(x, y, PILLAR_WIDTH, 1);
  }
  // Capital and base stick out on both sides.
  context.fillStyle = "#7d736a";
  context.fillRect(x - 2, 22, PILLAR_WIDTH + 4, 4);
  context.fillRect(x - 2, FLOOR_Y - 6, PILLAR_WIDTH + 4, 6);
  context.fillStyle = STONE_SHADOW;
  context.fillRect(x - 2, 25, PILLAR_WIDTH + 4, 1);
  context.fillRect(x - 2, FLOOR_Y - 1, PILLAR_WIDTH + 4, 1);
}

function paintTorchBracket(context: Paint, x: number, y: number): void {
  context.fillStyle = COLOURS.torch;
  context.fillRect(x - 1, y + 3, 3, 8);
  context.fillRect(x - 3, y + 2, 7, 2);
  context.fillStyle = "#1a120b";
  context.fillRect(x - 3, y + 4, 7, 1);
}

const FLOOR_ROWS = [
  { height: 7, width: 18 },
  { height: 9, width: 24 },
  { height: 12, width: 32 },
] as const;

function paintFloorRow(
  context: Paint,
  row: {
    readonly y: number;
    readonly height: number;
    readonly width: number;
    readonly offset: number;
  },
  random: () => number,
): void {
  for (let x = row.offset; x < SCENE_WIDTH; x += row.width) {
    context.fillStyle = random() < 0.5 ? COLOURS.floorA : COLOURS.floorB;
    context.fillRect(x, row.y, row.width - 1, row.height - 1);
    context.fillStyle = STONE_HIGHLIGHT;
    context.fillRect(x, row.y, row.width - 1, 1);
  }
}

function paintFloor(context: Paint, random: () => number): void {
  // Grout fills the gaps, so the background stays fully opaque and no earlier
  // frame can show through.
  context.fillStyle = COLOURS.mortar;
  context.fillRect(0, FLOOR_Y, SCENE_WIDTH, SCENE_HEIGHT - FLOOR_Y);
  let y = FLOOR_Y;
  for (const [index, { height, width }] of FLOOR_ROWS.entries()) {
    const offset = (index % 2) * (-width / 2);
    paintFloorRow(context, { y, height, width, offset }, random);
    y += height;
  }
  context.fillStyle = COLOURS.floorEdge;
  context.fillRect(0, FLOOR_Y, SCENE_WIDTH, 1);
}

function paintLeaf(context: Paint, at: Point, flip: boolean): void {
  context.fillStyle = COLOURS.vineLight;
  context.fillRect(at.x + (flip ? 1 : -2), at.y, 2, 1);
}

function paintVine(context: Paint, x: number, length: number): void {
  for (let y = 0; y < length; y += 1) {
    const sway = Math.round(Math.sin(y / 4) * 1.5);
    context.fillStyle = COLOURS.vine;
    context.fillRect(x + sway, y, 1, 1);
    if (y % 5 === 2) {
      paintLeaf(context, { x: x + sway, y }, y % 10 === 2);
    }
  }
}

function paintVines(context: Paint, random: () => number): void {
  for (const x of [30, 47, 112, 125]) {
    paintVine(context, x, 12 + Math.floor(random() * 22));
  }
}

function paintPedestal(context: Paint): void {
  const { x, top, width } = PEDESTAL;
  context.fillStyle = "#6f665e";
  context.fillRect(x, top, width, FLOOR_Y - top);
  context.fillStyle = "#857a70";
  context.fillRect(x - 2, top, width + 4, 3);
  context.fillStyle = STONE_SHADOW;
  context.fillRect(x, top + 3, width, 1);
  context.fillRect(x + width - 3, top + 3, 3, FLOOR_Y - top - 3);
  context.drawImage(paintSprite(IDOL, PALETTE), x + 4, top - IDOL.length);
}

/**
 * Paint the static temple once; each frame copies it and adds moving parts.
 * @returns A canvas holding the background.
 */
function paintBackground(): HTMLCanvasElement {
  const canvas = makeCanvas(SCENE_WIDTH, SCENE_HEIGHT);
  const context = context2d(canvas);
  const random = seededRandom(1936);
  paintWall(context, random);
  paintFrieze(context);
  paintDoorway(context);
  for (const x of PILLARS) {
    paintPillar(context, x);
  }
  for (const torch of TORCHES) {
    paintTorchBracket(context, torch.x, torch.y);
  }
  paintFloor(context, random);
  paintVines(context, random);
  paintPedestal(context);
  return canvas;
}

export { FLOOR_Y, SCENE_HEIGHT, SCENE_WIDTH, TORCHES, paintBackground };
