# plan

`/plan` creates an implementation plan without changing code.

It reads the issue, project docs, relevant ADRs, and affected code areas, then produces a plan for owner approval.

## Use When

- The user wants Plan Mode.
- An issue is ready but implementation should not start yet.
- The agent needs to identify affected areas, risks, and validation steps.

## Output

An implementation plan with understanding, affected areas, proposed steps, risks, open questions, and validation plan.

When GitHub Project is enabled in `docs/agents/issue-tracker.md`, planning updates Project status.

## Important Rule

The agent must stop after planning until the owner approves the plan.
