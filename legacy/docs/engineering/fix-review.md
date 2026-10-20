# fix-review

`/fix-review` fixes only the issues found during review.

It is intentionally narrow so the fix loop does not become another feature build.

## Use When

- `/review` found required fixes.
- The owner wants those review findings addressed.
- The implementation should return to review without adding new scope.

## Output

A review fix summary with fixed findings, rechecked validation, remaining issues, and readiness for another review.

When GitHub Project is enabled in `docs/agents/issue-tracker.md`, fix-review keeps the issue in `Fixing`.

## Important Rule

Do not fix optional suggestions or add new feature scope unless the owner approves.
