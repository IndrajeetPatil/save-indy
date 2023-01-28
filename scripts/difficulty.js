function setDifficultyLevel(event) {
  let options = [...event.target.options];
  let selectedOption = options.filter((option) => option.selected)[0].value;
  document.cookie = `level=${selectedOption}`;
}

let selectedElement = document.getElementById("difficulty-level-options");
selectedElement.addEventListener("change", (event) => setDifficultyLevel(event));
