let gameOver = () => {
  "use strict";
  let gameOverHTML = `<div class="game-over">
                <h2>Game Over!</h2>
                <p>Click the button below to restart the game.</p>
                <span class='restart-btn'><a href="./index.html">Restart</a></span>
            </div>`;
  document.getElementById("question-container").innerHTML = gameOverHTML;
};

let checkAnswer = (event) => {
  "use strict";

  const selectedAnswer = event.target.innerHTML;

  const askedQuestion = document.getElementById("question-text").innerHTML;
  const correctAnswer = questions.filter((item) => item.question === askedQuestion)[0].correctAnswer;

  let truthValue = String(selectedAnswer) === String(correctAnswer);

  return truthValue;
};

let showFeedbackAndNextQuestion = (event) => {
  "use strict";
  console.log("feedbacked");
  let isAnswerCorrect = checkAnswer(event);

  let newClass = isAnswerCorrect ? "correct-answer" : "incorrect-answer";
  let feedbackText = isAnswerCorrect ? "Correct!" : "Incorrect!";

  if (isAnswerCorrect) {
    game.snake.retract();
    game.player.increaseHealth();
  } else {
    game.snake.move();
    game.player.reduceHealth();
  }

  let feedbackElement = `<br><p class=${newClass}>${feedbackText}</p>`;

  let isPlayerDead = game.player.isDead();
  if (isPlayerDead) {
    gameOver();
  } else {
    event.target.parentNode.insertAdjacentHTML("beforeend", feedbackElement);
    setTimeout(displayQuestion, 1000, availableQuestions);
  }
};
