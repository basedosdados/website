# CLAUDE.md — Data Basis Website

## Git Flow (branch & PR workflow)

**Read this before creating branches, committing, or opening PRs. This repo follows Git Flow.**
Canonical reference: https://github.com/basedosdados/backend/wiki/Boas-Pr%C3%A1ticas#segue-o-fluxo

### The environment branches — never commit or push directly
- `main` — production (basedosdados.org).
- `staging` — pre-production / QA.
- `development` — integration / testing. First target for new work.

These three are **parallel, independently maintained** branches, not a linear chain.
Their histories have diverged, so you never merge one environment branch into another to
move a feature — that would drag the whole environment forward. Each feature is promoted
into each environment **selectively**, via its own PR carrying only that feature.

Note: the integration branch here is named `development` (full word), not `dev`.

### Feature workflow — promote the feature, not the environment
1. Cut your feature branch off `development` (the branch you integrate and test in first).
   Name it by intent: `feat/…`, `fix/…`, `chore/…`, `docs/…`, `refactor/…`.
   Keep one logical change per branch, with tidy commits — you will cherry-pick them.
2. Open a PR from that branch into `development`.
3. To promote the same feature to `staging`, cut a new branch off `staging` and
   cherry-pick only this feature's commit(s) onto it, then open a PR into `staging`.
4. To promote to `main`, repeat: cut a branch off `main`, cherry-pick the same commit(s),
   open a PR into `main`.
5. Result: one clean PR per environment, each carrying only this feature.

### Rules for agents working in this repo
- Never commit or push to `main`, `staging`, or `development` directly.
- Move a feature between environments by cherry-picking it onto a branch cut off the
  target — never by merging `development → staging` or `staging → main`.
- Each promotion branch is cut off its own target, so the PR diff is only this feature.
- One logical change per branch; one PR at a time per target; keep commits clean for cherry-picking.
- Before committing, verify you are on a feature branch: `git branch --show-current`.
- Do not push without explicit permission.
