# Skills Review and Comparative Assessment

**Review date:** 2026-10-20  
**Scope:** Local issue-first skills collection (`skills/engineering/*/SKILL.md`), repo documentation/metadata/validation, and public repository-level comparison with the five requested references. This is a design and packaging review, not a runtime evaluation of each skill against task scenarios.

## Executive assessment

The collection has a clear and differentiated premise: a lightweight, issue-first workflow for solo and small-team development, with explicit planning approval, isolated implementation, review, and shipping gates. The individual skills are generally concise, consistent, and safety-conscious. The project also has good alignment between its workflow document, README, and the command skills.

**Release blocker:** `npm run validate` currently fails for all 11 skills. The files have CRLF line endings, but `scripts/validate-skills.mjs` recognizes frontmatter only with LF delimiters (`/^---\n...\n---/`). The validator therefore reports valid-looking frontmatter as missing. Fix the line-ending handling and add a regression test before relying on this check.

The bigger strategic gap is not that the collection lacks a full methodology; it is that the 11 skills are all **user-invoked workflow commands**. Compared with the references, it has little reusable engineering discipline that can apply during ordinary implementation: TDD, systematic debugging, evidence-based completion, codebase design, receiving/responding to reviews, and runtime-specific adaptation. Add a small number of composable, optionally model-invoked skills rather than copying the larger frameworks wholesale.

## Local review findings

### Strengths

- **Purpose is explicit:** README and `WORKFLOW.md` explain the issue-first tradeoff and intended audience.
- **Good separation of concerns:** capture, plan, start, build, review, fix-review, ship are distinct and have understandable boundaries.
- **Strong non-destructive defaults:** `start` protects dirty work, `setup` asks before meaningful overwrite, and `ship` prohibits push/force-push without authorization.
- **Tracker configuration is guarded:** Project and milestone operations are conditional on documented settings instead of assumed.
- **Plans and reviews are traceable:** skills specify concrete issue-comment/report structures and map work back to acceptance criteria and decisions.
- **Scope discipline is consistent:** new discoveries usually become follow-up work and plan changes require owner input.
- **Reasonable context size:** SKILL.md files are short and largely focused on behavior rather than duplicating the full workflow essay.

### Findings and recommendations

| Priority | Finding | Evidence / impact | Recommendation |
|---|---|---|---|
| **P0** | Validator rejects CRLF frontmatter | `npm run validate` reports missing frontmatter/name/description for all 11 skills, despite frontmatter being present. The regex in `scripts/validate-skills.mjs` requires LF. | Normalize line endings or use a CRLF-safe frontmatter parser; add fixtures for LF and CRLF and run validation in CI. |
| **P1** | Skills all require explicit user invocation | README states this directly. Skills such as review discipline, TDD, debugging, and verification are not surfaced automatically during normal build work. | Preserve command skills, but add a few narrowly scoped model-invoked practices with clear invocation conditions and opt-outs. |
| **P1** | `/start` describes branch/worktree creation but does not define concrete safe commands or complete verification | It asks for branch/worktree, dirty-state check, and a summary; there is no prescribed workflow for base branch freshness, worktree path, checking the created branch/worktree, or recovering from partial creation. | Document a safe decision tree and post-creation checks. Keep command examples adaptable to harness/tool capabilities; never auto-clean dirty state. |
| **P1** | Workflow requires an approved plan before all implementation | `build` and `start` have hard gates; `WORKFLOW.md` also states AI should not write code before planning. This is safe but can burden trivial fixes and conflicts with the lightweight/small-change positioning. | Add explicit fast path for tiny, reversible changes (or make the approval gate configurable) with criteria, user-visible rationale, and mandatory verification. Keep full planning for ambiguous/high-impact work. |
| **P1** | GitHub Issues are the default and skills depend on `gh`, despite setup text hinting at unconfigured trackers | `capture`, `plan`, `ship`, and others center issue comments and `gh`. The protocol has limited local/non-GitHub behavior. | Decide whether GitHub-only is a deliberate product constraint. If not, define a tracker-neutral artifact interface and provide GitHub/local adapters; otherwise state the requirement prominently in install/setup docs. |
| **P2** | No automated behavior/eval tests for skill instructions are evident in the repo | The `validate` script checks wiring and metadata only. It cannot catch command behavior drift, contradictory gates, or unsafe tool assumptions. | Add scenario-based skill evals for dirty worktree, no approval, disabled Project, failing tests, review findings, unauthorized push, and small-change fast path. |
| **P2** | Validator is brittle and checks only a subset of skill quality | It uses a hand-rolled frontmatter parser; it checks links and doc wiring but not malformed YAML, empty body, reference integrity, description quality, or command consistency. | Keep it lightweight, but parse YAML robustly and validate frontmatter, links, docs, and duplicate names using test fixtures. Make errors actionable. |
| **P2** | Generic shared behavior is repeated across command skills | Tracker setting checks, output summaries, scope constraints, and context-reading lists recur across multiple files and `WORKFLOW.md`. Duplication makes behavioral drift likely. | Keep each skill standalone where useful, but make `WORKFLOW.md` the canonical source and add a concise shared policy/reference only where supported by target runtimes. Add consistency tests for important invariants. |
| **P2** | Some process expectations are underspecified | Examples: what constitutes explicit plan approval; how plan changes are recorded; whether review compares against merge-base or a fixed point; what makes a review finding actionable; handling unavailable `gh`/auth; behavior when issue state conflicts with local state. | Specify observable conditions and fallback/stop behavior in the relevant skill, not only in the long workflow doc. |
| **P3** | README presents a single quickstart path and setup outputs a large document set | The intended lightweight workflow can still generate many files (including five issue templates and several agent guides) before the user has confirmed what they need. | Make setup progressive: minimum viable setup first, then optional docs, templates, Project/milestone wiring. Preview proposed files and preserve existing content. |
| **P3** | Cross-harness portability is claimed more than demonstrated | Skills use slash commands and `gh` but do not document runtime assumptions, adapters, or compatibility tests. | Document tested harnesses and required capabilities; separate portable behavior from optional integrations. Avoid promising universal compatibility without evidence. |

## Skill-by-skill review

| Skill | Assessment | Main improvement |
|---|---|---|
| `setup` | Strong explore/confirm/write sequence; appropriately cautious about overwrites and fabricated product context. | Offer progressive setup profiles and explicitly distinguish GitHub-required from optional behavior. |
| `capture` | Clear issue types, observable acceptance criteria, and Project/milestone safeguards. | Specify tracker/auth failure behavior and local draft option if GitHub is unavailable. |
| `discover` | Useful separation of known/unknown/decision/research/prototype and a good next-step router. | Add an explicit stop condition and evidence/source expectations for research conclusions. |
| `spec` | Lightweight release-level artifact is well distinguished from issue tracking. | Explain how to handle multiple active releases and stale/contradictory issue links. |
| `plan` | Strong context gathering and explicit no-code/approval gate. | Add sizing/adaptive depth and a concrete test-first/verification plan requirement. |
| `start` | Good dirty-work protection and branch/worktree choice guidance. | Define creation and verification steps; specify safe recovery if creation partially succeeds. |
| `build` | Clear scope control and iterative validation. | Add a reusable TDD discipline and systematic diagnosis trigger for failures rather than relying on general test guidance. |
| `review` | Findings-first, checks scope and criteria, asks for line references. | Define severity and finding quality (impact, repro/evidence, affected location); review against a stable base diff and report validation limits. |
| `fix-review` | Good boundary between required fixes and optional suggestions. | Define how to record rejected/invalid findings and require re-review after material fixes. |
| `ship` | Strong authorization boundaries around merge/push and changelog. | Clarify merge strategy/PR mode, stale base handling, and how to verify merge/issue closure without overstating success. |
| `handoff` | Captures progress, risks, validation, and exact next step. | Include current commit/base diff, uncommitted changes, relevant commands/output, and durable artifact locations consistently. |

## Comparison with the requested repositories

This comparison uses the public repository descriptions/README and top-level structure available during this review, not a full audit of every upstream skill or implementation. Upstream projects evolve; recheck before adopting specifics.

| Reference | Primary emphasis | Relative to this collection | Practices worth considering |
|---|---|---|---|
| [mattpocock/skills](https://github.com/mattpocock/skills) | Small composable skills, clarification/grilling, shared domain language, TDD, debugging, codebase design, review, and adaptable setup. Offers user- and model-invoked skills. | Closest philosophical match. Local collection is more explicitly issue-first and has stronger separate Start/Ship gates, while upstream has broader engineering practices and richer routing. | Add interrogation/clarification for consequential ambiguity; TDD, debugging, architecture/deep-module, and retrospective skills; allow a configurable tracker rather than hardcoding one. |
| [cursor/plugins/pstack](https://github.com/cursor/plugins/tree/main/pstack) | A central mode/router with playbooks, principles, model-role configuration, agents, and Cursor automations; emphasizes low-slop, verifiable code and parallel work. | Local skills are simpler and more harness-neutral in intent, but lack an umbrella router, task playbooks, model/agent delegation conventions, and explicit operational routing. pstack is more Cursor-specific and opinionated. | Add a concise workflow selector/help skill and reusable playbooks for common tasks; document optional delegation and evidence requirements. Do not adopt model routing or Cursor automation unless harness-specific. |
| [obra/superpowers](https://github.com/obra/superpowers) | Automatically applied methodology: brainstorming, worktrees, bite-sized plans, TDD, subagent implementation, review, verification, and finishing a branch; broad harness support. | Local collection has more explicit issue tracking and owner approval gates; Superpowers has stronger automatic skill discovery, implementation discipline, and scenario-tested procedural behaviors. | Add model-invoked, task-relevant practices (especially TDD, systematic debugging, verification-before-completion, receiving review) and test them with behavior evals. Keep automation proportional to the user's lightweight goal. |
| [open-gsd/gsd-core](https://github.com/open-gsd/gsd-core) | Context engineering/spec-driven phases: discuss, plan, execute in parallel waves with fresh contexts, verify, ship; durable state and multi-runtime installer/docs. | Local workflow externalizes memory in GitHub Issues and stable docs; GSD is more phase/state/artifact-driven and explicitly addresses context rot and fresh-context execution. | For large/multi-session work, add compact durable state/handoff conventions and context-aware decomposition; keep them optional rather than introducing a large project-state framework for every issue. |
| [bmad-code-org/BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) | Adaptive agile method spanning clarification, planning, architecture, UX, development, testing, and learning, with specialist perspectives and install/update ecosystem. | Local workflow is intentionally smaller, issue-centric, and engineering-loop focused; BMAD covers broader product lifecycle and adapts process depth to work size. | Add a clear complexity-based path selector and optional discovery/design/testing depth for larger changes; maintain explicit decisions and verified project context. Avoid importing heavyweight roles/artifacts by default. |

### Summary of positioning

The local collection's advantage is **low ceremony plus GitHub Issue traceability and explicit merge safety**. Its weakness against these references is **engineering execution depth and adaptive/model-invoked support**, not lack of another end-to-end framework. Keep the core issue-first loop; selectively borrow reusable disciplines instead of cloning their orchestration models.

## Recommended roadmap

### P0 — Restore trust in validation

1. Make frontmatter parsing CRLF/LF safe.
2. Add validator tests for CRLF, LF, malformed frontmatter, missing skill docs/links, and descriptions.
3. Run `npm run validate` in CI and ensure the checked-in files pass.

### P1 — Improve execution quality without adding ceremony

1. Add a model-invoked **TDD** skill with explicit red/green/refactor evidence and sensible exceptions (e.g., exploratory changes or tests not feasible).
2. Add **systematic debugging** and **verification-before-completion** skills, invoked when work is failing or before success claims.
3. Add **clarify/interrogate** guidance for unresolved consequential decisions; avoid grilling for clear, trivial changes.
4. Add an adaptive path: tiny safe fix, normal issue loop, and large/uncertain discovery/spec path.

### P2 — Make workflow robust and assessable

1. Specify branch/worktree creation and verification behavior.
2. Add severity/evidence standards to review and stable diff-base guidance.
3. Build scenario evals for all stop gates and tracker configuration branches.
4. Decide and document GitHub-only versus tracker-neutral support.
5. Add optional durable state for multi-session/parallel work and a compact retrospective/environment-improvement step.

## Validation and limits

- Local command run: `npm run validate` — **failed**, reporting missing frontmatter for all 11 skills. Root cause confirmed in the validator's LF-only regex; skill files use CRLF.
- Git working tree was clean at review start; no source changes made.
- Upstream comparison is at repository/README level, with detailed feature claims limited to the visible README summaries and listed skill catalogs. No claim is made that every upstream feature has been independently tested.
