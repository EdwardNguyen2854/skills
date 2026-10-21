# Skills for turning vision into working software

[![skills.sh](https://skills.sh/b/edwardnguyen2854/skills)](https://skills.sh/edwardnguyen2854/skills)

Tool-neutral agent skills for product owners who want to describe an outcome, clarify what matters, plan carefully, and get working, tested software without running the engineering process themselves.

The owner does not need a coding background. The skills ask about product behavior in everyday language, investigate technical choices for the owner, use focused workers where useful, keep compact local progress, and review the real code rather than asking the owner to review it.

## Quickstart

Install the collection:

```bash
npx skills add edwardnguyen2854/skills
```

Install the collection together. Supporting skills are loaded by the entry points and are not written as inline fallbacks; if a required sibling is missing, the agent stops safely and explains what to install. A single-skill install of `create` or `next` alone is not a complete workflow.

Then describe what you want to build. To configure project guidance and local progress records first:

```text
/setup
```

Start or change a product/feature:

```text
/create
```

Continue saved work in a new session:

```text
/resume
```

Move one bounded update forward:

```text
/next
```

## Working model

```text
Vision or change request
  -> understandable clarification
  -> written plan + independent plan review
  -> approval or scoped delegated approval
  -> safe feature branch
  -> bounded implementation with focused workers
  -> current-code verification + agent code review
  -> agent-reviewed PR (when upload permission exists)
```

Planning always happens before application code. The depth adapts to the work; it is not skipped for small changes.

Default collaboration is **Work with me**: consequential product questions and plan revisions wait for the owner. If the owner explicitly authorizes **Use your judgment** for a named feature/update or session, the agent may record safe assumptions and approve a carefully reviewed plan within that scope. Spending money, destructive actions, private-data disclosure, production changes, merging, release and publication still need specific permission.

"Complete" means the agreed behavior works and was verified on the current integrated code. It does not imply that a PR was opened, merged, deployed or published.

## Skills

### Main entry points

| Skill | Purpose |
|---|---|
| [`setup`](./skills/setup/SKILL.md) | Configure minimal project guidance, records and preferences without issue-tracker overhead. |
| [`create`](./skills/create/SKILL.md) | Guide an idea or change from understanding through verified delivery. |
| [`resume`](./skills/resume/SKILL.md) | Reconcile saved progress with actual files, branches, PRs and workers, then continue safely. |
| [`next`](./skills/next/SKILL.md) | Propose and, when authorized, carry out one bounded next update. |

### Planning and delivery

| Skill | Purpose |
|---|---|
| [`clarify`](./skills/clarify/SKILL.md) | Ask useful, understandable questions and decide safely within scoped authority. |
| [`plan`](./skills/plan/SKILL.md) | Create and review a right-sized implementation plan before code. |
| [`execute`](./skills/execute/SKILL.md) | Coordinate safe branches, bounded tasks, workers, integration and checkpoints. |
| [`review`](./skills/review/SKILL.md) | Review plans and actual code/PRs for product fit, correctness and risk. |
| [`verify`](./skills/verify/SKILL.md) | Require current evidence before claiming completion. |
| [`diagnose`](./skills/diagnose/SKILL.md) | Investigate failures with a reproducible feedback loop instead of guessing. |
| [`checkpoint`](./skills/checkpoint/SKILL.md) | Save compact state so another session can resume without stale claims. |

### Product care

| Skill | Purpose |
|---|---|
| [`tidy`](./skills/tidy/SKILL.md) | Audit unused files and layout, then perform approved, recoverable cleanup. |
| [`security-review`](./skills/security-review/SKILL.md) | Review security, privacy, data-loss and operational risk in plain language. |
| [`ui-ux`](./skills/ui-ux/SKILL.md) | Improve real user journeys, clarity, accessibility, states and visual quality. |

Supporting skills are normally loaded by `create`, `next`, `plan`, `execute` and `resume`; the owner does not need to invoke each one manually.

## Moving an update forward with one instruction

You can say:

> Plan the next update, review the plan, implement it, and go. Use your judgment.

The `next` skill inspects the vision, actual behavior, unfinished work, feedback and risks; chooses one useful bounded update; reviews its plan before coding; checks the branch; implements and tests; arranges agent code review plus relevant security and UI/UX checks; and delivers within existing permission. It then stops and recommends a next step instead of starting an endless loop.

`go` does not authorize upload, merge, release or deployment. Open/update a PR only with scoped upload permission. Merge, tag, deploy and publish remain separate decisions.

## Branches and agent-reviewed PRs

Focused branches and PRs are the default delivery shape, without using the PR platform as a task tracker.

Before work the agent checks the actual default/target branch, current branch purpose, uncommitted changes, commits and related PR. If the owner is on the default branch or another feature's branch, the agent explains the risk and proposes safe isolation without stashing, discarding or moving unknown work.

The agent reviews the code/PR itself; the owner is not expected to review code. Required human approvals and protected-branch rules are still honored, never bypassed or faked. A review applies only to the revision actually inspected; new commits or a changed base require affected checks/review again.

## Local progress without a second project manager

With approval, setup creates a small `.work/` record:

```text
.work/
  project.md
  features/
    saved-products/
      plan.md
      progress.md
      decisions.md
```

Significant long-lived architecture choices also get ADRs at an existing project convention, otherwise `docs/adr/`.

Native task and delegation capabilities are used when available; `.work/` is compact durable memory, not a replacement scheduler. Before resuming, the agent checks actual files, branch/PR state and evidence instead of trusting checkboxes. Permission is recovered from immutable permission events, never by rolling back to an older snapshot that granted more. Records use explicit version 2; unsupported or ambiguous older records are read-only until an authorized migration.

If records are declined, an approved alternative location or session-only help is available; durable resume and ADR promises then do not apply.

See the full [workflow](./WORKFLOW.md), the [shared contract](./skills/references/contract.md) and [record/ADR templates](./skills/references/templates.md). Migration, uninstall and recovery guidance is in [docs/migration.md](./docs/migration.md); worked examples are in [docs/examples/](./docs/examples/README.md).

## Design

The redesign rationale, detailed safeguards and acceptance scenarios live in:

- [From vision to working product](./docs/redesign/README.md)
- [Product quality and delivery](./docs/redesign/product-quality.md)
- [Acceptance scenarios](./docs/redesign/scenarios.md)
- [Review results](./docs/redesign/review-results.md)
- [Next-release plan](./docs/releases/next-release-plan.md), [evaluation plan](./docs/releases/next-release-evaluation-plan.md) and [candidate evidence](./docs/releases/candidate-manifest.md)

The previous issue-first collection is preserved under [`legacy/`](./legacy/README.md). It is not part of the active plugin.

## Development

Requires Node.js 22.18 or newer for repository checks. The installed skills themselves are Markdown and do not require Node in a target application.

```bash
npm ci                   # install locked validation dependencies
npm test                 # parser, path, validator and packaging tests
npm run sync:references  # regenerate per-skill installed reference copies
npm run sync:notices     # regenerate per-skill MIT notices
npm run validate
npm run check            # tests + both generated-copy checks + validation
```

Each skill ships a `references/` directory generated from `skills/references/`, because installers copy only the individual skill directory. Treat those directories as generated: edit the shared source files, then run `npm run sync:references`. Hand-authored files in a skill's `references/` directory are not preserved; validation fails if an installed copy is missing, stale or obsolete. Shared reference sources must be flat regular `.md` files; linked directories, nested entries and non-Markdown extras fail for inspection rather than being recursively deleted. Each skill also ships a generated `LICENSE` copied from the root MIT notice; run `npm run sync:notices` after changing the root notice.

Validation checks strict YAML frontmatter, metadata and grouping shapes, unique canonical skill paths, Markdown links and real heading anchors, required docs/templates, physical containment and generated inventories. Repository-managed paths reject symbolic links and Windows junctions. It does not prove runtime skill behavior; the acceptance scenarios must be exercised separately.

## Acknowledgements

This collection learns from several public skill systems:

- [Matt Pocock's Skills for Real Engineers](https://github.com/mattpocock/skills) for small, composable engineering practices.
- [Cursor pstack](https://github.com/cursor/plugins/tree/main/pstack) for focused routing and disciplined delegation.
- [Superpowers](https://github.com/obra/superpowers) for clarification, testing discipline, independent review and evidence-based completion.
- [GSD Core](https://github.com/open-gsd/gsd-core) for durable context and fresh, dependency-aware execution.
- [BMAD Method](https://github.com/bmad-code-org/BMAD-METHOD) for adaptive planning depth and carrying product intent into delivery.

This is an independent collection, not a fork or copy of their workflows.
