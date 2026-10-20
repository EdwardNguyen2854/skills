---
name: next
description: Propose and, when authorized, carry out one bounded next product update from vision, current behavior, unfinished work, feedback and risks. Use when the owner asks what to do next, says plan review implement and go, wants to move the next release or update forward without managing stages, or wants delegated judgment-based progress.
---

# Next

Move one useful update forward without turning it into an endless autonomous loop.

Read [the shared delivery contract](references/contract.md) and use [the record templates](references/templates.md).

## Interpret the instruction

- "What should we do next?" or "plan the next update" → inspect and propose/review a plan, then wait.
- "Plan, review, implement and go" / "take the next update forward" / comparable instruction → perform one bounded update under an explicit scoped judgment grant.
- "Next release" → still one bounded update. Do not infer version bumps, breaking changes, tags, deployment or publication.

"Go" is authorization for the one update's implementation within recorded limits, not for upload/merge/release/publication unless that specific permission is also granted. A PR preference is not upload permission.

A clear instruction to plan, review, implement and go is an explicit feature/update-scoped judgment grant for exactly this update, including approval of the reviewed plan it produces. A bare "go" after a presented plan approves that plan revision only. Before coding, record the grant, its limits and its scope in the feature decisions record when records are authorized; otherwise keep it in the conversation and state that it is session-scoped. Stated limits are binding. Do not use "go" to approve an unreviewed or materially changed plan.

## 1. Inspect honestly

Read:

- Vision/purpose and current product behavior.
- `.work/project.md`, active feature records, unfinished work and accepted ADRs.
- Known bugs, user feedback, security/privacy risks, UI/UX gaps and verification limitations.
- Branch/PR/release state.

Prioritize:

1. Broken core behavior or serious risk.
2. Completing unfinished committed work.
3. A small improvement with clear user value.
4. Speculative polish last, if at all.

If no defensible next step exists, ask a product question or offer options. Do not invent demand or busywork. If several options have materially different product consequences, ask rather than deciding for the owner.

## 2. Define one update

State:

- The user benefit and observable outcome.
- Why this is the best next step now.
- What is explicitly excluded.
- Important questions/assumptions.
- Whether the owner's instruction covers implementation and what permissions remain missing.
- The intended trial environment.

Keep it small enough to plan, implement, verify and review coherently. Split unrelated ideas into follow-ups rather than bundling a release-sized pile.

## 3. Plan and review

Load `clarify` for genuine uncertainty and `plan` to create the plan. Review the plan before code. In Work with me mode, ask for approval. In judgment mode, approve/review it yourself only within the existing grant; record the approval revision, assumptions and limits.

If the plan reveals high-impact uncertainty outside the grant, paid/production/destructive actions, or a material scope change, pause that affected work and ask. Continue safe independent parts if authority remains.

Match a plan revision to the authorization; do not code from a rejected plan.

## 4. Execute with isolation

Load `execute`. Check the branch purpose and preserve unfinished work. If the current branch belongs to unrelated work or the tree contains unrelated changes, inventory those paths and use safe isolation from the verified intended base, such as a separate worktree; never move unrelated or unknown work, branch from an unrelated feature's `HEAD`, or move partial hunks without approval. Create or switch only when the working tree is clean of unrelated changes, then verify status and the actual diff.

Use native tasks and focused workers when useful. Store a stable update/feature ID and short records when authorized. Record significant architecture decisions as ADRs.

## 5. Verify and review

Load `verify` for current integrated acceptance. Load `review` for the actual diff. Include security/risk and UI/UX review when relevant. Fix blockers, rerun checks and re-review material changes.

If independent review is unavailable, label self-review. Do not let a worker's claim or a stale review substitute for current evidence.

## 6. Deliver and stop

If scoped upload/PR permission exists, prepare the agent-reviewed PR, verify the head/diff and report its status. Otherwise deliver reviewed local work and a prepared PR description, saying no PR was opened. Never merge/tag/deploy/publish without separate permission.

Stop after this one update. Report:

- What now works and how to try it.
- Checks and remaining limitations.
- Branch/PR/release status.
- What was deliberately left out.
- One recommended next step, without starting it automatically.

Checkpoint so the next update can resume without repeating the investigation.
