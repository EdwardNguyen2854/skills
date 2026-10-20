---
name: review
description: Review an implementation plan, code change, or pull request for product fit, correctness, security, architecture, UI/UX and delivery risk. Use when the owner asks for a review, before opening or merging a PR, after significant changes, or when independent agent review of actual code is needed.
---

# Review

Review evidence, not claims. Review plans before coding and finished changes separately.

Read [the shared delivery contract](../references/contract.md).

## Establish the target

Identify whether you are reviewing:

- A plan (before implementation).
- Local code changes.
- A PR, including its actual head revision and base.

For code/PR review, record the stable diff base and current head. Do not review a summary instead of the diff. Read the originating outcome, acceptance examples, relevant plan revision, accepted ADRs and actual changed files/tests.

If the PR head or base changes during review, review the new revision or explicitly state which revision the findings apply to. A review of an older revision is not evidence for the current one.

## Review independently

Use a fresh reviewer with read-only access when available. Give it:

- Product outcome and acceptance examples.
- Relevant plan, decisions and ADRs.
- Stable diff base/head and repository review conventions.
- Instructions to inspect actual code and tests, not the author's conclusion.

If independent review is unavailable, say it is self-review and state the limitation.

## Check

### Product and integration

- Acceptance examples are met in the integrated result.
- User journeys, edge/error/loading/empty states behave coherently.
- Terminology and UI match the agreed product language.
- Scope matches the plan; unrelated changes are not hidden in the diff.

### Correctness and quality

- Logic, error handling, data integrity and migrations are correct.
- Tests are meaningful, not merely passing assertions around the implementation.
- Changed behavior is verified; failures and limitations are visible.
- The solution is no more complex than needed and follows repository conventions.

### Security and operations

- Authorization/access, secrets, input/file handling, data exposure and dependencies are appropriate.
- Data loss, recovery, compatibility and deployment impact are addressed.
- A scanner pass is not proof of safety; state what was and was not checked.

### UI/UX and accessibility

Where relevant: clarity, hierarchy, navigation, keyboard/focus, contrast, responsive layout, feedback, destructive actions and error recovery. Do not reduce this to visual taste.

### Architecture

- Accepted ADRs are followed, or the conflict is explicit.
- Significant new choices are recorded with alternatives/consequences and accurate authority.
- Existing architecture is not silently replaced or widened.

## Report findings

For each finding include:

- Severity and owner-visible impact.
- Evidence/reproduction and exact file/line or behavior.
- Affected revision.
- Suggested correction.
- Status (open/resolved/accepted residual risk).

Separate blocking required fixes from optional suggestions. Confirmed critical/high-impact findings block readiness until fixed/reverified or safely removed from scope. Do not turn optional preferences into scope by stealth. Evidence-backed false positives may be dismissed with rationale.

Do not fix findings during a review unless asked. Load `diagnose` or `execute` for the fix loop. Re-review material changes and verify the final integrated revision.

## Verdict

State one of:

- **Ready for authorized delivery** — required checks pass on this revision; list any remaining required human gates. A ready verdict grants no commit, upload, PR, merge, release, deployment, or publication permission.
- **Awaiting checks** — review passes but required remote/manual checks are outstanding.
- **Blocked** — required fixes or unresolved evidence remain.

An agent review is not approval to merge or upload. Do not fake a formal human approval or bypass protected branch rules. Record the reviewed base and head, and the result, so later commits cannot inherit stale approval.
