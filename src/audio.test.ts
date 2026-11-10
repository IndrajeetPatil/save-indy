import { describe, expect, test, vi } from "vite-plus/test";

import { SoundEffects } from "./audio.ts";

// Count AudioContext constructions while still building real ones.
const trackContexts = () => vi.spyOn(globalThis, "AudioContext");

const playAll = (sound: SoundEffects) => {
  sound.whip();
  sound.hiss();
  sound.win();
  sound.lose();
};

describe(SoundEffects, () => {
  test("stays silent and creates no audio context while muted", () => {
    const created = trackContexts();
    const sound = new SoundEffects(true);

    playAll(sound);

    expect(sound.muted).toBe(true);
    expect(created).not.toHaveBeenCalled();
  });

  test("creates one audio context on the first effect and reuses it", () => {
    const created = trackContexts();
    const sound = new SoundEffects(false);

    expect(created).not.toHaveBeenCalled();

    playAll(sound);

    expect(created).toHaveBeenCalledOnce();
  });

  test("can be muted after playing", () => {
    const created = trackContexts();
    const sound = new SoundEffects(false);
    sound.whip();

    sound.muted = true;
    sound.hiss();

    expect(sound.muted).toBe(true);
    expect(created).toHaveBeenCalledOnce();
  });
});
