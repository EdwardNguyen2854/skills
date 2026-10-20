# review

`/review` checks completed work before merge.

It compares the implementation against the original issue, approved plan, acceptance criteria, `DOD.md`, `CONTEXT.md`, ADRs, changed files, and validation results.

## Use When

- Build is complete.
- The owner asks whether work is safe to merge.
- A PR or branch needs a structured review.

## Output

A review report with pass/needs changes, checked items, issues found, required fixes, and safe-to-merge status.

When GitHub Project is enabled in `docs/agents/issue-tracker.md`, review updates Project status.

## Important Rule

Findings come first. The review should prioritize bugs, regressions, missed requirements, and scope creep.
