# Vision-to-product workflow

This is the canonical behavioral overview for the active skills. The detailed invariants live in [`skills/references/contract.md`](./skills/references/contract.md); record formats live in [`skills/references/templates.md`](./skills/references/templates.md).

## Purpose

Help a product owner turn a vision or change request into working, tested software without requiring coding knowledge or project-management administration. The agent clarifies in plain language, plans before coding, reviews the plan, implements safely, verifies actual behavior, arranges agent code review, and prepares delivery.

## Flow

```text
Understand -> Clarify -> Plan -> Review plan -> Approve -> Branch -> Build
  -> Verify -> Agent review -> PR/delivery -> Checkpoint
```

Small work gets a short plan. It does not skip planning, verification or review proportionate to risk. Large or uncertain work gets a small first version, a direction, and detailed planning for the next useful piece rather than a fictional complete schedule.

## Collaboration

### Work with me

Default. Ask about consequential product choices and wait for approval of the implementation-plan revision. Routine engineering choices within that approved plan may proceed.

### Use your judgment

Explicitly granted for a named feature/update or session, with limits. The agent still surfaces questions with recommendations, records safe assumptions, and may approve a carefully reviewed plan within that grant. It must not invent owner goals or broaden its own permission.

Neither mode authorizes destructive deletion outside approved scope, paid commitments, private-data disclosure, production changes, pushing, merging, deployment, publication or broad scope expansion. PR preference is not upload permission; "go" is not merge/release permission.

Questions use everyday language, explain practical consequences, recommend an answer and allow "use your recommendation." High-impact product choices (users, core experience, data handling, acceptance criteria, reversibility) pause affected work without an answer or applicable delegation.

## Planning and review

Every implementation has:

- A plain-language outcome and observable acceptance examples.
- Scope and out-of-scope work.
- Questions, assumptions and their authority.
- Relevant code/behavior and risks from inspection.
- Trial environment, prerequisites, cleanup/security/UI/UX implications.
- Small tasks with dependencies, ownership, verification and stopping boundaries.
- Rollback/recovery where relevant.

Plan review happens before coding and is separate from code review. Use a fresh reviewer when available; otherwise label self-review. Fix blocking weaknesses and obtain approval of that revision. Material plan changes after approval require re-review and fresh applicable approval.

## Tasks and durable memory

Use native tasks and focused workers when available. Keep one stable local ID per task and enforce dependencies when the task system is flat. Do not build a custom scheduler or second task manager.

With permission, `.work/` stores a compact project index and per-feature plan, progress and decisions. Significant architecture decisions get ADRs at the project's existing convention, otherwise `docs/adr/`.

At checkpoints, record actual task evidence, branch/head/PR state, tested working-tree content, workers, blockers and the exact next action. Resume reconciles these records with actual files, branches, PRs and workers; it does not trust stale checkboxes. Permission is read from current authoritative grant/revocation records, never restored from an older checkpoint.

If records are declined, use an approved alternative or session-only help and disclose the lack of durable recovery.

## Delegation

The coordinator owns goals, plan, authority, dependencies and integration. Workers receive a bounded packet with selected context, file/worktree ownership, permissions, verification and stop conditions. They return results; they do not update shared records, publish, or delegate again by default.

Run independent tasks in parallel only when supported, useful and ownership-safe. Same-file or dependent work runs sequentially or uses explicit isolated worktrees. Fresh context is not a filesystem sandbox. Worker completion is ready for review, not done. After two failed attempts without new evidence, stop blind retries and diagnose or checkpoint a blocker.

## Branches and PRs

Default to focused feature/update branches and PRs without using issues as the task tracker. Inspect the real default/target branch and related PR state; do not hardcode names.

- Default branch: propose a dedicated branch.
- Correct feature branch: continue.
- Another feature's branch: explain and propose safe isolation; preserve unfinished work.
- Merged/closed PR: treat follow-up as new work.
- Unrelated changes: preserve; never auto-stash/reset/discard/move.

Commit only relevant files. Upload/open/update a PR only with scoped permission and after verifying the destination, target, head and actual diff. The agent performs the review; the owner is not expected to review code. Required human approvals and protected-branch rules are honored, not bypassed or fabricated. A review applies only to the inspected revision; new commits/base changes invalidate affected evidence.

## Verification and completion

Use meaningful failing tests, reproduce bugs, and check actual integrated behavior. Reproduce fixes, run relevant checks, and record what was tested against which working-tree content/configuration. Passing unrelated tests is not enough.

Confirmed critical/high-impact security or correctness findings block ready/complete status until mitigated/reverified or safely removed from scope. Owner acknowledgement alone does not unblock them. Medium/low residual risks may be accepted explicitly if mandatory checks pass; record accepted residual risk, not a safety guarantee.

Complete means required acceptance/checks pass on current integrated code, blocking findings are resolved, limitations are visible, records match reality, and the owner knows what works, how to try it and what remains out of scope. Local completion does not imply PR/merge/release/deployment/publication.

## Product care

- **Cleanup:** evidence-backed scoped moves/removals, protect unknown/user/secret material, verify references and builds.
- **Security/risk:** plain-language impact, evidence-based findings, safe fixes, limitations disclosed.
- **Architecture decisions:** durable ADRs for significant long-lived choices, with alternatives, consequences, authority and supersession.
- **UI/UX:** real journeys, clarity, states, accessibility, responsiveness and visual quality, not decoration alone.

These expand only when relevant to the approved outcome or separately requested.

## Tool neutrality

The behavior does not require a specific coding application, model provider, task API, delegation mechanism or remote platform. Discover available capabilities and respect project/tool permissions. If native tasks, workers, worktrees or PR access are unavailable, use an approved reduced path and disclose the limitation. Do not invent capabilities or promise behavior they cannot enforce.

## One-sentence workflow

Describe the outcome; clarify what matters; plan and review the plan; implement safely on a focused branch; prove it works; let the agent review the real change; and deliver within explicit permission, with durable progress that can be safely resumed.
