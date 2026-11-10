import { LEVELS } from "./config.ts";
import type { Level } from "./config.ts";
import { byId, make } from "./dom.ts";
import { currentRound, outcome } from "./game.ts";
import type { GameState, Outcome } from "./game.ts";
import type { Stat } from "./hud.ts";
import type { Question } from "./questions.ts";
import { setRichText } from "./text.ts";

type ScreenName = "start" | "question" | "end";

const LEVEL_DETAILS: Record<Level, { name: string; topics: string }> = {
  beginner: {
    name: "Beginner",
    topics: "Types, coercion, and everyday syntax",
  },
  intermediate: {
    name: "Intermediate",
    topics: "Operators, scope, and iteration",
  },
  advanced: { name: "Advanced", topics: "Edge cases and language internals" },
};

const RESULTS: Record<Exclude<Outcome, "playing">, string> = {
  won: "You saved Indy!",
  lost: "The snake got Indy!",
  "out-of-questions": "Out of questions! Indy is still trapped.",
};

const PERCENT = 100;

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
 * @param view The game view.
 * @param muted Whether sound is off.
 */
function renderMute(view: View, muted: boolean): void {
  view.mute.setAttribute("aria-pressed", String(muted));
}

function levelCard(view: View, level: Level, count: number) {
  const label = make(view.root, "label", "level-card");
  const input = make(view.root, "input", "level-input");
  input.type = "radio";
  input.name = "level";
  input.value = level;
  const name = make(view.root, "span", "level-name");
  name.textContent = LEVEL_DETAILS[level].name;
  const topics = make(view.root, "span", "level-topics");
  topics.textContent = `${LEVEL_DETAILS[level].topics} · ${count} questions`;
  label.append(input, name, topics);
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
  view.progress.textContent = `${LEVEL_DETAILS[state.level].name} · Question ${state.index + 1} · ${state.correct} correct`;
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

/** Text and symbol that mark an answer without relying on colour. */
const MARKS = {
  correct: { symbol: "✓", label: " (right answer)" },
  wrong: { symbol: "✗", label: " (your answer)" },
} as const;

function markAnswer(button: HTMLButtonElement, mark: keyof typeof MARKS) {
  button.classList.add(mark === "correct" ? "is-correct" : "is-wrong");
  const key = button.querySelector(".answer-key");
  if (key !== null) {
    key.textContent = MARKS[mark].symbol;
  }
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
  view.verdict.textContent = isCorrect
    ? "Correct! Your whip cracks and the snake recoils."
    : "Wrong! The snake lunges at Indy.";
  view.verdict.dataset["result"] = isCorrect ? "correct" : "wrong";
  setRichText(view.rightAnswer, `Right answer: ${question.correct}`);
  view.rightAnswer.hidden = isCorrect;
  setRichText(view.explanation, question.explanation);
  view.next.textContent =
    outcome(state) === "playing" ? "Next question" : "See the result";
  view.feedback.hidden = false;
}

function reviewItem(root: Document, question: Question): HTMLLIElement {
  const item = make(root, "li", "review-item");
  const prompt = make(root, "p", "review-question");
  setRichText(prompt, question.prompt);
  const answer = make(root, "p", "review-answer");
  setRichText(answer, `Answer: ${question.correct}`);
  const explanation = make(root, "p", "review-explanation");
  setRichText(explanation, question.explanation);
  item.append(prompt, answer, explanation);
  return item;
}

/**
 * Show how the round ended, the score, and the questions to revisit.
 * @param view The game view.
 * @param state Final game state.
 */
function renderEnd(view: View, state: GameState): void {
  const result = outcome(state);
  const answered = state.index + 1;
  const percent = Math.round((state.correct / answered) * PERCENT);
  const levelName = LEVEL_DETAILS[state.level].name.toLowerCase();
  view.result.textContent = result === "playing" ? "" : RESULTS[result];
  view.result.dataset["result"] = result;
  view.summary.textContent = `You answered ${state.correct} of ${answered} ${levelName} questions correctly (${percent}%).`;
  view.reviewList.replaceChildren(
    ...state.missed.map((question) => reviewItem(view.root, question)),
  );
  view.review.hidden = state.missed.length === 0;
}

export type { ScreenName, View };
export {
  announce,
  findView,
  renderEnd,
  renderFeedback,
  renderLevels,
  renderMute,
  renderQuestion,
  selectedLevel,
  showScreen,
};
