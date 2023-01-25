const HEIGHT = 800;
const WIDTH = HEIGHT;

const PLAYER_SIZE = 50;
const PLAYER_X = WIDTH / 2 - PLAYER_SIZE / 2;
const PLAYER_Y = HEIGHT / 2 - PLAYER_SIZE / 2;
const PLAYER_WIDTH = WIDTH / 5;
const PLAYER_HEIGHT = HEIGHT / 5;
const PLAYER_START_HEALTH = 100;

const SNAKE_START_LENGTH = WIDTH / 4;
const SNAKE_THICKNESS = HEIGHT / 10;
const SNAKE_START_X = 0;
const SNAKE_START_Y = 0.65 * HEIGHT;
const SNAKE_STEPS = 5;
const SNAKE_INCREMENT = (WIDTH / 2 - SNAKE_START_LENGTH) / SNAKE_STEPS;
const SNAKE_START_THREAT = PLAYER_START_HEALTH / 2;

const PLAYER_HEALTH_CHANGE = PLAYER_START_HEALTH / SNAKE_STEPS;
const SNAKE_THREAT_CHANGE = PLAYER_HEALTH_CHANGE / 2;

const threatLevelClasses = {
  low: "low-threat",
  medium: "medium-threat",
  high: "high-threat",
};

const healthLevelClasses = {
  low: "low-health",
  medium: "medium-health",
  high: "high-health",
};
