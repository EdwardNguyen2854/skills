# Installation, migration and rollback

This page describes safe installation and recovery for this collection. It does not grant permission to modify an owner's project, global agent configuration, branches, or remotes. Preview every change and preserve customized guidance and records.

## Install

Install the collection, not only one entry point:

```bash
npx skills add edwardnguyen2854/skills
```

The entry points load supporting skills and their installed `references/` copies. If a required sibling is missing, the agent should stop and explain the missing dependency rather than pretending it loaded. Verify the installed skill directory contains `SKILL.md`, `references/contract.md`, `references/templates.md` and `LICENSE`.

Run the repository checks only in a development checkout:

```bash
npm ci
npm run check
```

The skills themselves are Markdown and do not require Node in a target application.

## Move from the legacy issue-first collection

The historical skills now use `SKILL.historical.md`, so installers that discover `SKILL.md` do not activate them. The archive under `legacy/` is documentation, not an active plugin.

- Do not bulk-delete an old installation. Preview the exact skill directories and ask before removing them.
- Preserve project-specific guidance, `.work/` records, customized prompts and unrelated installed skills.
- If an installer still discovers a legacy name, stop and revise the installation representation rather than assuming the archive is excluded.

## Move records to version 2

Version 2 records add explicit project/feature/plan/checkpoint identities and immutable permission events. There is no automatic migration.

1. Read old records as evidence only. Do not treat an old status column or snapshot as current authority.
2. Create the new `project.md`, `plan.md`, `progress.md` or `decisions.md` only with permission, using the [templates](../skills/references/templates.md).
3. Record current owner instructions as new permission events with real references. Do not invent historical approvals or backdate events.
4. Preserve conflicts and unexplained edits. If intent is unclear, ask instead of overwriting.
5. Keep the old record until the owner confirms the replacement is understandable and complete.

If `.work/` is unsuitable, add an explicit owner-approved `Delivery records: <path>` pointer to existing project guidance. Do not create a hidden configuration file or merge multiple record roots.

## Upgrade and rollback

- Reinstall or update only with permission. Keep a copy of customized guidance and records before any installer action.
- Generated `references/` and `LICENSE` files are reproducible with `npm run sync:references` and `npm run sync:notices`. Hand edits to them are not preserved.
- Git can recover content that was committed. Untracked or modified work needs an approved copy first; do not assume `git checkout` is a backup.
- If a validation or packaging change fails, restore the last reviewed candidate and rerun the affected checks. Do not widen cleanup or reset unknown work.
- A rollback of the skills does not automatically downgrade project records. Keep version-2 records readable and do not re-enable an old grant.

## Uninstall

1. Inventory the installed skill directories and any generated copies.
2. Preserve `.work/`, ADRs, project guidance and unrelated skills.
3. Remove only the approved collection directories, with the owner's specific permission.
4. Tell the owner that session-only work and durable resume stop when records are removed.

No agent should automatically uninstall, convert, or delete an owner's project material as part of an upgrade.
