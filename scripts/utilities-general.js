function shuffleArray(array) {
  "use strict";
  if (array.length === 0) {
    throw new Error("Array is empty.");
  }

  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  let selectedLevel = parts.pop();
  return selectedLevel === "undefined" ? "beginner" : selectedLevel;
}
