# Save Indy!

A TypeScript quiz game with a canvas pixel-art scene, built with Vite+ and
deployed to GitHub Pages. Start with the [README](README.md) and the
[development guide](docs/development.md).

## Gotchas

- The toolchain is Vite+ (`vp`), configured in `vite.config.ts`. Use `vp`
  commands (`vp check`, `vp test`, `vp run <task>`, `vp exec <bin>`,
  `vp pm <command>`) rather than calling pnpm, Node.js, or Vitest directly.
- All text reaches the page through `textContent` or `setRichText`; lint
  forbids `innerHTML` and similar sinks. Keep it that way: the production
  build ships a strict Content Security Policy.
- The scene renders at 160 × 120 and CSS scales it with square pixels. The
  background must stay fully opaque, or earlier frames show through (a unit
  test guards this).
- Questions live in `src/questions.ts`. Verify any JavaScript claim by running
  it before adding or changing a question or explanation.
- Docs describe the current state only; history belongs in commits and PRs.

## Checks

Run `vp run qa` for implementation changes. Never lower a threshold or disable
a check to get green. A lint rule may be switched off only with a comment
saying why, as in `vite.config.ts`.

## Pull requests

- Commit messages and PR titles follow Conventional Commits.
- Publish PRs ready for review; wait for the QA workflow and fix failures.
- For visual changes, post before/after screenshots to the PR.
