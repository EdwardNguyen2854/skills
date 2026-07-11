# Skills for Issue-First AI Development

[![skills.sh](https://skills.sh/b/edwardnguyen2854/skills)](https://skills.sh/edwardnguyen2854/skills)

Reusable agent skills for a lightweight, issue-first AI development loop.

This repo turns the process in [`WORKFLOW.md`](./WORKFLOW.md) into installable skills that help agents plan, build, review, and ship work without turning a solo or small-team project into a heavyweight process.

## Quickstart

Install the collection:

```bash
npx skills add edwardnguyen2854/skills
```

Then run:

```text
/setup
```

`/setup` configures a target repository with the documents, issue templates, labels, and agent guidance that the other skills expect.

## Core Loop

```text
Capture -> Plan -> Start -> Build -> Review -> Fix -> Ship
```

In practice:

```text
GitHub Issue
  -> approved implementation plan
  -> branch or worktree
  -> scoped implementation
  -> review gate
  -> merge and changelog
```

The goal is not to replace judgment with process. The goal is to preserve context across many human and AI development runs.

## Skills

All skills are user-invoked command skills.

| Skill | Purpose |
|---|---|
| [`setup`](./skills/engineering/setup/SKILL.md) | Set up a repository for the issue-first workflow. |
| [`capture`](./skills/engineering/capture/SKILL.md) | Turn a rough idea into a GitHub Issue or improve an existing issue. |
| [`plan`](./skills/engineering/plan/SKILL.md) | Create an implementation plan without writing code. |
| [`start`](./skills/engineering/start/SKILL.md) | Create the branch or worktree for approved work. |
| [`build`](./skills/engineering/build/SKILL.md) | Implement only the approved plan. |
| [`review`](./skills/engineering/review/SKILL.md) | Review a completed implementation before merge. |
| [`fix-review`](./skills/engineering/fix-review/SKILL.md) | Fix only the issues found during review. |
| [`ship`](./skills/engineering/ship/SKILL.md) | Merge completed work and close the loop. |
| [`discover`](./skills/engineering/discover/SKILL.md) | Map unclear work before it becomes issues or specs. |
| [`spec`](./skills/engineering/spec/SKILL.md) | Create or update a lightweight release spec. |
| [`handoff`](./skills/engineering/handoff/SKILL.md) | Capture enough state for another agent or session to continue. |

## What Gets Created By `/setup`

The setup skill helps create or update:

```text
README.md
VISION.md
CONTEXT.md
DOD.md
CHANGELOG.md
AGENTS.md

docs/specs/v0.1.0.md
docs/adr/README.md
docs/adr/template.md
docs/agents/domain.md
docs/agents/issue-tracker.md
docs/agents/triage-labels.md
docs/agents/feature-loop.md

.github/ISSUE_TEMPLATE/feature.md
.github/ISSUE_TEMPLATE/bug.md
.github/ISSUE_TEMPLATE/task.md
.github/ISSUE_TEMPLATE/experiment.md
.github/ISSUE_TEMPLATE/ai-run.md
```

It also guides GitHub label, milestone, and project setup.

## Design Principles

- GitHub Issues hold active requirements, plans, bugs, experiments, and run memory.
- Plan Mode decides what to build.
- Build Mode implements only the approved plan.
- Review Mode checks whether the work is safe to merge.
- Branches or worktrees isolate implementation work from `main`.
- ADRs preserve important decisions so future runs do not undo them.
- `CHANGELOG.md` records what actually shipped.

## Acknowledgements

This skills collection is inspired by Matt Pocock's excellent [Skills for Real Engineers](https://github.com/mattpocock/skills).

Matt's repo shaped the idea of small, composable agent skills that preserve engineering judgment instead of replacing it with a heavyweight process. This repo adapts that spirit into an issue-first development loop centered on GitHub Issues, planning gates, branch/worktree isolation, review, and shipping.

## Development

Validate the repo metadata and skill wiring:

```bash
npm run validate
```
