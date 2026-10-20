# 0001. Adopt a vision-to-product skill architecture

- Status: accepted
- Date: 2026-10-20
- Authority: owner-approved redesign and implementation request
- Related: [redesign proposal](../redesign/README.md), [product quality contract](../redesign/product-quality.md)

## Context

The previous collection made GitHub Issues the active planning system and required the owner to operate an engineering workflow. The owner has a product vision but not a coding background, uses multiple coding tools, wants the agent to ask understandable questions, plan carefully, use available focus/delegation capabilities, and preserve progress without issue-tracker administration.

The redesign also needs to handle branches and PRs, cleanup, security/risk, durable architecture decisions and UI/UX improvement without turning every request into a heavyweight process.

## Alternatives considered

- **Keep the issue-first workflow and add local options.** Lower migration cost, but retains an administration model the owner does not want and a tool-specific center of gravity.
- **Adopt one existing framework wholesale.** Provides breadth, but imports commands, state formats and process assumptions that do not match the requested experience.
- **Build a custom application or task service.** Could synchronize state, but duplicates capabilities available in coding tools and creates a new thing to maintain.
- **Small tool-neutral skills with native execution and compact local memory.** Preserves flexibility, keeps the owner interface small, and uses available task/delegation capabilities without requiring a specific tool.

## Decision

Adopt small, tool-neutral skills around this flow:

```text
Understand -> Clarify -> Plan -> Review plan -> Approve -> Branch -> Build
  -> Verify -> Agent review -> PR/delivery -> Checkpoint
```

Key boundaries:

- Main entry points: `setup`, `create`, `resume`, `next`.
- Supporting practices: `clarify`, `plan`, `execute`, `review`, `verify`, `diagnose`, `checkpoint`, `tidy`, `security-review`, `ui-ux`.
- Native tasks and workers are used when available; `.work/` stores compact durable state and ADRs preserve significant architecture decisions.
- Branches and agent-reviewed PRs are the default delivery shape. Upload, merge, release, deployment and publication remain separate scoped permissions.
- Work with me is the default; Use your judgment requires explicit scoped authorization.
- No GitHub Issues/Projects dependency and no requirement for a particular coding application.
- The previous issue-first collection is preserved under `legacy/` and excluded from the active plugin.

## Consequences

- The owner gets a smaller, product-oriented surface and does not need issue or Git administration.
- Behavior now depends on situational judgment and available capabilities; acceptance scenarios and reduced-capability paths must be tested.
- Compact local records add a small maintenance surface, but avoid a custom service and remain usable without durable storage when declined.
- Existing users of the issue-first commands must opt into the new model; legacy instructions remain available only as historical/reference material.
- Validation must cover both LF and CRLF and repository wiring; it still does not prove runtime skill behavior.

## Evidence

The design was reviewed, risks around permission recovery, interrupted workers, cleanup, completion and ADR authority were revised, and the repository validator/test suite is updated alongside the implementation. Runtime scenario execution remains required before claiming broad compatibility.
