---
name: setup
description: Set up a project for vision-to-product delivery with minimal local progress records, architecture-decision guidance and branch/PR preferences. Use when first using these skills in a project, when the owner asks to configure the workflow, or when project guidance and record locations need to be created or updated safely.
---

# Setup

Set up only what this project needs. This is not a GitHub or project-management installation.

Read [the shared delivery contract](references/contract.md) and use [the record templates](references/templates.md).

## 1. Inspect

Read existing project guidance (`AGENTS.md`, `CLAUDE.md`, equivalent), README, ADR conventions, Git branch/PR configuration, verification commands, and any existing `.work/` directory.

Identify:

- What already exists and should be preserved.
- Whether a progress-record location is appropriate.
- Whether an ADR convention already exists.
- How the owner normally wants branches/PRs handled.
- Whether project instructions are loaded automatically.

Do not infer that the project wants GitHub Issues, labels, Projects, milestones or a particular coding application.

## 2. Propose a minimal setup

Explain in plain language and ask before writing. A minimal setup may add:

- `.work/project.md` with purpose, active work, preferences and authoritative project permissions.
- A short project agent-guidance section saying to read the project record and use `resume` when continuing.
- ADR guidance/location only if one does not already exist.
- Branch/PR preferences, distinct from upload/merge permission.

Do not pre-create empty feature folders, fake ADRs, issue templates, labels or a second task system. Use the existing ADR convention when present.

If the owner declines records or guidance changes:

- Preserve existing files.
- Offer an approved alternative location or session-only help.
- Explain that durable resume/ADRs are then unavailable or limited.
- Do not write records elsewhere without permission.

## 3. Record preferences

Ask or infer:

- Where the owner will normally try the product.
- Known verification commands.
- Branch/PR preference (preference is not upload permission).
- Whether they want agent-approved plans under explicitly delegated judgment.
- Any limits on local commits, upload/PR creation, spending or production access.

Do not turn preferences into broad authorization. Record each grant with scope, reference and status. Default to Work with me and no upload/merge/release permission. Permission rows are append-only: revoke by adding/changing status while retaining the original owner reference and any superseded/revoked history.

## 4. Write safely

Create/update only approved files. Preserve unrelated content. Do not overwrite existing guidance wholesale; add the smallest useful pointer/preferences. Never create secrets, fake owner approvals, fake decisions, or records containing private data.

If adding guidance for session discovery, use a mechanism supported by the project's tooling. If automatic loading is unavailable, tell the owner to use the resume entry point; do not promise invisible synchronization.

## 5. Validate

Check that:

- The project record is understandable and the referenced paths exist.
- Instruction pointers are accurate.
- Existing tests/build commands are real; if unknown, leave them unclaimed.
- Git changes are limited to approved setup files.

Report what was created/updated, what was intentionally left alone, and how to start or resume. A new product can then use `create`; an existing project can use `resume` or `create`.
