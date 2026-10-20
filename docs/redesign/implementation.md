# Implementation status

Status: implemented in the repository and statically validated; runtime workflow scenarios have **not** been executed. A local install smoke test confirmed that an installed skill includes its reference files.

## Implemented

| Area | Implementation |
|---|---|
| Tool-neutral workflow | Active skills do not require a specific coding application, task API, model provider or remote platform. |
| Main entry points | `setup`, `create`, `resume`, `next`. |
| Supporting practices | `clarify`, `plan`, `execute`, `review`, `verify`, `diagnose`, `checkpoint`, `tidy`, `security-review`, `ui-ux`. |
| Planning and approval | Plan review is separate from code review; small work gets a short plan, not a planning exemption. |
| Bounded autonomy | Work with me is default; Use your judgment requires explicit scoped authorization with no implicit merge/publish permission. |
| Progress and resume | Compact `.work/` records, native-task reconciliation, current-authority recovery, stale-evidence checks and interrupted-worker handling. |
| Branches and PRs | Purpose/base/PR checks, preservation of unfinished work, scoped upload permission, agent review tied to the inspected revision. |
| Product care | Safe cleanup, security/risk review, durable ADRs and UI/UX review. |
| Migration | Legacy issue-first skills/docs moved to `legacy/` and excluded from active plugin metadata. |
| Validation | CRLF/LF-safe frontmatter parser, tests, metadata/link/docs checks and CI `npm run check`. |
| Installation packaging | Each skill ships generated `references/` copies from the shared source because installers copy only one skill directory; validation rejects missing, stale or escaping references. |

## Validation performed

- `npm test` — 21 parser/helper/validator/packaging tests pass.
- `npm run validate` — 14 skills, installed reference sets and repository metadata pass.
- Local links and heading anchors across active and design docs are checked by the validator.
- Record-template required fields are checked deterministically.
- A local `npx skills add` smoke test installed `create` under the detected agent directory with `SKILL.md`, `references/contract.md`, `references/templates.md` and a working relative template link.
- Design documents were reviewed by fresh-context reviewers during planning; implementation diff review was performed and material findings were addressed before delivery.

## Not verified

- None of the 43 acceptance scenarios has been executed against a live coding session.
- Branch/PR behavior against a real remote, required checks and protected-branch rules has not been exercised.
- Native task/delegation capability variations, worker interruption recovery and session-only operation have not been exercised.
- Cleanup, security and UI/UX skills have not been run against a representative product.
- `npx skills add` installation was smoke-tested for one skill with copy mode; other agents, symlink mode, updates and cross-tool discovery have not been exercised.
- Static checks do not prove that agents will follow the instructions, nor that an independent reviewer exists in every tool.

These gaps mean the implementation is **statically checked and ready for scenario testing**, not proven production-ready.
