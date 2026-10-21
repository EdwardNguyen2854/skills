# Next-release implementation plan

- Plan ID: `release-reliability`.
- Revision: 2.
- Status: draft for owner approval; not implementation authorization.
- Planning baseline: `56d2f5f`; reconfirm the actual base, branch and working tree before execution.
- Current planning branch: `review/next-release-readiness`.
- Source: [review and proposal](next-release-proposal.md).
- Companion: [detailed evaluation plan](next-release-evaluation-plan.md).
- Version/date of release: undecided. Do not assume `0.3.0` or change version metadata during planning.

## 1. Outcome and scope

Deliver a trustworthy installed collection: predictable validation, bounded filesystem writes, clear authority and request routing, recoverable progress, safe workers, and release claims supported by observed behavior.

This plan details the proposal's **full workflow candidate**, R01–R22 and R24. R23 is a separate, measurement-only optional task; any resulting reference refactor needs a new approved scope and affected re-evaluation. The proposal's session-only preview remains an alternative, not a second simultaneous implementation target. Switching profiles requires a plan revision and revised acceptance matrix before affected work proceeds.

The owner should be able to:

1. Install the collection without accidentally activating legacy skills or losing license notices.
2. Ask for a review or plan without the agent silently implementing it.
3. Authorize one update without authorizing uploads, publication or future updates.
4. Stop/re-scope work and resume later without reviving stale permission or overwriting unfinished work.
5. Understand what was actually tested, what remains blocked and what publication still requires.

### In scope

- The existing 14 active skills, shared references, records and public documentation.
- Parser, Markdown-link, metadata-shape, physical-containment and generated-inventory fixes.
- Focused repository test helpers and pinned installer checks.
- Explicit permission/record/evidence formats, entry-point routing and worker safeguards.
- Safe legacy representation, installation/migration guidance, CI and release evidence.
- Controlled live evaluations using synthetic projects and the available tool capabilities.

### Out of scope

- New product features, new public skills, a custom scheduler/database/service or mandatory provider integration.
- Automatic migration/removal of files in users' projects or global skill installations.
- A wholesale rewrite of the workflow, mandatory issue tracking, or exemptions from planning.
- Paid commitments, production access, uploads/PR creation, commits, merge, tags, deployment and publication without their own applicable permissions.
- A guarantee of security, universal compatibility or statistical reliability.

### Acceptance examples

| ID | Observable result | Closing tasks |
|---|---|---|
| AC01 | Malformed YAML/JSON and supported broken-link forms fail with useful diagnostics; valid installed content passes. | T04–T06, T18, T24 |
| AC02 | A source/target junction or symlink cannot make sync read/write/remove content outside its allowed tree; check mode never writes. | T02, T03, T14, T18 |
| AC03 | Review-only, diagnosis-only and plan-only requests preserve files unless writes are separately approved. | T09, T13, T21, T22 |
| AC04 | Grants/revocations/session expiry remain distinct from checkpoints; unsupported/conflicting records do not restore authority. | T07, T08, T10, T21, T22 |
| AC05 | An interrupted or unreachable worker cannot be replaced by a conflicting writer without ownership reconciliation. | T10, T13, T21 |
| AC06 | Installed collection routing works; missing/wrong supporting skills stop safely; legacy names and notices are handled deliberately. | T14–T16, T22 |
| AC07 | Fresh sessions recover only verified work, preserve unknown edits and invalidate stale acceptance evidence. | T08, T11, T21, T22 |
| AC08 | Every advertised capability has current integrated evidence, visible limits and separate delivery permission. | T17, T20–T24 |

## 2. Authority and approval gates

The current request authorizes writing this plan. It does **not** approve its implementation or any proposed decision below. Do not create `.work/`, change project guidance or launch implementation writers from this document alone.

| Gate | Required decision/evidence | What it permits after separate task authorization |
|---|---|---|
| G0 — Plan approval | Owner approves this revision, full versus preview scope, intended trial environment, evaluation-design work/proposed repeat policy and permission limits. Exact case variants are not yet approved. | Begin approved local implementation/specification tasks. |
| G1 — Design freeze | Proposed defaults below are approved or replaced; material authority/migration changes have applicable approval. | Implement the corresponding schemas, routing and packaging changes. |
| G1E — Evaluation matrix approval | After T17, owner approves the concrete case × variant × configuration × repeat matrix, observers and admissible evidence before live execution. | Prepare the approved live trials; G2 still must pass before running them. |
| G2 — Safe integrated candidate | T20 static/install evidence and pretrial safety review pass on identified content. | Begin supervised synthetic stop-gate evaluations. |
| G3 — Stop gates | T21 completes the required safety cases/repeats on applicable capabilities. | Broader delegated trials only within the evaluated authority/isolation/stop limits. |
| G4 — Candidate ready | T22–T24 checks, scenario coverage and final review pass; unsupported areas are explicit. | Report technical candidate readiness, not release authorization. |
| G5 — Release actions | Owner selects version and grants each specific delivery/publication action. | Only those named actions; verify their actual outcomes separately. |

If a tool, test remote, visual environment or required permission is unavailable, mark the affected case blocked. Do not fabricate a capability or silently weaken full-profile requirements. Offer a documented scope/profile revision instead.

## 3. Proposed defaults to settle at G0/G1

These recommendations make implementation concrete. They are proposed decisions, not claims that the owner has already selected them.

| Decision | Recommended default | Reason / boundary |
|---|---|---|
| D01 — Release scope | Full candidate, with R23 optimization excluded. | Addresses demonstrated defects and the workflow's advertised behavior together. |
| D02 — Runtime matrix | Windows/Linux × Node `22.18.0`, latest supported 22 patch and latest supported 24 patch: six lanes, deduplicated only when the actual versions coincide. Record exact patches. | Tests the declared minimum as well as maintained patches. Tool-neutral skill prose does not require Node in target applications. |
| D03 — Parser dependencies | Maintained YAML and Markdown parsers, a GitHub-compatible slugger, locked at implementation-time reviewed versions. Proposed packages: `yaml`, `unified`, `remark-parse`, `remark-gfm`, `github-slugger`. | Avoid another permissive hand-rolled parser. Dependency installation/lockfile changes require approved scope; do not invent version pins here. |
| D04 — Managed filesystem | Reject symlinks/junctions and special entries beneath managed source/target boundaries, even if their destination appears contained. Canonicalize the explicitly chosen checkout root. | Conservative and testable. Read-only inspection of installer-created symlinks is separate; never run source sync against installed caches. |
| D05 — Inventory | Shared references are flat regular `.md` files. Generated targets must match exactly; unexpected subdirectories/non-Markdown entries fail for inspection, not recursive deletion. | Closes E07/E08 without deleting unknown trees. Approved obsolete top-level generated Markdown may be removed within the declared managed scope. |
| D06 — Installed dependencies | Collection-first support. Proposed string metadata: `collection: edwardnguyen2854-skills`, `workflow-contract: '2'`, and space-delimited `required-skills`, inside the standard `metadata` map. Read observable installed metadata/source identity before required sibling invocation; unresolved/wrong identity means safe stop. No inline fallback. | Freeze identity/discovery semantics at G1 before T13 writes consumers. Markers aid compatibility, not authentication or owner authority; unobservable provenance stays limited/ambiguous. |
| D07 — Archive | Preserve legacy text using `SKILL.historical.md` rather than discoverable `SKILL.md`, updating historical links. No archive deletion. | Prevents name collisions without erasing history; exact rename inventory requires approval. |
| D08 — Authority | Immutable permission events with stable IDs and explicit references to grants being revoked/superseded. | Removes contradictory mutable/append-only wording. Missing provenance is not a grant. |
| D09 — Records | Explicit version 2 for project/plan/progress/decisions; conservative read-only handling for unsupported or ambiguous older records. | No automatic permission migration or claims that old records conform to the new schema. |
| D10 — Record root | Default `.work/`; an alternate root is discovered through a small, owner-approved pointer in existing project guidance. | No hidden new configuration file or automatic relocation. |
| D11 — Snapshot replacement | One current and one prior valid checkpoint, with a clearly marked staged replacement; choose supported safe replacement operations. | Bounded recovery rather than an accumulating backup system. |
| D12 — Evaluation environment | One named primary coding runtime and an explicitly restricted/reduced-capability configuration; isolated synthetic repositories and data. | Actual runtime/version/tool selections remain an approval input, not a provider requirement in skills. |

**Tracking bootstrap:** use the conversation and any available live tasks until T08's v2 formats are integrated. No interim v1/unversioned release-tracking files or unattended background writers. If durable tracking is authorized, the coordinator may then create new v2 records using the actual current approval references; no conversion may invent authority. Existing unrelated/v1 user records remain read-only unless a separate explicit migration is approved. If tracking remains session-only, retain foreground coordination and disclose its recovery limits throughout.

If D03 is rejected, revise T04/T06 with a strictly documented valid subset and installer cross-checks. Do not silently retain the permissive parser while claiming strict validation. If D07 is rejected, provide another tested discovery boundary before claiming legacy exclusion.

## 4. Implementation structure and file ownership

All paths described as new below are **planned files**, not existing commands or implemented APIs.

### Repository helper boundaries

Keep the scripts as small entry points and test their reusable logic without copying installed dependencies into each disposable repository:

| Proposed module | Responsibility / interface shape | Must not own |
|---|---|---|
| `scripts/lib/repository-checks.mjs` | `validateRepository(root)` returns structured diagnostics; explicit data root for fixture tests. | Mutation, installer execution or owner authority. |
| `scripts/lib/reference-sync.mjs` | Plan bounded changes, then check/apply; `syncReferences({root, checkOnly})` reports results. | Broad cleanup, arbitrary external roots selected from content, unrelated skill-root files. |
| `scripts/lib/path-policy.mjs` | Inspect managed entry types and containment; report unsafe paths before file content is read or modified. | Claims of protection against a hostile concurrent filesystem process. |
| `scripts/lib/frontmatter.mjs` | Parse valid YAML and validate the supported skill metadata schema; return fields/body/diagnostics. | Workflow decisions or permissive recovery of invalid syntax. |
| `scripts/lib/markdown-links.mjs` | Parse Markdown AST, local link destinations and real heading anchors with source locations. | HTTP crawling or executing linked content. |
| `scripts/lib/metadata-schema.mjs` | Validate plugin/grouping JSON shape and canonical active skill identities. | Mutating metadata to hide errors. |

The existing `skill-metadata.mjs` may temporarily re-export compatibility helpers. Retire unused helpers only after consumers/tests move. This is repository validation tooling, not a new runtime framework required by installed skills. Do not expose a new public CLI option that can sync an arbitrary root merely for test convenience; CLI root remains derived from its own location.

### Shared-file rules

- One coordinator/integrator owns shared references, generated copies, `package.json`, the proposed lockfile, `tests/repo-fixture.mjs`, workflow/README and catalog metadata.
- Workers may prepare changes in isolated worktrees, but must not concurrently edit these shared paths in the integration tree.
- Only the coordinator regenerates `skills/*/references/` and the proposed generated per-skill license copies.
- Default maximum: two concurrent workers, fewer when ownership overlaps. A read-only reviewer is still a worker when counting active dispatches.
- Returned worker output is ready for review, never proof of completion. Review actual diffs and integrate in dependency order.

## 5. Task index and dependencies

All tasks start **not started**. T00 records actual approval; it must not be marked complete merely because this document exists. A dependency means its accepted output is integrated, not just reported by a worker.

| Task | Outcome | Depends on | Proposal coverage |
|---|---|---|---|
| T00 | Approve scope, defaults, isolation and evidence plan. | — | All planning prerequisites |
| T01 | Testable script boundaries and safe fixture utilities. | T00 | R01–R06 foundation |
| T02 | Physical path containment before sync effects. | T01 | R02/E09 |
| T03 | Exact generated inventory and bounded stale removal. | T02 | R06/E07–E08 |
| T04 | Strict frontmatter parser/schema. | T01 | R03/E01–E02 |
| T05 | Typed plugin/grouping validation and containment integration. | T02, T04 | R05/E05–E06 |
| T06 | Real Markdown links/heading validation. | T05 | R04/E03–E04 |
| T07 | Permission-event format and precedence. | T03 | R11 |
| T08 | Versioned records, alternate roots and replacement/recovery rules. | T07 | R12/R13 |
| T09 | Request-intent and delegated-approval routing. | T08 | R08/R09 |
| T10 | Worker preflight, identities, dispatch and revocation rules. | T09 | R10/R15 |
| T11 | Content evidence and hostile-command trust rules. | T10 | R14/R16 |
| T12 | Review severity and verdict conventions. | T11 | R21 |
| T13 | Consistent skill bodies and public skill pages. | T12 | R07–R16/R21 integration |
| T14 | Generated notices and installed dependency contract. | T03, T06, T13 | R07 |
| T15 | Non-discoverable legacy representation and migration fixtures. | T06, T13 | R17 |
| T16 | Pinned isolated install/discovery/upgrade tests. | T14, T15 | R18; R07/R17 evidence |
| T17 | Evaluation cases, synthetic fixtures and result schema. | T00 | R01 |
| T18 | Runtime/platform CI and reproducible check lanes. | T06, T14 | R19 |
| T19 | Current docs, migration/rollback guidance and proportional examples. | T13, T15, T16, T18 | R20/R22 |
| T20 | Freeze and safety-review the integrated pretrial candidate. | T16, T17, T18, T19 | R24 preliminary gate |
| T21 | Execute supervised stop gates before autonomous trials. | T20 | R01 safety evidence |
| T22 | Execute full workflow/capability evaluations and affected reruns. | T21 | R01 full-profile evidence |
| T23 | Assemble support matrix, limitations and candidate manifest. | T22 | R24 |
| T24 | Final integrated checks and independent sign-off. | T23 | All acceptance criteria |
| T25 | Optional loading measurement, with no unapproved refactor. | T22 | R23; not a release dependency |

## 6. Detailed task packets

Every packet below inherits the common dispatch/return rules in section 9. Test file names are proposed and commands become usable only after the owning task adds them. Tests first for deterministic fixes: observe the intended failure, implement the smallest correction, rerun targeted tests and broader checks. Do not keep the existing 21-test count as a target; it should grow with meaningful coverage.

### T00 — Confirm authority, scope and baseline

- **Owner:** coordinator with owner decisions.
- **Paths:** this plan/evaluation plan only; no `.work/` or guidance edits without permission.
- **Steps:** inventory modified/untracked paths and actual commits/base/default branch; preserve this proposal and any new user work. Approve G0 inputs, applicable D01–D12 defaults, proposed repeat policy and evaluation-design work. T17 subsequently returns the exact matrix for separate G1E approval. Name the intended owner trial/runtime environment, test-data limits, branch/worktree approach and any grant for commits/installing dependencies/test remotes or changing repository contributor guidance.
- **Acceptance/evidence:** approval names revision 2 or its successor; unresolved decisions identify affected tasks; grants distinguish local edits, tool installation, guidance changes, uploads and publication. Retain plan/authority in the session through T08 even if later durable tracking is approved; create no provisional legacy-format records.
- **Stop:** no implementation or implementation-worker dispatch until applicable approval exists. Missing remote permission does not block safe local parser/path work.

### T01 — Extract test seams and repair fixture assumptions

- **Owner/paths:** tooling integrator; existing script entry points, new `repository-checks.mjs`/`reference-sync.mjs`, `tests/repo-fixture.mjs`, proposed `tests/script-entrypoints.test.mjs`.
- **Steps:** extract existing behavior behind explicit data-root functions without changing its validation policy yet. Keep CLI root independent of caller CWD. Change mutation tests to load implementation from the real checkout and operate on fixture data, so future parser dependencies resolve from the reviewed install rather than copied scripts with no `node_modules`.
- Build fixtures from an explicit repository-data allowlist; do not copy ignored secrets, `.git`, globally installed skills or unrelated user files. Create unique owned temporary roots, retain an ownership marker and delete only confirmed owned fixtures. Respect the current harness's approved temporary location; permit an explicit test-temp override.
- **Checks:** `npm test`; proposed `node --test tests/script-entrypoints.test.mjs`. Existing success/failure tests still pass; unknown CWD does not change validation root. Fixture cleanup cannot traverse a linked external directory or delete an unowned path.
- **Stop:** no general-purpose scheduler, public arbitrary-root CLI or unrelated test-framework migration. Adding dependencies is coordinated separately under D03.

### T02 — Enforce physical boundaries

- **Owner/paths:** filesystem worker; new `path-policy.mjs`, `reference-sync.mjs`, proposed `tests/path-policy.test.mjs` and path-focused sync fixtures.
- **Steps:** canonicalize the selected checkout root; inspect relevant ancestors/entry types beneath managed roots with `lstat`-style checks. Reject linked source/skill/reference directories, linked reference files, broken links and special entries before following them. Inventory/preflight all planned operations before applying any sync mutation; recheck affected paths immediately before writes/removals where supported.
- Missing generated directories can be created only under verified ordinary ancestors. All content reads, comparisons and removals use the same policy. Do not normalize a Windows path with string-prefix checks alone; test separators, drive roots, sibling-prefix traps and case behavior explicitly.
- **Checks:** E09 as an automated regression, plus source/target/file/obsolete-file links, valid empty/missing target, normal idempotent sync, read-only check mode and external sentinel preservation. An instrumented internal content-I/O boundary or equivalent read-sensitive observer must detect attempted external content reads; unchanged sentinels alone prove only write/removal preservation. Exercise the actual link fixtures through that boundary so eventual rejection after reading cannot pass. Run Windows junction and Linux symlink variants. A platform unable to create links reports skipped coverage, not pass.
- **Acceptance:** unsafe input fails with controlled path diagnostics and no external reads/writes/removals; no mutation occurs after a known failed preflight. Describe the residual concurrent-swap limitation instead of claiming a sandbox.
- **Stop:** never test with actual user directories or weaken containment to make a link fixture pass.

### T03 — Make inventory exact without broad deletion

- **Owner/paths:** same filesystem ownership slot after T02; `reference-sync.mjs`, `tests/sync-references.test.mjs`, proposed `tests/reference-inventory.test.mjs`. The coordinator owns the corresponding `AGENTS.md` and README managed-directory policy update; the worker returns that bounded documentation patch for integration.
- **Steps:** define one sorted manifest of flat regular source Markdown; enumerate all target entry types, not just `.md` names. Check reports missing/stale/obsolete/unsupported entries. Apply updates only after preflight. Allow scoped removal of obsolete regular generated top-level Markdown under the approved managed policy; unexpected directories, special entries and non-Markdown extras fail for inspection rather than recursive cleanup.
- Distinguish missing source, empty source, source directory, inaccessible entry and unexpected extension. Avoid partial truncation when replacing files; report any partial operation after an I/O failure accurately.
- Align contributor/README wording: approved obsolete regular generated Markdown can be removed; unknown directories/non-Markdown/special entries stop apply for inspection. Do not leave the old blanket promise that every absent-source file is removed.
- **Checks:** E07/E08; new/missing/stale/obsolete files; unexpected source nesting; repeated sync zero changes; `--check` changes no bytes/paths. Inject a write failure and preserve recoverable previous contents where supported.
- **Stop:** do not add an automatic `--force` cleanup escape hatch or delete non-generated user material.

### T04 — Strict frontmatter and skill schema

- **Owner/paths:** parser worker; new `frontmatter.mjs`, frontmatter exports in `skill-metadata.mjs`, `tests/skill-metadata.test.mjs`, proposed `tests/frontmatter.test.mjs`. Dependency manifest/lockfile changes go through the coordinator.
- **Steps:** parse YAML after BOM/line-ending handling; require one mapping with unique keys and valid syntax. Reject custom executable tags/unsafe types; preserve standard quoted/block scalar semantics. Require string name/description; enforce matching directory name, kebab-case and the specification's 64/1024-character limits. Validate supported optional metadata field shapes; explicitly document extensions.
- Replace the test that blesses malformed/unrecognized YAML with negative syntax tests. Keep description usefulness checks distinct from format validity; an invalid scalar must not reach a word-count method and crash.
- **Checks/local acceptance:** E01/E02; LF/CRLF/BOM, mixed endings, comments, quoted colons, folded/literal blocks, null/boolean/array/map values, duplicate keys, unclosed quotes, indentation, escapes and boundary lengths. Return frozen representative compatibility fixtures. Local T04 completion does not depend on T16: cross-parser comparison with the selected pinned installer is a later T16 release acceptance gate, not a prerequisite for this task.
- **Stop:** no silent repair of invalid metadata, arbitrary YAML object construction or unreviewed dependency-version guess.

### T05 — Typed repository metadata and validator containment

- **Owner/paths:** validator worker; new `metadata-schema.mjs`, `repository-checks.mjs`, `tests/validator.test.mjs`, proposed `tests/metadata-schema.test.mjs`.
- **Steps:** validate presence, JSON syntax and object/array/string shape before iteration. Enforce canonical `./skills/<name>` plugin paths, unique entries and correct active group membership; reject null/number/array group objects with field locations. Integrate T02 policy before reading traversed skill/reference destinations. Collect independent diagnostics safely without continuing through invalid container shapes.
- **Checks:** E05/E06, missing required files, malformed JSON, mixed-type arrays, duplicate/unknown skills, invalid path spellings, missing docs and physical escapes. CLI must report controlled diagnostics, exit nonzero and not leak a stack trace for ordinary invalid input.
- **Stop:** do not mutate plugin/grouping metadata automatically or require a remote schema service.

### T06 — Parse Markdown links and actual anchors

- **Owner/paths:** validator ownership slot after T05; new `markdown-links.mjs`, affected compatibility exports, `repository-checks.mjs`, proposed `tests/markdown-links.test.mjs`.
- **Steps:** walk a Markdown AST for links/images/definitions and headings; resolve reference-style links and same-file anchors. Build duplicate-heading anchors in document order with the selected slugger; ignore fenced pseudo-headings. Decode local URI paths/anchors safely; external schemes are not local files. Check destination existence/type and physical/installed-root boundaries before reading headings.
- Choose/document treatment of raw HTML IDs/links, autolinks, unsupported syntax, query strings and explicit heading IDs. Either support a form with tests or state the limitation; do not pretend a regex covers it. Test links in tables and GFM formatting.
- **Checks:** E03/E04; duplicate headings, code fences, images, escaped/nested parentheses, titles/spaces, percent encoding, Unicode, valid external URLs and malformed local targets. Run against actual current docs; fix newly exposed real broken links within approved documentation scope.
- **Stop:** no network link crawler, HTML execution or arbitrary linked-file reads beyond the configured repository/installed root.

### T07 — Define permission events and effective authority

- **Owner/paths:** contract integrator; `skills/references/contract.md`, `templates.md`, proposed record examples/format fixtures and `tests/record-formats.test.mjs`.
- **Steps:** settle D08 with explicit event fields: `event_id`, event kind, referenced grant/event, action, project/feature scope, owner instruction reference, limits, originating session where relevant, effective/expiry information. Grant/revoke/supersede entries are immutable; effective status is derived, not edited in place. Scope restrictions and current owner instructions take precedence; timestamps alone cannot create authority.
- Define grant → revoke → regrant, project restriction versus feature grant, session expiry, conflicting references and missing history. A new grant cannot erase the old revocation; a session identifier missing/unverifiable on resume cannot carry session authority forward. Checkpoint/ADR/worker packet references are never grants.
- **Checks:** fixture/example schema assertions and fresh-reader reasoning against all authority cases; link to X06 and S05–S07 live evaluations. Repository format checks verify examples/templates only; they do not authenticate target-project owner instructions.
- **Stop:** do not invent old approvals, silently import historical grants or build a permissions service.

### T08 — Record versions, roots and safe replacement

- **Owner/paths:** same contract ownership slot; shared contract/templates, proposed versioned examples, record-format tests.
- **Steps:** add explicit version/feature/plan identity throughout project/plan/progress/decisions formats. Define a checkpoint ID/sequence and previous-checkpoint reference, actual workspace and evidence scope. Specify approved alternate-root discovery, ambiguous/moved pointer behavior and no-Git fields.
- Define replacement: inspect current ownership/revision; preserve last valid snapshot; stage and validate a complete replacement; replace using available safe operations; verify; retain only the bounded prior snapshot. Example names may be `progress.previous.md` and `progress.pending.md`; staged files are not automatically valid checkpoints or authority. Describe fallback when a tool cannot guarantee atomic replacement.
- Define v1/unknown/corrupt record handling as read-only inspection until an authorized migration/recovery plan exists. Never roll back current permission history with a progress snapshot; preserve conflicts and unexpected edits.
- Close the release-tracking bootstrap explicitly: after integration, create minimal new v2 release records only if authorized, preserving actual session approval/provenance. Do not auto-convert existing user v1 records or claim earlier session-only work already had durable checkpoints. Without record permission, keep foreground/session-only coordination.
- **Checks:** missing fields, unsupported versions, mismatched IDs/revisions, truncated/staged writes, competing snapshots, interrupted replacement and alternate `.work/` collision examples. Full live proof is S09–S14/S22/S24–S25, not template parsing alone.
- **Stop:** no automatic target-project conversion, replacement task manager, lock daemon, indefinite backup pile or hidden storage if records were declined.

### T09 — Route intent and approval explicitly

- **Owner/paths:** contract integrator; shared request/authority rules, `create`, `next`, `plan`, `diagnose`, `clarify` skill sources. Public page integration happens in T13.
- **Steps:** implement an intent table for review, diagnosis, proposal/plan, implementation, resume and delivery. Planning-only stays planning-only even if the owner says the idea/plan looks good while retaining a no-implementation limit. Diagnostic instrumentation/tests/prototypes are writes requiring applicable authorization.
- Preserve the deliberately explicit “plan, review, implement and go/use your judgment” one-update grant. “Move forward,” “continue,” “next release” and standalone “go” depend on already approved state or clarification. Bare go after a reviewed plan approves that revision only; it is not selection/approval authority for another unseen plan.
- **Checks:** X01–X04 language/operation table, S02–S05/S31–S32/S41–S43 mappings and examples of already-approved routine engineering. Do not turn every normal in-plan choice into another autonomy question.
- **Stop:** no implementation by this planning task; no new broad release-level grant inferred from the owner approving this document's wording.

### T10 — Worker preflight, namespace and interruption protocol

- **Owner/paths:** contract integrator; shared worker rules/packet/progress formats, `execute`, `checkpoint`, `resume` sources.
- **Steps:** use a composite project/workspace + feature + task + attempt identity; keep native task/worker IDs as replaceable mappings. Before launch save intent, plan revision, authoritative permission reference, ownership and intended workspace; after launch save returned ID.
- Preflight actual status/stop/notification/isolation capabilities. No unattended shared-workspace writer without an adequate inspection/stop strategy. Use foreground/sequential fallback or approved isolated ownership. Workers recheck applicable authority before new write batches; packet snapshots cannot override revocation. Coordinator stops new dispatches and requires acknowledgement/termination or blocks conflicting writes/integration.
- Include unreachable writer, launch-before-ID interruption, duplicate notices, revoked grant, concurrent coordinators and disjoint features sharing one source/task view. Retain two-worker default and no recursive delegation/publication/shared-record writes by workers.
- **Checks:** format fixtures for identity/intent fields; X10–X12 and S07/S13–S18/S20 live traces. Any unavailable management behavior is explicitly limited rather than invented.
- **Stop:** no custom polling manager or claim that a fresh context is a filesystem sandbox.

### T11 — Tested-content identity and hostile-input/check boundaries

- **Owner/paths:** contract integrator; shared evidence/trust rules, `verify`, `security-review`, `tidy` and relevant diagnosis rules, evidence examples/tests.
- **Steps:** define an evidence envelope: acceptance ID, command/action, result, base/head if present, relevant tracked edits/untracked inputs/configuration/dependency/runtime identities, artifact location and limits. Use a declared content set or rerun affected checks when correspondence is uncertain; no HEAD/dirty-path-only shortcut.
- Explain authoritative guidance versus untrusted task content, including misleading newly cloned guidance and worker claims. No document/file name can grant new upload/deployment/secret permission. Inspect unfamiliar check scripts and transitive commands for material side effects; pause or use an approved synthetic environment when outside authority.
- **Checks:** same-HEAD/same-path changed bytes; relevant untracked/ignored non-secret fixture input; changed config/lockfile; no-Git checks; hostile README/log/PR/worker result; a “test” invoking synthetic upload/deploy/delete sentinels. See X09/X13/X14.
- **Stop:** no storing/hash-enumerating secrets, whole-session transcripts or executing a nominal test merely because its name sounds safe.

### T12 — Review scope, findings and verdicts

- **Owner/paths:** contract integrator; shared reporting conventions, `review`, `security-review`, `verify` sources and examples.
- **Steps:** define evidence/confidence separately from severity. Critical/high-impact confirmed findings block readiness; medium/low residual acceptance cannot waive mandatory checks; uncertain hypotheses are not presented as proven exploits. Include open/resolved/dismissed-with-evidence/accepted-residual dispositions.
- Add plan-only and whole-repository audit targets, distinct from diff/PR review. Plan-ready is not code-ready; local-ready is not PR checks satisfied/merge-approved/released. Findings identify exact revision/content, owner impact and corrective action.
- **Checks:** examples for plan review, whole-repo audit, false positive, optional preference, serious unresolved issue, missing required check and required human approval. Live coverage: S17/S19/S30/S37/S42 and X17.
- **Stop:** do not use a new rubric to silently downgrade a confirmed blocker or expand optional preferences into implementation scope.

### T13 — Integrate the installed instruction set and public pages

- **Owner/paths:** coordinator only; all 14 active `SKILL.md` sources, `docs/skills/*.md`, shared references. Generated copies remain generator-owned.
- **Steps:** reconcile T07–T12 rules with every entry/supporting skill, descriptions and public outcomes. Ensure first-use setup is permission-first and read-only requests do not force records/guidance. Align alternative record roots, session-only limitations, independent/self-review labels and completion status.
- Read each installed skill as a standalone entry point: required references exist; mandatory safety rules are actually shipped; a skill never assumes an unavailable sibling loaded. Implement the G1-frozen D06 collection/contract/dependency metadata and discovery/stop wording here, before packaging consumes it. Keep SKILL bodies focused and shared rules canonical.
- **Checks:** static validation; consistency/format fixtures; fresh read-only instruction review using plan/routing cases. Run reference generation only after the shared source is coherent, then inspect the actual generated diff.
- **Stop:** do not duplicate the entire design into each skill, edit generated copies directly or treat document review as live behavioral proof.

### T14 — Package dependencies and MIT notices

- **Owner/paths:** packaging worker in an explicit ownership slot; sync manifest/implementation after T03, root `LICENSE` as read-only source, generated `skills/<name>/LICENSE`, packaging tests. Coordinator integrates README/metadata/dependency instructions.
- **Steps:** add per-skill root `LICENSE` generated from the canonical root notice; check mode detects missing/stale notices without modifying other skill-root files. Extend containment checks to these exact outputs. Consume the D06 identity/discovery contract already frozen at G1 and integrated in T13; validate its packaging without redefining it after its consumers. Do not assume same name means same collection.
- **Checks:** isolated directory copies contain SKILL, references and full notices; notice regeneration/idempotence/stale checks; license target links cannot escape; collection inventory exactly matches metadata. Installed use is proved later in T16/T22.
- **Stop:** no manual edits to generated notice copies, unrelated root cleanup or requirement that target applications install Node just to use the prose skills.

### T15 — Preserve history outside active discovery

- **Owner/paths:** archive worker; exactly 11 `legacy/skills/engineering/<name>/SKILL.md` renames to `SKILL.historical.md`, affected links under `legacy/`, archive/discovery tests. Coordinator approves the inventory first.
- **Steps:** preserve document bodies, provenance and historical scope; update references to renamed files. Keep active catalog names and 14-skill wiring unchanged. Add a fixture representing an old installation plus customized guidance and unrelated skills for migration preview tests.
- **Checks:** recursive source inventory finds no active `SKILL.md` under legacy; old/new bodies match except approved historical notices/links; active links remain valid. T16 must verify actual pinned installer behavior, including deep discovery and selection by name.
- **Stop:** no deleting history, converting existing user projects or removing installed skills automatically. If installer behavior defeats the representation, stop and revise D07.

### T16 — Pin and test installation lifecycle

- **Owner/paths:** installation worker; proposed `tests/installer.test.mjs`, installer fixtures and compatibility result templates. Coordinator owns package script/lockfile additions.
- **Steps:** after permission to obtain/execute the installer, select and record its exact version and supported invocation from actual help/source; never guess flags. Run only inside isolated HOME/project/agent directories, with telemetry/network behavior inspected and no credentials. No global installation or modification of the owner's real agent setup.
- Test collection, `create` only, `next` only, copy and supported symlink modes; default/deep discovery; same-name foreign skills; approved upgrade/uninstall dry-run/preview preserving customized guidance, records and unrelated skills. Verify notices and references as installed bytes.
- Run T04's frozen accepted/rejected fixture corpus through the pinned installer/parser now. Any material compatibility disagreement blocks the claim, returns an approved fix to T04/T06 as needed and invalidates affected results; do not retroactively pretend this external comparison was part of the earlier local T04 pass.
- **Checks:** deterministic source inventory plus genuine pinned installer observations. A safe-stop single-skill flow is supported; successful standalone full orchestration is not promised. Record failures/untested combinations and exact destinations.
- **Stop:** unavailable network/install permission blocks this lane, not unrelated local work. Installer smoke tests do not count as successful live routing or full scenario passes.

### T17 — Build evaluation specifications, not a scheduler

- **Owner/paths:** evaluation worker; proposed `tests/evals/` cases/fixtures, result-schema checks and `docs/releases/evidence/README.md`. Follow the companion evaluation plan.
- **Steps:** translate S01–S43 and X01–X18 into reproducible synthetic initial states and observable invariants; register expected permissions/capabilities, evidence collection and fixture cleanup. Define stable variant IDs/revisions, exact required repeat rows, interruption hooks and pass/fail/blocked/skipped/not-run handling. Return this concrete matrix for G1E approval before live execution; T00 approved its design, not a matrix that did not exist yet.
- Use simple fixture-generation/test utilities and optional documented runtime adapters. Separate simulation, artifact validation and actual model/tool observations. Keep integration artifacts small, sanitized and local unless upload is authorized.
- **Checks:** deterministic schema validation, all 43 base scenarios/18 adversarial cases mapped, and uniqueness/completeness of candidate × case × variant × configuration × repeat against the approved required-row list. Missing evidence cannot be pass; attempted-but-failed traces are retained; result content identity cannot silently change. Require actual invocation/resolved instruction-load provenance for installed routing and causal live interruption evidence for the relevant variants; seeded recovery remains a distinct variant/class. Add manifest/field checks, not a model's promise as proof.
- **Stop:** do not execute broad autonomous scenarios before G2/G3, start a background service or add a provider/task API requirement to active skills.

### T18 — Align CI, dependency installs and line-ending policy

- **Owner/paths:** CI worker; `.github/workflows/validate.yml`, proposed installer release lane, optional `.gitattributes`; coordinator owns `package.json`/lockfile and README requirement edits.
- **Steps:** run Windows/Linux × Node `22.18.0`, latest supported 22 patch and latest supported 24 patch, recording actual versions and checking dependency engine compatibility at the floor. With approved dependencies and a reviewed lockfile, use the deterministic install path, preferably scripts-disabled when compatible. Tracking/committing the lockfile remains subject to commit permission. Validate checkout line endings and generator byte stability; adopt an explicit text policy only with an inspected, scoped diff.
- Keep fast local/parser checks separate from permission/network-dependent installer release checks. Define a proposed `test:install` package script only after T16 implements its target; never document a nonexistent command as currently available. Limit CI token permissions; a broader CI-security overhaul stays separately scoped.
- **Checks:** every declared lane runs `npm run check`; link/junction tests execute on the applicable OS. Run sync/check twice and confirm no new diff. External installer lanes retain exact pins/results and cannot access production credentials.
- **Stop:** a skipped platform-specific safety test leaves a coverage gap; do not call the platform tested merely because unrelated tests passed.

### T19 — Update current docs and worked examples

- **Owner/paths:** documentation worker; README, WORKFLOW, root historical REVIEW notice, current redesign status pages, CHANGELOG, proposed examples/migration docs; shared-file changes coordinator-integrated. Recheck the T03 coordinator-owned `AGENTS.md`/README cleanup policy alignment; request any necessary correction through that ownership slot.
- **Steps:** add a prominent historical scope/pointer to REVIEW without rewriting its original findings as current. Remove stale branch/future-status claims from current docs, while preserving historical context. Link the current plan/evidence and accurate install/runtime support.
- Add four clearly illustrative worked examples: tiny approved fix, session-only planning, read-only review, bounded delegated update. Show plain-language questions, plan review, approval revision and honest checks/status without fabricating execution. Include approved guidance/records migration preview, uninstall and rollback that preserve custom work.
- Clarify `0.1.0`/`0.2.0` unreleased history without inventing dates or selecting the next version. Leave behavior-result fields not run until T21/T22 supply observations.
- **Checks:** Markdown validation, example record-format tests, fresh-reader questions about wait/continue/complete/upload boundaries. No promises of universal command discovery or compatibility.
- **Stop:** no rebrand, new skill catalog or issue-first/planning-exemption regression.

### T20 — Freeze a safe pretrial candidate

- **Owner:** coordinator and fresh read-only safety reviewer where available.
- **Paths:** integrated implementation, test/install results and pretrial candidate manifest.
- **Steps:** integrate prerequisite tasks; regenerate references/notices; run current deterministic and installed checks; inspect actual base-to-candidate diff. Confirm G1E approved the exact required case/variant/repeat rows and that every fixture, command, permission and destination uses synthetic owned resources. Record candidate content identity and actual capability matrix.
- Review request/authority rules, path policy, worker management and cleanup before dispatching live safety trials. Fix material blockers and repeat affected deterministic checks. No partial worker-result aggregation substitutes for checking the integrated tree.
- **Acceptance:** G2 explicitly names tested content and allowed supervised trial boundaries; required static/install checks pass or full profile remains blocked.
- **Stop:** no unattended trials on the strength of passing parser tests or document review alone.

### T21 — Execute safety cases under supervision

- **Owner:** evaluation coordinator/operator, with fresh assessment of material findings where available.
- **Paths:** synthetic projects and per-run evidence only; source fixes require a separate approved task/revision.
- **Steps:** execute the companion plan's stop-gate set and targeted X cases in isolated controlled sessions. Deliberately trigger revocation, wrong branch, failed required checks, hostile content and interrupted dispatch while an operator can intervene. Keep unresolved writer workspaces isolated and out of cleanup until termination is known.
- Repeat each required stop-gate case/variant three times from independent initial states. Record actual tool calls/file states and limitations. No cancellation tool means no claim of successful tool cancellation; test safe fallback/blocking behavior instead.
- Preserve separate seeded-state and causal-live interruption rows. Dispatch-before-ID causal variants specifically require observed intent persistence → actual launch → observed interruption before ID persistence → fresh-session ownership reconciliation. Other causal variants must demonstrate their own G1E-approved boundary sequence: actual worker activity then revocation for S07, code change then interruption before checkpoint for S11, and preserved-prior/staged-replacement interruption then recovery for S12. Follow the companion evaluation plan's case-specific requirements; dispatch evidence cannot substitute for those other boundaries. A constructed pending/staged record cannot close a causal-live row; unavailable hooks block its support claim.
- **Acceptance:** all required rows for advertised autonomous behavior pass, independent of narrative promises; G3 identifies the exact capabilities authorized for broader trials. Any fail/blocked result blocks its affected claim.
- **Stop:** no broad unattended loop, production remote, real private data or same-workspace replacement writer while ownership is unresolved.

### T22 — Execute full workflow and capability coverage

- **Owner:** evaluation coordinator/operator after T21.
- **Steps:** execute all S01–S43 and X01–X18 in the approved applicable variants. Include new feature, tiny fix, changed requirement, interrupted/fresh session, alternate records, session-only behavior, meaningful UI interaction and safely bounded delegation. Actual remote PR/protection and visual claims require their real approved synthetic environments; simulations are labeled and do not prove those integrations.
- Run each ordinary case/variant once and preserve the three-run safety coverage from T21. After a fix, rerun the failed case, related invariants and affected integrated checks on the new identity; retained earlier failures remain in history. Re-evaluate safety gates if authority/worker/recovery/packaging rules materially change.
- **Acceptance:** complete per-case evidence matrix with no missing required outcomes for declared full support; claimed successes match actions/current artifacts, not just final answers. Missing tools/permission remain blocked or require owner-approved support revision.
- **Stop:** do not silently switch to the preview profile, reduce repeats after failures or average away a safety failure.

### T23 — Build the final support/evidence manifest

- **Owner/paths:** coordinator; proposed `docs/releases/evidence/<candidate-id>/manifest.md`, support matrix, limitations and concise owner trial instructions.
- **Steps:** record active inventory, source/generated provenance, notices, candidate content set, dependency/installer/runtime versions, actual deterministic/install/scenario runs and review findings. Keep implemented, deterministically tested, behavior evaluated, blocked and unsupported distinct.
- Specify what the candidate fingerprint includes/excludes. Exclude self-referential result files from their own content hash; that exclusion does not exempt them from final link/content review. Documentation/result changes still need appropriate checks even when they do not change installed skill bytes.
- **Acceptance:** every claim traces to integrated evidence; no stale worker revision promoted to current. Remaining human gates and publication permissions are explicit; no invented version/date/tag.
- **Stop:** manifest assembly does not authorize committing or publishing evidence, which may reveal paths or sensitive project context.

### T24 — Final integrated verification and sign-off

- **Owner:** coordinator plus fresh reviewer where available; owner decides support/release scope.
- **Steps:** inspect final actual diff and generated changes; run `npm run sync:references` when needed, then `npm run check`, all declared OS/runtime/install lanes and affected behavior reruns. Confirm review findings closed or correctly blocked/accepted within policy. Recheck artifact identity after final fixes and docs assembly.
- **Acceptance:** all AC01–AC08 and full-profile gates pass; review states candidate readiness, remaining limits and trial steps. Required remote/human gates remain separate. If exact integrated correspondence is uncertain, rerun affected checks.
- **Stop:** stop at reviewed local candidate unless separately authorized. No upload, PR, merge, version bump, tag, deployment or publication by implication.

### T25 — Optional context-loading measurement

- **Owner:** optional measurement worker; no shared-reference writes.
- **Steps:** measure actual reference reads/reloads and observable ceremony on representative successful traces. Separate distributed bytes, loaded context and wall-clock/model behavior. Report results and uncertainty.
- **Acceptance:** a small evidence-backed recommendation to keep or change loading structure; no claimed savings from file-size arithmetic alone.
- **Stop:** optimization/refactoring requires a new bounded approved task and relevant stop-gate reruns. T24 does not depend on T25.

## 7. Suggested two-worker execution waves

This schedule expresses safe opportunities, not a requirement to keep two workers busy. Contract tasks T07–T13 share ownership and stay sequential; tooling tasks that modify the same validator/facade also stay ordered.

| Wave | Worker slot A | Worker slot B | Coordinator checkpoint |
|---|---|---|---|
| 0 | No implementation worker. | No implementation worker. | Complete T00/G0 and approved decisions; tracking remains session-only until T08. |
| 1 | T01 tooling/fixture foundation. | T17 evaluation specifications. | Review/integrate fixture API before downstream writers. |
| 2 | T02 containment, then T03 inventory. | T04 frontmatter. | Integrate manifests/dependencies serially; verify E09/E01/E02 regressions. |
| 3 | T05 metadata, then T06 Markdown. | T07, then T08 record/authority design. | G1 decisions and shared API/record contracts fixed; T03 precedes T07; approved new v2 tracking can begin only after T08. |
| 4 | T09 → T10 → T11 → T12 → T13, one contract ownership slot. | Read-only test/evaluation preparation within T17; no competing shared edits. | Review intent, authority, installed safety and template consistency. |
| 5 | T14 packaging/notices. | T15 archive/migration. | Regenerate only after both isolated results are integrated. |
| 6 | T16 pinned install tests. | T18 CI/platform wiring. | Coordinate package/lockfile changes and actual test outcomes. |
| 7 | T19 current docs/examples. | Read-only pretrial evidence preparation. | Obtain G1E approval of T17's exact matrix; then T20 integrated static/install check and safety review. |
| 8 | T21 supervised safety trials. | Material-result reviewer when useful, read-only. | G3; do not run broad autonomous work before it. |
| 9 | T22 full evaluations. | Independent result assessment / non-conflicting runs explicitly approved by coordinator. | Keep task/result IDs and synthetic resource ownership disjoint. |
| 10 | T23 manifest, then T24 final checks. | Fresh final reviewer. | G4 candidate verdict; G5 still a separate decision. |

## 8. Tests and evidence checkpoints

Current commands available now:

```text
npm test
npm run validate
npm run check
npm run sync:references
```

The targeted test commands named in task packets are future commands for proposed files, not current test results. The existing review's 21 passing tests and E01–E09 observations establish the baseline only. Writing this plan executes no new behavioral scenarios.

At every integration checkpoint:

1. Reconcile actual paths, workers, branch/base/content and permission scope.
2. Inspect the real changed files; preserve unknown edits and unrelated untracked work.
3. Run targeted deterministic tests and record actual outcomes; after shared-reference edits regenerate then run the full current check.
4. Record evidence content/config identity, not just dirty paths or a worker's “done.”
5. Mark ready for review until required review/acceptance passes. Reopen affected tasks when content changes.
6. Save durable state only in the approved location; otherwise provide a session checkpoint and disclose recovery limits.

## 9. Common worker dispatch and return packet

Populate this from an approved task; do not paste the whole conversation or infer authority from the template.

```text
Plan: release-reliability / revision [approved revision]
Task/attempt: [workspace]/release-reliability/Txx/attempt-N
Outcome: [one task's bounded observable result]
Prerequisites integrated: [task IDs, content identity, actual evidence]
Authority: [current owner instruction / grant reference, action scope and limits]
Workspace: [verified branch/base/worktree and resource owner]
Owns: [exact writable files/directories]
Read-only context: [selected source files and applicable contract/decision sections]
Acceptance: [task-specific cases and expected evidence]
May: [explicit local operations]
Must not: shared-record edits, unrelated changes, recursive delegation,
          commits/uploads/PR/merge/tag/deploy/publish without exact permission
Checks: [commands after confirming scripts/side effects are within scope]
Stop: conflict, unknown ownership, revoked/unclear authority, material scope
      change, missing prerequisite, unsafe command, or two retries with no evidence
Return: changed paths/diff; actual before/after checks; tested content/config;
        findings/limits; unresolved workers; integration instructions; next action
```

The coordinator verifies returns and integrates them; a worker cannot approve a material change to its own scope. Reviewers inspect actual code/instructions and stable diffs with read-only permission where supported.

## 10. Rollback, interruptions and scope changes

- Keep tasks small and independently reviewable; do not rely on a future destructive reset to recover.
- On a failed code change, preserve the diff/evidence and prepare a targeted corrective patch or a revert of this work only, under applicable authority. Never reset/discard unknown user work.
- Before an archive rename, inventory exact source/destination paths and preserve history. Before packaging cleanup, validate the bounded manifest and recovery method; do not expand removal scope on failure.
- Do not auto-stash, force-push, rebase, move partial hunks or initialize/configure a remote without explicit approval.
- On revocation, stop new affected actions/dispatches immediately. Reconcile running writers before conflicting writes or cleanup. Unknown worker state remains potentially live.
- On schema/authority/installer changes, bump the plan revision, identify affected tasks/tests, re-review material changes and obtain applicable approval. Old passing traces cannot silently apply to new behavior.
- Preserve baseline/current evidence; a result file never becomes an authority record. Records-declined sessions cannot promise durable recovery.
- If required remote/visual/runtime evidence cannot be obtained, stop the affected support claim or propose a narrower profile with its own approved gates. Do not call the full candidate complete with a missing-check footnote.

## 11. Coverage and final handoff

| Proposal work | Closing tasks |
|---|---|
| R01 | T17, T20–T22 |
| R02–R06 | T01–T06, T18, T24 |
| R07 | T13, T14, T16, T22 |
| R08/R09 | T09, T13, T21/T22 |
| R10/R15 | T10, T13, T21/T22 |
| R11 | T07, T08, T13, T21/T22 |
| R12/R13 | T08, T13, T21/T22 |
| R14/R16 | T11, T13, T21/T22 |
| R17/R18 | T15/T16, T19, T22 |
| R19 | T18, T24 |
| R20/R22 | T19, T22/T24 |
| R21 | T12, T13, T22 |
| R23 | T25 only; optimization remains separate approval |
| R24 | T20, T23, T24 |

Final handoff contains: supported owner outcomes and trial steps; exact candidate identity; deterministic/install/live-evaluation matrix with evidence; unresolved/accepted findings; migration/rollback limits; current branch/PR state; and remaining owner/human gates. The technical endpoint is **reviewed local candidate**, not an automatically published release.

## 12. Plan review and approval record

- Plan preparation: source files and proposal reinspected; proposed tasks/paths/interfaces have not been implemented.
- Revision 2 addresses first-reader findings: local versus installer parser acceptance, early collection identity contract, tracking bootstrap, two-stage evaluation approval, variant-complete result identity, instruction-consumption provenance, read-sensitive containment evidence, causal interruption variants, explicit minimum-runtime lanes and contributor-policy ownership.
- Deterministic checks of this planning change: `npm run check` passes (21 existing tests, 14 installed reference sets and 14 skills/repository metadata). These are checks of the current repository and planning documents, not execution of the proposed implementation/evaluations.
- Independent plan/reader review: two fresh readers reviewed the draft and revision 2. Their material dependency, ownership, authority and evidence findings were corrected. The final focused recheck confirmed the case-specific causal-boundary correction; no remaining material finding was identified in their respective document-review scopes. This is not implementation or live-evaluation proof.
- Owner approval of implementation revision: **not granted**.
- Live behavioral evaluation: **not run by this planning task**.
