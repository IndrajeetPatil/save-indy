"use strict";

const showStatus = () => renderStatus(game.snake.threat, game.player.health);

/**
 * Replace the question with the end-of-game message and a link back to the home page.
 * @param {string} message
 * @return {void}
 */
const gameOver = (message) => {
  const container = document.createElement("div");
  container.className = "game-over";

  const heading = document.createElement("h2");
  heading.textContent = message;

  const restartLink = document.createElement("a");
  restartLink.className = "button restart-btn";
  restartLink.href = "../index.html";
  restartLink.textContent = "Restart";

  container.append(heading, restartLink);
  document.getElementById("question-container").replaceChildren(container);
  restartLink.focus();
};

/**
 * Score the selected answer, update the game, and move on to the next question or the end screen.
 * @param {HTMLButtonElement} button The answer button that was clicked.
 * @param {string} answer The answer shown on that button.
 * @return {void}
 */
const showFeedbackAndNextQuestion = (button, answer) => {
  // Browsers keep audio suspended until a user gesture; this click is one
  userStartAudio();

  // Accept only one answer per question
  document.querySelectorAll(".answer-btn").forEach((element) => {
    element.disabled = true;
  });

  const isAnswerCorrect = answer === currentQuestion.correctAnswer;
  button.classList.add(isAnswerCorrect ? "correct-answer" : "incorrect-answer");

  if (isAnswerCorrect) {
    game.snake.retract();
    game.player.increaseHealth();
  } else {
    game.snake.move();
    game.player.reduceHealth();
  }

  showStatus();

  let endMessage = null;
  if (!game.snake.isThreateningPlayer()) {
    endMessage = messages.winPlayerSafe;
  } else if (game.player.isDead()) {
    endMessage = messages.losePlayerDead;
  } else if (remainingQuestions.length === 0) {
    endMessage = messages.loseNoQuestions;
  }

  // Keep the answer feedback visible for a moment, including on the final round
  if (endMessage) {
    setTimeout(gameOver, FEEDBACK_DELAY, endMessage);
  } else {
    setTimeout(displayQuestion, FEEDBACK_DELAY);
  }
};
