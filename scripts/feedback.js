let showStatus = () => {
  "use strict";
  let health = game.player.health;
  let threat = game.snake.threat;

  let healthLevelClass = decideHealthLevelClass(health);
  let threatLevelClass = decideThreatLevelClass(threat);

  let statusHTML = `<div id="threat-container" class="threat-container">
                    <p><b>Threat level</b></p>
                    <p class="${threatLevelClass}">${threat}</p>
                </div>

                <div id="health-container" class="health-container">
                    <p><b>Indy's health</b></p>
                    <p class="${healthLevelClass}">${health}</p>
                </div>`;

  document.getElementById("status-container").innerHTML = statusHTML;
};

let gameOver = (message) => {
  "use strict";
  let gameOverHTML = `<div class="game-over">
                <h2>${message}</h2>
                <button class='restart-btn'><a href="../index.html">Restart</a></button>
            </div>`;
  document.getElementById("question-container").innerHTML = gameOverHTML;
};

let checkAnswer = (event) => {
  "use strict";

  const askedQuestion = document.getElementById("question-text").innerHTML;
  const selectedAnswer = event.target.innerHTML;
  const correctAnswer = questions.filter((item) => item.question === askedQuestion)[0].correctAnswer;

  let truthValue = String(selectedAnswer) === String(correctAnswer);

  return truthValue;
};

let showFeedbackAndNextQuestion = (event) => {
  "use strict";
  let isAnswerCorrect = checkAnswer(event);

  let newClass = isAnswerCorrect ? "correct-answer" : "incorrect-answer";
  let feedbackText = isAnswerCorrect ? "Correct!" : "Incorrect!";

  // TODO: Why no feedback is shown for the final round?
  let feedbackElement = `<br><p class=${newClass}>${feedbackText}</p>`;
  event.target.parentNode.insertAdjacentHTML("beforeend", feedbackElement);

  if (isAnswerCorrect) {
    game.snake.retract();
    game.player.increaseHealth();
  } else {
    game.snake.move();
    game.player.reduceHealth();
  }

  showStatus(event);

  let isPlayerDead = game.player.isDead();
  let isPlayerSafe = !game.snake.isThreateningPlayer();
  let noQuestionsRemaining = availableQuestionsCopy.length === 0;

  if (isPlayerSafe) {
    gameOver(messages.winPlayerSafe);
  } else if (isPlayerDead) {
    gameOver(messages.losePlayerDead);
  } else if (noQuestionsRemaining) {
    gameOver(messages.loseNoQuestions);
  } else {
    setTimeout(displayQuestion, 1000, availableQuestions);
  }
};
