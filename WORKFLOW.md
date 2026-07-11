# Issue-First AI Development Workflow

This document defines the lightweight AI-assisted development workflow behind this skills collection.

It is the source design document for the installable skills in `skills/engineering/`. Users should start with `README.md` and `/setup`; contributors should use this file to understand the full workflow model before changing individual skills.

The workflow is designed for solo or small-team development where the final product may not be fully known upfront. It supports iterative building, many AI coding runs per release, GitHub Issues as the active planning system, and branch/worktree isolation before implementation.

The goal is not to create a heavy Scrum or enterprise process. The goal is to create enough structure so that AI-assisted development stays clear, traceable, reviewable, and safe to merge.

## Acknowledgements

This workflow is inspired by Matt Pocock's excellent [Skills for Real Engineers](https://github.com/mattpocock/skills). Matt's work shaped the idea of small, composable agent skills that preserve engineering judgment instead of replacing it with heavyweight process.

---

## 1. Workflow Philosophy

This workflow is based on one principle:

> Plan Mode decides what to build. Build Mode implements only the approved plan. Review Mode checks whether the work is safe to merge.

The workflow accepts that product understanding often emerges through iteration. Instead of requiring a complete roadmap or large upfront PRD, it uses stable documents, GitHub Issues, project boards, milestones, labels, and AI run notes to preserve direction and memory.

### Core beliefs

- The product vision should stay stable.
- The current release should be clear enough to guide work.
- GitHub Issues should hold active requirements, tasks, bugs, plans, and AI run notes.
- AI should not write code before planning.
- Implementation should happen in a branch or worktree, not directly on `main`.
- Every meaningful feature should be reviewed before merge.
- Important decisions should be recorded so future AI runs do not undo them.
- The changelog should describe what actually shipped, not what was planned.

---

## 2. Main Workflow

The main loop is:

```text
Capture → Plan → Start → Build → Review → Fix → Ship
```

In practical terms:

```text
GitHub Issue
  ↓
Plan Mode discussion
  ↓
Approved implementation plan
  ↓
Branch or worktree
  ↓
Build Mode implementation
  ↓
Review Mode
  ↓
Fix loop if needed
  ↓
Merge to main
  ↓
Update issue and changelog
```

---

## 3. Agile SDLC Mapping

| Agile SDLC Phase | Workflow Phase | Main Artifact / Tool | Purpose |
|---|---|---|---|
| Concept / Inception | Product direction | `VISION.md` | Defines why the product exists and who it serves |
| Domain Understanding | Shared vocabulary | `CONTEXT.md` | Defines official product terms and concepts |
| Planning | Release anchor | `docs/specs/v0.1.0.md` | Defines the goal and scope of the current release |
| Requirements | Capture | GitHub Issues | Stores PRD-level requirements, tasks, bugs, and experiments |
| Design / Analysis | Plan | Issue plan comment | Discusses the approach before implementation |
| Development Setup | Start | Branch or worktree | Creates an isolated implementation workspace |
| Development | Build | Code changes | Implements the approved plan |
| Testing / Validation | Review | Review report / PR review | Checks the result against scope, plan, and quality gates |
| Stabilization | Fix | Follow-up commits | Fixes review findings without expanding scope |
| Release Integration | Ship | Merge to `main` | Merges completed work and closes the loop |
| Release Notes | Ship | `CHANGELOG.md` | Records what actually changed |
| Retrospective / Learning | Follow-up | New issues / ADRs | Captures new work, decisions, and lessons |

---

## 4. Repository Documents

The workflow uses a small set of stable Markdown documents.

### Root files

```text
README.md
VISION.md
CONTEXT.md
DOD.md
CHANGELOG.md
AGENTS.md
```

### Docs folder

```text
docs/
  specs/
    v0.1.0.md

  adr/
    README.md
    template.md
    0001-*.md

  agents/
    domain.md
    issue-tracker.md
    triage-labels.md
    feature-loop.md
```

### GitHub configuration

```text
.github/
  ISSUE_TEMPLATE/
    feature.md
    bug.md
    task.md
    experiment.md
    ai-run.md
```

---

## 5. Document Responsibilities

### `README.md`

The project entry point.

It should explain:

- What the project is.
- What the current state is.
- Where important docs live.
- How contributors or AI agents should start.

It should stay short and practical.

---

### `VISION.md`

The product vision.

It should explain:

- Why the app exists.
- Who the target users are.
- What core problems the app solves.
- What the product should feel like.
- What high-level concepts define the product.

This file should change rarely.

---

### `CONTEXT.md`

The shared domain vocabulary.

It should define official product terms and rejected synonyms.

Example:

```md
**Run**:
One execution attempt to complete a Task using a specific Agent Version and fixed inputs.
_Avoid_: Session, Conversation, Job
```

This file helps humans and AI agents use consistent language in issues, UI, code, tests, and documentation.

---

### `DOD.md`

The Definition of Done.

It defines the quality gate for issues, branches, pull requests, and releases.

It should answer:

- When is an issue done?
- When is code ready to merge?
- When is a release safe enough to ship?

Example checks:

- Acceptance criteria are met.
- The approved plan was followed.
- Scope did not expand without approval.
- Domain terms follow `CONTEXT.md`.
- Relevant ADRs are respected.
- Manual validation was completed.
- No known blocking bugs remain.
- `CHANGELOG.md` was updated when user-facing behavior changed.

---

### `CHANGELOG.md`

The release history.

It records what actually shipped.

It should not be a planning document. It should be updated after meaningful changes are completed or before a release is closed.

Suggested sections:

```md
## [v0.1.0] - Unreleased

### Added

### Changed

### Fixed

### Removed
```

---

### `AGENTS.md`

The main AI agent operating guide.

It should tell coding agents:

- Which docs to read first.
- How to use GitHub Issues.
- How to follow the AI Feature Loop.
- When to use branch vs worktree.
- When to stop and ask questions.
- How to review before merge.

This file replaces tool-specific agent instruction files and should be general enough for different AI coding agents.

---

### `docs/specs/v0.1.0.md`

The release specification.

It is a lightweight release-level spec, not a heavy PRD.

It should explain:

- Release goal.
- Target user.
- Core user journey.
- Must-ship items.
- Nice-to-have items.
- Out-of-scope items.
- Acceptance criteria.
- Open questions.
- Linked GitHub issues.

This file replaces a heavy roadmap for the current release.

---

### `docs/adr/*.md`

Architecture Decision Records.

ADRs record important product or technical decisions that future work should respect.

Use ADRs for decisions that are:

- Long-lasting.
- Hard to reverse.
- Important to the product model.
- Important to architecture.
- Likely to affect many future issues.

Do not create ADRs for small temporary choices.

Example ADR topics:

- Local-first and single-owner for v0.1.0.
- Immutable Run attempts.
- Report immutability.
- Owner-supplied credentials.
- Native Windows distribution without Docker.

---

### `docs/agents/domain.md`

Agent guide for domain documentation.

It should tell agents:

- Read `CONTEXT.md` before working.
- Use the official glossary terms.
- Avoid rejected synonyms.
- Check relevant ADRs before changing affected areas.
- Surface conflicts with ADRs instead of silently overriding them.

---

### `docs/agents/issue-tracker.md`

Agent guide for GitHub Issues.

It should define that:

- GitHub Issues are the source of truth for PRDs, tasks, bugs, and experiments.
- GitHub Issues should be managed with `gh` CLI.
- Issue comments are used for plans, AI run summaries, review findings, and handoffs.
- GitHub PRs can also be triaged using the same labels and project status.

---

### `docs/agents/triage-labels.md`

Agent guide for labels.

It should explain the label system and when each label should be used.

Labels classify work. They should not replace project status.

---

### `docs/agents/feature-loop.md`

The detailed AI Feature Loop instruction file.

It should explain:

- How to start from an issue.
- How to plan before coding.
- How to create a branch or worktree.
- How to build only the approved scope.
- How to review.
- How to fix review findings.
- How to ship and close the loop.

---

## 6. GitHub System

This workflow uses GitHub as the active project management system.

```text
GitHub Project = execution board
GitHub Milestone = release boundary
GitHub Labels = classification and filtering
GitHub Issues = PRDs, tasks, bugs, experiments, and AI run memory
GitHub PRs = review and merge surface
```

---

## 7. GitHub Project

The GitHub Project is the execution board.

Recommended project name:

```text
Project Delivery
```

or project-specific:

```text
Agent Base Delivery
```

### Recommended Status field

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

### Status meanings

| Status | Meaning |
|---|---|
| Inbox | Captured but not processed yet |
| Needs Plan | Needs Plan Mode discussion |
| Planning | Agent or Owner is creating/refining the implementation plan |
| Ready for Build | Plan approved and ready for implementation |
| Building | Implementation is in progress |
| Review | Build is complete and needs review |
| Fixing | Review found issues that must be fixed |
| Ready to Ship | Review passed and work is ready to merge |
| Shipped | Work has been merged or completed |
| Parked | Not rejected, but intentionally paused |

### Recommended Project views

| View | Purpose |
|---|---|
| Current Release | Issues in the active milestone grouped by Status |
| Planning Queue | Issues in Inbox, Needs Plan, or Planning |
| Build Queue | Issues in Ready for Build or Building |
| Review Queue | Issues in Review, Fixing, or Ready to Ship |
| Blocked / Decisions | Issues with `blocked` or `needs:decision` |
| Backlog | Issues without a milestone |
| Experiments | Issues labeled `type:experiment` |

---

## 8. GitHub Milestones

Milestones represent releases.

Examples:

```text
v0.1.0
v0.2.0
v1.0.0
```

A milestone answers:

- Which issues belong to this release?
- How much work remains?
- What must be done before shipping?

Milestones should not be used for workflow status. Status belongs in the GitHub Project board.

### Relationship with release specs

```text
docs/specs/v0.1.0.md = release intent and scope
GitHub Milestone v0.1.0 = issues assigned to that release
CHANGELOG.md = what actually shipped
```

---

## 9. GitHub Labels

Labels classify issues and PRs.

Labels should be stable and searchable. Avoid using too many labels for workflow status if the GitHub Project already has a Status field.

### Type labels

```text
type:feature
type:bug
type:task
type:experiment
type:research
type:docs
type:refactor
type:chore
```

### Area labels

Use area labels to show where the issue belongs.

Example for Agent Base:

```text
area:agent
area:workflow
area:task
area:run
area:report
area:source
area:connector
area:credential
area:ui
area:data
area:local
area:docs
area:project
area:release
```

### Priority labels

```text
priority:p0
priority:p1
priority:p2
priority:p3
```

Suggested meaning:

| Label | Meaning |
|---|---|
| `priority:p0` | Blocking, urgent, or release-critical |
| `priority:p1` | Important for the current release |
| `priority:p2` | Useful but not blocking |
| `priority:p3` | Low priority or future improvement |

### Needs labels

```text
needs:plan
needs:decision
needs:review
needs:owner-input
needs:research
needs:prototype
```

### Risk labels

```text
risk:architecture
risk:data
risk:breaking-change
risk:security
risk:scope-creep
```

### Other useful labels

```text
ai-run
blocked
good-first-issue
out-of-scope
follow-up
```

---

## 10. Issue Types

### Feature issue

Use for user-visible or product-visible capability.

Example:

```text
Create Run detail timeline
```

Feature issues should include:

- Goal.
- User value.
- Scope.
- Acceptance criteria.
- Notes.

---

### Bug issue

Use for broken or incorrect behavior.

Bug issues should include:

- Expected behavior.
- Actual behavior.
- Steps to reproduce.
- Impact.
- Acceptance criteria for the fix.

---

### Task issue

Use for internal work that is not directly user-facing.

Examples:

- Rename a domain model.
- Add a validation helper.
- Clean up release docs.

---

### Experiment issue

Use when the outcome is uncertain.

Examples:

- Try a UI layout.
- Compare two storage approaches.
- Prototype a workflow before deciding.

Experiment issues should define what will be learned, not only what will be built.

---

### Research issue

Use when the team needs information before deciding.

Research issues should produce a short summary and recommendation.

---

### AI run issue

Use when tracking a specific AI coding run is useful.

Often, AI run details can live as comments on the main feature issue instead of separate issues. Create a separate `ai-run` issue only when the run is large, risky, or parallel to other work.

---

## 11. Slash Commands

The workflow uses slash commands as repeatable operating modes.

### Core commands

```text
/setup
/capture
/plan
/start
/build
/review
/ship
```

### Optional commands

```text
/discover
/spec
/fix-review
/handoff
```

---

## 12. `/setup`

Sets up the repository for the workflow.

### Purpose

Create or update the core project documents, agent instructions, issue templates, label system, project board conventions, milestone conventions, and release spec structure.

### Should create or update

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

### GitHub setup responsibilities

- Create or confirm the GitHub Project.
- Create or confirm the current milestone.
- Create or confirm standard labels.
- Add guidance for project status values.

### Important rules

- Do not overwrite existing docs without summarizing proposed changes.
- Do not create fake ADRs.
- Only create real ADRs for approved decisions.
- Keep setup lightweight and editable.

---

## 13. `/capture`

Turns a rough idea into a GitHub Issue or improves an existing issue.

### Input examples

```text
/capture I want the app to show Run history with events and reports.
```

```text
/capture Improve issue #24 so it is ready for planning.
```

### Output

A GitHub Issue with:

```md
# Goal

# User Value

# Scope

## In Scope

## Out of Scope

# Acceptance Criteria

# Notes
```

### Project behavior

- Add the issue to the GitHub Project.
- Set status to `Inbox` or `Needs Plan`.
- Add type, area, priority, and needs labels.
- Assign a milestone if the issue belongs to the current release.

---

## 14. `/plan`

Creates an implementation plan without writing code.

### Input examples

```text
/plan #24
```

```text
/plan this feature but do not code yet
```

### Required behavior

The agent should read:

- The GitHub Issue and comments.
- `VISION.md`.
- `CONTEXT.md`.
- Relevant ADRs.
- Current release spec.
- Relevant code areas.

The agent should then create a plan and wait for approval.

### Output

A plan comment on the issue:

```md
# Implementation Plan

## Understanding

## Affected Areas

## Proposed Steps

## Risks

## Open Questions

## Validation Plan
```

### Rules

- Do not modify code during `/plan`.
- Ask questions if the scope is unclear.
- Surface conflicts with ADRs.
- Keep the plan focused on the issue.
- Move project status to `Planning`, then `Ready for Build` after approval.

---

## 15. `/start`

Creates the isolated implementation workspace.

### Input examples

```text
/start #24 branch
```

```text
/start #24 worktree
```

### Branch vs worktree

Use a branch when:

- The change is small or medium.
- Only one AI run is needed.
- The work is low risk.

Use a worktree when:

- The change is large.
- The work is experimental.
- Multiple AI coding runs may happen in parallel.
- The implementation may be messy before it stabilizes.
- You want to keep the main working directory clean.

### Naming convention

```text
feature/24-run-history
fix/31-report-rendering
refactor/42-agent-version-model
experiment/55-local-run-layout
```

### Output

An issue comment:

```md
# Start Summary

## Issue

## Branch / Worktree

## Approved Plan

## Next Step
```

---

## 16. `/build`

Implements the approved plan.

### Input examples

```text
/build #24
```

### Required behavior

The agent should:

- Follow the approved plan.
- Stay within scope.
- Respect `CONTEXT.md` terminology.
- Respect relevant ADRs.
- Update tests or validation steps where appropriate.
- Stop and ask before making major unplanned decisions.

### Output

An issue comment:

```md
# Build Summary

## Changed

## Verified

## Problems Found

## Follow-up Needed
```

### Rules

- Do not expand scope without approval.
- Do not mix unrelated refactors into the feature.
- Do not silently change domain terms.
- Do not bypass known decisions in ADRs.

---

## 17. `/review`

Reviews the implementation before merge.

### Input examples

```text
/review #24
```

### Review checklist

The review should check:

- Original issue.
- Approved plan.
- Acceptance criteria.
- `DOD.md`.
- `CONTEXT.md` vocabulary.
- Relevant ADRs.
- Changed files.
- Error handling.
- Edge cases.
- Obvious bugs.
- Unnecessary complexity.
- Scope creep.

### Output

```md
# Review Report

## Result

Pass / Needs Changes

## Checked

- [ ] Acceptance criteria
- [ ] Approved plan
- [ ] Domain terminology
- [ ] ADR consistency
- [ ] Manual validation
- [ ] No obvious scope creep

## Issues Found

## Required Fixes

## Safe to Merge?

Yes / No
```

### Project behavior

- Move issue to `Review` while reviewing.
- Move issue to `Fixing` if changes are required.
- Move issue to `Ready to Ship` if review passes.

---

## 18. `/fix-review`

Fixes only the issues found during review.

### Input examples

```text
/fix-review #24
```

### Required behavior

The agent should:

- Read the review report.
- Fix only the review findings.
- Avoid adding new scope.
- Re-run relevant validation.
- Ask before changing the design.

### Output

```md
# Review Fix Summary

## Fixed

## Re-checked

## Remaining Issues

## Ready for Review?
```

---

## 19. `/ship`

Merges completed work and closes the loop.

### Input examples

```text
/ship #24
```

### Required checks before shipping

- Review passed.
- Acceptance criteria are met.
- No known blocking bugs remain.
- Work is on the correct branch or worktree.
- Main branch is ready to receive the merge.
- Changelog has been updated if needed.
- Follow-up work is captured as issues.

### Output

```md
# Ship Summary

## Merged

## User-facing Changes

## Validation

## Changelog Updated

## Follow-up Issues

## Closed
```

### Project behavior

- Move issue to `Shipped`.
- Close the GitHub Issue if complete.
- Close or update the related PR.
- Update the milestone progress automatically through closed issues.

---

## 20. `/discover`

Optional command for foggy work.

Use when the idea is too unclear for a normal feature issue.

### Good use cases

- Many unknowns exist.
- Product direction is not clear.
- Several decisions block implementation.
- Research is needed.
- Prototype is needed.
- The feature may become multiple tickets.

### Output

A discovery summary:

```md
# Discovery Map

## Goal

## Known Facts

## Unknowns

## Decisions Needed

## Research Needed

## Prototype Needed

## Proposed Issues
```

---

## 21. `/spec`

Optional command for creating or updating a release spec.

### Input examples

```text
/spec v0.1.0
```

### Output

Updates or creates:

```text
docs/specs/v0.1.0.md
```

Suggested structure:

```md
# v0.1.0 Release Spec

## Release Goal

## Target User

## Core User Journey

## Must Ship

## Nice to Have

## Out of Scope

## Key GitHub Issues

## Acceptance Criteria

## Risks

## Open Questions
```

---

## 22. `/handoff`

Optional command for pausing and resuming work.

Use when work is not finished and another AI run or future session needs to continue.

### Output

```md
# Handoff

## Current Issue

## Current Branch / Worktree

## Goal

## Done

## Not Done

## Important Context

## Problems / Risks

## Next Step
```

The handoff can be posted as an issue comment or saved as a temporary Markdown note.

---

## 23. Branch and Worktree Policy

### Never build directly on `main`

All feature work should happen in a branch or worktree.

### Branches

Branches are best for normal work.

Use branches for:

- Small features.
- Bug fixes.
- Documentation changes.
- Low-risk refactors.

### Worktrees

Worktrees are best for isolated or parallel AI work.

Use worktrees for:

- Large features.
- Risky experiments.
- Multiple AI agents working in parallel.
- Comparing two approaches.
- Keeping the main checkout clean.

### Merge rule

Only merge after review passes.

---

## 24. Plan Approval Gate

The agent must not begin implementation until the Owner approves the plan.

Approval can be explicit:

```text
Plan approved. Start implementation.
```

or conditional:

```text
Approved, but remove the settings screen from scope.
```

If the plan changes, the agent should update the plan before building.

---

## 25. Review Gate

The review gate protects quality.

Before merge, the work must be checked against:

- The issue.
- The approved plan.
- Acceptance criteria.
- `DOD.md`.
- `CONTEXT.md`.
- ADRs.
- Manual validation.

A review result should clearly say:

```text
Safe to merge: Yes
```

or:

```text
Safe to merge: No
```

---

## 26. Merge Gate

The merge gate prevents unfinished work from entering `main`.

Before merge:

- Review must pass.
- Blocking issues must be resolved.
- Follow-up work must be captured.
- Changelog must be updated if needed.
- The related issue must have a final summary.

---

## 27. Handling Scope Creep

AI agents often discover extra work during implementation.

The rule is:

> New work becomes a follow-up issue unless it is required to complete the current acceptance criteria.

If the agent discovers a necessary scope change, it should stop and ask.

Examples of scope creep:

- Adding login while building a local-first v0.1.0 feature.
- Refactoring unrelated modules.
- Renaming domain concepts not involved in the issue.
- Adding new screens not required by the plan.
- Changing architecture without an ADR.

---

## 28. Handling Decisions

Use ADRs for important decisions.

Create an ADR when a decision is:

- Long-term.
- Architecture-level.
- Product-model-level.
- Expensive to reverse.
- Likely to affect future work.

Do not create ADRs for every small preference.

### ADR flow

```text
Decision discovered
  ↓
Discuss in issue or plan
  ↓
Owner approves decision
  ↓
Create ADR
  ↓
Reference ADR in issue or PR
```

---

## 29. Handling Research and Prototypes

Research and prototypes should be treated as first-class work when needed.

### Research output

A research issue should end with:

```md
# Research Summary

## Question

## Findings

## Options

## Recommendation

## Follow-up Issues
```

### Prototype output

A prototype issue should end with:

```md
# Prototype Summary

## Goal

## What Was Tried

## Result

## What We Learned

## Keep / Discard

## Follow-up Issues
```

Research and prototypes do not always need to ship. Their value is learning.

---

## 30. How to Use This Workflow Daily

### For a small clear fix

```text
/capture
/plan
/start branch
/build
/review
/ship
```

The plan can be short.

---

### For a medium feature

```text
/capture
/plan
/start branch or worktree
/build
/review
/fix-review
/review
/ship
```

---

### For a large unclear feature

```text
/discover
/spec
/capture multiple issues
/plan issue #1
/start worktree
/build
/review
/ship
```

---

### For parallel AI work

```text
/capture issues
/plan each issue
/start each issue in separate worktree
/build separately
/review separately
/ship one at a time
```

---

## 31. Comparison with a Skill-First Workflow

This workflow is inspired by skill-based AI engineering systems, but it is not a copy.

The main difference is that this workflow is centered on the Owner's actual development loop:

```text
Issue → Plan Mode → Branch/Worktree → Build Mode → Review → Merge
```

A skill-first workflow usually emphasizes:

```text
Clarify → Spec → Tickets → Implement → Code Review
```

This workflow keeps the useful parts:

- Clarification before coding.
- Specs when needed.
- Tickets as executable work.
- Domain vocabulary.
- ADRs.
- Review before merge.

But it changes the center of gravity:

| Skill-first workflow | This workflow |
|---|---|
| Spec-first | Issue-first |
| Skill command driven | Plan/Build/Review mode driven |
| Implementation as one larger command | Start, build, review, and ship are separate gates |
| Works well for structured engineering tasks | Works well for iterative solo development and vibe coding with guardrails |
| May create more planning artifacts | Keeps stable docs small and active work in GitHub Issues |

---

## 32. What This Workflow Avoids

This workflow intentionally avoids unnecessary planning files.

Usually not needed:

```text
ROADMAP.md
PRD.md
BACKLOG.md
TASKS.md
USER_STORIES.md
SPRINT_PLAN.md
RELEASE_PLAN.md
```

These are replaced by:

```text
docs/specs/v0.1.0.md
GitHub Issues
GitHub Project
GitHub Milestones
Issue templates
DOD.md
CHANGELOG.md
```

---

## 33. Final Mental Model

```text
VISION.md
= why the product exists

CONTEXT.md
= what words mean

docs/specs/v0.1.0.md
= what this release is trying to become

GitHub Issues
= PRDs, tasks, bugs, experiments, plans, AI run notes

GitHub Project
= where work is now

GitHub Milestone
= which release the work belongs to

Labels
= what kind of work it is

ADRs
= important decisions

DOD.md
= quality gate

CHANGELOG.md
= what shipped

AGENTS.md
= how AI agents should work
```

---

## 34. The One-Sentence Workflow

Start from a GitHub Issue, discuss and approve a plan, isolate the work in a branch or worktree, build only the approved scope, review against the issue and quality gates, fix what review finds, merge to `main`, update the changelog, and capture follow-up work as new issues.
