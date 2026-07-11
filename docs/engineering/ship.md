# ship

`/ship` merges completed work and closes the issue-first loop.

It checks that review passed, acceptance criteria are met, changelog updates are handled, follow-up work is captured, and the issue can move to shipped.

## Use When

- Review says the work is safe to merge.
- The owner wants to merge, close the issue, or prepare a PR for final shipping.
- User-facing changes need release notes.

## Output

A ship summary with merge status, user-facing changes, validation, changelog status, follow-up issues, and closure status.

## Important Rule

Do not ship if review says `Safe to merge: No`.
