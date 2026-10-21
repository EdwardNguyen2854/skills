# Example: a one-line fix with a short plan

**Request:** "The total on the cart page shows the wrong currency symbol. Fix it."

This is implementation, so planning still happens, but briefly.

## Questions and assumptions

> I found the cart total uses the account currency but a hard-coded `$` in the display component. I recommend using the existing currency formatter, then checking one USD and one EUR cart. Should the symbol follow the account setting everywhere, or only on this page?

The owner answers: "Use the account setting everywhere."

## Short plan

- **Outcome:** cart totals use the account currency formatter.
- **In scope:** the cart display component and its focused test.
- **Out of scope:** changing currency conversion, pricing rules, or other screens.
- **Task T1:** replace the hard-coded symbol, add a regression test for two currencies, run the focused test and the cart integration check.
- **Trial:** owner opens the cart with a EUR account.
- **Approval:** Work with me; owner approves this revision.

## Review before code

A fresh or self-review checks that the plan covers both currencies and does not silently change conversion. Self-review is labeled if no fresh reviewer exists.

## Implementation and evidence

- The component now calls the existing formatter.
- The focused test failed before the change and passes after it.
- Evidence: `cart-total.test` and the cart integration check, tested on the current working-tree content.
- No PR was opened; no upload permission was granted.

## Report

> Cart totals now follow the account currency. I checked a USD and a EUR cart and the focused regression test. Currency conversion and other screens were not changed. To try it, open the cart with a EUR account. I did not commit or open a PR.
