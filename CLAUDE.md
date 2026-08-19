# CLAUDE.md — Data Basis Website

## Git Flow (branch & PR workflow)

**Read this before creating branches, committing, or opening PRs. This repo follows Git Flow.**
Canonical reference: https://github.com/basedosdados/backend/wiki/Boas-Pr%C3%A1ticas#segue-o-fluxo

### The environment branches — never commit or push directly
- `main` — production (basedosdados.org). Source of truth: resets flow *from* `main`.
- `staging` — pre-production / QA.
- `development` — integration / testing.

### How work flows
Every feature starts from `main` and is promoted back into the other environments using
**one branch and three PRs** — the same head branch is PR'd into `development`, `staging`, and
`main`. Merging the same branch into each target puts the *same commit objects* into all
three, so the feature's own commits share SHAs everywhere. Only the merge commits differ,
which is expected and fine.

The environments still drift apart as those merge commits accumulate at different times, so
the team **resets `staging` and `development` back to `main` roughly every two weeks**. Because
resets flow *from* `main`, a change must reach `main` to survive — anything living only on
`staging` or `development` is discarded at the next reset.

### Feature workflow — one branch, three PRs
1. Cut your feature branch off `main` — never off `staging` or `development`.
   Name it by intent: `feat/…`, `fix/…`, `chore/…`, `docs/…`, `refactor/…`.
   One logical change per branch.
2. From that **same branch**, open three PRs: one into `development`, one into `staging`, one
   into `main`. Do not cut a separate branch per target, and do not cherry-pick.
3. Merge with a **merge commit or fast-forward — never squash**. A squash mints a new,
   unrelated commit on each branch and breaks the shared history the resets rely on.
4. Timing: a `main`-based branch merges cleanly into `development`/`staging` when those are
   aligned with `main` — in practice, shortly after a reset. The longer since the last
   reset, the more of `main`'s accumulated commits the PR will drag along. If a target has
   drifted far, wait for the reset rather than forcing a noisy merge.

### Rules for agents working in this repo
- Never commit or push to `main`, `staging`, or `development` directly — always a feature branch + PR.
- Always cut features off `main`, never off `staging` or `development`.
- Use **one branch for all three PRs**. Never a branch-per-target, never cherry-pick.
- **Never squash-merge.** Merge commit or fast-forward only.
- Never merge one environment branch into another to promote a feature.
- Before committing, verify you are on a feature branch: `git branch --show-current`.
- Do not push without explicit permission.
