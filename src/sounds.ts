import { NOISE_SECONDS } from "./mixer.ts";
import type { Mixer } from "./mixer.ts";

const ATTACK_SECONDS = 0.005;
const SILENT_GAIN = 0.0001;

/** The whoosh lasts as long as the drawn whip takes to reach the snake. */
const WHOOSH_SECONDS = 0.12;
const WHOOSH_ATTACK_SECONDS = 0.1;
const WHOOSH_GAIN = 0.22;
const WHOOSH_FILTER_START_HZ = 500;
const WHOOSH_FILTER_END_HZ = 3500;
const SNAP_SECONDS = 0.06;
const SNAP_ATTACK_SECONDS = 0.001;
const SNAP_GAIN = 1;
const SNAP_FILTER_HZ = 1200;
const THUMP_SECONDS = 0.05;
const THUMP_GAIN = 0.35;
const THUMP_START_HZ = 900;
const THUMP_END_HZ = 140;

const HISS_SECONDS = 0.9;
const HISS_ATTACK_SECONDS = 0.12;
const HISS_GAIN = 0.6;
const HISS_FILTER_HZ = 6500;
const HISS_FILTER_Q = 0.7;
/** The hiss centre wobbles, so it sounds breathed rather than static. */
const HISS_WOBBLE_HZ = 7;
const HISS_WOBBLE_DEPTH_HZ = 900;

const BRASS_DETUNE_CENTS = 7;
const BRASS_ATTACK_SECONDS = 0.03;
const BRASS_RELEASE_SECONDS = 0.08;
const BRASS_SUSTAIN = 0.75;
/** Brightness of the lowpass at rest and at the bite of each note. */
const BRASS_FILTER_REST = 1.5;
const BRASS_FILTER_BITE = 6;
const BRASS_FILTER_SUSTAIN = 3;
/** Share of a sliding note held before the pitch starts to droop. */
const SLIDE_FROM = 0.4;
const VIBRATO_HZ = 5.5;
const VIBRATO_CENTS = 18;
const VIBRATO_DELAY_SECONDS = 0.15;

/** Equal-temperament pitches in hertz. */
const NOTE_HZ = {
  aSharp3: 233.08,
  b3: 246.94,
  c4: 261.63,
  cSharp4: 277.18,
  d4: 293.66,
  g4: 392,
  c5: 523.25,
  e5: 659.25,
  g5: 783.99,
} as const;

interface Note {
  /** Seconds after the phrase begins. */
  readonly at: number;
  readonly frequency: number;
  readonly seconds: number;
  readonly gain: number;
  readonly vibrato?: boolean;
  /** Pitch the note droops to by its end. */
  readonly slideTo?: number;
}

const FANFARE_GAIN = 0.16;
const CHORD_GAIN = 0.1;
const DIRGE_GAIN = 0.18;

/** A bugle-call pickup that lands on a held C major chord. */
const FANFARE: readonly Note[] = [
  { at: 0, frequency: NOTE_HZ.g4, seconds: 0.09, gain: FANFARE_GAIN },
  { at: 0.12, frequency: NOTE_HZ.g4, seconds: 0.09, gain: FANFARE_GAIN },
  { at: 0.24, frequency: NOTE_HZ.c5, seconds: 0.24, gain: FANFARE_GAIN },
  { at: 0.52, frequency: NOTE_HZ.e5, seconds: 0.12, gain: FANFARE_GAIN },
  ...[NOTE_HZ.c5, NOTE_HZ.e5, NOTE_HZ.g5].map((frequency) => ({
    at: 0.66,
    frequency,
    seconds: 0.9,
    gain: CHORD_GAIN,
    vibrato: true,
  })),
];

/** A drooping, muted-brass "wah wah wah waah". */
const DIRGE: readonly Note[] = [
  { at: 0, frequency: NOTE_HZ.d4, seconds: 0.3, gain: DIRGE_GAIN },
  { at: 0.36, frequency: NOTE_HZ.cSharp4, seconds: 0.3, gain: DIRGE_GAIN },
  { at: 0.72, frequency: NOTE_HZ.c4, seconds: 0.3, gain: DIRGE_GAIN },
  {
    at: 1.08,
    frequency: NOTE_HZ.b3,
    seconds: 1,
    gain: DIRGE_GAIN,
    vibrato: true,
    slideTo: NOTE_HZ.aSharp3,
  },
];

interface Envelope {
  readonly start: number;
  readonly peak: number;
  readonly end: number;
  readonly attack?: number;
}

/**
 * Shape a gain into a quick attack and an exponential decay.
 * @param gain Parameter to automate.
 * @param envelope Start time, peak level, end time, and optional attack.
 */
function applyEnvelope(gain: AudioParam, envelope: Envelope): void {
  const attack = envelope.attack ?? ATTACK_SECONDS;
  gain.setValueAtTime(SILENT_GAIN, envelope.start);
  gain.exponentialRampToValueAtTime(envelope.peak, envelope.start + attack);
  gain.exponentialRampToValueAtTime(SILENT_GAIN, envelope.end);
}

/**
 * Play a slice of the shared noise through a filter, shaped by an envelope.
 * @param mixer Graph to play into.
 * @param filter Node that colours the noise.
 * @param envelope Timing and level in context seconds.
 */
function playNoise(mixer: Mixer, filter: AudioNode, envelope: Envelope): void {
  const { context, noise } = mixer;
  const source = new AudioBufferSourceNode(context, { buffer: noise });
  const gain = new GainNode(context);
  applyEnvelope(gain.gain, envelope);
  source.connect(filter).connect(gain).connect(mixer.output);
  // A random slice keeps repeated effects from sounding identical.
  const seconds = envelope.end - envelope.start;
  source.start(envelope.start, Math.random() * (NOISE_SECONDS - seconds));
  source.stop(envelope.end);
}

/**
 * A whip crack: a rising whoosh that ends in a sharp snap.
 * @param mixer Graph to play into.
 * @param start Context time at which the swing begins.
 */
function playCrack(mixer: Mixer, start: number): void {
  const { context } = mixer;
  // The lash swinging through the air.
  const whoosh = new BiquadFilterNode(context, { type: "bandpass", Q: 1.5 });
  whoosh.frequency.setValueAtTime(WHOOSH_FILTER_START_HZ, start);
  whoosh.frequency.exponentialRampToValueAtTime(
    WHOOSH_FILTER_END_HZ,
    start + WHOOSH_SECONDS,
  );
  playNoise(mixer, whoosh, {
    start,
    peak: WHOOSH_GAIN,
    end: start + WHOOSH_SECONDS,
    attack: WHOOSH_ATTACK_SECONDS,
  });
  // The tip breaking the sound barrier: a broadband snap with some body.
  const snapAt = start + WHOOSH_SECONDS;
  const snap = new BiquadFilterNode(context, {
    type: "highpass",
    frequency: SNAP_FILTER_HZ,
  });
  playNoise(mixer, snap, {
    start: snapAt,
    peak: SNAP_GAIN,
    end: snapAt + SNAP_SECONDS,
    attack: SNAP_ATTACK_SECONDS,
  });
  const thump = new OscillatorNode(context, {
    type: "triangle",
    frequency: THUMP_START_HZ,
  });
  thump.frequency.setValueAtTime(THUMP_START_HZ, snapAt);
  thump.frequency.exponentialRampToValueAtTime(
    THUMP_END_HZ,
    snapAt + THUMP_SECONDS,
  );
  const gain = new GainNode(context);
  applyEnvelope(gain.gain, {
    start: snapAt,
    peak: THUMP_GAIN,
    end: snapAt + THUMP_SECONDS,
    attack: SNAP_ATTACK_SECONDS,
  });
  thump.connect(gain).connect(mixer.output);
  thump.start(snapAt);
  thump.stop(snapAt + THUMP_SECONDS);
}

/**
 * A snake hiss: breathy, wobbling noise that swells and fades.
 * @param mixer Graph to play into.
 * @param start Context time at which the hiss begins.
 */
function playHiss(mixer: Mixer, start: number): void {
  const { context } = mixer;
  const end = start + HISS_SECONDS;
  const filter = new BiquadFilterNode(context, {
    type: "bandpass",
    frequency: HISS_FILTER_HZ,
    Q: HISS_FILTER_Q,
  });
  const wobble = new OscillatorNode(context, { frequency: HISS_WOBBLE_HZ });
  wobble
    .connect(new GainNode(context, { gain: HISS_WOBBLE_DEPTH_HZ }))
    .connect(filter.frequency);
  wobble.start(start);
  wobble.stop(end);
  playNoise(mixer, filter, {
    start,
    peak: HISS_GAIN,
    end,
    attack: HISS_ATTACK_SECONDS,
  });
}

/**
 * A vibrato that fades in after the note settles.
 * @param context Audio context to build the oscillator in.
 * @param note Note to sing, timed in context seconds.
 * @returns A node to connect to each oscillator's detune, in cents.
 */
function addVibrato(context: AudioContext, note: Note): AudioNode {
  const end = note.at + note.seconds;
  const lfo = new OscillatorNode(context, { frequency: VIBRATO_HZ });
  const depth = new GainNode(context, { gain: 0 });
  depth.gain.setValueAtTime(0, note.at + VIBRATO_DELAY_SECONDS);
  depth.gain.linearRampToValueAtTime(VIBRATO_CENTS, end);
  lfo.connect(depth);
  lfo.start(note.at);
  lfo.stop(end);
  return depth;
}

/**
 * One brass note: two detuned saws through a lowpass that opens on the
 * attack, like a player's lips buzzing into the horn.
 * @param mixer Graph to play into.
 * @param note Pitch, timing in context seconds, level, and expression.
 */
function playBrass(mixer: Mixer, note: Note): void {
  const { context } = mixer;
  const { at: start, frequency, gain: peak } = note;
  const bite = start + BRASS_ATTACK_SECONDS;
  const end = start + note.seconds;
  // Very short notes skip the sustain and fade straight after the bite.
  const release = Math.max(end - BRASS_RELEASE_SECONDS, bite);
  const filter = new BiquadFilterNode(context, { type: "lowpass", Q: 1 });
  filter.frequency.setValueAtTime(frequency * BRASS_FILTER_REST, start);
  filter.frequency.linearRampToValueAtTime(frequency * BRASS_FILTER_BITE, bite);
  filter.frequency.exponentialRampToValueAtTime(
    frequency * BRASS_FILTER_SUSTAIN,
    end,
  );
  const gain = new GainNode(context, { gain: 0 });
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(peak, bite);
  gain.gain.linearRampToValueAtTime(peak * BRASS_SUSTAIN, release);
  gain.gain.exponentialRampToValueAtTime(SILENT_GAIN, end);
  filter.connect(gain).connect(mixer.output);
  const vibrato = note.vibrato === true ? addVibrato(context, note) : null;
  for (const detune of [-BRASS_DETUNE_CENTS, BRASS_DETUNE_CENTS]) {
    const oscillator = new OscillatorNode(context, {
      type: "sawtooth",
      frequency,
      detune,
    });
    if (note.slideTo !== undefined) {
      oscillator.frequency.setValueAtTime(
        frequency,
        start + note.seconds * SLIDE_FROM,
      );
      oscillator.frequency.exponentialRampToValueAtTime(note.slideTo, end);
    }
    vibrato?.connect(oscillator.detune);
    oscillator.connect(filter);
    oscillator.start(start);
    oscillator.stop(end);
  }
}

/**
 * Play a phrase of brass notes.
 * @param mixer Graph to play into.
 * @param notes Notes timed from the start of the phrase.
 * @param start Context time at which the phrase begins.
 */
function playPhrase(mixer: Mixer, notes: readonly Note[], start: number): void {
  for (const note of notes) {
    playBrass(mixer, { ...note, at: start + note.at });
  }
}

export { DIRGE, FANFARE, playCrack, playHiss, playPhrase };
