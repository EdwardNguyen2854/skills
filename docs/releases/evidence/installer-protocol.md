# Installer lifecycle evidence protocol

Status: **not executed.** No installer has been downloaded or run for this candidate. This protocol defines what a future approved run must prove; it is not a pass record.

## Before running

1. Obtain approval for the exact installer package, version, source URL and lifecycle scripts.
2. Create isolated project, `HOME`/user profile, agent-configuration, cache and install-prefix directories. Do not point them at the real user profile.
3. Create an unrelated sentinel file outside the install root and record its bytes.
4. Record the candidate revision and tested content identity. Any later edit invalidates the run.

## Guarded harness

The external lifecycle test is skipped unless `SKILLS_INSTALLER_CMD` is set. When it is set, the harness requires all of:

| Variable | Required | Meaning |
|---|---|---|
| `SKILLS_INSTALLER_CMD` | Yes | Exact command, including the pinned package version and isolated target paths. |
| `SKILLS_INSTALLER_VERSION` | Yes | Exact semantic version pin; the run is rejected without it. |
| `SKILLS_INSTALLED_ROOT` | Yes | Isolated directory containing the installed collection after the command. |
| `SKILLS_INSTALLER_MODE` | No | `copy` (default) or `symlink`. |
| `SKILLS_INSTALLER_SENTINEL` | No | Unrelated file whose bytes must be unchanged. |

After execution the harness verifies:

- The installed root is an ordinary directory.
- Exactly the 14 active skills are present, each with `SKILL.md`, `references/contract.md`, `references/templates.md` and `LICENSE`.
- Each installed `SKILL.md` names this collection and workflow contract version 2.
- No legacy `SKILL.historical.md` is discoverable as `SKILL.md`.
- The sentinel is byte-identical.

A successful install run is installed-artifact evidence only. It does not prove skill routing, authority, worker or recovery behavior.

## Still required

- Copy and supported symlink discovery, with any installer metadata that controls which skills are selected.
- Upgrade from the previous collection and rollback behavior.
- Uninstall while preserving `.work/`, ADRs, project guidance, customized files and unrelated skills.
- Behavior when a required sibling is missing, shadowed by a same-name foreign skill, or installed from a legacy name.
- Actual output, limitations and any installer network or global-config side effects recorded as evidence.

Complete these checks under G1E/G2 approval and attach the result records before claiming installed support.
