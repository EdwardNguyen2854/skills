import assert from "node:assert/strict";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { copyRepository, removeDirectory, repoRoot, runScript } from "./repo-fixture.mjs";

test("committed installed reference copies are current", () => {
  const result = runScript(repoRoot, "sync-skill-references.mjs", ["--check"]);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Verified \d+ installed skill reference sets/);
});

test("detects a missing installed reference copy and repairs it", () => {
  const directory = copyRepository();
  try {
    const copiedReference = join(directory, "skills", "create", "references", "contract.md");
    rmSync(copiedReference);

    const stale = runScript(directory, "sync-skill-references.mjs", ["--check"]);
    assert.notEqual(stale.status, 0);
    assert.match(stale.stderr, /skills\/create\/references\/contract\.md/);

    const synced = runScript(directory, "sync-skill-references.mjs");
    assert.equal(synced.status, 0, synced.stderr);

    const source = readFileSync(join(directory, "skills", "references", "contract.md"));
    const repaired = readFileSync(copiedReference);
    assert.equal(source.equals(repaired), true);

    const checked = runScript(directory, "sync-skill-references.mjs", ["--check"]);
    assert.equal(checked.status, 0, checked.stderr);
  } finally {
    removeDirectory(directory);
  }
});

test("detects stale contents and restores them", () => {
  const directory = copyRepository();
  try {
    const copiedReference = join(directory, "skills", "create", "references", "contract.md");
    writeFileSync(copiedReference, "stale content");

    const stale = runScript(directory, "sync-skill-references.mjs", ["--check"]);
    assert.notEqual(stale.status, 0);
    assert.match(stale.stderr, /out of date/);

    const synced = runScript(directory, "sync-skill-references.mjs");
    assert.equal(synced.status, 0, synced.stderr);
    assert.equal(
      readFileSync(copiedReference, "utf8"),
      readFileSync(join(directory, "skills", "references", "contract.md"), "utf8"),
    );
  } finally {
    removeDirectory(directory);
  }
});

test("syncs new source files and removes obsolete generated copies", () => {
  const directory = copyRepository();
  try {
    const sourceExtra = join(directory, "skills", "references", "extra.md");
    const generatedExtra = join(directory, "skills", "create", "references", "extra.md");
    const obsolete = join(directory, "skills", "create", "references", "removed.md");
    writeFileSync(sourceExtra, "# Extra\n");
    writeFileSync(obsolete, "# Removed\n");

    const stale = runScript(directory, "sync-skill-references.mjs", ["--check"]);
    assert.notEqual(stale.status, 0);
    assert.match(stale.stderr, /extra\.md: missing or out of date/);
    assert.match(stale.stderr, /removed\.md: obsolete generated copy/);

    const synced = runScript(directory, "sync-skill-references.mjs");
    assert.equal(synced.status, 0, synced.stderr);
    assert.equal(readFileSync(generatedExtra, "utf8"), "# Extra\n");
    assert.equal(existsSync(obsolete), false);

    const checked = runScript(directory, "sync-skill-references.mjs", ["--check"]);
    assert.equal(checked.status, 0, checked.stderr);
  } finally {
    removeDirectory(directory);
  }
});
