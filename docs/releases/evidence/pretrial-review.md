# Pretrial safety review

Status: **self-review only; not independent, and not a G2 pass.**

- Candidate: current working tree on `release/reliability-hardening`, based on `56d2f5f`
- Reviewed: repository scripts, tests, shared contract/templates, all 14 skill bodies, packaging metadata, docs and evaluation manifest
- Method: source inspection, deterministic test execution and mutation fixtures; no live skill sessions

## Findings

| ID | Severity | Confidence | Finding | Disposition |
|---|---|---|---|---|
| PR01 | High | Confirmed | Installer lifecycle, copy/symlink discovery and upgrade/uninstall behavior are unverified. No pinned installer was downloaded or executed. | Open; blocks G2 and AC06. |
| PR02 | High | Confirmed | All 61 evaluation cases remain `not-run`. Static checks and seeded recovery fixtures do not prove live routing, authority, worker or recovery behavior. | Open; blocks G2/G3/G4. |
| PR03 | Medium | Confirmed | The path policy rejects symbolic links and junctions but not hard links. A hard-linked generated copy can still be read, though writes use a temporary file and rename so the external link target is not overwritten. | Accepted limitation for this candidate; disclose in evidence. |
| PR04 | Low | Confirmed | Path checks and mutations are not atomic against a hostile process swapping paths concurrently. This is a local single-owner repository tool, not a multi-tenant service. | Accepted limitation; workers are not granted adversarial filesystem access. |
| PR05 | Low | Confirmed | Link validation covers parsed Markdown links/images and GitHub-style heading slugs. Raw HTML links/ids, reference definitions without links and non-Markdown documents are outside the checked subset. | Documented limitation. |
| PR06 | Medium | Confirmed | Required-sibling identity is enforced by instructions and metadata, not by the runtime loader. A same-name foreign skill could still be loaded by an installer that ignores collection metadata. | Open; evaluation case X05 and installer evidence must close it. |
| PR07 | High | Confirmed | No independent reviewer has signed off this candidate. | Open; T24 not satisfied. |
| PR08 | Medium | Confirmed | R23 measurement-only loading comparison was not authorized or run. | Out of scope; remains optional and separate. |

## Positive checks

- Duplicate YAML keys, unclosed quotes and unsupported tags fail closed.
- Markdown links are parsed, anchors are checked against actual headings, and malformed encoding does not throw an unhandled exception.
- Sync rejects linked, nested and unexpected entries without recursively deleting them; check mode changes no bytes.
- Generated reference and notice inventories are exact for the 14 active skills.
- Legacy `SKILL.md` files are not discoverable by recursive name.
- Worker, permission, record and review rules are now explicit and mutually consistent in the shared contract.

## Verdict

**Blocked for G2.** The deterministic foundation is reviewable, but PR01, PR02, PR06 and PR07 prevent a safe pretrial candidate claim. Complete the pinned-install evidence and an independent review, obtain G1E approval and run the required safety rows before treating this as ready for supervised evaluation.
