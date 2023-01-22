class Game {
  constructor() {
    this.spikesLeft = new SpikesLeft();
    this.spikesRight = new SpikesRight();
    this.background = new Background();
  }

  preload() {
    this.spikesLeft.preload();
    this.spikesRight.preload();
    this.background.preload();
  }

  draw() {
    this.background.draw();
    this.spikesLeft.draw();
    this.spikesRight.draw();
  }
}

function keyPressed() {
  "use strict";
  if (keyCode === 32) {
    game.spikesLeft.move();
    game.spikesRight.move();
  }
}
