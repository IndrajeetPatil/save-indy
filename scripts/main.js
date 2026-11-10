"use strict";

const game = new Game();
showStatus();

// p5.js calls these global functions: preload() once, then setup() once, then draw() every frame

function preload() {
  game.preload();
}

function setup() {
  const canvas = createCanvas(WIDTH, HEIGHT);
  canvas.parent("game-container");
  describe("Indiana Jones trapped in a temple while a snake slithers towards him.");
}

function draw() {
  game.draw();
}
