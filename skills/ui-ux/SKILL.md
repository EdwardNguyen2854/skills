---
name: ui-ux
description: Improve the user experience and interface of an application, including user journeys, clarity, accessibility, responsiveness, states, interaction feedback and visual quality. Use when the owner asks to improve UI/UX, usability or design, users struggle with a flow, or a feature needs interface review before delivery.
---

# UI/UX

Improve how people understand and accomplish the product's real tasks.

Read [the shared delivery contract](references/contract.md).

## 1. Understand users and journeys

Identify the target users, their goals and the important journeys. Ask about outcomes, not design vocabulary:

> What should someone be able to finish here, and what usually confuses them?

Inspect the existing interface, product terminology, brand patterns and relevant screenshots or running app. Do not assume a new visual style is wanted. A rebrand or whole-app redesign is broader scope and needs explicit approval.

## 2. Review

Check, where relevant:

### Task and clarity

- Can users find the next action and understand labels?
- Is information hierarchy sensible?
- Are forms, validation and error recovery helpful?
- Is the current state/result clear after actions?

### States and edge cases

- First use, loading, empty, error, success, permission-denied and destructive states.
- Long text, missing data, slow connections and partial failure.
- Sensitive actions and private-data clarity.

### Accessibility and interaction

- Keyboard reachability, focus, semantics, labels and contrast.
- Reasonable target sizes and feedback.
- Screen-size/responsive behavior and input-method differences.
- No reliance on color or hover alone where it blocks use.

### Visual quality

- Consistent spacing, typography, color and component usage.
- Existing brand/design conventions.
- Visual noise, repetition and unclear emphasis.

Screenshots alone do not prove usability or accessibility. Use running behavior and available inspection tools when possible.

## 3. Prioritize and plan

Turn findings into a small set of improvements ordered by user impact. For each:

- Explain the current friction and expected benefit in plain language.
- Show a before/after sketch, mock-up or concrete description.
- Note accessibility and responsive effects.
- Define how the interaction will be verified.
- Keep the change within the approved feature/update.

Do not add dependencies, redesign unrelated screens or force a new aesthetic merely to look more modern. Follow approved product/brand language and official terminology.

A coded UI change or prototype is implementation: plan/review it before changing application code. Use a disposable prototype only with authorized scope.

## 4. Implement and verify

Implement the approved change with the smallest coherent visual/interaction update. Preserve behavior unless the plan explicitly changes it.

Verify:

- Complete journeys and edge/error states.
- Keyboard/focus and other applicable accessibility behavior.
- Representative viewport sizes and input methods.
- Loading/empty/success feedback.
- No regressions in existing flows.

If visual tools are unavailable, state that visual validation is incomplete and do not claim full accessibility compliance.

## 5. Report

Summarize:

- The user problem addressed.
- What changed and why it should help.
- What was checked, with screenshots/evidence when available.
- Accessibility or visual limitations.
- What remains as a follow-up.

Combine with functional and security verification before calling the delivery ready.
