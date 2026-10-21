---
name: execute
description: Safely implement an approved plan with bounded tasks, branch isolation, focused workers, checkpoints and integration. Use when a plan is approved, implementation needs coordination, tasks can be delegated, work must resume safely, or changes need to be integrated and handed to verification.
metadata:
  collection: edwardnguyen2854-skills
  workflow-contract: "2"
  required-skills: checkpoint verify diagnose
---

# Execute

Implement the approved plan. You are the coordinator: workers return results; you own integration and shared records.

Read [the shared delivery contract](references/contract.md) and use [the record templates](references/templates.md).

## Before editing

Confirm:

- The plan revision is approved for this work and still current.
- The permission scope covers the planned actions.
- The branch purpose/base and PR state are safe.
- Unrelated or unfinished changes are preserved.
- Dependencies and likely file ownership are understood.
- The owner can try the result where the plan says.

If any of these fail, stop the affected work and explain in plain language. Do not silently create branches, discard changes, or widen scope.

## Worker preflight

Before delegating, inspect the actual capabilities available: status, stop/cancellation, notifications and filesystem isolation.

- Give every dispatch a composite identity: workspace/project + feature + task + attempt, plus the plan revision.
- Persist the dispatch intent, authority reference, intended workspace and owned paths before launch; persist the returned worker ID after launch.
- If status/stop is unavailable, do not use an unattended shared-workspace writer. Use foreground/sequential work, or an approved isolated worktree with a workable stop boundary.
- Workers recheck authority before each new write batch; a packet snapshot cannot override a later revocation.
- On revocation, stop new dispatches, require acknowledgement or verified termination, or isolate the work and block conflicting integration.
- A fresh context is not a filesystem sandbox. Never assume conversations isolate files.

## Prepare tasks

Use available native tasks. Give each a stable local ID in the description/metadata, its outcome, dependency, ownership, verification and stopping boundary. If tasks are flat, enforce dependencies yourself. Do not build another task manager.

Checkpoint the plan revision, branch state, task statuses and next action before substantial changes.

## Work in slices

For each ready task:

1. Recheck prerequisites and ownership.
2. If delegating, use a worker under the contract's packet rules. Otherwise implement inline with the smallest correct change.
3. Add/update meaningful tests with the change where appropriate.
4. Run focused validation early; do not wait until everything is "finished."
5. Inspect the actual result and record evidence tied to the tested content.
6. Mark it ready for review, not done. Integrate dependent work only after prerequisites are verified.

Do not let two writers touch the same file without explicit worktree/integration ownership. Do not start unattended background writers that rely on an unanswered blocking decision.

If a worker reports done without evidence, verify it yourself. If a task fails, load `diagnose`; after two attempts with no new evidence, change approach within authority or checkpoint a blocker.

## Handle discoveries

- Required to meet current acceptance criteria: update the task within the approved plan and record it.
- Unrelated or optional: capture as a follow-up suggestion; do not do it silently.
- Material scope, risk or architecture change: revise the plan, identify affected tasks, and obtain fresh approval or confirm it remains within delegated authority.

Relevant cleanup, security fixes and UI/UX improvements belong only if included in the approved outcome or separately approved.

## Checkpoint

At meaningful boundaries, update `.work/features/<id>/progress.md` (when authorized) and native tasks:

- Task status, dependencies, evidence, tested working-tree state.
- Branch/head/PR and unfinished changes.
- Worker/attempt IDs and unresolved ownership.
- Findings, blockers and exact next action.

Keep the previous valid checkpoint until the replacement is complete. Write and validate a complete staged replacement before replacing the current progress file; avoid truncated writes. A staged or previous file is not current authority. Workers do not write shared records.

## Finish

Integration is not complete until the pieces work together. Load `verify` for current-code acceptance, then `review` for an independent agent code/PR review when appropriate. Fix blocking findings and re-run affected checks. Return a plain-language result and the PR/delivery status; do not merge or publish without separate permission.

If stopping before completion, provide a resume-ready checkpoint and tell the owner exactly what is safe to do next.
