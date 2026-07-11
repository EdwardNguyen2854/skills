# start

`/start` creates an isolated branch or worktree for approved work.

It protects `main` from in-progress implementation and makes parallel AI work safer.

## Use When

- The implementation plan is approved.
- The owner wants a branch or worktree for an issue.
- Work needs to be isolated before `/build`.

## Output

A start summary with issue, branch/worktree, approved plan, and next step.

## Important Rule

Never start feature work directly on `main`.
