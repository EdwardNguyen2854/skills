---
name: plan
description: Create and review a careful, right-sized implementation plan before writing code. Use when a feature or update needs a plan, the owner asks to plan before implementation, scope needs decomposition, risks or architecture decisions need analysis, or a plan revision needs approval.
---

# Plan

Produce a plan a coding agent can follow and the owner can understand. Do not write application code during planning.

Read [the shared delivery contract](../references/contract.md) and use [the record templates](../references/templates.md).

## 1. Load context

Read:

- Owner request and clarifications.
- Project guidance, relevant code/behavior, tests, configuration and current branch/PR.
- `.work/project.md`, related feature records and accepted ADRs when present.
- Existing conventions for UI, security and verification.

Inspect rather than assume. Identify facts, constraints, unknowns and contradictions. If a missing answer changes the outcome, return to `clarify`; do not bundle a hidden product decision into a technical plan.

## 2. Decide the planning depth

Use a short plan for a small, reversible change. Use a fuller plan when work is large, risky, cross-cutting, hard to reverse, or has several dependent pieces.

For a whole product:

- Agree a useful first version and overall direction.
- Plan the next piece in detail.
- Note longer-term candidates without inventing a false schedule.

Never use "small change" as a reason to skip planning or verification. Adjust length, not existence.

## 3. Define the outcome

Write:

- Who benefits and what they can do afterward.
- Observable acceptance examples.
- In-scope and out-of-scope work.
- The environment where the owner will try it, prerequisites, and differences from the test environment.
- Questions, assumptions and their authority.
- Relevant security/privacy/operational risks and UI/UX implications.
- Architecture decisions the work depends on or creates.

Use official product terminology consistently. If terminology is unclear, clarify it; do not quietly rename the product around the plan.

## 4. Design the smallest coherent approach

Inspect relevant code and identify the simplest approach that satisfies the outcome. Prefer reuse and existing conventions. Avoid unrelated refactors or a new framework for a small need.

Consider:

- Small end-to-end slices with dependencies.
- Failure, empty, loading and permission states where relevant.
- Data migration/loss and rollback/recovery.
- Accessibility and the main user journey.
- Security boundaries and private data.
- Test strategy, manual checks and evidence.
- File ownership and safe parallelism.

If two materially different approaches remain viable, explain the tradeoff and recommend one. Record a significant long-lived choice as an ADR, including alternatives and consequences. Do not create ADRs for routine details.

## 5. Review the plan

Before asking for approval:

- Check every acceptance example maps to at least one task and verification step.
- Check tasks have clear outcomes, dependencies, ownership and stopping boundaries.
- Look for missing setup, migration, edge cases, security/UX work and cleanup.
- Remove steps that do not serve the outcome.
- Verify assumptions against the project rather than the conversation alone.
- Use a fresh reviewer when available; otherwise label self-review and its limits.

Revise blocking weaknesses. Plan review is not code review.

## 6. Record and approve

Post or present a concise plan for the owner. If records are authorized, write `.work/features/<id>/plan.md` using the template; otherwise keep the plan in the conversation and available live tasks.

Ask for approval of the plan revision. In judgment mode, approve it yourself only when an explicit grant covers the update and the plan is within it. Record the approver, revision and limits. A general positive remark about the idea is not approval of an unseen plan.

On approval, hand control to `execute`. If implementation later needs a material scope/assumption change, revise and re-review the affected plan before continuing.
