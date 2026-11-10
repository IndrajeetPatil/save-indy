"use strict";

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

/**
 * Map a 0-100 value to the low/medium/high key used by the status classes.
 * @param {number} value
 * @return {"low" | "medium" | "high"}
 */
const decideLevel = (value) => {
  if (value <= 40) {
    return "low";
  }
  return value <= 70 ? "medium" : "high";
};

/**
 * Show the current threat and health values with their colour-coded classes.
 * @param {number} threat
 * @param {number} health
 * @return {void}
 */
const renderStatus = (threat, health) => {
  const threatValue = document.getElementById("threat-value");
  const healthValue = document.getElementById("health-value");

  threatValue.textContent = threat;
  threatValue.className = threatLevelClasses[decideLevel(threat)];
  healthValue.textContent = health;
  healthValue.className = healthLevelClasses[decideLevel(health)];
};
