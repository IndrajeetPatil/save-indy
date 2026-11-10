/** Seconds of shared white noise; each effect plays a random slice of it. */
const NOISE_SECONDS = 2;
/** A stone temple rings for a while: the reverb tail and how fast it dies. */
const REVERB_SECONDS = 1.6;
const REVERB_DECAY_POWER = 3;
const REVERB_MIX = 0.22;
const MASTER_GAIN = 0.8;

/** The audio graph every effect plays into, built once per context. */
interface Mixer {
  readonly context: AudioContext;
  readonly output: AudioNode;
  readonly noise: AudioBuffer;
}

/**
 * Fill a buffer with white noise, optionally fading out like a room's echo.
 * @param context Audio context that will play the buffer.
 * @param options Length in seconds, channel count, and decay exponent.
 * @param options.seconds Buffer length.
 * @param options.channels One for mono, two for a stereo room.
 * @param options.decay Exponent of the fade-out; zero keeps a steady level.
 * @returns The filled buffer.
 */
function noiseBuffer(
  context: AudioContext,
  options: { seconds: number; channels: number; decay: number },
): AudioBuffer {
  const length = Math.round(context.sampleRate * options.seconds);
  const buffer = new AudioBuffer({
    length,
    numberOfChannels: options.channels,
    sampleRate: context.sampleRate,
  });
  for (let channel = 0; channel < options.channels; channel += 1) {
    const samples = buffer.getChannelData(channel);
    for (let index = 0; index < length; index += 1) {
      // The difference of two uniform samples spans (-1, 1), like a waveform.
      const level = (1 - index / length) ** options.decay;
      samples[index] = (Math.random() - Math.random()) * level;
    }
  }
  return buffer;
}

/**
 * Route effects through a gentle compressor and a stone-temple reverb.
 * @param context Audio context to build the graph in.
 * @returns The mixer that effects play into.
 */
function createMixer(context: AudioContext): Mixer {
  const compressor = new DynamicsCompressorNode(context, {
    threshold: -18,
    ratio: 4,
    attack: 0.003,
    release: 0.25,
  });
  compressor.connect(context.destination);
  const output = new GainNode(context, { gain: MASTER_GAIN });
  output.connect(compressor);
  const reverb = new ConvolverNode(context, {
    buffer: noiseBuffer(context, {
      seconds: REVERB_SECONDS,
      channels: 2,
      decay: REVERB_DECAY_POWER,
    }),
  });
  output
    .connect(reverb)
    .connect(new GainNode(context, { gain: REVERB_MIX }))
    .connect(compressor);
  const noise = noiseBuffer(context, {
    seconds: NOISE_SECONDS,
    channels: 1,
    decay: 0,
  });
  return { context, output, noise };
}

export { NOISE_SECONDS, createMixer };
export type { Mixer };
