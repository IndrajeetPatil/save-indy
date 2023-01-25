let gameOver = (message) => {
  "use strict";
  let gameOverHTML = `<div class="game-over">
                <h2>${message}</h2>
                <button class='restart-btn'><a href="./index.html">Restart</a></button>
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
  let isPlayerSafe = !game.snake.isThreateningPlayer();
  let noQuestionsRemaining = availableQuestionsCopy.length === 0;

  if (isPlayerDead) {
    gameOver("Game Over! <br>You didn't save Indy 🪦");
  } else if (isPlayerSafe) {
    gameOver("You have won! <br>You saved Indy 🙏");
  } else if (noQuestionsRemaining) {
    gameOver("No more questions left. You have won! <br>You saved Indy 🙏");
  } else {
    event.target.parentNode.insertAdjacentHTML("beforeend", feedbackElement);
    setTimeout(displayQuestion, 1000, availableQuestions);
  }
};
