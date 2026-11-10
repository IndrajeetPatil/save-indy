"use strict";

class Background {
  constructor() {
    this.image = null;
  }

  preload() {
    this.image = loadImage("../assets/background.png");
  }

  draw() {
    image(this.image, 0, 0, WIDTH, HEIGHT);
  }
}
