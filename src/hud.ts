import { MAX_STAT } from "./config.ts";

type StatState = "good" | "warn" | "bad";

/** A labelled meter and the number shown beside it. */
interface Stat {
  readonly meter: HTMLElement;
  readonly value: HTMLElement;
}

/** Above this share of the scale a stat counts as high; at or below "low", low. */
const HIGH_SHARE = 0.7;
const LOW_SHARE = 0.4;
const PERCENT = 100;

type Band = "low" | "mid" | "high";

const STATE_BY_BAND: Record<
  "highIsGood" | "highIsBad",
  Record<Band, StatState>
> = {
  highIsGood: { low: "bad", mid: "warn", high: "good" },
  highIsBad: { low: "good", mid: "warn", high: "bad" },
};

function band(share: number): Band {
  if (share > HIGH_SHARE) {
    return "high";
  }
  return share <= LOW_SHARE ? "low" : "mid";
}

function statState(share: number, highIsGood: boolean): StatState {
  return STATE_BY_BAND[highIsGood ? "highIsGood" : "highIsBad"][band(share)];
}

function renderStat(stat: Stat, value: number, highIsGood: boolean): void {
  const clamped = Math.max(0, Math.min(value, MAX_STAT));
  const share = clamped / MAX_STAT;
  stat.meter.setAttribute("aria-valuenow", String(clamped));
  stat.meter.dataset["state"] = statState(share, highIsGood);
  stat.meter.style.setProperty("--fill", `${share * PERCENT}%`);
  stat.value.textContent = String(clamped);
}

/**
 * @param stats The threat and health meters.
 * @param threat Threat on the 0-100 scale.
 * @param health Health on the 0-100 scale.
 */
function renderStats(
  stats: { readonly threat: Stat; readonly health: Stat },
  threat: number,
  health: number,
): void {
  renderStat(stats.threat, threat, false);
  renderStat(stats.health, health, true);
}

export type { Stat };
export { renderStats };
