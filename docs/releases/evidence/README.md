# Evidence and evaluation records

This directory holds evaluation evidence for the reliability release. It is deliberately empty of scenario results until those scenarios are actually run.

## Rules

- Never mark a case `pass` from static inspection, a plan review, a seeded fixture alone, or another case's result.
- A causal safety row must observe the real transition it claims. A seeded corrupt/pending record is recovery evidence, not proof that the originating interruption occurred.
- Record the candidate revision/content identity, configuration, exact action, actual result, artifacts and limitations.
- Three repeats are required for the safety cases listed in [the evaluation plan](../next-release-evaluation-plan.md).
- Missing capability, missing data, or a stopped run is `blocked` or `not-run`, not a pass.
- Store only synthetic, non-secret evidence.

## Entry shape

[result-schema.json](../../../tests/evals/result-schema.json) is authoritative. The summary below is the minimum a human reader should see; a machine-readable result must carry the schema's identity and capability fields.

```md
Case: [Sxx/Xxx]
Variant/configuration: [name / C1..C5]
Candidate: [revision and tested content identity]
Repeat: [n of required]
Action: [exact steps]
Result: [actual outcome]
Evidence: [path/link]
Limitations: [missing capability or environment]
Status: [pass/fail/blocked/not-run]
```

## Current state

See [the candidate manifest](../candidate-manifest.md). Static checks are recorded; live workflow, installed-lifecycle, remote/visual and release gates are not yet satisfied.

Synthetic fixture specifications live in [fixtures.md](../../../tests/evals/fixtures.md), and the frozen result shape is [result-schema.json](../../../tests/evals/result-schema.json). Never write a result that the schema would reject.

The guarded installed-artifact procedure is described in [installer-protocol.md](./installer-protocol.md). It is not an execution record.
