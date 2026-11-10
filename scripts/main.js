"use strict";

const game = new Game();
showStatus();

// p5.js calls these global functions: preload() once, then setup() once, then draw() every frame

// eslint-disable-next-line no-unused-vars
function preload() {
  game.preload();
}

// eslint-disable-next-line no-unused-vars
function setup() {
  const canvas = createCanvas(WIDTH, HEIGHT);
  canvas.parent("game-container");
  describe("Indiana Jones trapped in a temple while a snake slithers towards him.");
}

// eslint-disable-next-line no-unused-vars
function draw() {
  game.draw();
}
