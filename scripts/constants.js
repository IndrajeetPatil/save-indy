const messages = {
  loseNoQuestions: "No more questions left. Game Over! <br>You didn't save Indy 🪦",
  losePlayerDead: "Game Over! <br>You didn't save Indy 🪦",
  winPlayerSafe: "You have won! <br>You saved Indy 🙏",
};

const HEIGHT = window.innerWidth > 800 ? 800 : window.innerWidth;
const WIDTH = window.innerWidth > 800 ? 800 : window.innerWidth;

// TODO: change to 10 when enough questions are added
const MIN_STEPS_TO_WIN = 5;

const PLAYER_SIZE = 50;
const PLAYER_X = WIDTH / 2 - PLAYER_SIZE / 2;
const PLAYER_Y = HEIGHT / 2 - PLAYER_SIZE / 2;
const PLAYER_WIDTH = WIDTH / 5;
const PLAYER_HEIGHT = HEIGHT / 5;
const PLAYER_START_HEALTH = 50;

const SNAKE_START_LENGTH = WIDTH / 4;
const SNAKE_THICKNESS = HEIGHT / 10;
const SNAKE_START_X = 0;
const SNAKE_START_Y = 0.65 * HEIGHT;
const SNAKE_INCREMENT = (WIDTH / 2 - SNAKE_START_LENGTH) / MIN_STEPS_TO_WIN;
const SNAKE_START_THREAT = PLAYER_START_HEALTH;

const PLAYER_HEALTH_CHANGE = PLAYER_START_HEALTH / MIN_STEPS_TO_WIN;
const SNAKE_THREAT_CHANGE = SNAKE_START_THREAT / MIN_STEPS_TO_WIN;
