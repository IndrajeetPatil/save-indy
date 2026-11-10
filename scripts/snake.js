"use strict";

class Snake {
  constructor() {
    this.x = SNAKE_START_X;
    this.y = SNAKE_START_Y;
    this.width = SNAKE_START_LENGTH;
    this.height = SNAKE_THICKNESS;
    this.threat = SNAKE_START_THREAT;
    this.image = null;
    this.sound = null;
  }

  preload() {
    this.image = loadImage("../assets/snake_px.png");
    this.sound = loadSound("../assets/snake_hissing_sound.mp3");
  }

  move() {
    if (this.x < WIDTH / 2) {
      this.x += SNAKE_INCREMENT;
      this.threat += SNAKE_THREAT_CHANGE;
      this.sound.play();
    }
  }

  retract() {
    this.x -= SNAKE_INCREMENT;
    this.threat -= SNAKE_THREAT_CHANGE;
  }

  isThreateningPlayer() {
    return this.threat > 0;
  }

  draw() {
    image(this.image, this.x, this.y, this.width, this.height);
  }
}
