---
name: checkpoint
description: Save a compact, consistent snapshot of plan, progress, permissions, branch, workers and evidence so another session can resume safely. Use when pausing work, handing off, switching agents, before context compaction, when blocked, after meaningful milestones, or before unattended or parallel work.
metadata:
  collection: edwardnguyen2854-skills
  workflow-contract: "2"
---

# Checkpoint

Save enough state to resume safely without turning the record into a transcript.

Read [the shared delivery contract](references/contract.md) and use [the record templates](references/templates.md).

## Capture

Record, concisely:

- Record version `2`, project/workspace identity, feature ID, plan ID/revision, checkpoint ID/sequence, prior checkpoint and timestamp.
- Collaboration mode and authoritative permission event IDs.
- Working directory, branch purpose/base/head, related PR, uncommitted/unfinished paths.
- Task IDs, dependencies, status and a one-line reason for each blocker.
- Verification evidence tied to tested working-tree content, plus relevant configuration/dependencies.
- Worker/attempt IDs and ownership; unresolved workers or pending dispatch intents.
- Findings, unanswered questions, decisions and ADR links.
- Exact next action and the smallest context needed.

Do not include secrets, private data, full command output, or the whole conversation. Summarize evidence and point to durable artifacts when appropriate.

## Reconcile

Before writing:

1. Inspect actual files, commits, branch/PR state and available checks. Do not copy stale native task statuses into the record.
2. Reconcile pending worker dispatches: confirm completion/termination or mark unresolved ownership.
3. Check the plan and record revisions. If they conflict, preserve the evidence and report the conflict rather than overwriting it.
4. Preserve unexpected edits/untracked files.

If records are not authorized, keep the same information in the conversation/live tasks and tell the owner that durable resume is unavailable.

## Write safely

- Only the coordinator updates shared workflow records and the native task view.
- Keep the last valid checkpoint as `progress.previous.md` and write a complete `progress.pending.md`.
- Validate the staged replacement, then replace `progress.md` using the safest operation available and verify it.
- Avoid truncated writes; if replacement cannot be completed safely, keep the prior version and report the partial state.
- Retain one prior valid checkpoint, not an accumulating backup pile.
- Do not auto-commit or upload progress records.

Progress records mirror verified reality; native tasks remain the live execution view. Do not maintain competing authority or copy permission grants into progress.

## Report

Tell the owner:

- What is done and verified.
- What remains or is blocked.
- Whether any worker/change is unresolved.
- What happens next and whether it is safe to close the session.

On resume, load `resume`; do not blindly trust the checkpoint.
