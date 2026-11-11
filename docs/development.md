# Development

_Save Indy!_ is a TypeScript single-page app built with
[Vite+](https://viteplus.dev/) (`vp`), which also manages Node.js (from
`.node-version`) and pnpm (from `packageManager` in `package.json`).

## How it is built

- The temple, explorer, and snake are pixel art drawn in code on a 160 × 120
  canvas that CSS scales up with square pixels.
- Sound effects are synthesised at runtime with the Web Audio API and played
  through a convolution reverb; nothing is loaded from audio files.
- The site is static, with no runtime dependencies beyond a self-hosted font
  and Google Analytics, and the production build ships a strict Content
  Security Policy.

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

| Path                                    | Contents                                                                               |
| --------------------------------------- | -------------------------------------------------------------------------------------- |
| `index.html`                            | Page markup: scene, stats, and the three screens                                       |
| `src/questions.ts`                      | The question bank, with an explanation for every answer                                |
| `src/game.ts`                           | Pure game rules: scoring, outcomes, and question order                                 |
| `src/app.ts`, `view.ts`                 | The controller and the DOM rendering it drives                                         |
| `src/scene/`                            | Pixel art, sprites, and the animated canvas scene                                      |
| `src/audio.ts`, `sounds.ts`, `mixer.ts` | Synthesised sound effects, their voices, and the reverb mix                            |
| `src/analytics.ts`                      | Google Analytics, skipped on localhost                                                 |
| `e2e-tests/`                            | Playwright gameplay tests and axe accessibility audits                                 |
| `public/`                               | Icons, manifest, social image, sitemap, `llms.txt`, 404 page, and the old-URL redirect |
| `scripts/render-assets.ts`              | Renders the PNG icons and social image from the game                                   |
| `hextools/`                             | R script that renders the hex sticker logo                                             |
| `docs/`                                 | This guide and the images the README uses                                              |

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

| Level        | Pitch it at                                                                 |
| ------------ | --------------------------------------------------------------------------- |
| Beginner     | Values, types, operators, truthiness, and everyday string and array methods |
| Intermediate | Scope, closures, `this`, destructuring, iteration, promises, and JSON       |
| Advanced     | Hoisting, Unicode, symbols, property order, proxies, and the event loop     |

## Deployment

Every push to `main` builds the site and publishes `dist/` to GitHub Pages via
the [Deploy workflow](../.github/workflows/deploy.yml).

## Analytics

`src/analytics.ts` loads the same Google Analytics tag as every page of
[indrapatil.com](https://www.indrapatil.com/privacy/), except on `localhost`
and `127.0.0.1`, so local runs, tests and Lighthouse send nothing. It loads
from that module rather than an inline script, so the Content Security Policy
in `vite.config.ts` only adds Google's tag and collection hosts and never
`'unsafe-inline'`.

## Search, AI and social sharing

The game draws itself with JavaScript, so everything crawlers, AI assistants
and social networks read is static and lives in `index.html` and `public/`.
`e2e-tests/discovery.spec.ts` checks it.

| What                                                       | Where                                                                               |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Title, description, canonical URL, `robots`                | `index.html` head                                                                   |
| Open Graph and Twitter card (`summary_large_image`)        | `index.html` head, image `public/og-image.png`                                      |
| `VideoGame` and `BreadcrumbList` structured data (JSON-LD) | `index.html` head                                                                   |
| Summary for readers and crawlers without JavaScript        | `<noscript>` on the start screen                                                    |
| [llms.txt](https://llmstxt.org/) for AI assistants         | `public/llms.txt`, linked with `rel="describedby"`                                  |
| Sitemap                                                    | `public/sitemap.xml`, one URL                                                       |
| Not-found page (`noindex`, links back to the game)         | `public/404.html`, which GitHub Pages serves with a 404 status for any unknown path |

Keep the head, the `<noscript>` summary and `llms.txt` in step with the
README's features. The structured data follows indrapatil.com's: the author is
its `#person` node and the page has no `dateModified`. `public/404.html` is
self-contained, with absolute links, because it answers for paths at any depth.
Crawlers read `robots.txt` only at the domain root, which indrapatil.com
publishes, so the game ships none.

## Images

| Image                      | How to update it                                                             |
| -------------------------- | ---------------------------------------------------------------------------- |
| `docs/images/feedback.png` | Screenshot of a beginner question answered wrongly, at a 1280 × 800 viewport |
| `docs/images/logo.png`     | Run the script in [`hextools/`](../hextools/README.md)                       |
