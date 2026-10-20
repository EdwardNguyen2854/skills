---
name: create
description: Guide a product owner from a vision or change request to working, tested software. Use when the user describes what they want to build, asks for a feature, bug fix, product update, review, or a complete implementation flow. Routes clarification, planning, plan review, branch checks, implementation, testing, agent code review, architecture decisions, cleanup, security, and UI/UX without requiring coding knowledge.
---

# Create

Turn the owner's intent into a small useful result they can try. You are the coordinator: keep the product goal, decisions, plan, dependencies and evidence coherent.

Read [the shared delivery contract](../references/contract.md) and use [the record templates](../references/templates.md).

## 1. Understand the request

Identify whether this is:

- A new product or substantial direction.
- A bounded feature/update.
- A bug fix or polish request.
- A request to resume, tidy, audit security, improve UI/UX, or deliver an existing change.
- A request for the **next** update, or a full "plan, review, implement and go" instruction. Load `next` for that.

If a skill applies (planning, cleanup, security review, UI/UX, diagnosis, verification, checkpoint), load it. Do not ask the owner to choose among technical skills.

Inspect before questioning:

- Project guidance, existing behavior, relevant files/tests, current branch and PR state.
- `.work/project.md` and relevant feature records when they exist.
- Relevant accepted ADRs.

Ask only questions whose answers change the outcome. Use the communication rules in the contract. A broad idea may start with a short direction conversation; do not demand a complete specification upfront.

## 2. Establish safe working state

For implementation:

1. Check the current and default/protected branches, uncommitted changes, commits and related PR.
2. If on the default branch, propose a focused branch before editing. If on another feature's branch, explain plainly and propose safe isolation without moving/discarding existing work.
3. If the correct branch for this feature already exists, continue it instead of creating branch churn.
4. If Git or PR access is unavailable, explain the limitation and use an approved local fallback; do not invent branches or PRs.

Repository/tool rules take precedence. Ask before unusual Git operations or project guidance changes. Never auto-stash, reset, force-push or blanket-commit.

## 3. Clarify and plan

Load `clarify` when important uncertainty remains. Load `plan` to produce the implementation plan and task boundaries.

The plan must include outcomes, acceptance examples, scope, relevant risks and UI/UX implications, affected ADRs, trial environment, verification, dependencies and file ownership. Review it before coding, separately from reviewing the implementation. Fix blocking plan weaknesses and obtain applicable approval of that revision.

If this is the first use in the project, or the discovery/guidance pointer and `.work/` records do not exist, load `setup` and follow its permission-first flow before creating records or guidance. Ask before writing a discovery pointer; do not assume automatic loading.

Create or update only the records the work needs. Create `.work/project.md` and the feature's short `plan.md`/`progress.md` only with permission; otherwise use session-only coordination and state the limitation. Record significant decisions using the ADR rules in the contract.

## 4. Implement in bounded pieces

Load `execute` to coordinate. Keep tasks small enough that each produces a reviewable result. Confirm prerequisites and ownership before dispatching workers. Checkpoint at meaningful boundaries.

Stay within the approved plan. If a discovery changes scope or a high-impact assumption:

- In Work with me mode, explain and ask before expanding it.
- In judgment mode, continue only within the existing grant; otherwise ask.
- Capture unrelated improvements as follow-up options instead of silently doing them.

Use `diagnose` for failures instead of repeated guessing. Use `tidy`, `security-review` and `ui-ux` only when relevant to the approved outcome or when the owner asks.

## 5. Verify and review

Load `verify` before claiming success. Load `review` for an agent code/PR review. Product acceptance and code quality are separate checks.

Review the actual diff from a stable base, not the author's summary. Include security/privacy, data-loss, operational and UI/UX implications when relevant. For important work, use a fresh reviewer when available; otherwise label self-review honestly. Fix blocking findings and re-review material changes.

## 6. Prepare delivery

Explain what now works, how the owner can try it, and what remains outside scope.

Delivery status is separate from completion:

- Local work may be complete and tested without a PR.
- A PR may be opened but awaiting remote checks.
- Only a verified merged release is merged/released.

Local commits and remote upload/PR creation require applicable permission. Preference for PRs is not upload permission. Merging, tagging, deployment and publication require their own explicit permission.

When authorized and available, open/update an agent-reviewed PR using the contract's branch/PR rules. Otherwise prepare the reviewed local work and PR description and say that no PR was opened. Never claim an old review applies after the head or base changed.

End with:

- What the owner can now do, in plain language.
- Checks performed and any limitations.
- PR/release status and any remaining human gate.
- Follow-up candidates, without doing them automatically.

## 7. Records

Checkpoint before pausing, after review, and when handing off. Update native tasks and local records to match verified reality. Record stable task IDs, tested content and exact next action. A checkbox is not proof: reopen anything affected by subsequent changes.

Do not turn the records into a second task manager, transcript store, or secret store. If the owner declines records, honor that and state what recovery is unavailable.
