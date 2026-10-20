# Product quality and delivery

Status: implemented in the repository; static checks pass, runtime scenarios are not executed. This extends the [main design](README.md); it does not authorize changes to an arbitrary project. Planning, scoped permission and checkpoint rules still apply.

## 1. Branches and agent-reviewed PRs

### Default approach

Use one focused branch per feature or bounded update, and a PR for remote integration. The agent performs the code review; the owner is asked about product outcomes and permission decisions, not expected to read code. Worktrees are optional when useful for isolation, not a mandatory extra step.

Do not assume the default branch is named `main`. Inspect repository configuration and available remote information. Establish the intended target branch, branch purpose, local changes/commits and related PR state. Do this at the start/resume of work, on a new feature request, and again before committing/uploading or opening/updating a PR. Do not depend solely on the current branch's name or the previous conversation.

| Current state | Agent response |
|---|---|
| On the default/protected branch | Say that feature work should be isolated and propose a named feature/update branch. Create it only under applicable implementation permission and safe working-state conditions. |
| On the correct branch for the same unfinished work | Continue there after checking the plan and scope; do not create a new branch for every message. |
| On a branch for another feature | Explain the mismatch and propose a separate branch from the verified intended base, or a separate worktree. Do not stack unrelated work on an unmerged feature by accident. |
| The related PR is already merged/closed | Check whether the request is follow-up work requiring a fresh branch; do not blindly reuse a completed branch. |
| Uncommitted or unrelated changes are present | Preserve them. Explain which appear related and propose a safe separation. Do not auto-stash, discard, reset, cherry-pick, or move another person's work. |
| No Git repository or PR access exists | Explain the limitation and ask before initialization/configuration changes. Continue permitted local work only with an agreed fallback; do not fabricate branch or PR status. |

A useful reminder is:

> We are still on the branch for the previous feature. I recommend a separate branch for this update so its changes and review stay separate. Your unfinished files will be preserved.

Avoid repeated reminders once the owner has approved a safe branch choice. Record the choice and check again when scope or actual branch state changes. If the intended base is stale, compare divergence before proceeding; do not fetch-and-reset, rebase, force-push or rewrite history automatically.

### Permission and PR workflow

Record the branch/PR preference once. Ask in everyday language whether the agent may make scoped local commits and, separately, upload the feature branch and open/update a PR on the verified remote. The owner may grant these actions for a feature or bounded series of updates. Preference alone is not upload permission. Check that the destination and files match the grant; local progress records and ADRs are not automatically safe to upload.

Once authorized:

1. Complete the planned work in the intended branch; commit only relevant files, not a blanket staging of unrelated changes.
2. Review the change against the product criteria and a stable base/diff. Include security/risk and UI/UX review where relevant. A separate agent reviews important work when available; label self-review honestly otherwise.
3. Fix blocking findings, rerun relevant checks and re-review material changes. Review findings carry impact, severity, evidence, location, suggested action and resolution status. An evidence-backed false positive may be closed with a rationale; optional preferences are not blockers by default.
4. Upload/open/update the PR only when authorized. Confirm the destination, target branch, actual PR diff and head revision match the reviewed work. Include what works, how it was checked, key risks and any architecture decisions.
5. Record the review result tied to that head revision. New commits, changed base/diff, or relevant configuration changes invalidate affected evidence and require re-review/checks. Required remote checks still count; local tests are not a substitute for missing required checks.
6. Report **PR ready**, **PR awaiting checks**, or **blocked**, with a plain-language summary. If no upload permission/access exists, report **reviewed locally; PR not opened** and prepare the PR description.

An agent review is an assessment, not permission to merge. Do not impersonate a human reviewer or claim a formal approving review that the platform cannot accept from the PR author. Respect required reviewers, protected branches and repository rules. If human approval is required, clearly explain that remaining gate; do not expect the owner to perform an unnecessary code review, but do not bypass a required one either.

Merging, creating a public release/tag, deploying and publishing require their own explicit scoped authorization. Never infer them from "review this PR," "go," or a general preference for agent-reviewed PRs.

## 2. Cleanup and a professional project layout

The `tidy` practice has two stages: **audit and propose**, then **carry out an approved cleanup**. In delegated mode, an already authorized cleanup scope may allow the agent to approve ordinary, recoverable edits/removals within it. It does not authorize deleting unknown material because it looks untidy.

Inspect tracked/untracked/ignored files, build/configuration entry points, tests, documentation, scripts, packaging and deployment references. Use available reference analysis, but do not equate "no imports found" with unused: dynamic loading, plugins, migrations, fixtures, public URLs and external consumers may depend on a file.

Classify candidates:

- **Confirmed obsolete project artifacts:** evidence supports scoped removal or consolidation; explain why and how recovery will work.
- **Uncertain dependencies or ownership:** keep them and report the uncertainty.
- **User data, uploads, credentials, environment files, databases, backups, historical migrations, ignored/untracked material:** protect by default; require specific permission and a verified recovery plan before any applicable deletion. Do not read or expose secret contents just to classify files.

Professional organization follows the project's existing language/framework conventions and makes important paths understandable. Keep conventional root files where tools expect them. Prefer a small, evidence-backed simplification over creating many layers of folders or moving everything for visual tidiness.

Every move/removal needs a purpose, affected references, scope and recovery method. Git is recovery only for content actually recorded in a commit; a tracked-but-modified file may contain unrecorded work. Otherwise preserve an approved recoverable copy before removal. Do not use broad recursive cleanup, overwrite user changes, or create an indefinite pile of backup folders as a substitute for a plan.

Update imports, config paths, scripts, links and packaging as needed. Rerun relevant build/tests and verify affected entry points, including dynamic/external paths where knowable. Report exactly what moved/was removed, what was preserved, and what was verified. Cleanup beyond touched artifacts is a separate planned task, not automatic scope expansion during every feature.

## 3. Security, privacy and other risks

Use `security-review` during planning for exposed/sensitive changes, during relevant implementation/code review, and when the owner requests an audit. Default to read-only examination until fixes have an authorized plan. An audit request does not authorize intrusive testing, external scanning, production probing, uploading source to a service, installing tools, or broad dependency upgrades.

Review the actual attack/failure surface, not a mandatory checklist detached from the product. Consider:

- Who can access which data/actions; authentication and permission checks where present.
- Secrets, configuration, logging, data storage/transmission, backups and private information.
- Input validation, injection, file uploads/path access, unsafe execution and relevant browser protections.
- Dependencies and known vulnerabilities, with scanner coverage and uncertainty stated.
- External integrations, least privilege, exposed endpoints and sensitive defaults.
- Data loss/corruption, failed migrations, recovery, compatibility, reliability and operational cost surprises.

For each material finding, record severity, affected path/behavior, evidence, likely impact, proposed mitigation, verification and status. Explain the owner-facing consequence, for example: "Someone could read another person's saved items," not just an acronym or scanner score.

Store feature risks with the existing plan/progress records rather than adding a second task system. Link long-lived design risks to relevant ADRs. Keep exploit details/secrets/private data out of shareable summaries. Verify findings where safe, distinguish confirmed problems from hypotheses, and do not dismiss risk merely because a scanner passed or could not run.

Confirmed critical/high-impact problems block the affected feature's **ready/complete** status until mitigated or safely removed from scope and reverified. The agent cannot accept serious risk on the owner's behalf. Owner acknowledgement/acceptance alone does not unblock those findings; a specifically authorized preserved/shared draft remains explicitly **blocked**, not PR ready or complete. Medium/low residual risks may be accepted by the owner within their authority, with rationale and scope, provided mandatory requirements/checks still pass. Record these as **accepted residual risk**, not **no risk** or a security guarantee. Risk acceptance never grants merge/release permission or waives mandatory security/repository rules. State review limitations; do not promise that any review proves the product secure.

## 4. Architecture decisions that outlive a session

Yes: significant architecture choices get durable **Architecture Decision Records (ADRs)**, not just a passing mention in a progress note.

Reuse an existing `ADR.md`, `adr.md`, ADR index/folder or equivalent project convention. If none exists, use `docs/adr/0001-short-title.md` and create an index only when useful. Do not generate imaginary decisions during setup or duplicate the same decision across several canonical locations.

Record decisions that are long-lived, costly to reverse, or constrain future work: data ownership/storage, offline versus synced behavior, authentication boundaries, major integration choices, compatibility, deployment shape and significant module responsibilities. Small implementation details do not each need an ADR.

Each ADR contains:

- ID/title and status: proposed, accepted, or superseded.
- Context/problem, with a plain-language summary and user-visible consequences.
- Considered alternatives and important tradeoffs, including risk/cost where relevant.
- The chosen approach and why it satisfies the agreed goals.
- Decision authority: explicitly owner-selected, agent-selected within owner-approved plan revision X, or agent-selected under a named delegated scope. Reference the applicable approval/permission record; never mislabel an agent choice as an explicit owner choice. Routine in-plan engineering decisions do not require a separate judgment-mode grant, but material changes to scope, assumptions or outcomes need applicable fresh approval/delegation.
- Consequences, relevant evidence and conditions that would justify reconsideration.
- Links to related work/ADRs and a superseding decision if one exists.

Planning reads the relevant accepted ADRs. Implementation and review check that they are followed. If an ADR conflicts with the new request or reality, explain the conflict, revise the plan and obtain applicable authority rather than silently ignoring it. Supersede a decision with a new linked record; do not rewrite history to make it appear that the old choice was never made.

An ADR records why the design exists; it is not an authorization grant or a parallel progress tracker. Keep detailed grants in the authoritative permission records. Feature notes link ADRs, which survive feature completion and progress compaction.

## 5. UI/UX improvement

The `ui-ux` practice begins with the owner's users, goals and main journeys. Inspect the existing interface and design conventions. Ask about practical outcomes rather than demanding design vocabulary.

Review:

- Whether users can find, understand and complete the important actions.
- Information hierarchy, navigation, labels, forms and error recovery.
- Visual consistency, spacing, typography, contrast and approved brand patterns.
- Keyboard access, focus, semantic structure and other applicable accessibility needs.
- Responsive layouts, loading/empty/error/success states and feedback after actions.
- Destructive actions, confusing defaults, privacy clarity and avoidable friction.

Prioritize concrete improvements by user impact. Show a concise before/after explanation, mock-up or screenshots where available. A broad visual rebrand needs explicit scope; do not change established branding or add dependencies merely for a fashionable appearance. Coded prototypes and interface changes still require a reviewed, authorized plan.

Verify changed interactions and representative screen sizes/input methods, not just screenshots. Use visual inspection where tools allow it; if unavailable, state the limitation and do not claim visual validation or full accessibility compliance. Keep text labels and domain language consistent across the interface and the owner's terminology. Integrate functional, accessibility and relevant security checks before calling the improvement complete.

## 6. One instruction for the next update

`next` should also recognize ordinary language such as:

> Plan the next update, review it, implement it and go. Use your judgment.

Interpretation:

1. Inspect the current vision, implemented behavior, unfinished work, known risks, owner feedback and relevant ADRs.
2. Choose one small, useful next update aligned with that evidence. Prioritize broken core behavior and serious risks over speculative polish. If there is no defensible next step, ask a clear product question or propose options; do not manufacture demand.
3. State the intended user benefit, boundaries and questions. Without delegated authority, stop at the reviewed proposal. With explicit "go/use your judgment" authority, create a grant for this one bounded update and record assumptions; it does not grant every permission for every future update.
4. Make a testable plan and review it before coding. Fix plan weaknesses and record owner/delegated approval of the final revision. Material uncertainty or actions outside authority still stop affected work.
5. Check the branch/PR state and establish safe isolation before implementation. Do not mix an unrelated update into unfinished feature work.
6. Implement with native tasks and focused workers where useful, checkpoint progress, record actual architecture decisions and run relevant checks.
7. Arrange independent code review when possible, with security/risk and UI/UX review appropriate to the change. Fix blockers and re-review affected revisions.
8. Deliver an agent-reviewed PR when specifically authorized and available, or reviewed local changes with a prepared PR summary otherwise. Make remote-check gaps visible. Stop after this one update with an understandable summary and recommended next step.

Do not interpret "next release" as automatic version selection, backward-incompatible changes, tagging, merging, deployment or publication. Explain those distinctions without forcing the owner to learn release engineering. Previously granted, still-applicable permissions can avoid repeated questions, but absent permission must not be invented just to keep the flow moving.
