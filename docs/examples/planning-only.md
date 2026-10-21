# Example: planning only

**Request:** "Plan how to add saved searches. Don't implement it yet."

The request authorizes inspection and planning, not code, tests, records, or branch changes.

## What the agent does

1. Inspects the current search, storage and account model.
2. Asks only outcome-changing questions, such as whether saved searches are per account or shared, and what should happen when a saved filter becomes invalid.
3. Produces a plan with acceptance examples, scope, risks, task boundaries, trial steps and rollback.
4. Reviews the plan before presenting it.
5. Stops.

## What the agent does not do

- It does not add a saved-search table, route, component or test.
- It does not create `.work/` records or change project guidance without permission.
- It does not treat "that plan looks good" as approval to implement while the no-implementation limit remains.

## Handoff

> Here is the reviewed plan. The main choice is whether saved searches belong to an account or a shared workspace; I recommend per account for the first version. Nothing has been implemented. If you want to proceed, say "implement this plan" or grant one bounded update explicitly.

A later bare "go" would approve this reviewed revision only, not a different plan or any upload, merge, or release action.
