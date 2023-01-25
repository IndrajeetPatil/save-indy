class Player {
  constructor() {
    this.health = PLAYER_START_HEALTH;
    this.image;
    this.soundScream;
    this.soundThanks;
  }

  preload() {
    this.image = loadImage("../assets/blood.png");
    this.soundScream = loadSound("../assets/man_scream_sound.mp3");
    this.soundThanks = loadSound("../assets/man_thanks_sound.mp3");
  }

  reduceHealth() {
    this.health -= PLAYER_HEALTH_CHANGE;
    if (this.health <= 0) {
      this.soundScream.play();
    }
  }

  increaseHealth() {
    if (this.health < 100) {
      this.health += PLAYER_HEALTH_CHANGE;
      this.soundThanks.play();
    }
  }

  isDead() {
    return this.health <= 0;
  }

  draw() {
    image(this.image, PLAYER_X, PLAYER_Y, PLAYER_WIDTH, PLAYER_HEIGHT);
  }
}
