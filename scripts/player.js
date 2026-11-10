"use strict";

class Player {
  constructor() {
    this.health = PLAYER_START_HEALTH;
    this.image = null;
    this.soundScream = null;
    this.soundWhip = null;
  }

  preload() {
    this.image = loadImage("../assets/blood.png");
    this.soundScream = loadSound("../assets/man_scream_sound.mp3");
    this.soundWhip = loadSound("../assets/whip_sound.mp3");
  }

  reduceHealth() {
    this.health -= PLAYER_HEALTH_CHANGE;
    if (this.isDead()) {
      this.soundScream.play();
    }
  }

  increaseHealth() {
    this.health = Math.min(this.health + PLAYER_HEALTH_CHANGE, PLAYER_MAX_HEALTH);
    this.soundWhip.play();
  }

  isDead() {
    return this.health <= 0;
  }

  draw() {
    image(this.image, PLAYER_X, PLAYER_Y, PLAYER_WIDTH, PLAYER_HEIGHT);
  }
}
