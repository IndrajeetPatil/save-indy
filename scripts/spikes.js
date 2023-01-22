class Spikes {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image;
  }

  preload() {
    this.image = loadImage("../assets/long_wood_spike.png");
  }

  draw() {
    image(this.image, this.x, this.y, this.width, this.height);
  }
}
