class Spikes {
  constructor() {
    this.x = SPIKE_X;
    this.y = SPIKE_START_LENGTH;
    this.width = SPIKE_START_LENGTH;
    this.height = SPIKE_WIDTH;
  }

  draw() {
    image(this.image, this.x, this.y, this.width, this.height);
  }
}

class SpikesLeft extends Spikes {
  constructor() {
    super();
    this.x = SPIKE_X;
    this.y = SPIKE_START_LENGTH;
    this.width = SPIKE_START_LENGTH;
    this.height = SPIKE_WIDTH;
    this.image;
  }

  preload() {
    this.image = loadImage("../assets/long_wood_spike_left.png");
  }

  move() {
    this.x += SPIKE_INCREMENT;
  }
}

class SpikesRight extends Spikes {
  constructor() {
    super();
    this.x = WIDTH - SPIKE_START_LENGTH;
    this.y = SPIKE_START_LENGTH;
    this.width = SPIKE_START_LENGTH;
    this.height = SPIKE_WIDTH;
    this.image;
  }

  preload() {
    this.image = loadImage("../assets/long_wood_spike_right.png");
  }

  move() {
    this.x -= SPIKE_INCREMENT;
  }
}
