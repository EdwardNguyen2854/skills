# Record templates

Copy only the sections needed. Keep entries concise and factual. Replace bracketed text. Do not include secrets, private data, full logs, or entire transcripts.

## `.work/project.md`

```md
# Project

## Purpose

[Why this exists, in the owner's terms.]

## Intended users and outcome

[Who it is for and what they should be able to do.]

## Constraints and preferences

- [Constraint or preference.]
- Branch/PR preference: [e.g. focused branches; agent-reviewed PRs after scoped upload permission.]

## Active work

| Feature/update | Path | Status |
|---|---|---|
| [Name] | `.work/features/[id]/` | [active/paused/complete] |

## Project-wide permissions

Permission rows are append-only. Keep revoked/superseded rows with their owner reference and replacement link.

| Action | Scope | Status | Owner reference | Limits/expiry |
|---|---|---|---|---|
| [local commits/upload branch/open PR] | [project or feature] | [active/revoked/superseded] | [message/date] | [limits] |

## Verification

- [Known command or manual check, and when it applies.]

## Record conventions

- Architecture decisions: [existing ADR path or `docs/adr/`].
- [Commit/upload policy.]
```

## `.work/features/<id>/plan.md`

```md
# Plan: [Feature/update name]

- Feature ID: [kebab-case-id]
- Plan revision: [N]
- Status: [draft/awaiting approval/approved/superseded]
- Approval: [owner/delegated grant reference; revision approved]
- Base/branch intent: [verified base and proposed feature branch]

## Outcome

[What the owner will be able to do.]

## Acceptance examples

1. Given [situation], when [action], then [observable result].

## In scope

- [Item.]

## Out of scope

- [Item.]

## Questions and assumptions

| Question/assumption | Status | Answer/selected default | Authority |
|---|---|---|---|
| [Question.] | [open/answered/assumed] | [Answer.] | [owner/delegated/in-plan engineering] |

## Relevant context

- Behavior/code inspected: [paths and findings]
- ADRs: [links]
- Security/privacy/operational risks: [summary]
- UI/UX implications: [summary or not relevant]
- Trial environment/prerequisites: [where the owner will run it]

## Plan review

- Reviewer: [independent/self-review]
- Findings addressed: [summary]
- Remaining limitations: [summary]

## Tasks

| ID | Outcome | Depends on | Likely files/ownership | Verification | Stopping boundary |
|---|---|---|---|---|---|
| T1 | [Bounded result.] | — | [paths] | [check] | [What must not be changed/expanded.] |

## Rollback/recovery

[How to recover safely if the change must be abandoned.]
```

## `.work/features/<id>/progress.md`

```md
# Progress: [Feature/update name]

- Feature ID: [kebab-case-id]
- Record version: 1
- Plan revision: [N]
- Checkpoint: [ISO timestamp]
- Mode: [work-with-me/use-your-judgment]
- Authority: [permission record reference]

## Workspace

- Working directory: [path]
- Branch/base/head: [branch, base revision, current revision]
- Related PR: [URL/number/head/base or none]
- Uncommitted/unfinished: [paths and summary]
- Tested content ID: [compact diff/hash/content identifier for the working tree that was checked]
- Config/dependencies verified: [relevant versions, environment, configuration]

## Tasks

| ID | Status | Dependencies | Evidence/blocker | Tested content/config |
|---|---|---|---|---|
| T1 | [pending/in progress/blocked/ready for review/done] | — | [check + result or reason] | [content ID and relevant config] |

## Workers

| Task/attempt | Worker/status | Ownership | Last known result |
|---|---|---|---|
| [T1/attempt-1] | [ID/terminated/completed/unknown] | [paths/worktree] | [summary] |

## Open findings and questions

- [Impact, severity, location, action/status.]

## Next action

[One exact next step and the smallest context needed.]
```

## `.work/features/<id>/decisions.md`

```md
# Decisions: [Feature/update name]

## Decision log

### [D1: Title]

- Status: [proposed/accepted/superseded]
- Date: [date]
- Authority: [owner-selected/delegated/agent-selected within approved plan revision N]
- Context: [Problem in plain language.]
- Options: [Alternatives and tradeoffs.]
- Decision: [Chosen approach and why.]
- Consequences: [What becomes easier/harder; follow-up.]
- Supersedes/links: [D/ADR references]
- ADR: [path or not significant enough for ADR]

## Feature-scoped permissions

Permission rows are append-only. Keep revoked/superseded rows with their owner reference and replacement link.

| Action | Scope | Status | Owner reference | Limits/expiry |
|---|---|---|---|---|
| [action] | [feature/update] | [active/revoked/superseded] | [message/date] | [limits] |
```

## ADR (`docs/adr/NNNN-short-title.md`)

```md
# NNNN. [Decision title]

- Status: [proposed/accepted/superseded by NNNN]
- Date: [date]
- Authority: [owner-selected/delegated/agent-selected within owner-approved plan revision N]
- Related: [feature/issue/PR/ADR links]

## Context

[The problem, constraints, and user-visible consequences in plain language.]

## Alternatives considered

- **[Option]:** [Tradeoffs, risk, cost.]

## Decision

[What was chosen and why it best meets the agreed goals.]

## Consequences

- [Positive, negative, and follow-up effects.]
- [Conditions that would justify reconsidering.]

## Evidence

[Relevant checks, references, or limitations.]
```

## Task packet

```md
Task/attempt: [stable ID]
Plan revision: [N]
Permission: [record reference and exact scope]
Outcome: [one bounded result]
Acceptance: [examples]
Relevant context: [decisions, selected paths/references]
Ownership: [files/worktree; no unrelated edits]
May: [permitted operations]
Must not: [publication, merge, shared-record updates, delegation, out-of-scope edits]
Prerequisites: [verified conditions]
Verification: [steps and expected evidence]
Stop when: [scope conflict, missing requirement, repeated failure, permission needed]
Return: [changed paths, checks/results, risks, integration notes]
```

## PR description

```md
## What this changes

[Owner-facing outcome.]

## Verification

- [Check and actual result, tied to the reviewed revision.]
- [Manual/visual/accessibility checks or limitation.]
- [Security/risk review summary.]

## Architecture decisions

- [ADR links or none.]

## Risks and limitations

- [Residual risk or required checks still pending.]

## Agent review

- Reviewed base: [stable base revision]
- Reviewed head: [revision]
- Result: [ready for authorized delivery/awaiting checks/blocked]
- Remaining human gates: [required reviewer/branch rule or none known]
```
