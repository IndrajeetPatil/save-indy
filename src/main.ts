// The pixel font is only used for English headings and labels.
import "@fontsource/press-start-2p/latin-400.css";
import "./styles.css";
import { startAnalytics } from "./analytics.ts";
import { startApp } from "./app.ts";
import { SoundEffects } from "./audio.ts";
import { byId } from "./dom.ts";
import { Scene } from "./scene/scene.ts";
import { loadMuted, saveMuted } from "./storage.ts";

const reducedMotion = globalThis.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const scene = new Scene(
  byId(document, "scene", HTMLCanvasElement),
  reducedMotion,
);
scene.start();

startApp({
  root: document,
  stage: scene,
  sound: new SoundEffects(loadMuted()),
  onMuteChange: saveMuted,
});

startAnalytics(document, globalThis.location.hostname, globalThis);
