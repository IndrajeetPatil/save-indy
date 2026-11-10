import { MAX_STAT, START_STAT, STAT_STEP } from "./config.ts";
import type { Level } from "./config.ts";
import type { Question } from "./questions.ts";
import { shuffle } from "./random.ts";

type Outcome = "playing" | "won" | "lost" | "out-of-questions";

/** A question as asked in this round, with its answers in play order. */
interface Round {
  readonly question: Question;
  readonly answers: readonly string[];
}

interface GameState {
  readonly level: Level;
  /** This round's questions, in play order. */
  readonly rounds: readonly Round[];
  /** Index of the question being asked, or answered last. */
  readonly index: number;
  readonly threat: number;
  readonly health: number;
  readonly correct: number;
  readonly missed: readonly Question[];
  /** The answer picked for the current question, or `null` before answering. */
  readonly choice: string | null;
}

/**
 * Start a round with the level's questions and their answers in random order.
 * @param level Difficulty to draw questions from.
 * @param bank Every available question.
 * @param random Source of uniform numbers in [0, 1), injectable for tests.
 * @returns The opening state.
 */
function createGame(
  level: Level,
  bank: readonly Question[],
  random: () => number = Math.random,
): GameState {
  const rounds = shuffle(
    bank.filter((question) => question.level === level),
    random,
  ).map((question) => ({
    question,
    answers: shuffle(question.answers, random),
  }));
  if (rounds.length === 0) {
    throw new Error(`No questions for level "${level}".`);
  }
  return {
    level,
    rounds,
    index: 0,
    threat: START_STAT,
    health: START_STAT,
    correct: 0,
    missed: [],
    choice: null,
  };
}

/**
 * @param state Current state.
 * @returns The question being asked, with its answers in play order.
 */
function currentRound(state: GameState): Round {
  const round = state.rounds[state.index];
  if (round === undefined) {
    throw new RangeError("No question at the current index.");
  }
  return round;
}

/**
 * Score an answer to the current question. Answering twice has no effect.
 * @param state Current state.
 * @param choice The answer the player picked.
 * @returns The next state.
 */
function answer(state: GameState, choice: string): GameState {
  if (state.choice !== null) {
    return state;
  }
  const { question } = currentRound(state);
  const isCorrect = choice === question.correct;
  const step = isCorrect ? -STAT_STEP : STAT_STEP;
  return {
    ...state,
    threat: Math.min(state.threat + step, MAX_STAT),
    health: Math.min(state.health - step, MAX_STAT),
    correct: state.correct + (isCorrect ? 1 : 0),
    missed: isCorrect ? state.missed : [...state.missed, question],
    choice,
  };
}

/**
 * @param state Current state.
 * @returns Whether the current question was answered correctly.
 */
function lastAnswerCorrect(state: GameState): boolean {
  return state.choice === currentRound(state).question.correct;
}

/**
 * Decide whether the round is over, and how it ended.
 * @param state Current state.
 * @returns The round's outcome so far.
 */
function outcome(state: GameState): Outcome {
  if (state.threat <= 0) {
    return "won";
  }
  if (state.health <= 0) {
    return "lost";
  }
  const isLastQuestion = state.index >= state.rounds.length - 1;
  return state.choice !== null && isLastQuestion
    ? "out-of-questions"
    : "playing";
}

/**
 * Move to the next question after an answer, while the round is still on.
 * @param state Current state.
 * @returns The state for the next question, or `state` if it can't advance.
 */
function nextQuestion(state: GameState): GameState {
  if (state.choice === null || outcome(state) !== "playing") {
    return state;
  }
  return { ...state, index: state.index + 1, choice: null };
}

export type { GameState, Outcome, Round };
export {
  answer,
  createGame,
  currentRound,
  lastAnswerCorrect,
  nextQuestion,
  outcome,
};
