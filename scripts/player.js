class Player {
  constructor() {
    this.health = 100;
    this.image;
  }

  preload() {
    this.image = loadImage("../assets/blood.png");
    this.sound = loadSound("../assets/man_scream_sound.mp3");
  }

  reduceHealth() {
    this.health -= 10;
  }

  checkHealth() {
    if (this.health === 0) {
      this.sound.play();
    }
  }

  draw() {
    image(this.image, PLAYER_X, PLAYER_Y, WIDTH / 5, HEIGHT / 5);
  }
}
