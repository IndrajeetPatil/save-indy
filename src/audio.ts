import { createMixer } from "./mixer.ts";
import type { Mixer } from "./mixer.ts";
import { DIRGE, FANFARE, playCrack, playHiss, playPhrase } from "./sounds.ts";

/** The fanfare follows the crack of the winning whip. */
const FANFARE_DELAY_SECONDS = 0.22;
/** The dirge follows the hiss of the snake that won. */
const DIRGE_DELAY_SECONDS = 0.45;

// Safari's Audio Session API, which TypeScript's DOM types do not cover yet.
declare global {
  interface AudioSession {
    type: string;
  }

  interface Navigator {
    readonly audioSession?: AudioSession;
  }
}

/**
 * IOS treats Web Audio as ambient sound by default, so the Ring/Silent switch
 * mutes it while video and music still play. Declaring the page a playback
 * session makes the in-game mute button the one control over the sound.
 * Browsers without the Audio Session API ignore this.
 */
function playThroughSilentSwitch(): void {
  const { audioSession } = navigator;
  if (audioSession !== undefined) {
    audioSession.type = "playback";
  }
}

/**
 * Sound effects synthesised with the Web Audio API, so the game ships no
 * audio files. The audio context is created on the first effect, which always
 * follows a click or key press, as browser autoplay policies require.
 */
export class SoundEffects {
  #mixer: Mixer | null = null;
  #muted: boolean;

  public constructor(muted: boolean) {
    this.#muted = muted;
  }

  public get muted(): boolean {
    return this.#muted;
  }

  public set muted(value: boolean) {
    this.#muted = value;
  }

  /** A whip crack: a rising whoosh that ends in a sharp snap. */
  public whip(): void {
    const mixer = this.#ready();
    if (mixer !== null) {
      playCrack(mixer, mixer.context.currentTime);
    }
  }

  /** A snake hiss: breathy, wobbling noise that swells and fades. */
  public hiss(): void {
    const mixer = this.#ready();
    if (mixer !== null) {
      playHiss(mixer, mixer.context.currentTime);
    }
  }

  /** A final whip crack and a brass fanfare. */
  public win(): void {
    const mixer = this.#ready();
    if (mixer !== null) {
      const now = mixer.context.currentTime;
      playCrack(mixer, now);
      playPhrase(mixer, FANFARE, now + FANFARE_DELAY_SECONDS);
    }
  }

  /** A last hiss and a drooping brass dirge. */
  public lose(): void {
    const mixer = this.#ready();
    if (mixer !== null) {
      const now = mixer.context.currentTime;
      playHiss(mixer, now);
      playPhrase(mixer, DIRGE, now + DIRGE_DELAY_SECONDS);
    }
  }

  #ready(): Mixer | null {
    if (this.#muted) {
      return null;
    }
    if (this.#mixer === null) {
      playThroughSilentSwitch();
      this.#mixer = createMixer(new AudioContext());
    }
    // IOS also reports "interrupted" after a call or a trip to another app.
    if (this.#mixer.context.state !== "running") {
      void this.#mixer.context.resume();
    }
    return this.#mixer;
  }
}
