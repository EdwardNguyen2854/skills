# Example: one bounded delegated update

**Request:** "Plan the next update, review the plan, implement it, and go. Use your judgment for this update. Don't upload or merge."

This is an explicit feature/update-scoped judgment grant with limits. It authorizes one update and its reviewed plan, not upload, merge, release, or an endless loop.

## Scope

The agent inspects the product and chooses one useful bounded update: make the empty-state message explain how to add the first item. It excludes a redesign, new dependencies, analytics, and unrelated cleanup.

## Plan and review

- **Outcome:** a first-time user understands the next action.
- **Acceptance:** with zero items, the page shows the message and an action; with one item, the message disappears.
- **Task T1:** update the empty state and its test.
- **Verification:** component test plus a real empty-state journey.
- **Stop:** any need to change data handling, add a dependency, or touch unrelated screens returns to the owner.
- **Approval:** the agent approves this reviewed revision within the recorded grant and records the revision and limits.

## Execute and verify

The agent works on the verified feature branch, keeps unrelated changes untouched, runs the focused test and the journey check, and records the actual result and tested content. It uses a fresh reviewer if available; otherwise it labels self-review.

## Delivery

> The empty state now explains how to add the first item. The component test and the empty-state journey passed. I did not upload, open a PR, merge, or publish. One follow-up candidate is improving the same message for screen readers; I did not start it.

The agent stops after this update and checkpoints only if records are authorized. If records are declined, it says the session cannot promise durable resume.
