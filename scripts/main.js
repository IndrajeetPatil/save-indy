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
  // let cnv = createCanvas(HEIGHT, WIDTH);
  //cnv.parent("myContainer");
}

function draw() {
  "use strict";
  game.draw();
}
