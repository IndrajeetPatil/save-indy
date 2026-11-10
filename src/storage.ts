const MUTED_KEY = "save-indy:muted";

/**
 * Read a stored flag, treating unavailable storage (private browsing, blocked
 * cookies) as "not set" so the game still runs.
 * @param key Storage key.
 * @returns Whether the flag is set.
 */
function readFlag(key: string): boolean {
  try {
    return globalThis.localStorage.getItem(key) === "true";
  } catch {
    return false;
  }
}

/**
 * Store a flag, ignoring unavailable storage.
 * @param key Storage key.
 * @param value Flag value.
 */
function writeFlag(key: string, value: boolean): void {
  try {
    globalThis.localStorage.setItem(key, String(value));
  } catch {
    // The preference simply won't persist.
  }
}

/**
 * @returns Whether the player muted the sound on an earlier visit.
 */
export function loadMuted(): boolean {
  return readFlag(MUTED_KEY);
}

/**
 * @param muted Whether sound is off.
 */
export function saveMuted(muted: boolean): void {
  writeFlag(MUTED_KEY, muted);
}
