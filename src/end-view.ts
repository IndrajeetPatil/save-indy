import { make } from "./dom.ts";
import { outcome } from "./game.ts";
import type { GameState, Outcome } from "./game.ts";
import { iconText } from "./icons.ts";
import type { Question } from "./questions.ts";
import { setRichText } from "./text.ts";
import { LEVEL_NAMES } from "./view.ts";
import type { View } from "./view.ts";

const RESULTS: Record<Exclude<Outcome, "playing">, string> = {
  won: "You saved Indy!",
  lost: "The snake got Indy!",
  "out-of-questions": "Out of questions! Indy is still trapped.",
};

const PERCENT = 100;

function reviewItem(root: Document, question: Question): HTMLLIElement {
  const item = make(root, "li", "review-item");
  const prompt = make(root, "p", "review-question");
  setRichText(prompt, question.prompt);
  const answer = make(root, "p", "review-answer");
  answer.append(
    ...iconText(root, {
      icon: "check",
      text: question.correct,
      hidden: "Answer: ",
    }),
  );
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
  view.result.textContent = result === "playing" ? "" : RESULTS[result];
  view.result.dataset["result"] = result;
  view.summary.textContent = `${LEVEL_NAMES[state.level]}: ${state.correct}/${answered} correct (${percent}%)`;
  view.reviewList.replaceChildren(
    ...state.missed.map((question) => reviewItem(view.root, question)),
  );
  view.review.hidden = state.missed.length === 0;
}

export { renderEnd };
