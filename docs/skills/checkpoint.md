# Checkpoint progress

`/checkpoint`

Saves compact, consistent progress, permission-event references, branch/worker state and evidence so a future session can resume safely.

## Use when

- Pausing or handing off.
- After a plan, meaningful task or review.
- Before context compaction or parallel/background work.

## Outcome

A resume-ready snapshot that mirrors verified reality and identifies unresolved work.

## Key safeguard

It excludes secrets and transcripts, preserves the previous valid record during replacement, and never grants authority by itself.

See the [skill instructions](../../skills/checkpoint/SKILL.md), [shared contract](../../skills/references/contract.md) and [workflow](../../WORKFLOW.md).
