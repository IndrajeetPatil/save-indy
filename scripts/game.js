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

    if (this.player.isDead()) {
      this.player.draw();
    }
  }
}
