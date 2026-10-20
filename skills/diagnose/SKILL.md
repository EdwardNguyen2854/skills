---
name: diagnose
description: Investigate a bug, failing test, performance problem, or unexpected behavior with a reproducible feedback loop instead of guessing. Use when something is broken or slow, a fix failed, tests fail without a clear cause, or repeated retries are not producing new evidence.
---

# Diagnose

Find and fix the cause, not just the symptom.

Read [the shared delivery contract](../references/contract.md).

## 1. Reproduce

Establish a minimal, reliable reproduction:

- Exact action/input/environment.
- Expected versus actual behavior.
- Error output/evidence.
- How often it occurs and any known trigger.

Prefer a failing automated test or small script. If reproduction is intermittent, instrument without changing behavior blindly. Do not "fix" something you cannot observe or explain.

## 2. Build a feedback loop

Use the fastest check that goes red for this problem and can go green after the fix. Record the command/action and result. Run it before and after changes. If the loop is slow, narrow it without weakening the property being tested.

## 3. Form hypotheses

List plausible causes and the evidence for/against each. Inspect:

- Recent changes and relevant history.
- Inputs, state, configuration, dependencies and environment.
- Boundaries between modules and external systems.
- Assumptions encoded in tests versus actual behavior.

Pick the highest-value hypothesis that can be tested cheaply. Instrument at a boundary rather than scattering logs. Protect private data and secrets.

## 4. Test and narrow

Change one relevant variable at a time. Record what each result rules in or out. Remove temporary instrumentation before completion unless it provides lasting diagnostic value.

After two failed attempts with no new evidence, stop blind retries. Reassess the model, seek a different observation, or ask for help with a specific blocker. Do not spawn unlimited attempts or widen the fix without authority.

## 5. Fix and prove

Once the cause is supported:

- Implement the smallest correct fix.
- Add a regression test at the right level when feasible.
- Re-run the reproduction and relevant broader checks.
- Check neighboring cases/state transitions that share the cause.

If the cause reveals a significant architecture problem, capture it as a follow-up or revise the plan rather than silently undertaking a large refactor.

## 6. Report

State:

- Reproduction and root cause in plain language.
- Why the fix addresses it.
- Evidence from before/after checks.
- Remaining uncertainty or related risks.
- Any architecture decision or follow-up needed.

Do not claim the bug is fixed because a retry passed once or an unrelated suite is green. Load `verify` for the feature-level completion gate.
