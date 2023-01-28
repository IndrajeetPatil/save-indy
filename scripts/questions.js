function prepareQuestions(questions) {
  "use strict";
  if (questions.length === 0) {
    throw new Error("No questions provided.");
  }

  let selectedLevel = getCookie("level");

  // Retain only questions with the specified level of difficulty
  let questionsFiltered = questions.filter((item) => item.level === (selectedLevel ?? "beginner"));

  // Show questions in random order each time
  let questionsShuffled = shuffleArray(questionsFiltered);

  let questionsHTMLArray = questionsShuffled.map((item) => {
    // Show options in random order each time
    let answersHTML = shuffleArray(item.answers).reduce(
      (prev, cur) => prev + `<button type="button" class="answer-btn">${cur}</button><br>`,
      ""
    );

    let questionButtonsHTML = `<h2 id="question-text" class="question-text">${item.question}</h2> <form> ${answersHTML} </form>`;

    return questionButtonsHTML;
  });

  return questionsHTMLArray;
}

function displayQuestion() {
  "use strict";
  if (availableQuestionsCopy.length === 0) {
    throw new Error("No more questions remaining.");
  }

  let html = availableQuestionsCopy.pop();
  document.getElementById("question-container").innerHTML = html;

  let answerButtons = [...document.getElementsByClassName("answer-btn")];
  answerButtons.forEach((element) => element.addEventListener("click", (event) => showFeedbackAndNextQuestion(event)));
}

// questions are defined in scripts/questions-db.js
const availableQuestions = prepareQuestions(questions);
let availableQuestionsCopy = [...availableQuestions];
displayQuestion();
