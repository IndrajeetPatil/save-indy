const showStatus = () => {
  "use strict";
  const health = game.player.health;
  const threat = game.snake.threat;

  const healthLevelClass = decideHealthLevelClass(health);
  const threatLevelClass = decideThreatLevelClass(threat);

  const statusHTML = `<div id="threat-container" class="threat-container">
                    <p><b>Threat level</b></p>
                    <p class="${threatLevelClass}">${threat}</p>
                </div>

                <div id="health-container" class="health-container">
                    <p><b>Indy's health</b></p>
                    <p class="${healthLevelClass}">${health}</p>
                </div>`;

  document.getElementById("status-container").innerHTML = statusHTML;
};

const gameOver = (message) => {
  "use strict";
  const gameOverHTML = `<div class="game-over">
                <h2>${message}</h2>
                <button class='restart-btn'><a href="../index.html">Restart</a></button>
            </div>`;
  document.getElementById("question-container").innerHTML = gameOverHTML;
};

const checkAnswer = (event) => {
  "use strict";

  const askedQuestion = document.getElementById("question-text").innerHTML;
  const selectedAnswer = event.target.innerHTML;
  const correctAnswer = questions.filter((item) => item.question === askedQuestion)[0].correctAnswer;

  const truthValue = String(selectedAnswer) === String(correctAnswer);

  return truthValue;
};

const showFeedbackAndNextQuestion = (event) => {
  "use strict";
  const isAnswerCorrect = checkAnswer(event);
  const answerClass = isAnswerCorrect ? "correct-answer" : "incorrect-answer";

  // TODO: Why no feedback is shown for the final round?
  event.target.classList.add(answerClass);

  if (isAnswerCorrect) {
    game.snake.retract();
    game.player.increaseHealth();
  } else {
    game.snake.move();
    game.player.reduceHealth();
  }

  showStatus();

  const isPlayerDead = game.player.isDead();
  const isPlayerSafe = !game.snake.isThreateningPlayer();
  const noQuestionsRemaining = availableQuestionsCopy.length === 0;

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
