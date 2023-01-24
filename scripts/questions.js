let questions = [
  {
    question: "What output will `console.log(+true)` produce?",
    answers: ["0", "1", "Syntax error", "2"],
    correctAnswer: "1",
    language: "javascript",
    level: "beginner",
  },
  {
    question: "What does `null == undefined` evaluate to?",
    answers: ["true", "false", "undefined", "null"],
    correctAnswer: "true",
    language: "javascript",
    level: "beginner",
  },
  {
    question: "Which of the following is not a literal?",
    answers: ["null", "true", "myVar", "-3.14"],
    correctAnswer: "myVar",
    language: "javascript",
    level: "beginner",
  },
  {
    question: "Which of the following is not a falsy value?",
    answers: ["' '", "null", "undefined", "[ ]"],
    correctAnswer: "[ ]",
    language: "javascript",
    level: "beginner",
  },
];

function prepareQuestions(questions) {
  "use strict";
  if (questions.length === 0) {
    throw new Error("No questions provided.");
  }

  let questionsHTMLArray = questions.map((item) => {
    let answersHTML = item.answers.reduce(
      (prev, cur) => prev + `<button type="button" class="answer-btn">${cur}</button><br>`,
      ""
    );

    let questionButtonsHTML = `<h2 id="question-text" class="question-text">${item.question}</h2> <form> ${answersHTML} </form>`;

    return questionButtonsHTML;
  });

  return questionsHTMLArray;
}

const availableQuestions = prepareQuestions(questions);

function displayQuestion() {
  "use strict";
  let availableQuestionsCount = availableQuestions.length;
  let randomQuestionIndex = Math.floor(Math.random() * availableQuestionsCount);
  let html = availableQuestions[randomQuestionIndex];
  document.getElementById("question-container").innerHTML = html;

  let answerButtons = [...document.getElementsByClassName("answer-btn")];
  answerButtons.forEach((element) => element.addEventListener("click", (event) => showFeedbackAndNextQuestion(event)));
}

displayQuestion();
