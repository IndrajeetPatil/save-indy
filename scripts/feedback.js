let checkAnswer = (event) => {
  "use strict";

  const selectedAnswer = event.target.innerHTML;

  const askedQuestion = document.getElementById("question-text").innerHTML;
  const correctAnswer = questions.filter((item) => item.question === askedQuestion)[0].correctAnswer;

  return String(selectedAnswer) === String(correctAnswer);
};

let answerButtons = [...document.getElementsByClassName("answer-btn")];
answerButtons.forEach((element) => element.addEventListener("click", (event) => checkAnswer(event)));
