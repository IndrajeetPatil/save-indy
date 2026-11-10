import js from "@eslint/js";
import globals from "globals";

// The game runs as classic scripts that share globals in the load order of game/index.html
const projectGlobals = Object.fromEntries(
  [
    // constants.js
    "messages",
    "LEVELS",
    "DEFAULT_LEVEL",
    "FEEDBACK_DELAY",
    "WIDTH",
    "HEIGHT",
    "PLAYER_X",
    "PLAYER_Y",
    "PLAYER_WIDTH",
    "PLAYER_HEIGHT",
    "PLAYER_START_HEALTH",
    "PLAYER_MAX_HEALTH",
    "SNAKE_START_LENGTH",
    "SNAKE_THICKNESS",
    "SNAKE_START_X",
    "SNAKE_START_Y",
    "SNAKE_INCREMENT",
    "SNAKE_START_THREAT",
    "PLAYER_HEALTH_CHANGE",
    "SNAKE_THREAT_CHANGE",
    // other scripts
    "shuffleArray",
    "getSelectedLevel",
    "setTextWithCode",
    "renderStatus",
    "questions",
    "remainingQuestions",
    "currentQuestion",
    "displayQuestion",
    "showStatus",
    "showFeedbackAndNextQuestion",
    "Background",
    "Snake",
    "Player",
    "Game",
    "game",
  ].map((name) => [name, "writable"]),
);

// p5.js and p5.sound functions used in global mode
const p5Globals = Object.fromEntries(
  ["createCanvas", "describe", "image", "loadImage", "loadSound", "userStartAudio"].map((name) => [name, "readonly"]),
);

export default [
  js.configs.recommended,
  {
    files: ["scripts/**/*.js"],
    languageOptions: {
      sourceType: "script",
      globals: { ...globals.browser, ...projectGlobals, ...p5Globals },
    },
    rules: {
      // Top-level declarations are shared with the other scripts, so only flag unused locals
      "no-unused-vars": ["error", { vars: "local" }],
      "no-redeclare": ["error", { builtinGlobals: false }],
    },
  },
];
