export const LEVELS = ["beginner", "intermediate", "advanced"] as const;
export type Level = (typeof LEVELS)[number];

/** Net correct answers needed to drive the snake away, starting from even. */
export const STEPS_TO_WIN = 5;
/** Threat and health share a 0-100 scale and start halfway. */
export const MAX_STAT = 100;
export const START_STAT = 50;
export const STAT_STEP = START_STAT / STEPS_TO_WIN;
