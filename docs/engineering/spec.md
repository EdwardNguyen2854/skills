# spec

`/spec` creates or updates a lightweight release spec.

The release spec is the current release anchor. It is not a task tracker and should not replace GitHub Issues.

## Use When

- The owner wants to define `v0.1.0` or another release.
- The current release needs goal, scope, acceptance criteria, risks, and open questions.
- GitHub Issues need to be tied back to release intent.

## Output

A file such as `docs/specs/v0.1.0.md` with release goal, target user, core journey, must-ship scope, nice-to-have scope, out-of-scope items, key issues, acceptance criteria, risks, and open questions.

## Important Rule

Keep specs release-level. Tasks belong in issues.
