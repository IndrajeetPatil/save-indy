import { LEVELS } from "./config.ts";
import type { Level } from "./config.ts";
import { byId, make } from "./dom.ts";
import { currentRound, outcome } from "./game.ts";
import type { GameState } from "./game.ts";
import type { Stat } from "./hud.ts";
import { iconText, makeIcon } from "./icons.ts";
import { setRichText } from "./text.ts";

type ScreenName = "start" | "question" | "end";

const LEVEL_NAMES: Record<Level, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

/** Every element the game updates, looked up once. */
interface View {
  readonly root: Document;
  readonly screens: Readonly<Record<ScreenName, HTMLElement>>;
  readonly announcer: HTMLElement;
  readonly mute: HTMLButtonElement;
  readonly startForm: HTMLFormElement;
  readonly levelOptions: HTMLElement;
  readonly threat: Stat;
  readonly health: Stat;
  readonly progress: HTMLElement;
  readonly question: HTMLElement;
  readonly answers: HTMLOListElement;
  readonly feedback: HTMLElement;
  readonly verdict: HTMLElement;
  readonly rightAnswer: HTMLElement;
  readonly explanation: HTMLElement;
  readonly next: HTMLButtonElement;
  readonly nextLabel: HTMLElement;
  readonly result: HTMLElement;
  readonly summary: HTMLElement;
  readonly playAgain: HTMLButtonElement;
  readonly changeLevel: HTMLButtonElement;
  readonly review: HTMLElement;
  readonly reviewList: HTMLOListElement;
}

/**
 * @param root Document holding the game markup.
 * @returns References to every element the game updates.
 */
function findView(root: Document): View {
  const element = (id: string) => byId(root, id, HTMLElement);
  const button = (id: string) => byId(root, id, HTMLButtonElement);
  const list = (id: string) => byId(root, id, HTMLOListElement);
  return {
    root,
    screens: {
      start: element("start-screen"),
      question: element("question-screen"),
      end: element("end-screen"),
    },
    announcer: element("announcer"),
    mute: button("mute-toggle"),
    startForm: byId(root, "start-form", HTMLFormElement),
    levelOptions: element("level-options"),
    threat: { meter: element("threat-meter"), value: element("threat-value") },
    health: { meter: element("health-meter"), value: element("health-value") },
    progress: element("progress"),
    question: element("question"),
    answers: list("answers"),
    feedback: element("feedback"),
    verdict: element("verdict"),
    rightAnswer: element("right-answer"),
    explanation: element("explanation"),
    next: button("next-button"),
    nextLabel: element("next-label"),
    result: element("result"),
    summary: element("summary"),
    playAgain: button("play-again"),
    changeLevel: button("change-level"),
    review: element("review"),
    reviewList: list("review-list"),
  };
}

/**
 * Show one screen and hide the others.
 * @param view The game view.
 * @param name Screen to show.
 */
function showScreen(view: View, name: ScreenName): void {
  for (const [key, screen] of Object.entries(view.screens)) {
    screen.hidden = key !== name;
  }
}

/**
 * Announce a message to screen readers.
 * @param view The game view.
 * @param message Text to read out.
 */
function announce(view: View, message: string): void {
  view.announcer.textContent = message;
}

/**
 * Show the speaker icon that matches the sound setting.
 * @param view The game view.
 * @param muted Whether sound is off.
 */
function renderMute(view: View, muted: boolean): void {
  view.mute.setAttribute("aria-pressed", String(muted));
  view.mute.replaceChildren(
    makeIcon(view.root, muted ? "soundOff" : "soundOn"),
  );
}

function levelCard(view: View, level: Level, count: number) {
  const label = make(view.root, "label", "level-card");
  const input = make(view.root, "input", "level-input");
  input.type = "radio";
  input.name = "level";
  input.value = level;
  const name = make(view.root, "span", "level-name");
  name.textContent = LEVEL_NAMES[level];
  const total = make(view.root, "span", "level-count");
  total.textContent = `${count} questions`;
  label.append(input, name, total);
  return { label, input };
}

/**
 * Fill the level picker with one radio card per level.
 * @param view The game view.
 * @param counts Number of questions per level.
 * @param selected Level to pre-select.
 */
function renderLevels(
  view: View,
  counts: Readonly<Record<Level, number>>,
  selected: Level,
): void {
  const cards = LEVELS.map((level) => {
    const { label, input } = levelCard(view, level, counts[level]);
    input.checked = level === selected;
    return label;
  });
  view.levelOptions.replaceChildren(...cards);
}

/**
 * @param view The game view.
 * @returns The level whose radio button is checked.
 */
function selectedLevel(view: View): Level | undefined {
  const picked = new FormData(view.startForm).get("level");
  return LEVELS.find((level) => level === picked);
}

function answerButton(view: View, choice: string, position: number) {
  const button = make(view.root, "button", "answer");
  button.type = "button";
  button.dataset["choice"] = choice;
  button.setAttribute("aria-keyshortcuts", String(position));
  const key = make(view.root, "span", "answer-key");
  key.textContent = String(position);
  key.setAttribute("aria-hidden", "true");
  const text = make(view.root, "span", "answer-text");
  setRichText(text, choice);
  button.append(key, text);
  return button;
}

/**
 * Show the current question with a button per answer.
 * @param view The game view.
 * @param state Game state with an unanswered question.
 * @param onAnswer Called with the picked answer.
 */
function renderQuestion(
  view: View,
  state: GameState,
  onAnswer: (choice: string) => void,
): void {
  const { question, answers } = currentRound(state);
  view.progress.replaceChildren(
    `${LEVEL_NAMES[state.level]} · Q${state.index + 1} · `,
    ...iconText(view.root, {
      icon: "check",
      text: String(state.correct),
      hidden: "correct: ",
    }),
  );
  setRichText(view.question, question.prompt);
  const items = answers.map((choice, index) => {
    const item = make(view.root, "li", "answer-item");
    const button = answerButton(view, choice, index + 1);
    button.addEventListener("click", () => {
      onAnswer(choice);
    });
    item.append(button);
    return item;
  });
  view.answers.replaceChildren(...items);
  view.feedback.hidden = true;
}

/** Icon and spoken text that mark an answer without relying on colour. */
const MARKS = {
  correct: { icon: "check", label: " (right answer)" },
  wrong: { icon: "cross", label: " (your answer)" },
} as const;

function markAnswer(button: HTMLButtonElement, mark: keyof typeof MARKS) {
  button.classList.add(mark === "correct" ? "is-correct" : "is-wrong");
  button
    .querySelector(".answer-key")
    ?.replaceChildren(makeIcon(button.ownerDocument, MARKS[mark].icon));
  const label = make(button.ownerDocument, "span", "visually-hidden");
  label.textContent = MARKS[mark].label;
  button.append(label);
}

function markAnswers(view: View, correct: string, choice: string | null) {
  for (const button of view.answers.querySelectorAll("button")) {
    const shown = button.dataset["choice"];
    button.disabled = true;
    if (shown === correct) {
      markAnswer(button, "correct");
    } else if (shown === choice) {
      markAnswer(button, "wrong");
    }
  }
}

/**
 * Lock the answers, mark the right and wrong ones, and explain.
 * @param view The game view.
 * @param state Game state right after an answer.
 */
function renderFeedback(view: View, state: GameState): void {
  const { question } = currentRound(state);
  const isCorrect = state.choice === question.correct;
  markAnswers(view, question.correct, state.choice);
  view.verdict.replaceChildren(
    ...iconText(view.root, {
      icon: isCorrect ? "check" : "cross",
      text: isCorrect ? "Correct!" : "Wrong!",
    }),
  );
  view.verdict.dataset["result"] = isCorrect ? "correct" : "wrong";
  view.rightAnswer.replaceChildren(
    ...iconText(view.root, {
      icon: "check",
      text: question.correct,
      hidden: "Right answer: ",
    }),
  );
  view.rightAnswer.hidden = isCorrect;
  setRichText(view.explanation, question.explanation);
  view.nextLabel.textContent =
    outcome(state) === "playing" ? "Next" : "Results";
  view.feedback.hidden = false;
}

export type { ScreenName, View };
export { LEVEL_NAMES };
export {
  announce,
  findView,
  renderFeedback,
  renderLevels,
  renderMute,
  renderQuestion,
  selectedLevel,
  showScreen,
};
