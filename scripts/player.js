class Player {
  constructor() {
    this.health = 100;
    this.image;
  }

  preload() {
    this.image = loadImage("../assets/blood.png");
  }

  draw() {
    image(this.image, PLAYER_X, PLAYER_Y, WIDTH / 5, HEIGHT / 5);
  }
}
