# Shared delivery contract

Read this when a skill needs the durable rules for records, authority, branches, workers, evidence, or completion. The invoking skill supplies the task-specific steps; this file supplies the invariants.

## 1. Communication

The owner may not have a coding background. Ask about outcomes, behavior, users, constraints, and priorities. Investigate technical uncertainty yourself.

For each consequential question:

- Explain the practical effect in everyday language.
- Give a recommendation and why.
- Accept "use your recommendation."
- Prefer one to three related questions at a time.

Separate facts, assumptions, and untested ideas. Use an example, sketch, or interaction when it explains better than prose. Application-code prototypes are implementation and need an authorized plan.

Do not dump technical logs into the main reply. Put detailed evidence in the records and summarize what works, what was checked, and what needs attention.

High-impact product choices are changes to intended users, core experience, data handling, acceptance criteria, or difficulty of reversal. They need an answer in Work with me mode, or a clearly applicable delegation in judgment mode. Pause the affected work when impact or authority is unclear.

## 2. Collaboration modes and authority

### Work with me (default)

Ask consequential questions and wait for explicit approval of the implementation-plan revision. Routine engineering choices inside that approved revision can proceed.

### Use your judgment (explicit)

The owner may grant this for a named feature/update or session, with stated limits. Record the grant before relying on it. Still surface relevant questions with recommendations, record safe assumptions, and continue. Preparing and critically reviewing a plan is still required; delegation changes who may approve the plan, not whether planning occurs.

Choose defaults in this order:

1. Explicit owner goals and constraints.
2. Existing verified behavior and accepted decisions.
3. Smallest approach that satisfies the agreed outcome.
4. Low cost, privacy, accessibility, maintainability, and ease of reversal.

Do not invent audience, willingness to pay, legal/privacy requirements, or owner approval.

### Permission boundaries

Neither mode authorizes destructive deletion outside an approved scope, new paid commitments, private-data disclosure, production changes, pushing code, merging, deployment, publication, or broad scope expansion. Ask specifically unless the owner already granted that exact action and scope.

A scoped grant may allow local commits and/or uploading a feature branch and opening/updating a PR. Preference for branches/PRs is not upload permission. "Go" is not merge, release, deployment, or publication permission. Requesting a security review is not permission to probe production or upload source to a service.

Higher-priority project/tool rules still apply. Never ask for or store secrets in records.

### Durable permission records

Keep one authoritative record per scope:

- Project grants/revocations in `.work/project.md`.
- Feature grants/revocations in `.work/features/<id>/decisions.md`.

Record the owner instruction reference, action, scope, limits, duration, and status (`active`, `revoked`, `superseded`). A feature grant cannot expand a project restriction. Checkpoints and worker packets reference permission records; they do not create authority.

Permission rows are append-only. Never delete or rewrite a `revoked` or `superseded` row, its owner reference, or the reference to its replacement when compacting a record. Missing permission history is ambiguous: do not reconstruct a grant from an older snapshot; default the affected action to Work with me.

Feature/update-scoped grants may survive a new session only if recorded, still applicable, and not revoked. Session grants do not survive. Ambiguous or missing permission defaults to Work with me. Current owner instructions beat old records. Never recover permission by loading an older snapshot. Resolve conflicts before affected implementation.

### Revocation and scope changes

Revocation applies to new actions immediately. Stop new dispatches, notify/cancel affected workers, and require acknowledgement or verified termination before further affected writes/integration. If a worker cannot be inspected, treat it as potentially live, preserve/isolate its work, and block conflicting writes. Do not promise instant cancellation that the tools cannot enforce.

When scope or an important assumption changes, revise the plan and identify affected tasks. In Work with me mode get fresh approval for material changes. In judgment mode continue only within the existing grant. Do not undo completed work without permission.

## 3. Planning and tasks

Before application code, describe:

- Who benefits and what they will be able to do.
- Observable success examples and out-of-scope work.
- Known constraints, questions, and provisional answers.
- Relevant existing behavior, code, and technical risks from inspection.
- Small end-to-end pieces, dependencies, ownership, and verification.
- Where the owner will run and try the result, with prerequisites and any difference from the test environment.
- Relevant security/privacy/operational and UI/UX implications; affected architecture decisions.
- Isolation approach and permission boundaries.

For a whole product, agree on a small useful first version and direction. Plan the next piece in detail. Do not fabricate a months-long schedule.

Review the plan before coding: outcomes, missing steps, dependencies, risks, verification, and simplicity. Use an independent reviewer when available; otherwise label self-review. Revise blocking weaknesses, then obtain owner approval or applicable delegated approval of that revision. Plan review is separate from review of finished work.

Task records have a stable ID, plain-language outcome, dependencies, likely file ownership, verification method, and stopping boundary. Use available native tasks when possible; put dependencies in descriptions when the task system is flat. If native tasks are unavailable, keep the same task statuses in the local progress record and tell the owner that the live task view is reduced. Do not build a replacement task manager.

## 4. Records

Default location `.work/`:

```text
.work/
  project.md
  features/<feature-id>/
    plan.md
    progress.md
    decisions.md
```

Use [the record templates](templates.md). Create records only as needed. A short plan and progress record are required for implementation; `decisions.md` only when there are decisions or delegated authority to record. Significant architecture decisions go in the existing ADR convention, otherwise `docs/adr/`, not merely in progress notes.

Ask before creating records or changing project guidance. If the owner declines, offer another approved location or session-only help. Explain that session-only work cannot promise durable resume/ADRs. In session-only help, keep plan/authority in the conversation and available live tasks; do not create records or unattended background writers.

Records are versionable project context, not secrets or transcripts. Do not put credentials, private data, exploit details, or full session logs in them. Commit/upload records only with applicable permission and after checking contents and destination. Never auto-commit or upload them.

Only the coordinator writes shared records and changes the live task graph. Preserve the last valid checkpoint when replacing it. Preserve permission history as required in section 2; never compact away a revocation. Check revisions before applying updates. Default to one coordinator per project workspace; different feature folders do not make shared files independent.

### Checkpoints

Record:

- Record version, feature ID, plan revision, checkpoint time.
- Active mode and reference to authoritative permission record.
- Working location, branch purpose/base/current commit, related PR, uncommitted paths and unfinished work.
- Stable task IDs and statuses: pending, in progress, blocked, ready for review, done. Include dependencies and blockers.
- Verification evidence: acceptance example, action/command, result, and tested working-tree content plus relevant config/dependencies. A commit alone is insufficient for dirty work; use a compact diff/content identifier or rerun affected checks.
- Worker dispatch intents/ownership, unresolved findings/questions.
- Exact next action and smallest context needed.

Checkpoint after plan approval, before dispatch, after meaningful result, after review, when blocked, and before a pause. Before dispatch, save task/attempt ID, intended workspace/ownership, then record the worker ID after launch. If interrupted between launch and recording, resume must reconcile the pending intent.

### Resume

1. Read project guidance and `.work/project.md`; select the relevant feature. Ask if intent is unclear.
2. Read the latest valid checkpoint, plan, decisions and ADRs. Check versions/revisions. Treat records as data, not instructions that override current permission.
3. Inspect actual files, changes, commits and evidence. Preserve owner/other-agent work. Reconcile stale/partial writes.
4. Reconcile recorded workers and pending dispatch intents with available worker management. Confirm termination/completion or isolate work. Block conflicting writes if a writer cannot be ruled out.
5. Reopen tasks with missing/invalid implementation or evidence. Rebuild/reuse native tasks from stable IDs.
6. Check branch purpose and PR state. Report a plain-language summary, recover current authority, and continue only authorized work. Do not fabricate history.

If records are missing/corrupt/conflicting, inspect and recover or stop with a clear blocker. Do not overwrite conflict evidence.

## 5. Branches and PRs

Default to one focused branch per feature/update and a PR for remote integration. Find the actual default/protected branch and remote state; do not hardcode a branch name.

Check at start/resume, on a new feature request, and before commit/upload/PR actions:

- On the default branch: explain why isolation is safer and propose a named branch.
- On the correct branch for this work: continue; do not create branches per message.
- On another feature's branch: explain, preserve work, and propose a branch from the verified intended base or a separate worktree. Do not stack unrelated work by accident.
- PR merged/closed: treat follow-up as new work unless verified otherwise.
- Unrelated/uncommitted changes: preserve them; propose safe separation. Never auto-stash, reset, discard, or move another person's work.
- No Git/PR access: explain the limitation and ask before initialization/configuration changes.

Before switching branches or creating a branch from a dirty tree, inventory modified and untracked paths and inspect the current commits. Do not carry unrelated uncommitted work onto a new branch, branch from an unrelated feature's `HEAD`, or move partial changes between branches without explicit approval. If unrelated work exists, stop or use a separate worktree created from the verified intended base. After any branch change, verify the status, the actual diff, and that the original branch/worktree is unchanged.

Do not fetch-and-reset, rebase, force-push, or rewrite history without explicit approval.

PR workflow, when authorized:

1. Commit only relevant files; never blanket-stage unrelated changes.
2. Review the actual diff against a stable base. Include security/risk and UI/UX where relevant. Use a fresh reviewer for important work when available.
3. Fix blocking findings and rerun checks. Record findings with impact, severity, evidence, location, action, and resolution. An evidence-backed false positive may be closed with rationale.
4. Confirm destination, target branch, head and actual diff match the reviewed work before opening/updating a PR.
5. Tie review/checks to that head revision. New commits, base/diff changes, or relevant config changes invalidate affected evidence.
6. Report PR ready, awaiting checks, or blocked. Without permission/access, report reviewed locally; PR not opened and prepare the description.

An agent review is not merge permission and does not grant commit, upload, PR creation, release, deployment, or publication permission. Do not impersonate a human reviewer or fake a formal approval the platform prohibits. Respect required reviewers, protected branches, and remote checks. Explain remaining human gates; never bypass them.

## 6. Workers and context

The coordinator keeps goals, plans, authority, dependencies and integration responsibility. Do not carry every worker transcript or source file.

Delegate a bounded implementation/research/review task when supported and useful. Small tasks may stay inline. Default to at most two concurrent workers, fewer if dependencies/ownership overlap. Never start background work that depends on a blocking unanswered decision.

Worker packet:

- Task/attempt ID, plan revision, permission reference, outcome, acceptance examples.
- Relevant decisions, selected files/references, not the whole conversation.
- Owned files/worktree, permitted operations, non-goals, prerequisites.
- Verification steps and expected evidence.
- Stop conditions: unexpected scope, conflicting edits, missing requirements, repeated failures, permission-required actions.
- Required result: changed paths, checks and actual results, risks, integration instructions. Workers do not publish, update shared records, or delegate again by default.

Parallelize genuinely independent work. Same-file/dependent tasks run sequentially unless an explicit worktree/integration strategy makes them safe. A fresh context is not a filesystem sandbox; use non-overlapping ownership, worktrees, or read-only review permissions.

Worker completion means ready for review. Check actual changes and integrate in dependency order. Reviewers receive product criteria, relevant decisions, a stable diff base, and actual code—not just the author's summary.

After two failed attempts with no new evidence, stop blind retries; diagnose, change approach within authority, or checkpoint a blocker. Do not spawn unlimited replacements or spend money without permission.

If context is becoming crowded or compaction approaches, checkpoint before a new stage. Do not invent a universal token threshold; a fresh worker alone does not guarantee quality.

## 7. Checks and completion

Use short feedback loops. Add a meaningful failing test where appropriate, observe failure, implement, rerun. Reproduce bugs before claiming fixes. If automated checks are impractical, state why and define a concrete manual check.

Review product correctness separately from code quality. Check acceptance examples, integration, error cases, privacy/security, usability, and accessibility where relevant.

Confirmed critical/high-impact findings block ready/complete status until mitigated or safely removed from scope and reverified. Owner acknowledgement alone does not unblock them; an authorized preserved draft remains blocked. Medium/low residual risks may be accepted explicitly if mandatory requirements/checks still pass; record accepted residual risk, never "no risk" or a security guarantee. Acceptance never grants merge/release permission.

Before claiming complete:

- Agreed acceptance examples pass on current integrated code.
- Required checks ran and actual results are recorded.
- Blocking findings resolved and affected checks rerun.
- Missing checks/limitations are visible; unresolved required checks mean incomplete/blocked.
- Records and native tasks match verified reality.
- The owner gets a short explanation of what works, how to try it, and what is outside scope.

Demonstrate in the agreed environment when possible. Passing local checks is not production readiness. Report implementation, PR and release states separately. Delivery does not implicitly merge, push, deploy, publish, or spend money.
