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

let decideHealthLevelClass = (health) => {
  "use strict";
  if (health >= 0 && health <= 40) {
    return healthLevelClasses.low;
  } else if (health > 40 && health <= 70) {
    return healthLevelClasses.medium;
  } else {
    return healthLevelClasses.high;
  }
};

let decideThreatLevelClass = (threat) => {
  "use strict";
  if (threat >= 0 && threat <= 40) {
    return threatLevelClasses.low;
  } else if (threat > 40 && threat <= 70) {
    return threatLevelClasses.medium;
  } else {
    return threatLevelClasses.high;
  }
};

let PLAYER_START_HEALTH_LEVEL_CLASS = decideHealthLevelClass(PLAYER_START_HEALTH);
let SNAKE_START_THREAT_LEVEL_CLASS = decideThreatLevelClass(SNAKE_START_THREAT);
