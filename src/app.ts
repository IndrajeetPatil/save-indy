import type { SoundEffects } from "./audio.ts";
import { START_STAT } from "./config.ts";
import type { Level } from "./config.ts";
import {
  answer,
  createGame,
  lastAnswerCorrect,
  nextQuestion,
  outcome,
} from "./game.ts";
import type { GameState } from "./game.ts";
import { renderStats } from "./hud.ts";
import { QUESTIONS } from "./questions.ts";
import type { Question } from "./questions.ts";
import type { Cue } from "./scene/scene.ts";
import {
  announce,
  findView,
  isAsking,
  renderEnd,
  renderFeedback,
  renderLevels,
  renderMute,
  renderQuestion,
  selectedLevel,
  showScreen,
} from "./view.ts";
import type { View } from "./view.ts";

/** The parts of the scene the game drives; a stub can stand in for tests. */
interface Stage {
  readonly update: (threat: number, cue: Cue) => void;
}

/** The sound effects the game plays; a stub can stand in for tests. */
type Sound = Pick<SoundEffects, "muted" | "whip" | "hiss" | "win" | "lose">;

interface AppOptions {
  readonly root: Document;
  readonly stage: Stage;
  readonly sound: Sound;
  readonly onMuteChange: (muted: boolean) => void;
  readonly bank?: readonly Question[];
  readonly random?: () => number;
}

/** Keys 1-4 pick the matching answer. */
const ANSWER_KEYS: readonly string[] = ["1", "2", "3", "4"];

/**
 * @param bank Every available question.
 * @returns How many questions each level has.
 */
function countByLevel(bank: readonly Question[]): Record<Level, number> {
  const counts: Record<Level, number> = {
    beginner: 0,
    intermediate: 0,
    advanced: 0,
  };
  for (const question of bank) {
    counts[question.level] += 1;
  }
  return counts;
}

/**
 * @param state Game state right after an answer.
 * @returns The animation and sound that the answer deserves.
 */
function cueFor(state: GameState): Cue {
  const result = outcome(state);
  if (result === "won" || result === "lost") {
    return result;
  }
  return lastAnswerCorrect(state) ? "correct" : "wrong";
}

/**
 * @param event A key press.
 * @returns Whether it was pressed without a modifier, so it isn't a shortcut
 *   meant for the browser.
 */
function isPlainKey(event: KeyboardEvent): boolean {
  return !(event.altKey || event.ctrlKey || event.metaKey);
}

/**
 * The game controller: wires the view, the scene, and the sounds to the game
 * state as the player picks a level, answers, and plays again.
 */
class App {
  readonly #view: View;
  readonly #stage: Stage;
  readonly #sound: Sound;
  readonly #options: AppOptions;
  readonly #bank: readonly Question[];
  #level: Level = "beginner";
  #game: GameState | null = null;

  public constructor(options: AppOptions) {
    this.#options = options;
    this.#view = findView(options.root);
    this.#stage = options.stage;
    this.#sound = options.sound;
    this.#bank = options.bank ?? QUESTIONS;
    this.#bindEvents();
    renderLevels(this.#view, countByLevel(this.#bank), this.#level);
    renderMute(this.#view, this.#sound.muted);
    this.#reset();
  }

  #bindEvents(): void {
    const view = this.#view;
    view.startForm.addEventListener("submit", (event) => {
      event.preventDefault();
      this.#level = selectedLevel(view) ?? this.#level;
      this.#begin();
    });
    view.next.addEventListener("click", () => {
      this.#advance();
    });
    view.playAgain.addEventListener("click", () => {
      this.#begin();
    });
    view.changeLevel.addEventListener("click", () => {
      this.#reset();
      view.levelOptions.querySelector<HTMLInputElement>(":checked")?.focus();
    });
    view.mute.addEventListener("click", () => {
      this.#toggleMute();
    });
    view.root.addEventListener("keydown", (event) => {
      this.#onKey(event);
    });
  }

  #reset(): void {
    this.#game = null;
    showScreen(this.#view, "start");
    renderStats(this.#view, START_STAT, START_STAT);
    this.#stage.update(START_STAT, "reset");
  }

  #begin(): void {
    const game = createGame(this.#level, this.#bank, this.#options.random);
    this.#game = game;
    showScreen(this.#view, "question");
    renderStats(this.#view, game.threat, game.health);
    this.#stage.update(game.threat, "reset");
    this.#ask(game);
  }

  #ask(game: GameState): void {
    renderQuestion(this.#view, game, (choice) => {
      this.#choose(choice);
    });
    this.#view.question.focus();
  }

  #choose(choice: string): void {
    if (this.#game === null) {
      return;
    }
    const game = answer(this.#game, choice);
    this.#game = game;
    const cue = cueFor(game);
    this.#playSound(cue);
    this.#stage.update(game.threat, cue);
    renderStats(this.#view, game.threat, game.health);
    renderFeedback(this.#view, game);
    announce(
      this.#view,
      `${this.#view.verdict.textContent} ${this.#view.explanation.textContent}`,
    );
    this.#view.next.focus();
  }

  #advance(): void {
    const game = this.#game;
    if (game === null) {
      return;
    }
    if (outcome(game) === "playing") {
      this.#game = nextQuestion(game);
      this.#ask(this.#game);
      return;
    }
    renderEnd(this.#view, game);
    showScreen(this.#view, "end");
    this.#view.result.focus();
  }

  #playSound(cue: Cue): void {
    const effects: Record<Exclude<Cue, "reset">, () => void> = {
      correct: () => {
        this.#sound.whip();
      },
      wrong: () => {
        this.#sound.hiss();
      },
      won: () => {
        this.#sound.win();
      },
      lost: () => {
        this.#sound.lose();
      },
    };
    if (cue !== "reset") {
      effects[cue]();
    }
  }

  #toggleMute(): void {
    this.#sound.muted = !this.#sound.muted;
    renderMute(this.#view, this.#sound.muted);
    this.#options.onMuteChange(this.#sound.muted);
  }

  #onKey(event: KeyboardEvent): void {
    const index = ANSWER_KEYS.indexOf(event.key);
    if (index === -1 || !isPlainKey(event) || !isAsking(this.#view)) {
      return;
    }
    [...this.#view.answers.querySelectorAll("button")][index]?.click();
  }
}

/**
 * Start the game on a page.
 * @param options Document, scene, sound, and optional test seams.
 * @returns The running game.
 */
function startApp(options: AppOptions): App {
  return new App(options);
}

export type { AppOptions, Sound, Stage };
export { startApp };
