class Game {
  constructor() {
    this.background = new Background();
    this.snake = new Snake();
    this.player = new Player();
  }

  preload() {
    this.background.preload();
    this.snake.preload();
    this.player.preload();
  }

  draw() {
    this.background.draw();
    this.snake.draw();

    if (this.snake.getX() >= WIDTH / 4) {
      this.player.draw();
    }
  }
}

function keyPressed() {
  "use strict";
  if (keyCode === 32) {
    game.snake.move();
    game.player.reduceHealth();
    game.player.checkHealth();
  }

  if (keyCode === 13) {
    game.snake.retract();
  }
}
