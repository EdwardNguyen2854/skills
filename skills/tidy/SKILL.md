---
name: tidy
description: Audit unused files and project organization, then carry out an approved, recoverable cleanup that keeps the project professional and understandable. Use when the owner asks to clean up, remove unused files, organize the directory, reduce clutter, or review whether the project layout is sound.
metadata:
  collection: edwardnguyen2854-skills
  workflow-contract: "2"
  required-skills: verify
---

# Tidy

Clean up with evidence, not cosmetic guesswork.

Read [the shared delivery contract](references/contract.md).

## 1. Inspect

Inventory tracked, untracked and ignored files, build/configuration entry points, tests, docs, scripts, packaging, deployment references and generated output. Read relevant guidance and conventions.

Do not treat "no import found" as proof a file is unused. Check likely dynamic loading, plugins, package exports, migrations, fixtures, public URLs, documentation references, external consumers and build tooling. Git history may show origin/purpose; it is not proof of current use.

Before running a cleanup/audit command, inspect what it actually does. A script named "clean" or "test" is not authority to delete outside the approved scope.

Protect by default:

- User data, uploads, databases, backups and exports.
- Secrets and environment files (do not read/expose contents just to classify them).
- Historical migrations or fixtures whose retention is uncertain.
- Untracked/modified files containing unrecorded work.
- Dependencies or files you cannot verify.

## 2. Propose

Classify candidates:

- **Confirmed obsolete:** evidence supports removal/consolidation; state recovery method.
- **Uncertain:** keep and explain what would resolve the uncertainty.
- **Active but misplaced:** propose the smallest move that follows conventions.

Make a scoped cleanup plan with:

- Purpose and expected benefit.
- Exact paths to move/remove and references to update.
- What is explicitly preserved.
- Recovery method. Git recovery exists only for content recorded in a commit; modified/untracked content needs an approved copy.
- Build/test/entry-point checks.

For a small, clearly reversible cleanup within an existing approved plan/task, proceed only under applicable approval. Broad removals, unknown dependencies, user data, secrets or large reorganizations need specific owner permission. In judgment mode, do not treat delegated implementation as permission to delete unknown material.

Professional layout means understandable, conventional and minimal enough to navigate—not a large aesthetic reshuffle. Keep conventional root files where tooling expects them. Do not add many folder layers or an indefinite pile of backups.

## 3. Execute safely

1. Preserve anything required by the recovery plan.
2. Make the scoped moves/removals without touching unrelated work.
3. Update imports, config, scripts, docs, links and packaging.
4. Check dynamic/external paths where knowable.
5. Run relevant build/tests and verify affected entry points.
6. Reinspect for broken references and unexpected generated files.

Never use broad recursive cleanup, delete outside the approved scope, overwrite user changes, or stage unrelated removals in a feature commit.

## 4. Report

State:

- What moved/was removed and why.
- What was deliberately preserved and why.
- What was verified and what remains uncertain.
- Recovery instructions.
- Follow-up cleanup not performed.

Cleanup is not a substitute for functional verification. If unrelated obsolete code is discovered during a feature, capture it as a follow-up unless it blocks the current outcome.
