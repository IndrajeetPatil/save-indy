let HEIGHT = 800;
let WIDTH = HEIGHT;

let PLAYER_SIZE = 50;
let PLAYER_X = WIDTH / 2 - PLAYER_SIZE / 2;
let PLAYER_Y = HEIGHT / 2 - PLAYER_SIZE / 2;
let PLAYER_WIDTH = WIDTH / 5;
let PLAYER_HEIGHT = HEIGHT / 5;
let PLAYER_START_HEALTH = 100;

let SNAKE_START_LENGTH = WIDTH / 4;
let SNAKE_THICKNESS = HEIGHT / 10;
let SNAKE_START_X = 0;
let SNAKE_START_Y = 0.65 * HEIGHT;
let SNAKE_STEPS = 5;
let SNAKE_INCREMENT = (WIDTH / 2 - SNAKE_START_LENGTH) / SNAKE_STEPS;
let SNAKE_START_THREAT = PLAYER_START_HEALTH / 2;

let PLAYER_HEALTH_CHANGE = PLAYER_START_HEALTH / SNAKE_STEPS;
let SNAKE_THREAT_CHANGE = PLAYER_HEALTH_CHANGE / 2;

let threatLevelClasses = {
  low: "low-threat",
  medium: "medium-threat",
  high: "high-threat",
};

let healthLevelClasses = {
  low: "low-health",
  medium: "medium-health",
  high: "high-health",
};
