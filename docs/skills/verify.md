# Verify before claiming completion

`/verify`

Checks acceptance examples and required evidence against the current integrated working tree and agreed trial environment.

## Use when

- Implementation or fixes appear finished.
- Before PR delivery.
- A required check is missing, failed or cannot run.

## Outcome

A clear separation of verified behavior, unverified requirements, risks and delivery status.

## Key safeguard

Passing unrelated tests, old evidence or a single retry cannot justify "complete". Unresolved required checks remain blocked.

See the [skill instructions](../../skills/verify/SKILL.md), [shared contract](../../skills/references/contract.md) and [workflow](../../WORKFLOW.md).
