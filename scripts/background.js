/**
 * Background
 * @class Background
 * @param {number} width - The width of the background
 * @param {number} height - The height of the background
 * @param {object} background - The background image
 * @param {function} preload - Preload the background image
 * @param {function} draw - Draw the background image
 */
class Background {
  constructor() {
    this.width = WIDTH;
    this.heght = HEIGHT;
    this.background = "";
  }

  preload() {
    this.background = loadImage("../assets/background.png");
  }

  draw() {
    image(this.background, 0, 0, WIDTH, HEIGHT);
  }
}
