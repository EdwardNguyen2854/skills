# Implementation status

Status: implemented and statically validated on candidate commit `7889117`; **no acceptance scenario has been executed**, no installer lifecycle was verified, and no release gate is satisfied. This is a local review candidate, not a production-ready release.

See the [candidate manifest](../releases/candidate-manifest.md) for evidence and the [evaluation manifest](../../tests/evals/manifest.json) for the 61 registered cases.

## Implemented

| Area | Implementation |
|---|---|
| Tool-neutral workflow | Active skills do not require a specific coding application, task API, model provider or remote platform. |
| Main entry points | `setup`, `create`, `resume`, `next`. |
| Supporting practices | `clarify`, `plan`, `execute`, `review`, `verify`, `diagnose`, `checkpoint`, `tidy`, `security-review`, `ui-ux`. |
| Request intent | Review/audit, diagnosis and planning are read-only by default; implementation needs an approved plan or explicit judgment grant. |
| Planning and approval | Plan review is separate from code review; small work gets a short plan, not a planning exemption. A bare "go" approves one reviewed revision only. |
| Bounded autonomy | Work with me is default; Use your judgment requires explicit scoped authorization with no implicit merge/publish permission. |
| Permission history | Immutable grant/revoke/supersede events with stable IDs and owner references. Effective authority is derived, never restored from an older snapshot. |
| Progress and resume | Version-2 `.work/` records with project/feature/plan/checkpoint identities, staged replacement, one prior snapshot, native-task reconciliation and interrupted-worker handling. |
| Workers | Composite task/attempt identity, capability preflight, persisted dispatch intent/status, authority recheck and revocation stop rules. |
| Evidence | Evidence IDs with tested content, relevant untracked/config/dependency/runtime identity, artifacts and limitations. |
| Review | Separate plan, local, PR and whole-repository scopes; severity and confidence are distinct; plan-ready is not code-ready; agent review is not merge approval. |
| Branches and PRs | Purpose/base/PR checks, preservation of unfinished work, scoped upload permission, revision-specific agent review. |
| Product care | Safe cleanup, security/risk review, durable ADRs and UI/UX review, with untrusted-content and command-inspection warnings. |
| Migration | Legacy issue-first files renamed `SKILL.historical.md` so recursive `SKILL.md` discovery cannot activate them. |
| Validation | Strict YAML parsing (`yaml`), AST link/anchor checks (`unified`/remark), canonical metadata checks, physical containment and cycle-safe traversal. |
| Packaging | Generated per-skill `references/` and MIT `LICENSE` copies; sync rejects stale, obsolete, linked, nested or unexpected entries rather than deleting them. |
| CI | Ubuntu and Windows on Node `22.18.0`, latest 22 and latest 24 patches, with read-only workflow permissions. |

## Validation performed

- `npm test` — 71 tests: 70 pass and one guarded installer test skips because no pinned installer command is configured.
- `npm run sync:references -- --check` — 14 installed reference sets match the shared source.
- `npm run sync:notices -- --check` — 14 installed MIT notices match the root notice.
- `npm run validate` — 14 skills and repository metadata pass.
- `npm run check` — integrated suite passes.
- The tests exercise duplicate YAML keys, unclosed quotes, custom tags, wrong metadata shapes, missing anchors, reference-style destinations, traversal, linked source/target paths, malformed JSON, stale/obsolete copies, nested and non-Markdown extras, and check-mode non-mutation.
- Parser, path and validator tests use repository-data fixtures with an ownership marker rather than deleting arbitrary temporary directories.

## Not verified

- None of the 43 acceptance scenarios has been executed against a live coding session.
- The 77 evaluation run definitions (including causal interruption/revocation rows) remain `not-run`; seeded fixtures do not close causal rows.
- Branch/PR behavior against a real remote, required checks and protected-branch rules has not been exercised.
- Native task/delegation capability variations, worker interruption recovery and session-only operation have not been exercised.
- The pinned installer, copy/symlink modes, updates, and cross-tool discovery have not been exercised; the installer test skips without an explicitly configured command.
- Cleanup, security and UI/UX skills have not been run against a representative product.
- R23 measurement-only comparison was not authorized or run.
- G1E matrix approval, G2 safe-candidate status and G3 supervised stop are not satisfied.

Static checks do not prove that agents will follow the instructions, nor that an independent reviewer exists in every tool. The implementation is **statically checked but not yet ready for supervised evaluation**; G1E approval, pinned-install evidence, independent review and the required safety rows remain outstanding.
