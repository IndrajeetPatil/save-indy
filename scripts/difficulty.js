/**
 * @param {Event} event
 * @return {void}
 */
function setDifficultyLevel(event) {
  const options = [...event.target.options];
  const selectedOption = options.filter((option) => option.selected)[0].value;
  document.cookie = `level=${selectedOption}`;
}

const selectedElement = document.getElementById("difficulty-level-options");
selectedElement.addEventListener("change", (event) => setDifficultyLevel(event));
