class Game {
  constructor() {
    this.background = new Background();
    this.spikesLeft = new SpikesLeft();
    this.spikesRight = new SpikesRight();
    this.player = new Player();
  }

  preload() {
    this.background.preload();
    this.spikesLeft.preload();
    this.spikesRight.preload();
    this.player.preload();
  }

  draw() {
    this.background.draw();
    this.spikesLeft.draw();
    this.spikesRight.draw();

    if (this.spikesLeft.getX() >= WIDTH / 4) {
      this.player.draw();
    }
  }
}

function keyPressed() {
  "use strict";
  if (keyCode === 32) {
    game.spikesLeft.move();
    game.spikesRight.move();
    game.player.reduceHealth();
    console.log(game.player.health);
    game.player.checkHealth();
  }

  if (keyCode === 13) {
    game.spikesLeft.retract();
    game.spikesRight.retract();
  }
}
