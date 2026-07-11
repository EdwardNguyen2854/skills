---
name: setup
description: Set up a repository for issue-first AI development. Use when the user runs /setup or asks to configure a repo with planning docs, GitHub Issues, issue templates, labels, milestones, AGENTS.md guidance, ADRs, Definition of Done, and the Capture, Plan, Start, Build, Review, Ship loop.
---

# Setup

Configure the current repository to use the issue-first AI development workflow.

This skill is prompt-driven. Explore first, show what you found, ask before overwriting, then write the smallest useful setup.

## Core Principle

Plan Mode decides what to build. Build Mode implements only the approved plan. Review Mode checks whether the work is safe to merge.

## Process

### 1. Explore

Inspect the current repo before proposing changes:

- `git remote -v` and `.git/config` if present.
- Existing `README.md`, `VISION.md`, `CONTEXT.md`, `DOD.md`, `CHANGELOG.md`, `AGENTS.md`, `CLAUDE.md`.
- Existing `docs/specs/`, `docs/adr/`, `docs/agents/`.
- Existing `.github/ISSUE_TEMPLATE/` files.
- Current package/build/test commands if the repo has application code.
- Whether `gh` is available and authenticated if GitHub setup is requested.

### 2. Present Findings

Summarize:

- Files that already exist.
- Files that are missing.
- Files that should be updated instead of created.
- Any risk of overwriting user-authored docs.

Ask for confirmation before editing existing docs in a meaningful way.

### 3. Create Or Update Core Files

Create or update these files when they are missing or approved:

```text
README.md
VISION.md
CONTEXT.md
DOD.md
CHANGELOG.md
AGENTS.md

docs/specs/v0.1.0.md
docs/adr/README.md
docs/adr/template.md
docs/agents/domain.md
docs/agents/issue-tracker.md
docs/agents/triage-labels.md
docs/agents/feature-loop.md

.github/ISSUE_TEMPLATE/feature.md
.github/ISSUE_TEMPLATE/bug.md
.github/ISSUE_TEMPLATE/task.md
.github/ISSUE_TEMPLATE/experiment.md
.github/ISSUE_TEMPLATE/ai-run.md
```

Keep every file lightweight and editable. Do not create fake ADRs.

### 4. GitHub Setup

If the repo uses GitHub and the user wants GitHub setup:

- Confirm or create the current milestone, usually `v0.1.0`.
- Confirm or create labels for type, area, priority, needs, and risk.
- Document the recommended project status values in `docs/agents/issue-tracker.md`.
- Do not force-create a GitHub Project if permissions or preferences are unclear. Record the intended project convention instead.

Recommended project statuses:

```text
Inbox
Needs Plan
Planning
Ready for Build
Building
Review
Fixing
Ready to Ship
Shipped
Parked
```

### 5. Final Summary

Report:

- Files created.
- Files updated.
- GitHub labels, milestone, or project conventions configured.
- Anything intentionally left for the owner.

## File Guidance

### `VISION.md`

Explain why the product exists, who it serves, what problem it solves, what it should feel like, and the high-level product concepts. This file should change rarely.

### `CONTEXT.md`

Define official product terms and rejected synonyms. Use this format:

```md
**Run**:
One execution attempt to complete a Task using a specific Agent Version and fixed inputs.
_Avoid_: Session, Conversation, Job
```

### `DOD.md`

Define when an issue is done, when code is ready to merge, and when a release is safe enough to ship.

### `AGENTS.md`

Tell AI agents which docs to read first, how to use GitHub Issues, how to follow the feature loop, when to use branch vs worktree, when to stop, and how to review before merge.

## Rules

- Do not overwrite existing docs without summarizing proposed changes first.
- Do not create fake ADRs.
- Do not invent product vision details. Use placeholders or ask.
- Prefer GitHub Issues for active work.
- Keep setup lightweight. The owner should be able to edit everything by hand.
