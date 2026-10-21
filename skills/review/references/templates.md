# Record templates

Copy only the sections needed. Keep entries concise and factual. Replace bracketed text. Do not include secrets, private data, full logs, or entire transcripts.

## `.work/project.md`

```md
# Project

- Record version: 2
- Project ID: [kebab-case-id]
- Delivery records: [`.work/` or approved alternate root]

## Purpose

[Why this exists, in the owner's terms.]

## Intended users and outcome

[Who it is for and what they should be able to do.]

## Constraints and preferences

- [Constraint or preference.]
- Branch/PR preference: [e.g. focused branches; agent-reviewed PRs after scoped upload permission.]

## Active work

| Feature/update | Record path | Status |
|---|---|---|
| [Name] | `.work/features/[id]/` | [active/paused/complete] |

## Project-wide permission events

Permission events are append-only. Add a revoke/supersede event; never edit or delete an earlier event. Effective permission is derived from the event chain.

| Event ID | Kind | References | Action | Scope | Owner reference | Limits/expiry | Session | Effective |
|---|---|---|---|---|---|---|---|---|
| [PE-001] | [grant/revoke/supersede] | [event ID or —] | [local commits/upload branch/open PR] | [project or feature] | [message/date] | [limits] | [session ID or —] | [date/time] |

## Verification

- [Known command or manual check, and when it applies.]

## Record conventions

- Architecture decisions: [existing ADR path or `docs/adr/`].
- [Commit/upload policy.]
```

## `.work/features/<id>/plan.md`

```md
# Plan: [Feature/update name]

- Record version: 2
- Project ID: [kebab-case-id]
- Feature ID: [kebab-case-id]
- Plan ID: [stable id]
- Plan revision: [N]
- Status: [draft/awaiting approval/approved/superseded]
- Approval: [owner/delegated permission event; revision approved]
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

- Record version: 2
- Project ID: [kebab-case-id]
- Feature ID: [kebab-case-id]
- Plan ID: [stable id]
- Plan revision: [N]
- Checkpoint ID: [stable id and sequence]
- Prior checkpoint: [ID/path or none]
- Checkpoint: [ISO timestamp]
- Mode: [work-with-me/use-your-judgment]
- Authority: [permission event IDs]

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
| [workspace/feature/T1/attempt-1] | [ID/terminated/completed/unknown] | [paths/worktree] | [summary] |

## Open findings and questions

- [Impact, severity, confidence, location, action/status.]

## Next action

[One exact next step and the smallest context needed.]
```

Replacing a checkpoint: keep the last valid file as `progress.previous.md`, write and validate a complete `progress.pending.md`, replace `progress.md` using the safest available operation, then verify. A pending or previous file is not a current authority record.

## `.work/features/<id>/decisions.md`

```md
# Decisions: [Feature/update name]

- Record version: 2
- Project ID: [kebab-case-id]
- Feature ID: [kebab-case-id]

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

## Feature-scoped permission events

Permission events are append-only. Add a revoke/supersede event; never edit or delete an earlier event.

| Event ID | Kind | References | Action | Scope | Owner reference | Limits/expiry | Session | Effective |
|---|---|---|---|---|---|---|---|---|
| [FE-001] | [grant/revoke/supersede] | [event ID or —] | [action] | [feature/update] | [message/date] | [limits] | [session ID or —] | [date/time] |
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
Task/attempt: [workspace]/[feature]/[task]/attempt-[N]
Plan ID/revision: [stable ID and approved revision]
Permission: [event ID and exact scope]
Outcome: [one bounded result]
Acceptance: [examples]
Relevant context: [decisions, selected paths/references]
Ownership: [files/worktree; no unrelated edits]
May: [permitted operations]
Must not: [publication, merge, shared-record updates, delegation, out-of-scope edits]
Prerequisites: [verified conditions and integrated revisions]
Verification: [steps and expected evidence, including tested content/config]
Stopping boundary: [what must not be changed or expanded]
Stop when: [scope conflict, missing requirement, repeated failure, permission needed]
Return: [changed paths, checks/results, tested content, risks, integration notes]
```

## Evidence record

```md
Evidence ID: [stable ID]
Acceptance ID: [Sxx/ACxx/task]
Action/command: [what ran]
Result: [actual outcome]
Base/head: [revisions or no Git]
Tracked content: [relevant edits/content identifier]
Untracked/ignored inputs: [relevant non-secret inputs]
Config/dependencies/runtime: [versions and configuration]
Artifacts: [paths and retention limit]
Limitations: [missing checks or environment]
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
- Verdict: [ready for authorized delivery/awaiting checks/blocked]
- Findings: [open/resolved/dismissed evidence/accepted residual]
- Remaining human gates: [required reviewer/branch rule or none known]
```
