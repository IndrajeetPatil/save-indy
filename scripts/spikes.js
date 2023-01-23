class Spikes {
  constructor() {
    this.x;
    this.y;
    this.width;
    this.height;
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  draw() {
    image(this.image, this.x, this.y, this.width, this.height);
  }
}

class SpikesLeft extends Spikes {
  constructor() {
    super();
    this.x = SPIKE_START_X;
    this.y = SPIKE_START_Y;
    this.width = SPIKE_START_LENGTH;
    this.height = SPIKE_THICKNESS;
    this.image;
    this.sound;
  }

  preload() {
    this.image = loadImage("../assets/long_wood_spike_left.png");
    this.sound = loadSound("../assets/spike_movement_sound.mp3");
  }

  move() {
    if (this.x < WIDTH / 2 - SPIKE_START_LENGTH) {
      this.x += SPIKE_INCREMENT;
      this.sound.play();
    }
  }

  retract() {
    if (this.x > 0) {
      this.x -= SPIKE_INCREMENT;
      this.sound.play();
    }
  }
}

class SpikesRight extends Spikes {
  constructor() {
    super();
    this.x = WIDTH - SPIKE_START_LENGTH;
    this.y = SPIKE_START_LENGTH;
    this.width = SPIKE_START_LENGTH;
    this.height = SPIKE_THICKNESS;
    this.image;
  }

  preload() {
    this.image = loadImage("../assets/long_wood_spike_right.png");
  }

  move() {
    if (this.x > WIDTH / 2) {
      this.x -= SPIKE_INCREMENT;
    }
  }

  retract() {
    if (this.x < WIDTH - SPIKE_START_LENGTH) {
      this.x += SPIKE_INCREMENT;
    }
  }
}

class ShortSpikesLeft extends Spikes {
  constructor() {
    super();
    this.image;
  }

  preload() {
    this.image = loadImage("../assets/short_wood.png");
  }

  update(width) {
    this.x = 0;
    this.y = SPIKE_START_LENGTH;
    this.width = width * 2;
    this.height = SPIKE_THICKNESS;
  }

  remove() {
    this.width -= SPIKE_INCREMENT;
  }
}

class ShortSpikesRight extends Spikes {
  constructor() {
    super();
    this.image;
  }

  preload() {
    this.image = loadImage("../assets/short_wood.png");
  }

  update(x, width) {
    this.x = x;
    this.y = SPIKE_START_LENGTH;
    this.width = width * 2;
    this.height = SPIKE_THICKNESS;
  }

  remove() {
    this.width += SPIKE_INCREMENT;
  }
}
