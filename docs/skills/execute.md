# Execute an approved plan

`/execute`

Coordinates safe branch isolation, bounded tasks, focused workers, dependencies, checkpoints and integration.

## Use when

- The plan is approved.
- Several tasks need coordinated implementation.
- Work needs resumption or safe worker management.

## Outcome

Integrated changes ready for current-code verification and agent review, with durable evidence and no silent scope growth.

## Key safeguard

It preserves unrelated work, blocks conflicting writers, verifies worker claims, and stops after repeated failure instead of blindly retrying.

See the [skill instructions](../../skills/execute/SKILL.md), [shared contract](../../skills/references/contract.md) and [workflow](../../WORKFLOW.md).
