let checkAnswer = (event) => {
  "use strict";

  const selectedAnswer = event.target.innerHTML;

  const askedQuestion = document.getElementById("question-text").innerHTML;
  const correctAnswer = questions.filter((item) => item.question === askedQuestion)[0].correctAnswer;

  let truthValue = String(selectedAnswer) === String(correctAnswer);

  return truthValue;
};

let addFeedbackHTML = (event) => {
  "use strict";
  let truthValue = checkAnswer(event);
  let newClass = truthValue ? "correct-answer" : "incorrect-answer";
  let feedbackText = truthValue ? "Correct!" : "Incorrect!";

  let feedbackElement = `<br><p class=${newClass}>${feedbackText}</p>`;

  event.target.parentNode.insertAdjacentHTML("afterend", feedbackElement);
};

let answerButtons = [...document.getElementsByClassName("answer-btn")];
answerButtons.forEach((element) => element.addEventListener("click", addFeedbackHTML));
