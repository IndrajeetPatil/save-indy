let questions = [
  {
    question: "What output will `console.log(+true)` produce?",
    answers: ["0", "1", "Syntax error", "2"],
    correctAnswer: "1",
    language: "javascript",
    level: "beginner",
  },
];

function prepareHTML(questions) {
  "use strict";

  let questionsHTMLArray = questions.map((item) => {
    let questionHTML = `
        <h2 class="question-text">${item.question}</h2>
        <form>
          <button type="button" class="answer-btn">${item.answers[0]}</button>
          <br>
          <button type="button" class="answer-btn">${item.answers[1]}</button>
          <br>
          <button type="button" class="answer-btn">${item.answers[2]}</button>
          <br>
          <button type="button" class="answer-btn">${item.answers[3]}</button>
          <br>
        </form>
    `;

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
