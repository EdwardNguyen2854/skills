# Contributor guidance

This repository contains installable agent skills, not a product application.

## Before changing skills

- Read [README.md](./README.md), [WORKFLOW.md](./WORKFLOW.md), [the shared contract](./skills/references/contract.md) and the relevant [redesign scenario](./docs/redesign/scenarios.md).
- Keep behavior tool-neutral. Do not require a particular coding application, model provider, task API or remote platform.
- Keep SKILL.md bodies focused. Move shared rules to `skills/references/` and record formats to `skills/references/templates.md`; do not duplicate the whole workflow in each skill.
- Preserve the permission distinction between local changes, upload/PR creation, merge, release, deployment and publication.
- Planning and plan review happen before application code. Verification must use current integrated evidence.
- Do not claim the acceptance scenarios are tested unless they actually were.

## Change workflow

1. Check the current/default branch and work on a focused branch.
2. Make the smallest coherent change and update affected docs/metadata.
3. Add or update deterministic tests for validation/parser behavior.
4. Run `npm run check`.
5. Review the actual diff, including safety/permission regressions.
6. Do not commit or upload unrelated work.

The legacy issue-first collection under `legacy/` is historical. Do not reintroduce its GitHub Issues dependency into the active skills.
