class Game {
  constructor() {
    this.background = new Background();
    this.spikesLeft = new SpikesLeft();
    this.spikesRight = new SpikesRight();
    this.shortSpikesLeft = new ShortSpikesLeft();
    this.ShortSpikesRight = new ShortSpikesRight();
    this.player = new Player();
  }

  preload() {
    this.background.preload();
    this.spikesLeft.preload();
    this.spikesRight.preload();
    this.shortSpikesLeft.preload();
    this.ShortSpikesRight.preload();
    this.player.preload();
  }

  draw() {
    this.background.draw();
    this.spikesLeft.draw();
    this.spikesRight.draw();

    let currentLeftSpikesX = this.spikesLeft.getX();
    if (currentLeftSpikesX > 0) {
      this.shortSpikesLeft.update(currentLeftSpikesX);
      this.shortSpikesLeft.draw();
    }

    let currentRightSpikesX = this.spikesRight.getX();

    if (currentRightSpikesX < WIDTH - SPIKE_START_LENGTH) {
      let startingX = currentRightSpikesX + SPIKE_START_LENGTH;
      let width = WIDTH - startingX;
      this.ShortSpikesRight.update(startingX, width);
      this.ShortSpikesRight.draw();
    }

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
    game.player.checkHealth();
  }

  if (keyCode === 13) {
    game.spikesLeft.retract();
    game.spikesRight.retract();
    game.ShortSpikesLeft.remove();
  }
}
