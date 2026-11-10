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

// Give the browser Safari's Audio Session API for the length of one test.
const stubAudioSession = () => {
  const audioSession = { type: "auto" };
  vi.stubGlobal("navigator", { audioSession });
  return audioSession;
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

  test("builds the temple reverb once and shares it across effects", () => {
    const reverbs = vi.spyOn(globalThis, "ConvolverNode");
    const sound = new SoundEffects(false);

    playAll(sound);
    playAll(sound);

    expect(reverbs).toHaveBeenCalledOnce();
  });

  test("plays through the iPhone silent switch once sound starts", () => {
    const audioSession = stubAudioSession();
    const sound = new SoundEffects(false);

    expect(audioSession.type).toBe("auto");

    sound.whip();

    expect(audioSession.type).toBe("playback");
  });

  test("leaves the audio session alone while muted", () => {
    const audioSession = stubAudioSession();

    playAll(new SoundEffects(true));

    expect(audioSession.type).toBe("auto");
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
