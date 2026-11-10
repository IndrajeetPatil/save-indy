import type { Palette } from "./pixels.ts";

/** Original artwork for this game, drawn as pixel rows. */
export const PALETTE: Palette = {
  // Explorer
  k: "#1a120b",
  h: "#8a5c34",
  H: "#5e3d20",
  B: "#2b1a0e",
  s: "#e8b48a",
  S: "#c48a62",
  e: "#1a120b",
  m: "#a87458",
  w: "#ddc99a",
  j: "#8f5b30",
  g: "#3b2614",
  y: "#f0c75a",
  p: "#6e6450",
  P: "#544c3c",
  b: "#3a2a1c",
  // Snake
  G: "#5daa3f",
  D: "#2f6b25",
  Y: "#e2cf5a",
  E: "#ffe94d",
  // Idol
  o: "#e8b93c",
  O: "#7a4a12",
  L: "#fff1a8",
};

export const COLOURS = {
  outline: "#1a120b",
  jacket: "#8f5b30",
  skin: "#e8b48a",
  whip: "#4a2e18",
  tongue: "#e8413c",
  spark: "#fff6c2",
  star: "#ffe94d",
  stoneLight: "#7a7068",
  mortar: "#221d1a",
  floorA: "#3f3631",
  floorB: "#4a403a",
  floorEdge: "#6d6159",
  doorway: "#0d0a09",
  vine: "#3e7d32",
  vineLight: "#6fb24f",
  flameOuter: "#ff8a1f",
  flameInner: "#ffe066",
  torch: "#3a2414",
  dust: "rgba(255, 236, 200, 0.55)",
} as const;

/** The explorer without arms, which are drawn per pose; 16 x 27. */
export const EXPLORER_BODY = [
  "......kkkk......",
  ".....khhhhk.....",
  "....khhhhhhk....",
  "....kBBBBBBk....",
  "..khhhhhhhhhhk..",
  "...kkSSSSSSkk...",
  "....ksessesk....",
  "....kssssssk....",
  "....kmssssmk....",
  ".....kmmmmk.....",
  "......kssk......",
  "....kjwwwwjk....",
  "....kjwwwwjk....",
  "....kjgwwwjk....",
  "....kjwgwwjk....",
  "....kjwwgwjk....",
  "....kjwwwgjk....",
  "....kgggyggk....",
  "....kppppppk....",
  "....kppppppk....",
  "....kppkkppk....",
  "....kpPkkpPk....",
  "....kpPkkpPk....",
  "....kpPkkpPk....",
  "....kbbkkbbk....",
  "...kbbbkkbbbk...",
  "...kkkkkkkkkk...",
] as const;

/** Snake head facing right; 8 x 6. */
export const SNAKE_HEAD = [
  "..kkkkk.",
  ".kGGGGGk",
  "kGGGGkEk",
  "kDGGGGGk",
  ".kYYYYk.",
  "..kkkk..",
] as const;

export const SNAKE_SEGMENT = [
  ".kkk.",
  "kGGGk",
  "kGGGk",
  "kYYYk",
  ".kkk.",
] as const;
export const SNAKE_BAND = [
  ".kkk.",
  "kDDDk",
  "kDDDk",
  "kYYYk",
  ".kkk.",
] as const;
export const SNAKE_TAIL = ["kkk", "kGk", "kkk"] as const;

/** A golden idol on its pedestal; 8 x 10. */
export const IDOL = [
  "..kkkk..",
  ".koooLk.",
  ".koOoOk.",
  ".kooook.",
  "..kook..",
  ".kooook.",
  "koLLooOk",
  "koooooOk",
  ".kooOOk.",
  "kkkkkkkk",
] as const;

/** A dizzy star shown over the fainted explorer; 3 x 3. */
export const STAR = [".E.", "EEE", ".E."] as const;
