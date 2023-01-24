const game = new Game();

function preload() {
  "use strict";
  game.preload();
}

function setup() {
  "use strict";
  let cnv = createCanvas(HEIGHT, WIDTH);
  cnv.parent("game-container");
}

function draw() {
  "use strict";
  game.draw();
}
