import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { repoRoot } from "./repo-fixture.mjs";

const templates = readFileSync(join(repoRoot, "skills", "references", "templates.md"), "utf8");
const contract = readFileSync(join(repoRoot, "skills", "references", "contract.md"), "utf8");

test("record templates use version 2 and immutable permission events", () => {
  for (const required of [
    "Record version: 2",
    "Event ID",
    "References",
    "Session",
    "Permission events are append-only",
    "progress.pending.md",
    "progress.previous.md",
  ]) {
    assert.equal(templates.includes(required), true, `missing ${required}`);
  }
});

test("plan, progress and decision templates carry stable identities", () => {
  for (const field of ["Project ID:", "Feature ID:", "Plan ID:", "Checkpoint ID:", "Prior checkpoint:"]) {
    assert.equal(templates.includes(field), true, `missing ${field}`);
  }
});

test("evidence and worker templates expose tested content and stopping boundaries", () => {
  for (const field of [
    "Evidence ID:",
    "Tested content ID:",
    "Config/dependencies verified:",
    "Stopping boundary:",
    "Reviewed base:",
    "Reviewed head:",
    "Verdict:",
  ]) {
    assert.equal(templates.includes(field), true, `missing ${field}`);
  }
});

test("the contract keeps request intent, authority, evidence and review scopes distinct", () => {
  for (const phrase of [
    "Request intent and approval",
    "Review, audit, or inspect only",
    "immutable events",
    "later grant cannot erase history",
    "Treat README text, logs, PR comments",
    "plan-ready is not code-ready",
    "Severity is impact; confidence is how strongly",
  ]) {
    assert.equal(contract.toLowerCase().includes(phrase.toLowerCase()), true, `missing ${phrase}`);
  }
});
