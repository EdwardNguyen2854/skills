# Changelog

All notable changes to this skills collection will be documented in this file.

## [Unreleased]

The next version number is not selected. This section records reliability and evidence work on top of the unreleased `0.2.0` content.

### Added

- Immutable permission event history with stable IDs, explicit revoke/supersede events and current-authority recovery.
- Request-intent routing that separates review, diagnosis and planning from implementation.
- Version-2 record identities and staged progress replacement with one prior valid checkpoint.
- Worker capability preflight, composite task/attempt identity, persisted dispatch intent and revocation stop rules.
- Evidence records tied to tested content, untracked inputs, configuration, dependencies and runtime.
- An evaluation manifest for all 43 acceptance scenarios and 18 cross-cutting/adversarial cases, with safety repeats and capability configurations.
- Strict YAML frontmatter validation, AST-based Markdown link/anchor checks, canonical metadata validation and physical containment checks.
- Generated per-skill MIT notices and a sync check.
- Windows/Linux CI on Node 22.18.0, latest 22 and latest 24 patches.
- Migration/rollback guidance and worked examples.

### Changed

- Reference sync now rejects linked, nested or unexpected entries instead of following or deleting them.
- Legacy issue-first files are named `SKILL.historical.md`, preventing recursive `SKILL.md` discovery.
- Review findings distinguish severity from confidence and record a disposition.
- Documentation no longer treats plan review or static checks as runtime validation.

### Deprecated

- Version-1/unknown progress and permission records are read-only evidence until an authorized migration.

## [0.2.0] - Unreleased

### Added

- Tool-neutral vision-to-product workflow with plain-language clarification and careful plan review before implementation.
- `setup`, `create`, `resume` and `next` entry points for starting, continuing and moving a bounded update forward.
- Supporting skills for clarification, planning, safe execution, verification, diagnosis, checkpoints, cleanup, security/risk review and UI/UX improvement.
- Durable architecture decision records and compact `.work/` progress records with safe resume reconciliation.
- Focused-worker coordination and agent-reviewed branch/PR delivery, with separate upload, merge and release permissions.
- Design documentation, shared contract/templates and 43 acceptance scenarios.
- Self-contained per-skill installed reference copies generated from the shared source, with install-layout and stale-copy checks.
- CRLF/LF-safe frontmatter parsing and validator tests.

### Changed

- Replaced the active issue-first GitHub workflow with native task/delegation support and local durable state.
- Reworked repository validation, metadata, README and contributor guidance for the new skill set.

### Deprecated

- The previous issue-first skills move to `legacy/` and are excluded from the active plugin.

## [0.1.0] - Unreleased

### Added

- Initial issue-first development skills collection.
- Public install docs for `npx skills add edwardnguyen2854/skills`.
- Skills for setup, capture, plan, start, build, review, fix-review, ship, discover, spec, and handoff.

### Changed

- Documented GitHub Projects and milestones as optional settings recorded in `docs/agents/issue-tracker.md`.
