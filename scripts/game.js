class Game {
  constructor() {
    this.spikes = new Spikes(SPIKE_X, SPIKE_START_LENGTH, SPIKE_START_LENGTH, SPIKE_WIDTH);
    this.backgrund;
  }

  preload() {
    this.spikes.preload();
    this.backgrund = loadImage("../assets/background.png");
  }

  draw() {
    image(this.backgrund, 0, 0, WIDTH, HEIGHT);

    this.spikes.draw();
  }
}
