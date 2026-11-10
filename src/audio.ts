/** Seconds; every effect is short enough to finish before the next answer. */
const NOISE_SECONDS = 1;
const WHIP_SECONDS = 0.16;
const WHIP_SWEEP_SECONDS = 0.08;
const HISS_SECONDS = 0.7;
const NOTE_SECONDS = 0.14;
const NOTE_GAP_SECONDS = 0.11;
const ATTACK_SECONDS = 0.005;
const SILENT_GAIN = 0.0001;

const WHIP_GAIN = 0.7;
const HISS_GAIN = 0.18;
const NOTE_GAIN = 0.12;
const WHIP_FILTER_START_HZ = 1800;
const WHIP_FILTER_END_HZ = 7000;
const HISS_FILTER_HZ = 3800;

/** Equal-temperament pitches in hertz. */
const NOTE_HZ = {
  c4: 261.63,
  eFlat4: 311.13,
  f4: 349.23,
  g4: 392,
  c5: 523.25,
  e5: 659.25,
  g5: 783.99,
  c6: 1046.5,
} as const;

/** A C major arpeggio up for a win, a falling minor line for a loss. */
const WIN_NOTES = [NOTE_HZ.c5, NOTE_HZ.e5, NOTE_HZ.g5, NOTE_HZ.c6];
const LOSE_NOTES = [NOTE_HZ.g4, NOTE_HZ.f4, NOTE_HZ.eFlat4, NOTE_HZ.c4];

interface Envelope {
  readonly start: number;
  readonly peak: number;
  readonly end: number;
}

/**
 * Shape a gain node into a quick attack and an exponential decay.
 * @param gain Node to automate.
 * @param envelope Start time, peak level, and end time in context seconds.
 */
function applyEnvelope(gain: GainNode, envelope: Envelope): void {
  gain.gain.setValueAtTime(SILENT_GAIN, envelope.start);
  gain.gain.exponentialRampToValueAtTime(
    envelope.peak,
    envelope.start + ATTACK_SECONDS,
  );
  gain.gain.exponentialRampToValueAtTime(SILENT_GAIN, envelope.end);
}

/**
 * Sound effects synthesised with the Web Audio API, so the game ships no
 * audio files. The audio context is created on the first effect, which always
 * follows a click or key press, as browser autoplay policies require.
 */
export class SoundEffects {
  #context: AudioContext | null = null;
  #noise: AudioBuffer | null = null;
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

  /** A whip crack: a burst of noise swept upwards through a band-pass filter. */
  public whip(): void {
    const context = this.#ready();
    if (context === null) {
      return;
    }
    const now = context.currentTime;
    const filter = new BiquadFilterNode(context, { type: "bandpass", Q: 1 });
    filter.frequency.setValueAtTime(WHIP_FILTER_START_HZ, now);
    filter.frequency.exponentialRampToValueAtTime(
      WHIP_FILTER_END_HZ,
      now + WHIP_SWEEP_SECONDS,
    );
    this.#playNoise(context, filter, {
      start: now,
      peak: WHIP_GAIN,
      end: now + WHIP_SECONDS,
    });
  }

  /** A snake hiss: high-passed noise that swells and fades. */
  public hiss(): void {
    const context = this.#ready();
    if (context === null) {
      return;
    }
    const now = context.currentTime;
    const filter = new BiquadFilterNode(context, {
      type: "highpass",
      frequency: HISS_FILTER_HZ,
    });
    this.#playNoise(context, filter, {
      start: now,
      peak: HISS_GAIN,
      end: now + HISS_SECONDS,
    });
  }

  /** A rising arpeggio. */
  public win(): void {
    this.#playMelody(WIN_NOTES, "triangle");
  }

  /** A falling line. */
  public lose(): void {
    this.#playMelody(LOSE_NOTES, "square");
  }

  #ready(): AudioContext | null {
    if (this.#muted) {
      return null;
    }
    this.#context ??= new AudioContext();
    if (this.#context.state === "suspended") {
      void this.#context.resume();
    }
    return this.#context;
  }

  #noiseBuffer(context: AudioContext): AudioBuffer {
    if (this.#noise === null) {
      const length = context.sampleRate * NOISE_SECONDS;
      this.#noise = new AudioBuffer({ length, sampleRate: context.sampleRate });
      const samples = this.#noise.getChannelData(0);
      for (let index = 0; index < length; index += 1) {
        // The difference of two uniform samples spans (-1, 1), like a waveform.
        samples[index] = Math.random() - Math.random();
      }
    }
    return this.#noise;
  }

  #playNoise(
    context: AudioContext,
    filter: BiquadFilterNode,
    envelope: Envelope,
  ): void {
    const source = new AudioBufferSourceNode(context, {
      buffer: this.#noiseBuffer(context),
    });
    const gain = new GainNode(context);
    applyEnvelope(gain, envelope);
    source.connect(filter).connect(gain).connect(context.destination);
    source.start(envelope.start);
    source.stop(envelope.end);
  }

  #playMelody(notes: readonly number[], type: OscillatorType): void {
    const context = this.#ready();
    if (context === null) {
      return;
    }
    for (const [index, frequency] of notes.entries()) {
      const start = context.currentTime + index * NOTE_GAP_SECONDS;
      const oscillator = new OscillatorNode(context, { type, frequency });
      const gain = new GainNode(context);
      applyEnvelope(gain, {
        start,
        peak: NOTE_GAIN,
        end: start + NOTE_SECONDS,
      });
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + NOTE_SECONDS);
    }
  }
}
