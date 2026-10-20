# Redesign review results

Status: design reviewed and implemented; static checks pass, runtime scenarios remain unexecuted. Review performed on 2026-10-20.

The original review below covered the first design. Subsequent owner requirements add tool neutrality, branch/PR safeguards, one-step next-update routing, cleanup, security/risk review, durable ADRs and UI/UX. See [product quality and delivery](product-quality.md). A further pair of fresh-context reviewers assessed these additions; findings and design responses are below. Executed evaluations are still required before implementation can be considered validated.

## What was checked

Two fresh-context reviewers independently read the design and scenario specification:

- **Owner-experience review:** could a new reader explain starting/resuming, questions versus delegated decisions, planning, saved progress and completion without the original conversation?
- **Safety/recovery review:** were authority, interrupted writes, lingering workers, concurrent work and stale verification handled consistently?

Each reviewer checked a revised version after their findings were addressed. Both reported their findings resolved at the design level, with no remaining material contradiction identified in their respective review scope. This is useful independent feedback, not proof that the design is complete or that future agents will follow it.

## Changes made from feedback

| Finding | Design response |
|---|---|
| The owner might not be able to use the environment where tests passed. | Agree during planning where the owner will try the result; disclose and resolve required environment gaps. |
| The owner might decline local records. | Offer approved alternative storage or session-only help without a durable-recovery promise. |
| "Safe assumption" was too subjective. | Give examples of high-impact product decisions and require applicable authority or clarification. |
| A scenario appeared to require parallel agents for every independent task. | Make delegation conditional on actual capability and benefit. |
| A worker could launch just before the session stopped, without its ID being saved. | Record dispatch intent before launch, correlate by task/attempt ID, and block conflicting writes if a previous writer cannot be located or ruled out. |
| An old checkpoint could revive permission later revoked. | Maintain current authoritative scoped grants/revocations separately from progress snapshots; unresolved authority blocks affected implementation. |
| A worker might continue after permission changes. | Require stop/re-scope acknowledgement or verified termination; disclose cancellation limits and isolate unresolved work. |
| Different features could collide through shared files or progress records. | Define ownership across the project workspace and shared resources, not merely feature folders. |
| A commit ID does not identify changing uncommitted code. | Tie evidence to actual tested content/configuration; rerun checks when correspondence is uncertain. |
| The minimum test set omitted important permission/ownership cases. | Require permission persistence, revocation and coordinator-conflict scenarios before unattended delegated runs. |

## Not yet verified

- The 43 acceptance scenarios are **specifications**, not executed passes.
- The new skills, local templates and validation are implemented; native-task/worker/PR behavior has not been exercised end to end.
- No real product task or cross-session restoration trial has been run against this proposal.
- The design no longer targets a particular coding application; varied capability paths remain untested.
- The existing validator's CRLF problem is fixed and covered by parser tests.

## Expanded product-care review

Two further read-only reviewers checked safety/consistency and the nontechnical owner's experience. They found three issues, addressed in the documents:

- **Serious risk acceptance versus readiness:** confirmed critical/high-impact findings still block ready/complete status even if acknowledged; medium/low acceptance cannot waive required checks. A specifically authorized draft may be preserved/shared only with its blocked state clear.
- **Architecture decision attribution:** distinguish an explicit owner choice, an agent choice within an owner-approved plan revision, and a choice under delegated scope. Do not demand a separate autonomy grant for routine in-plan engineering choices.
- **Session-only assistance:** keep plan/authority in the conversation and available live tasks, avoid unattended background writers, and disclose that durable progress/ADRs require approved storage.

The reviews also confirmed that the design distinguishes plan review from code/PR review, checks branch purpose instead of just its name, preserves unfinished work, and scopes "go" to one update rather than upload/merge/publication permission. These are document-review observations, not executed workflow passes.

The safety reviewer reread the revised design and confirmed the risk/ADR findings resolved, with no remaining material contradiction identified. Local document checks also passed for links/anchors, whitespace, tool-neutral wording and 43 sequential scenario IDs. No workflow scenarios were executed.

## Implementation review

After implementation, fresh-context reviewers inspected the actual working tree and validator behavior. Material findings were addressed before delivery:

- `/next` now treats a clear "plan, review, implement and go" instruction as a recorded, update-scoped judgment grant and distinguishes it from a bare approval of a presented plan.
- Branch isolation now inventories dirty paths and forbids carrying unrelated work or branching from an unrelated feature's HEAD.
- Permission records are append-only so revocation history cannot be compacted away.
- Checkpoint and PR templates now carry feature IDs, tested content/config, stopping boundaries and reviewed base/head.
- A passing review verdict no longer implies upload or PR permission.
- First use routes through permission-first setup; reduced native-task capability uses local task statuses with the limitation disclosed.
- Validation now rejects duplicate metadata, bad name formats, malformed links, missing template fields and broken design/legacy documentation links, and derives its root from the script location.
- Installed skills now ship generated `references/` copies from the shared source; validation rejects stale, missing or escaping copies, and a local installer smoke test confirmed the installed layout.

`npm test` (21 tests) and `npm run validate` pass. The 43 acceptance scenarios remain unexecuted behavior specifications.

## Remaining validation slice

Execute the required acceptance scenarios against live sessions with varied capabilities, especially permission revocation, interrupted workers, resume staleness, cleanup safety, security findings, branch/PR recovery and reduced-capability paths. Record actual observations and fix behavior gaps rather than treating the scenario table as a pass. Broader install discovery and agent-specific behavior also remain unverified.

Keep installed instructions coherent during migration: update documentation, skill metadata and entry points together, and do not install contradictory old and new workflows side by side by accident.
