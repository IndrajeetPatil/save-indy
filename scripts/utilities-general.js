"use strict";

/**
 * Return a shuffled copy of an array (Fisher-Yates).
 * @param {Array} array
 * @return {Array}
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Read the difficulty level chosen on the home page from the `level` query parameter.
 * Falls back to the default level when it is missing or unknown.
 * @return {string}
 */
function getSelectedLevel() {
  const level = new URLSearchParams(window.location.search).get("level");
  return LEVELS.includes(level) ? level : DEFAULT_LEVEL;
}

/**
 * Fill an element with text, rendering `backtick`-delimited spans as inline code.
 * Text with an unpaired backtick (e.g. the answer "`" itself) is shown verbatim.
 * @param {HTMLElement} element
 * @param {string} text
 * @return {void}
 */
function setTextWithCode(element, text) {
  const parts = text.split("`");
  if (parts.length % 2 === 0) {
    element.textContent = text;
    return;
  }

  element.replaceChildren(
    ...parts.map((part, index) => {
      if (index % 2 === 0) {
        return document.createTextNode(part);
      }
      const code = document.createElement("code");
      code.textContent = part;
      return code;
    }),
  );
}
