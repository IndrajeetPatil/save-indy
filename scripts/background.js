class Background {
  constructor() {
    this.width = WIDTH;
    this.heght = HEIGHT;
    this.background;
  }

  preload() {
    this.background = loadImage("../assets/background.png");
  }

  draw() {
    image(this.background, 0, 0, WIDTH, HEIGHT);
  }
}
