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

Keep Lighthouse in a self-contained `lighthouse.yml` workflow named
`Lighthouse`. Exclude privacy pages, use native LHCI assertion output for
coloured measurements, and retain report artifacts after failures. Cache
setup dependencies and the toolchain, but always collect fresh measurements.
Use `vp build --logLevel warn` for the Lighthouse build.
Do not introduce a shared action, reusable Lighthouse workflow, or custom
reporter.

Run `vp run qa` for implementation changes. Never lower a threshold or disable
a check to get green. A lint rule may be switched off only with a comment
saying why, as in `vite.config.ts`.

## Learn from mistakes

When a check fails, a reviewer raises a finding, or you notice a mistake in
your own work, fix it, then ask what led you to it. If `AGENTS.md` or a doc
under `docs/` gave missing, ambiguous, or wrong guidance, correct that
guidance in the same pull request, stating the general rule rather than the
incident. Never weaken a quality gate instead.

## Pull requests

Follow these rules without relying on any instructions outside this
repository:

- Write every commit message and PR title as a Conventional Commit,
  `type(scope): description`, lowercase and imperative, with an allowed type
  (`build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`,
  `revert`, `style`, `test`). Keep the PR title and body in sync with the
  net diff.

- Open every PR ready for review with `gh pr create`, never as a draft.

- Never add agent or tool attribution to commits, PRs, or comments.

- For visual changes, post before/after screenshots to the PR.

- After opening or pushing, wait for hosted CI to finish. Inspect failed jobs,
  fix the cause, run the local checks (`vp run qa`), push, and repeat.
  Skipped, queued, or failing required checks are not success.

- If an automatic AI review (Codex, for the owner) runs on the PR, wait for
  its result instead of requesting one. Fix merited findings, reply to and
  resolve addressed threads, and continue until the review approves the
  current head with no unresolved findings. Never write `@codex` anywhere in
  a PR, even in backticks: it cancels the automatic review. Say "a Codex
  review request" instead.

- If Codex reports exhausted usage, leave the PR open and report it; no other
  reviewer or silence counts as approval. Once usage refreshes, comment
  `@codex review` once; only this case needs the comment.

- Once CI is green and the review gate is met, squash-merge, then verify the
  merged state. Recheck the head, threads, and checks immediately before
  merging, and never bypass branch protections.

- Update a PR branch from `main` only to resolve conflicts or pick up a change
  the PR depends on, never just to bring it up to date.

- Report local validation, hosted CI, review, and merge state separately. If
  an external blocker stops completion, leave the PR open and say so.
