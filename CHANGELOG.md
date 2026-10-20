# Changelog

All notable changes to this skills collection will be documented in this file.

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
