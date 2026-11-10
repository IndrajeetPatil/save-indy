/** Maps sprite characters to CSS colours; any other character is transparent. */
type Palette = Readonly<Record<string, string>>;

interface Point {
  readonly x: number;
  readonly y: number;
}

/**
 * @param canvas Canvas to draw on.
 * @returns Its 2D context.
 */
function context2d(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const context = canvas.getContext("2d");
  if (context === null) {
    throw new Error("Canvas 2D is unavailable.");
  }
  return context;
}

/**
 * @param width Width in pixels.
 * @param height Height in pixels.
 * @returns A new off-screen canvas.
 */
function makeCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function paintRow(
  context: CanvasRenderingContext2D,
  line: { readonly row: string; readonly y: number; readonly palette: Palette },
) {
  for (let x = 0; x < line.row.length; x += 1) {
    const colour = line.palette[line.row.charAt(x)];
    if (colour !== undefined) {
      context.fillStyle = colour;
      context.fillRect(x, line.y, 1, 1);
    }
  }
}

/**
 * Paint pixel art described as rows of palette characters onto a new canvas,
 * so each frame can draw it with a single `drawImage`.
 * @param rows Strings of equal length, one per pixel row.
 * @param palette Colour for each character.
 * @returns A canvas holding the sprite.
 */
function paintSprite(
  rows: readonly string[],
  palette: Palette,
): HTMLCanvasElement {
  const width = Math.max(...rows.map((row) => row.length));
  const canvas = makeCanvas(width, rows.length);
  const context = context2d(canvas);
  for (const [y, row] of rows.entries()) {
    paintRow(context, { row, y, palette });
  }
  return canvas;
}

/**
 * Draw a straight line of square "pixels" between two points.
 * @param context Target canvas.
 * @param line Endpoints and the edge length of each pixel square.
 * @param line.from Start point.
 * @param line.to End point.
 * @param line.size Edge length of each square.
 */
function pixelLine(
  context: CanvasRenderingContext2D,
  line: { readonly from: Point; readonly to: Point; readonly size: number },
): void {
  const { from, to, size } = line;
  const steps = Math.max(Math.abs(to.x - from.x), Math.abs(to.y - from.y), 1);
  for (let step = 0; step <= steps; step += 1) {
    const x = from.x + ((to.x - from.x) * step) / steps;
    const y = from.y + ((to.y - from.y) * step) / steps;
    context.fillRect(
      Math.round(x - size / 2),
      Math.round(y - size / 2),
      size,
      size,
    );
  }
}

/**
 * A small deterministic random generator, so the procedurally painted temple
 * looks the same on every visit. Quality only needs to fool the eye.
 * @param seed Starting point of the sequence.
 * @returns A function returning numbers in [0, 1).
 */
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state += 1;
    const value = Math.sin(state * 12.9898) * 43_758.5453;
    return value - Math.floor(value);
  };
}

export type { Palette, Point };
export { context2d, makeCanvas, paintSprite, pixelLine, seededRandom };
