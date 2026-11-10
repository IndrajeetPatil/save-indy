"use strict";

/**
 * Select the questions for the chosen difficulty level, in random order.
 * @param {Array<object>} allQuestions
 * @param {string} level
 * @return {Array<object>}
 */
function prepareQuestions(allQuestions, level) {
  const questionsForLevel = allQuestions.filter((item) => item.level === level);
  if (questionsForLevel.length === 0) {
    throw new Error(`No questions available for level "${level}".`);
  }
  return shuffleArray(questionsForLevel);
}

/**
 * Display the next question, with its answers in random order.
 * @return {void}
 */
function displayQuestion() {
  currentQuestion = remainingQuestions.pop();

  const questionText = document.createElement("h2");
  questionText.id = "question-text";
  questionText.className = "question-text";
  setTextWithCode(questionText, currentQuestion.question);

  const answerButtons = shuffleArray(currentQuestion.answers).map((answer) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-btn";
    setTextWithCode(button, answer);
    button.addEventListener("click", () => showFeedbackAndNextQuestion(button, answer));
    return button;
  });

  const answersContainer = document.createElement("div");
  answersContainer.className = "answers";
  answersContainer.append(...answerButtons);

  document.getElementById("question-container").replaceChildren(questionText, answersContainer);
}

// questions are defined in scripts/questions-db.js
const remainingQuestions = prepareQuestions(questions, getSelectedLevel());
let currentQuestion = null;
displayQuestion();
