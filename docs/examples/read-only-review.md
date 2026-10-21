# Example: a read-only review

**Request:** "Review this change for security problems. Don't change anything."

The agent reviews the actual diff from a stable base and reports findings. It does not edit code, add tests, install scanners, probe production, or upload source.

## Report shape

| Finding | Severity | Confidence | Disposition |
|---|---|---|---|
| Uploaded filenames are joined to the storage root without normalizing `..` | High | Confirmed by reading the handler and a local reproduction | Open; blocks readiness |
| Error responses include the internal storage path | Medium | Confirmed | Open; fix or accept residual risk explicitly |
| Dependency scanner was unavailable | — | — | Missing check; do not claim dependency safety |

The review states the reviewed base and head, the exact affected revision, and that no files were changed.

## Verdict

> **Blocked.** The path traversal is a confirmed high-impact issue. The internal-path disclosure is medium and needs a decision. I did not run a dependency scanner, so I am not claiming dependency safety. This review grants no upload, merge, or release permission.

If the owner then asks for a fix, that is a new implementation request and needs its own plan/approval. The review's findings can seed that plan.
