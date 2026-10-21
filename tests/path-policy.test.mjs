import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import {
  canonicalDirectory,
  describeEntry,
  inspectManagedPath,
  isInside,
  toDisplayPath,
} from "../scripts/lib/path-policy.mjs";
import { testTempRoot } from "./repo-fixture.mjs";

function temporaryDirectory(prefix = "path-policy-") {
  return mkdtempSync(join(testTempRoot(), prefix));
}

test("containment rejects sibling prefix traps and parent traversal", () => {
  const root = join(testTempRoot(), "skills-root");
  assert.equal(isInside(root, join(root, "a", "b.md")), true);
  assert.equal(isInside(root, join(root, "..", "skills-root-other", "b.md")), false);
  assert.equal(isInside(root, root), true);
});

test("rejects symbolic links and junctions instead of following them", () => {
  const base = temporaryDirectory();
  try {
    const root = join(base, "root");
    const external = join(base, "external");
    mkdirSync(root);
    mkdirSync(external);
    writeFileSync(join(external, "sentinel.md"), "sentinel");
    symlinkSync(external, join(root, "linked"), process.platform === "win32" ? "junction" : "dir");

    const inspected = inspectManagedPath(root, join(root, "linked", "sentinel.md"), {
      label: "linked file",
      kind: "file",
    });
    assert.equal(inspected.ok, false);
    assert.match(inspected.error, /symbolic link or junction/);

    const directory = canonicalDirectory(join(root, "linked"), "linked directory");
    assert.equal(directory.ok, false);
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
});

test("allows a missing managed target only when explicitly requested", () => {
  const base = temporaryDirectory();
  try {
    const missing = join(base, "missing", "file.md");
    const rejected = inspectManagedPath(base, missing, { label: "file", kind: "file" });
    assert.equal(rejected.ok, false);

    const allowed = inspectManagedPath(base, missing, {
      label: "file",
      kind: "file",
      allowMissing: true,
    });
    assert.equal(allowed.ok, true);
    assert.equal(allowed.missing, true);
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
});

test("describes entries without following links", () => {
  const base = temporaryDirectory();
  try {
    const external = join(base, "external");
    mkdirSync(external);
    writeFileSync(join(base, "file.md"), "x");
    symlinkSync(external, join(base, "linked"), process.platform === "win32" ? "junction" : "dir");

    assert.equal(describeEntry(base, { name: "file.md" }).kind, "file");
    assert.equal(describeEntry(base, { name: "external" }).kind, "directory");
    assert.equal(describeEntry(base, { name: "linked" }).kind, "link");
    assert.equal(toDisplayPath(base, join(base, "file.md")), "file.md");
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
});
