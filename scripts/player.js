class Player {
  constructor() {
    this.health = PLAYER_HEALTH;
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
  }

  increaseHealth() {
    this.health += PLAYER_HEALTH_CHANGE;
    this.soundThanks.play();
  }

  isDead() {
    return this.health <= 0;
  }

  scream() {
    if (this.health <= 0) {
      this.soundScream.play();
    }
  }

  draw() {
    image(this.image, PLAYER_X, PLAYER_Y, PLAYER_WIDTH, PLAYER_HEIGHT);
  }
}
