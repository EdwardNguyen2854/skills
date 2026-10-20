# From vision to working product

Status: implemented on branch `design/vision-to-product` and statically validated; runtime scenarios are not yet executed. See [implementation status](implementation.md).

Reading guide: sections 1–3 describe the owner's experience; sections 8–9 summarize the next-update flow and product care. Details are in [product quality and delivery](product-quality.md). The other sections specify agent behavior, influences and implementation sequence. See [acceptance scenarios](scenarios.md) and [design review results](review-results.md) for validation limits.

## 1. Who this is for

The owner has a product vision and understands the experience they want, but does not have a coding background. They should not need to manage engineering tasks, select software infrastructure, or interpret technical jargon to get a useful result.

The agent's job is to clarify the intended experience, investigate the technical choices, plan carefully, coordinate implementation, and demonstrate what works. The owner retains control of the goal, important tradeoffs, and permission boundaries.

### Agreed direction

- Plan before implementation, including small changes. Small work gets a short plan, not a planning exemption.
- Ask useful questions in everyday language, with a recommendation and practical consequences.
- Offer an explicitly authorized "use your judgment" mode so unanswered, low-risk questions do not stop all progress.
- Use available native tasks and subagents rather than GitHub Issues or Projects for execution.
- Save compact local records so another session can continue and reconstruct native tasks.
- Prefer fresh, focused worker contexts and independent review over one increasingly crowded conversation.
- Use feature/update branches and pull requests by default, with the agent responsible for reviewing the work rather than expecting the owner to review code.
- Include project cleanliness, security/risk review, architecture decisions, and UI/UX where relevant to the work.
- "Complete" means working and tested in the agreed environment, with delivery status stated separately. Opening a PR, merging, publishing, and deployment are distinct actions with distinct permissions.

The skills are tool-neutral. They use capabilities available in the current session without naming or requiring a particular coding application, model provider, task API, or delegation system.

### What this replaces

The existing issue-first collection remains unchanged during design. The future workflow will not require GitHub Issues, `gh`, labels, Projects, milestones, or an issue for each change. Prefer Git branches and PRs for code delivery without using the PR platform as the task tracker. If Git or remote PR access is unavailable, explain the limitation and prepare local work; never invent a remote repository.

The [earlier review](../../REVIEW.md) is a historical assessment, not the redesign's requirements. In particular, its suggestions to retain issue-first tracking or bypass planning for tiny fixes are superseded here.

## 2. The experience

The owner should be able to say:

> I want an app where I can save interesting products and compare them later. Ask me what matters, then help me build it.

The agent guides the work through:

**Understand → Clarify → Plan → Review the plan → Build → Test and review → Prepare PR**

These are working stages, not commands the owner must remember. The main entry point routes between them based on the request and verified project state.

Proposed main entry points, with final names to be checked for command conflicts:

- **`/create`**: start or change a product/feature; also route fixes and requests for changes. Natural-language requests are supported when skill discovery is available.
- **`/resume`**: inspect saved work, reconcile it with the actual project, and continue or explain what is blocked.
- **`/next`**: propose the next useful update from the owner's vision and actual project state. **`/next go`**, or an equivalent explicit natural-language instruction, delegates planning, plan review and implementation of one bounded update within the owner's limits. It is not an endless release loop or permission to merge/publish.

Optional direct entry points are **`/tidy`**, **`/security-review`**, and **`/ui-ux`**. The main guide also invokes these practices when needed; the owner does not have to remember them.

First use includes minimal setup inside this flow. Explain proposed local files and request permission before creating project guidance or changing existing guidance. Existing instructions are preserved, not replaced wholesale.

If the owner declines setup, preserve their files and offer another approved location or session-only assistance. Explain that session-only work cannot promise durable recovery. Lack of permission to save records is not permission to save them elsewhere without agreement.

In session-only assistance, keep the plan, approval, decisions and permission scope in the conversation and any available live tasks. Do not create progress/guidance files or unattended background writers. Continue only authorized work that can be safely coordinated within this session; no durable resume or ADR promise applies without approved storage. If the session is lost, recover actual project changes by inspection and ask again for authority that cannot be established. Offer separate permission for an existing ADR location when a lasting architecture decision needs recording; do not secretly substitute another file.

### Plain-language communication contract

- Ask about user experience, desired behavior, constraints, and priorities. Investigate technical questions before asking the owner to resolve them.
- Normally ask one to three related questions at a time. Do not make the owner answer a long intake form before seeing anything useful.
- Each consequential question explains the choice, the practical effect, and the recommended answer. Offer "use your recommendation" rather than forcing technical expertise.
- Distinguish facts, assumptions, and untested ideas. Do not present an agent-selected assumption as an owner-approved requirement.
- Use a short user journey, mock-up, or example when words are ambiguous. A coded prototype is implementation: plan it first, mark it disposable, and keep it within authorized scope.
- Updates explain what now works, what is being checked, and what needs attention. Keep detailed code/test evidence in the local record rather than dumping it into every reply.

Example:

> Should your saved products appear on another computer? I recommend keeping them on this computer for the first version unless using multiple devices is important. That makes the first version simpler, but it won't automatically sync.

Not:

> Should we use local persistence or a hosted database?

## 3. Collaboration and decision authority

### Work with me — default

Ask about consequential product uncertainty and wait for explicit approval of the implementation plan. The owner approves outcomes and boundaries, not every technical detail. Routine engineering choices within that approved plan can proceed without repeated questions.

If the owner is unavailable, continue only work already authorized that does not depend on the unanswered decision. Otherwise save a checkpoint and report the blocker.

### Use your judgment — explicit opt-in

The owner can authorize this for a named feature or session. Record the exact authorization, its scope, and any stated limits before using it.

The agent still raises relevant questions but need not open a blocking question dialog for safe assumptions. It can state the question and recommended answer, record the assumption, and continue. It must prepare a plan and critically check it before implementation; delegated authority changes who may approve the plan, not whether planning happens.

Choose defaults by this order:

1. Explicit owner goals and constraints.
2. Existing, verified project behavior and decisions.
3. The smallest approach that satisfies the agreed outcome.
4. Low cost, privacy, accessibility, maintainability, and ease of reversal.

If those considerations conflict, record the tradeoff and keep alternatives open where practical. Do not invent willingness to pay, a target audience, or legal/privacy requirements. High-impact uncertainty blocks the affected work, not unrelated authorized tasks.

High-impact product choices include changing the intended users, core experience, data handling, acceptance criteria, or difficulty of reversal. In Work with me mode these require an answer; in judgment mode they require a clearly applicable owner constraint or explicit delegation covering that choice. If impact or authority is unclear, pause the affected work. Routine engineering details within those boundaries may proceed.

### Permission boundaries

Neither mode authorizes destructive actions outside an approved change/removal scope, new paid commitments, private-data disclosure, production changes, pushing code, merging, deployment, publication, or broad scope expansion. Ask for specific permission before these actions, unless the owner has already explicitly granted that specific action and scope. Repository instructions and tool permissions still apply; the skill cannot override them. PR creation requires scoped permission to upload the relevant code/records to the verified remote; a preference for PRs or the word "go" alone is not that permission.

Prefer isolated local changes and test data. Never request secrets in chat or store credentials in the planning records. Reversible does not automatically mean authorized or safe.

### Approval and scope changes

Each plan has a revision, and approval or delegated approval names that revision. Record who approved it and the limits. A general positive response to an idea is not approval of an unseen implementation plan.

When scope or an important assumption changes, revise the plan and identify affected tasks. In Work with me mode, obtain fresh approval for material changes. In Use your judgment mode, a revised plan may proceed only if it remains within the existing authorization and safety boundaries. Revocation applies immediately to new actions; stop/re-scope affected workers and checkpoint ongoing work safely. Do not undo completed work without permission. See the worker stop protocol in section 6 for the limits of stopping already-running work.

A feature/update-scoped delegation may survive a new session only when the authorization and scope are clearly recorded and still applicable. A session-scoped delegation does not carry into another session. An ambiguous or missing permission defaults to Work with me.

Keep one authoritative permission record per scope: project-wide grants/revocations in `project.md`, feature-specific ones in that feature's `decisions.md`. Record the owner's instruction/reference, action, scope, limits, duration, and active/revoked/superseded status. A feature grant cannot expand a project restriction. Checkpoints and worker packets reference these records; they do not grant authority themselves. Current owner instructions and higher-priority project/tool rules take precedence. Preserve revocation/supersession information when compacting records; never recover authority merely by loading an older valid checkpoint. Conflicting or unverifiable permission records suspend the affected implementation until clarified.

## 4. Planning before implementation

Before changing product code, describe:

- Who benefits and what they will be able to do.
- Observable success examples and what is outside scope.
- Known constraints, important questions, and provisional answers.
- Relevant existing code/behavior and technical risks found by inspection.
- Small end-to-end pieces of functionality, their dependencies, and how each will be checked.
- Where the owner will run and try the result, any prerequisites, and any difference between the test environment and intended use. Explain this in everyday language before treating that environment as agreed.
- Isolation approach and permission boundaries.
- Security/privacy and operational risks, architecture decisions affected, and UI/UX implications where relevant. Do not force a visual redesign or directory reorganization into unrelated work.

Review the plan before implementation: check outcomes, missing steps, dependencies, risks, verification and simplicity. Use a fresh reviewer when available; otherwise explicitly label self-review. Revise blocking weaknesses before coding, then obtain owner approval or record applicable delegated approval of that revision. This is separate from reviewing the finished code/PR.

For a whole product, first agree on a small useful version and an overall direction. Plan the next piece in detail; do not fabricate a fully detailed, months-long implementation schedule. Research and design inspection may occur before approval, but writing application code or a coded prototype requires an authorized plan.

Internal task records include a stable ID, plain-language outcome, dependencies, likely file ownership, a verification method, and a reasonable stopping boundary. Technical details belong in the task packet, not in a questionnaire for the owner.

Use the available native task interface whenever possible. If it only offers a flat list, express dependencies in task descriptions and enforce them in the coordinator. Do not build a replacement task manager.

## 5. Live tasks and durable local memory

### Proposed layout

```text
.work/
  project.md
  features/
    saved-products/
      plan.md
      progress.md
      decisions.md
docs/
  adr/
    0001-example-decision.md
```

Create records only as needed. A tiny fix still has a short plan and progress record; a decisions file is unnecessary until there is a decision worth preserving or delegated authority to record. ADR files exist only for actual significant decisions, not as setup placeholders. Reuse existing architecture-decision conventions instead of creating a competing folder. The project file indexes active work so new sessions need not read every past feature. A bounded update can use the same record format and link its included features without adding a new hierarchy by default.

| Record | Owns |
|---|---|
| `project.md` | Product purpose, constraints, active feature paths, authoritative project-wide permission grants/revocations, preferences and verification commands when known. |
| `plan.md` | Feature outcomes, acceptance examples, scope, revision, approval reference, task IDs and dependencies. |
| `progress.md` | Latest checkpoint, task statuses, working location, code revision/dirty state, evidence, blockers and exact next action. |
| `decisions.md` | Consequential choices/questions, rationale, assumptions, owner answers, decision status and authoritative feature-scoped permission grants/revocations. Create it before relying on feature-scoped delegated authority. |
| Existing ADR location, otherwise `docs/adr/*.md` | Durable architecture decisions and their tradeoffs, independent of temporary progress. Feature records link them rather than duplicate them. ADRs are not permission grants. |

**Do not maintain competing task authorities.** Native tasks are the live view during work. At checkpoints, progress.md stores the compact durable snapshot. On resume, reconcile that snapshot with code and evidence, then restore the native view. A checkbox is not proof that a feature works.

Plan task IDs survive sessions; native task IDs do not have to. Store the current mapping in the checkpoint only if useful. Rebuilding tasks must update/reuse an existing live view instead of duplicating it on every resume.

### Minimum checkpoint contract

- Record version, feature ID, plan revision and checkpoint revision/time.
- Active collaboration mode and reference to the current authoritative scoped permission record; do not broaden authority when copying it.
- Working directory, branch/worktree and base/current commit where Git exists; uncommitted paths and unfinished work. Without Git, identify the relevant files and verification state instead of inventing commits.
- Stable task IDs with status: pending, in progress, blocked, ready for review, or done. Include dependencies and a brief reason for blocked work.
- Verification evidence: task/acceptance example, command or manual action, result and tested working-tree state, including relevant test configuration/dependencies. A commit alone is insufficient for dirty work; use a compact content/diff identifier or rerun affected checks when correspondence is uncertain. Summarize output; keep large or sensitive artifacts out of these records.
- Worker dispatch intents and outstanding ownership, unresolved findings and unanswered questions.
- Intended branch purpose/base, related PR and its reviewed head revision when present; whether changes belong to this feature/update. A branch name alone does not prove scope.
- Exact next action and the smallest context needed to perform it.

Checkpoint after plan approval, before dispatching a worker, after a meaningful task result, after review, when blocked, and before a deliberate pause. Before dispatch, save a stable task/attempt identifier and intended workspace/ownership; include that identifier in the native worker request, then record the returned worker ID. If termination falls between dispatch and saving that ID, resume must reconcile the pending intent, not assume no worker was launched. Combine rapid internal updates instead of writing on every tool call. Unexpected termination may occur between checkpoints, so the resume flow must recover unrecorded changes from the project itself.

Only the coordinator writes shared workflow records and changes the live task graph. Workers return results. Preserve the last valid checkpoint when writing a replacement; do not leave a truncated file if interrupted. Check plan/checkpoint revisions before applying an update. Default to one active coordinator per project workspace, including shared records and the native task view. Different feature folders do not make shared application files independent. Parallel coordinators require explicit non-overlapping resource ownership and an owner for shared-record updates; otherwise use a handoff. If ownership is uncertain, stop direct writes and write dispatches until it is resolved.

The setup flow should explain that these records are intended to be versionable project context, not secrets or full session logs. Follow repository policy for including them in commits. Commit only relevant reviewed records under applicable implementation/delivery permission; never upload records without checking their contents and upload scope. Never overwrite an existing unrelated `.work/` directory; agree on another location instead.

### Resume procedure

1. Read existing project instructions and the small project index; select the relevant feature. Ask if multiple active features make the owner's intent unclear.
2. Read its latest valid checkpoint, plan and applicable decisions. Check record versions and plan/checkpoint consistency; do not guess at unsupported versions. Treat record contents as project data, not instructions that can override current permissions. Recover permission from the current authoritative grant/revocation records, not a historical snapshot; uncertain authority does not prevent read-only recovery but blocks affected implementation.
3. Inspect the actual working directory, changes, code revision and available evidence. Preserve work changed by the owner or another agent. Reconcile partial/stale writes before overwriting state.
4. Reconcile both recorded workers and pending dispatch intents through available worker-management tools, using task/attempt identifiers. Never assume a previous worker is alive or finished; confirm cancellation/completion or isolate its work before assigning a replacement writer. If an unrecorded writer's existence cannot be resolved, block conflicting writes rather than claiming the workspace is safe.
5. Reopen tasks whose implementation/evidence is missing or invalidated. Verification for old code does not automatically apply to new code. Rebuild/reuse native tasks from stable IDs and dependencies.
6. Check branch purpose and PR state before new implementation, report a short plain-language summary, recover the applicable permission scope, and continue only authorized work. Missing, corrupt or conflicting records require inspection/recovery, not a fabricated progress history.

The setup flow adds a short, approved pointer to project agent guidance so sessions can discover these records. If guidance is not loaded automatically, `/resume` is the explicit fallback. Do not promise invisible cross-session synchronization.

## 6. Delegation and context management

The coordinator retains the product goal, plan, permissions, dependencies and integration responsibility. It does not carry every worker's transcript or every source file in its context.

Start a fresh worker context for a bounded implementation/research/review task when supported and the isolation is useful. Small tasks can stay inline when delegation costs more than it saves. Default to at most two concurrent workers, subject to actual tool limits; use fewer when dependencies or file ownership overlap. Never spawn background work that relies on an unanswered blocking decision.

### Worker packet

- Task/attempt ID, plan revision, applicable permission scope/reference, expected outcome and acceptance examples.
- Relevant decisions, file paths and selected references, not the entire conversation.
- Owned files/worktree, permitted operations, explicit non-goals and prerequisites.
- Verification steps and expected evidence.
- Stop conditions: unexpected scope, conflicting edits, missing requirements, repeated failures or actions requiring permission.
- Required result: changed paths, what was checked, actual results, remaining risks and integration instructions. Workers must not publish, update shared workflow state, or delegate again by default.

Run genuinely independent work in parallel. Tasks that change the same files or depend on each other's output run sequentially unless an explicit worktree/integration strategy makes them safe. A fresh context is not a filesystem sandbox: use read-only permissions for reviewers where supported, dedicated worktrees when helpful, or enforce non-overlapping file ownership. Do not claim isolation based only on a new conversation.

The coordinator checks actual changes and integrates dependent work in order. Worker completion means ready for review, not done. Reviewers use a fresh context and receive the product criteria, relevant decisions, a stable diff base and actual code, not just the author's favorable summary.

On permission revocation or material re-scoping, stop new dispatches and notify/cancel affected workers through supported tools. Require acknowledgement of the new boundaries or verified termination before further affected writes/integration. Workers check their task authority before new write batches and stop on revocation or revision conflicts. If a worker cannot be stopped or inspected, report that limit, treat it as potentially live, preserve/isolate its workspace, and block conflicting work or integration. Do not promise instantaneous cancellation the available tools cannot enforce. Do not start unattended shared-workspace writers without an adequate inspection/stop mechanism; choose isolated or foreground execution instead.

After two failed attempts with no new evidence, stop blind retries. Diagnose with a focused task, change approach within authority, or checkpoint a blocker. This is a default retry limit, not permission to spend money or spawn unlimited replacement workers.

Keep workers' replies concise and load references on demand. If the coordinator is becoming crowded or context compaction is approaching, checkpoint before starting a new stage and resume from compact records. Do not invent a universal token threshold or assume a fresh worker alone guarantees quality.

## 7. Checks and completion

Implementation should use short feedback loops: add a meaningful failing test when appropriate, observe the failure, make the change, and rerun the test. For bugs, reproduce the problem before claiming a fix. Where automated tests are impractical, state the limitation and define a concrete manual check; do not silently declare that validation is unnecessary.

Separate review of product correctness from code quality. Check acceptance examples, integration between pieces, error cases, privacy/security, usability and accessibility where relevant. Confirmed critical/high-impact findings block ready/complete status until mitigated or safely removed from scope and reverified; merely acknowledging or accepting them does not resolve that gate. The owner may authorize preserving/sharing an explicitly blocked draft within existing safety rules, but it remains blocked, not ready. Medium/low residual risks may be accepted explicitly if mandatory requirements/checks still pass. Optional suggestions do not silently become new scope.

Independently review nontrivial work when fresh reviewers are available. For small changes, a focused separate review may suffice. If independent review is unavailable, explicitly label self-review and its limitations; do not represent it as independent. Re-review material fixes and verify the integrated result, not just individual worker outputs.

Before claiming complete:

- The agreed acceptance examples pass on the current integrated code.
- Required checks have run and their actual results are recorded.
- Blocking findings are resolved and the relevant checks rerun.
- Missing checks and remaining limitations are visible; unresolved required checks mean incomplete or blocked, not "complete with a footnote."
- Progress records and native tasks agree with verified reality.
- The owner receives a short explanation of what now works, how to try it, and what remains outside scope.

Demonstrate the product in the agreed environment when tools allow it. Passing local checks is not production readiness. Report implementation, PR and release states separately: implemented locally, PR prepared/open/reviewed, merged, deployed or published. The default delivery endpoint is an agent-reviewed PR when upload/PR permission exists; otherwise it is reviewed local work plus a prepared PR summary. Do not mark a PR reviewed without verifying its actual head/diff matches the reviewed code. Delivery does not implicitly merge, push, deploy, publish, or spend money.

## 8. Move the next update forward

The owner can say:

> Plan the next update, review the plan, implement it, and go. Use your judgment within our agreed limits.

The `next` skill inspects the vision, actual product state, unfinished work, risks and recorded feedback; proposes one useful, bounded update; reviews its plan; checks the branch; implements; verifies; arranges agent code/security/UI review as relevant; and prepares a PR. It continues through fix/review loops without asking the owner to operate each stage, but still stops at permission or consequential uncertainty boundaries.

Without "go" or equivalent delegated authority, `/next` proposes and reviews a plan, then waits. With explicit scoped authority it may approve the reviewed plan and proceed, while still surfacing understandable questions and assumptions. An update is not automatically a public release, version bump or deployment. Do not invent new product demand merely to keep busy. Stop after the one agreed update and report the result; do not select another update automatically.

Branch/PR preferences are durable project preferences, not an instruction to change branches blindly. Before a new feature/update or resume, inspect the default branch, current branch purpose, changes, commits and related PR. On the default branch, propose a dedicated branch; on another feature's branch, warn plainly and offer a separate branch/worktree. Follow existing approved branch policy when it is safe. Never auto-stash, discard, move unrelated changes, or branch from unmerged feature work without checking and obtaining applicable permission. See the [branch and PR contract](product-quality.md#1-branches-and-agent-reviewed-prs).

## 9. Product care without extra administration

These practices belong inside planning and review when relevant, and can also be requested directly:

- **Cleanup:** identify unused/redundant files and confusing layout; propose evidence-backed, scoped moves/removals; preserve user data and validate references. Professional means conventional and understandable, not a large cosmetic folder reshuffle.
- **Security and risks:** review privacy, secrets, permissions, input/file handling, dependencies and relevant failure/data-loss risks. Explain impact plainly, track unresolved risks locally, fix authorized blockers and never claim a security guarantee from a scanner alone.
- **Architecture decisions:** record significant long-lived choices as ADRs at the existing location or `docs/adr/`. Explain why, alternatives, consequences and what would justify changing the decision. Link ADRs from feature plans and read relevant ADRs before changing their areas.
- **UI/UX:** evaluate complete user journeys, clarity, consistency, accessibility, responsiveness, loading/empty/error states and visual quality. Offer specific improvements or examples, follow existing brand patterns and verify changed interactions. Do not reduce UI/UX to making screens prettier.

The detailed safeguards and record formats are in [product quality and delivery](product-quality.md). These are not excuses to expand a small feature into an unrelated redesign, dependency overhaul or directory cleanup.

## 10. Proposed skill boundaries

Keep the main public surface small. Supporting skills are reusable practices reached for by the agent; the owner does not need to invoke each one. Names below are provisional, not a promise that every tool exposes identical commands.

| Skill | Responsibility |
|---|---|
| `create` | Main guide: understand the request, choose the working stage, explain progress and coordinate the overall flow. |
| `resume` | Discover/reconcile durable state, restore native tasks and recover the applicable authority. |
| `next` | Select one bounded next update, review its plan and, when authorized, coordinate implementation through an agent-reviewed PR or reviewed local delivery. |
| `clarify` | Ask understandable questions, investigate technical uncertainty, and record answers/assumptions. |
| `plan` | Inspect the project, consult relevant ADRs and produce right-sized, reviewed and authorized plans with verifiable task boundaries. |
| `execute` | Check branch purpose, safely isolate work, dispatch bounded workers, manage dependencies and integrate results. |
| `review` | Review plans and, separately, finished code/PRs for product fit and code risks; return actionable findings with evidence tied to a revision. |
| `verify` | Test current behavior and gate completion claims on evidence. |
| `diagnose` | Reproduce and investigate failures rather than guessing or retrying blindly. |
| `checkpoint` | Save compact, consistent state and permission references at meaningful boundaries. |
| `tidy` | Audit unused files and layout, then carry out an approved, recoverable cleanup plan with reference/build checks. |
| `security-review` | Examine relevant security/privacy/operational risks and record evidence, severity, mitigations and unresolved blockers. |
| `ui-ux` | Review and improve real user journeys, interface clarity, accessibility and visual quality within authorized scope. |

Shared record/ADR templates and tool capability guidance belong in references, loaded only when needed. Architecture decision recording is built into planning, implementation and review rather than requiring the owner to remember another command. Do not repeat this entire design in every skill. Add deterministic helper scripts only where real usage shows a reliability benefit, such as record validation; no custom scheduler, database or background service is proposed.

## 11. Available-tool contract

Portable instructions describe behavior, not product-specific commands or APIs. Discover capabilities actually available in the current session. Respect tool availability and existing permissions; do not guess tool names or API shapes, pin a provider, or require a particular coding application.

| Capability | Preferred behavior | If unavailable |
|---|---|---|
| Native tasks/progress | Restore/update tasks with stable local IDs in descriptions or metadata. | Use the local progress snapshot and explain the reduced live view. |
| Fresh subagents | Use native workers with bounded packets and fresh review contexts. | Work sequentially with compact checkpoints; disclose the loss of independent review where applicable. |
| Background management | Use native completion notices, cancellation and continuation. | Use foreground workers; do not invent a polling manager. |
| Workspace isolation | Use supported worktree tools or safe Git operations when appropriate. | Use verified non-overlapping ownership, or sequential work in an existing safe workspace. |
| Project guidance/startup | Add an approved discovery pointer using the supported project-instruction mechanism. | Offer explicit `/resume`; do not claim auto-loading. |
| PR access | Open/update a PR and verify the reviewed head/diff on the intended remote when authorized. | Prepare reviewed local changes and a PR summary; clearly state that no PR was opened or remotely reviewed. |

Capability integration is implemented as tool-neutral fallback guidance and has not been tested end to end. Before relying on a reduced-capability path, verify actual installed capabilities. Do not weaken a mandatory repository or tool rule to match these defaults. Validate both full-capability and reduced-capability paths without coupling the skill catalog to one coding application.

## 12. What to learn from the comparison

These are design lessons from the repository-level comparison, not measured performance rankings or claims of exhaustive upstream audits.

| Source | Borrow | Avoid or adapt |
|---|---|---|
| Matt's skills | Small reusable engineering disciplines and shared product vocabulary. | Do not make its workflow, command catalog or technical audience our product requirements. |
| pstack | A main guide that routes to focused practices; disciplined delegation. | Model/provider assumptions, product-specific integrations and unnecessary parallel/model panels. |
| Superpowers | Clarification, planning, test feedback, independent review and evidence before completion. | Rigid ceremony for every task and automatic behavior that overrides the owner's preferred collaboration mode. |
| GSD Core | Durable context, focused fresh workers, resumable execution and dependency-aware work. | A large mandatory planning directory or task framework that duplicates available native features. |
| BMAD | User goals becoming delivery artifacts; planning depth adapted to uncertainty. | Requiring a nontechnical owner to operate a large roster of roles, documents or commands. |

## 13. Implementation sequence and acceptance gates

1. **Approve the behavior contract:** settle decision authority, checkpoint ownership and resume rules using the [scenario checks](scenarios.md).
2. **Build the smallest complete path:** main guide, clarification/planning plus plan review, local checkpoint/resume, native task use, branch-purpose checks and sequential implementation/verification. Include safe permission handling and ADR recording from the start.
3. **Add bounded delegation and fresh review:** worker packets, dependency/file ownership checks, task result reconciliation and interruption recovery.
4. **Replace old packaging together:** update skills, README, workflow documentation, skill groupings and plugin metadata in one coherent migration. Preserve the original review and legacy user-authored project documents; do not delete existing target-repo issues or guidance. Mark old entry points as superseded or explicitly migrate them so contradictory instructions are not installed together.
5. **Add product care and next-update routing:** cleanup, security/risk review, UI/UX review and a bounded next-update flow through agent-reviewed PR delivery, using [the detailed contract](product-quality.md).
6. **Test real tasks:** a new feature, a bug fix, an interrupted session, a changed requirement and one delegated next update. Restore progress in a fresh session; test wrong-branch detection, scoped cleanup, ADR preservation and PR review invalidation after new commits.

Fix the known CRLF-sensitive validator during implementation and add LF/CRLF fixtures. Expand static checks to catch missing references, invalid metadata, contradictory installed entry points and record format errors. Static checks alone are not skill-behavior evaluations.

The redesign is ready to replace the old workflow only after real scenario runs show: planning and plan review precede code, plain-language questions are useful, native tasks are reconstructed without duplicates, changes survive interruption, delegation does not lose scope, branch/PR safeguards work, and completion claims match current evidence. Test varying task/delegation/PR capabilities without advertising unverified compatibility.
