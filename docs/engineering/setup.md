# setup

`/setup` configures a repository for issue-first AI development.

It creates or updates the stable project docs, agent guidance, GitHub issue templates, label conventions, optional Project and milestone settings, and release spec structure used by the rest of the skills.

## Use When

- A repo is adopting this skills collection for the first time.
- The project needs `VISION.md`, `CONTEXT.md`, `DOD.md`, `AGENTS.md`, ADR guidance, or issue templates.
- The owner wants GitHub Issues to become the active planning system, with optional GitHub Project or milestone support.

## Output

The setup skill reports which files were created or updated and what remains for the owner to configure manually.

## Important Rule

It should not overwrite existing docs without first showing the proposed changes.
