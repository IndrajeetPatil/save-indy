# Development

_Save Indy!_ is a TypeScript single-page app built with
[Vite+](https://viteplus.dev/) (`vp`), which also manages Node.js (from
`.node-version`) and pnpm (from `packageManager` in `package.json`).

## How it is built

- The temple, explorer, and snake are pixel art drawn in code on a 160 × 120
  canvas that CSS scales up with square pixels.
- Sound effects are synthesised at runtime with the Web Audio API and played
  through a convolution reverb; nothing is loaded from audio files.
- The site is static, with no runtime dependencies beyond a self-hosted font,
  and the production build ships a strict Content Security Policy.

## Tasks

| Task                                 | Command                            |
| ------------------------------------ | ---------------------------------- |
| Install dependencies                 | `vp install`                       |
| Start the dev server with hot reload | `vp dev`                           |
| Run every check, as CI does          | `vp run qa`                        |
| Format, lint, and type-check         | `vp check`                         |
| Unit tests in Chromium               | `vp test`                          |
| Build and run end-to-end tests       | `vp run test:e2e`                  |
| Build and preview production assets  | `vp run preview`                   |
| Lighthouse audit of the build        | `vp run lighthouse`                |
| Re-render PNG icons and social image | `vp build && vp run render-assets` |

## Project structure

| Path                                    | Contents                                                    |
| --------------------------------------- | ----------------------------------------------------------- |
| `index.html`                            | Page markup: scene, stats, and the three screens            |
| `src/questions.ts`                      | The question bank, with an explanation for every answer     |
| `src/game.ts`                           | Pure game rules: scoring, outcomes, and question order      |
| `src/app.ts`, `view.ts`                 | The controller and the DOM rendering it drives              |
| `src/scene/`                            | Pixel art, sprites, and the animated canvas scene           |
| `src/audio.ts`, `sounds.ts`, `mixer.ts` | Synthesised sound effects, their voices, and the reverb mix |
| `e2e-tests/`                            | Playwright gameplay tests and axe accessibility audits      |
| `public/`                               | Icons, web manifest, social image, and the old-URL redirect |
| `scripts/render-assets.ts`              | Renders the PNG icons and social image from the game        |
| `hextools/`                             | R script that renders the hex sticker logo                  |
| `docs/`                                 | This guide and the images the README uses                   |

## Quality gates

`vp run qa` runs the same gates as the [QA workflow](../.github/workflows/qa.yml):

| Gate                       | Tool                                                                                           |
| -------------------------- | ---------------------------------------------------------------------------------------------- |
| Formatting, lint, types    | Oxfmt and type-aware Oxlint with every rule category on                                        |
| CSS lint                   | Biome                                                                                          |
| Unit tests                 | Vitest in real Chromium, with coverage thresholds                                              |
| Dead code and complexity   | Fallow                                                                                         |
| Type coverage              | `type-coverage` at 100%                                                                        |
| Dependency audit           | `pnpm audit` at moderate severity                                                              |
| Gameplay and accessibility | Playwright with axe-core (WCAG 2.2 AA) in Chromium, desktop Safari (WebKit), and iPhone Safari |
| Web quality                | Lighthouse CI                                                                                  |

## Adding a question

1. Add an entry to `src/questions.ts` with a level, a prompt, four distinct
   answers, the correct one, and a one-sentence explanation.
2. Wrap code in backticks to show it as inline code.
3. Run the code in the question before committing, so the answer and
   explanation match what JavaScript actually does.

The unit tests check that every question is well-formed and that each level
has enough questions to finish a round.

| Level        | Pitch it at                                                                    |
| ------------ | ------------------------------------------------------------------------------ |
| Beginner     | Values, types, operators, truthiness, and everyday string and array methods    |
| Intermediate | Scope, destructuring, optional chaining, iteration, `this`, and JSON           |
| Advanced     | Hoisting details, Unicode strings, object conversion, copying, and strict mode |

## Deployment

Every push to `main` builds the site and publishes `dist/` to GitHub Pages via
the [Deploy workflow](../.github/workflows/deploy.yml).

## Images

| Image                      | How to update it                                                             |
| -------------------------- | ---------------------------------------------------------------------------- |
| `docs/images/feedback.png` | Screenshot of a beginner question answered wrongly, at a 1280 × 800 viewport |
| `docs/images/logo.png`     | Run the script in [`hextools/`](../hextools/README.md)                       |
