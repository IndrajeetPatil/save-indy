const game = new Game();

// Load game assets
function preload() {
  "use strict";
  game.preload();
}

// Setup game
function setup() {
  "use strict";
  createCanvas(HEIGHT, WIDTH);
}

function draw() {
  "use strict";
  game.draw();
}
