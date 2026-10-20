# Diagnose failures

`/diagnose`

Reproduces a problem, builds a focused feedback loop, tests hypotheses and fixes the cause rather than guessing.

## Use when

- A bug, failing test or performance problem needs investigation.
- A fix attempt failed.
- Repeated retries are not producing new evidence.

## Outcome

A supported root cause, the smallest correct fix and before/after evidence.

## Key safeguard

It avoids unobserved fixes, unbounded retries and unrelated rewrites; a single passing retry is not proof.

See the [skill instructions](../../skills/diagnose/SKILL.md), [shared contract](../../skills/references/contract.md) and [workflow](../../WORKFLOW.md).
