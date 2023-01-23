let checkAnswer = (event) => {
  "use strict";

  const selectedAnswer = event.target.innerHTML;

  const askedQuestion = document.getElementById("question-text").innerHTML;
  const correctAnswer = questions.filter((item) => item.question === askedQuestion)[0].correctAnswer;

  let truthValue = String(selectedAnswer) === String(correctAnswer);

  let newClass = truthValue ? "correct-btn" : "incorrect-btn";
  event.target.classList.add(newClass);

  return truthValue;
};

let answerButtons = [...document.getElementsByClassName("answer-btn")];
answerButtons.forEach((element) => element.addEventListener("click", (event) => checkAnswer(event)));
