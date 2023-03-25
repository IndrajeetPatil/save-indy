/**
 * Shuffle an array in place.
 * @param {*} questions
 * @returns {Array} The shuffled array.
 */
function prepareQuestions(questions) {
  "use strict";
  if (questions.length === 0) {
    throw new Error("No questions provided.");
  }

  const selectedLevel = getCookie("level");

  // Retain only questions with the specified level of difficulty
  const questionsFiltered = questions.filter((item) => item.level === (selectedLevel ?? "beginner"));

  // Show questions in random order each time
  let questionsShuffled = [];
  try {
    questionsShuffled = shuffleArray(questionsFiltered);
  } catch {
    // If the user didn't select a level, show only beginner questions
    // This can happen if the user somehow directly lands on the game or if the user manually deconstes the cookie
    questionsShuffled = shuffleArray(questions.filter((item) => item.level === "beginner"));
  }

  const questionsHTMLArray = questionsShuffled.map((item) => {
    // Show options in random order each time
    const answersHTML = shuffleArray(item.answers).reduce(
      (prev, cur) => prev + `<button type="button" class="answer-btn">${cur}</button><br>`,
      ""
    );

    const questionButtonsHTML = `<h2 id="question-text" class="question-text">${item.question}</h2> <form> ${answersHTML} </form>`;

    return questionButtonsHTML;
  });

  return questionsHTMLArray;
}

/**
 * Display a question from the available questions.
 * @throws {Error} If no more questions are available.
 * @return {void}
 */
function displayQuestion() {
  "use strict";
  if (availableQuestionsCopy.length === 0) {
    throw new Error("No more questions remaining.");
  }

  const html = availableQuestionsCopy.pop();
  document.getElementById("question-container").innerHTML = html;

  const answerButtons = [...document.getElementsByClassName("answer-btn")];
  answerButtons.forEach((element) => element.addEventListener("click", (event) => showFeedbackAndNextQuestion(event)));
}

// questions are defined in scripts/questions-db.js
const availableQuestions = prepareQuestions(questions);
const availableQuestionsCopy = [...availableQuestions];
displayQuestion();
