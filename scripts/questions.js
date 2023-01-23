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
];

function prepareHTML(questions) {
  "use strict";
  if (questions.length === 0) {
    throw new Error("No questions provided.");
  }

  let questionsHTMLArray = questions.map((item) => {
    let answersHTML = item.answers.reduce(
      (prev, cur) => prev + `<button type="button" class="answer-btn">${cur}</button><br>`,
      ""
    );

    let questionHTML = `<h2 id="question-text" class="question-text">${item.question}</h2> <form> ${answersHTML} </form>`;

    return questionHTML;
  });

  return questionsHTMLArray;
}

function displayQuestion(html) {
  "use strict";

  document.getElementById("question-container").innerHTML = html;
}

let questionsHTML = prepareHTML(questions);
displayQuestion(questionsHTML[0]);
