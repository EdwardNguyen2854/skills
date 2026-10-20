---
name: clarify
description: Ask a product owner useful, understandable questions and resolve uncertainty before planning or implementation. Use when requirements are ambiguous, the owner has a broad vision, technical choices affect user experience, assumptions are needed, or the owner is unavailable and has authorized judgment-based progress.
---

# Clarify

Resolve uncertainty without turning the owner into a project manager or engineer.

Read [the shared delivery contract](references/contract.md).

## Inspect first

Read available project guidance, relevant code/behavior, tests, records, accepted ADRs and the current branch/PR state. Do not ask questions the project can answer. Investigate technical options yourself; do not ask the owner to select infrastructure, libraries or architecture they cannot evaluate.

Separate:

- Facts you verified.
- Product questions only the owner can resolve.
- Technical questions you can investigate or prototype.
- Safe assumptions within an existing approval/permission.
- High-impact assumptions that need an answer or applicable delegation.

## Ask well

Normally ask one to three related questions at a time. For each consequential question:

1. State the practical choice in everyday language.
2. Explain the user-visible effect and the main tradeoff.
3. Recommend an answer and why.
4. Offer "use your recommendation."

Example:

> Should saved products be available on another computer? I recommend starting on this computer only unless using multiple devices matters. That keeps the first version simpler, but the data will not sync automatically.

Avoid a technical questionnaire. Use a short journey, sketch, example or disposable prototype when it communicates better. A coded prototype needs an authorized plan and must remain within scope.

High-impact decisions include changing intended users, core experience, data handling, acceptance criteria or difficulty of reversal. In Work with me mode, wait. In judgment mode, proceed only with a clearly applicable owner constraint or delegation; otherwise pause the affected work. Do not invent audience, payment willingness, privacy/legal obligations or product demand.

## When the owner is busy or unavailable

If judgment mode is explicitly authorized:

- State the question and recommended answer.
- Record the assumption and why it is safe/reversible.
- Continue work that does not depend on an unresolved high-impact or high-risk decision.
- Escalate before paid commitments, data-loss risk, private-data disclosure, production changes, destructive cleanup, publishing, merging or large scope expansion.

Silence is not permission. A session-only question answer is not a durable product decision unless recorded with approval. When authority is ambiguous, default to Work with me and checkpoint a clear question.

If Work with me mode is active, continue only already-authorized work independent of the answer; otherwise save a checkpoint and ask.

## Record outcomes

Use `.work/features/<id>/decisions.md` when records are authorized. Record the question, status, answer/default, authority and consequences. Significant long-lived architecture choices also get an ADR under the contract's rules.

When clarification is sufficient, summarize in plain language:

- What will be built and for whom.
- The important decisions and assumptions.
- What remains open.
- Whether planning can proceed.

Then load `plan` or return to the coordinating skill.
