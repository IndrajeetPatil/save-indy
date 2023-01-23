const game = new Game();

// Load game assets
function preload() {
  "use strict";
  game.preload();
}

// Setup game
function setup() {
  "use strict";
  let cnv = createCanvas(HEIGHT, WIDTH);
  cnv.parent("game-container");
}

function draw() {
  "use strict";
  game.draw();
}
