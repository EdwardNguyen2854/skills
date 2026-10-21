import assert from "node:assert/strict";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { syncReferences } from "../scripts/lib/reference-sync.mjs";
import {
  copyRepositoryData,
  removeDirectory,
  repoRoot,
  testTempRoot,
} from "./repo-fixture.mjs";

function withFixture(callback) {
  const directory = copyRepositoryData();
  try {
    callback(directory);
  } finally {
    removeDirectory(directory);
  }
}

function hasProblem(result, pattern) {
  return result.problems.some((problem) => pattern.test(problem));
}

test("committed installed reference copies are current", () => {
  const result = syncReferences({ root: repoRoot, checkOnly: true });
  assert.deepEqual(result.problems, []);
  assert.equal(result.skillCount, 14);
});

test("rejects a symlinked or junction repository root before inventory or mutation", () => {
  withFixture((directory) => {
    const linkedRoot = `${directory}-link`;
    symlinkSync(directory, linkedRoot, process.platform === "win32" ? "junction" : "dir");
    try {
      const result = syncReferences({ root: linkedRoot });
      assert.equal(hasProblem(result, /repository root must not be a symbolic link or junction/), true);
      assert.equal(result.synced, 0);
    } finally {
      rmSync(linkedRoot, { recursive: true, force: true });
    }
  });
});

test("detects a missing installed reference copy and repairs it", () => {
  withFixture((directory) => {
    const copiedReference = join(directory, "skills", "create", "references", "contract.md");
    rmSync(copiedReference);

    const stale = syncReferences({ root: directory, checkOnly: true });
    assert.equal(hasProblem(stale, /skills\/create\/references\/contract\.md/), true);

    const synced = syncReferences({ root: directory });
    assert.deepEqual(synced.problems, []);
    assert.equal(
      readFileSync(copiedReference).equals(readFileSync(join(directory, "skills", "references", "contract.md"))),
      true,
    );

    const checked = syncReferences({ root: directory, checkOnly: true });
    assert.deepEqual(checked.problems, []);
  });
});

test("detects stale contents and restores them", () => {
  withFixture((directory) => {
    const copiedReference = join(directory, "skills", "create", "references", "contract.md");
    writeFileSync(copiedReference, "stale content");

    const stale = syncReferences({ root: directory, checkOnly: true });
    assert.equal(hasProblem(stale, /out of date/), true);

    const synced = syncReferences({ root: directory });
    assert.deepEqual(synced.problems, []);
    assert.equal(
      readFileSync(copiedReference, "utf8"),
      readFileSync(join(directory, "skills", "references", "contract.md"), "utf8"),
    );
  });
});

test("syncs new source files and removes obsolete generated copies", () => {
  withFixture((directory) => {
    const sourceExtra = join(directory, "skills", "references", "extra.md");
    const generatedExtra = join(directory, "skills", "create", "references", "extra.md");
    const obsolete = join(directory, "skills", "create", "references", "removed.md");
    writeFileSync(sourceExtra, "# Extra\n");
    writeFileSync(obsolete, "# Removed\n");

    const stale = syncReferences({ root: directory, checkOnly: true });
    assert.equal(hasProblem(stale, /extra\.md: missing or out of date/), true);
    assert.equal(hasProblem(stale, /removed\.md: obsolete generated copy/), true);

    const synced = syncReferences({ root: directory });
    assert.deepEqual(synced.problems, []);
    assert.equal(readFileSync(generatedExtra, "utf8"), "# Extra\n");
    assert.equal(existsSync(obsolete), false);

    const checked = syncReferences({ root: directory, checkOnly: true });
    assert.deepEqual(checked.problems, []);
  });
});

test("E07 detects an unexpected nested directory without recursively deleting it", () => {
  withFixture((directory) => {
    const nested = join(directory, "skills", "create", "references", "nested");
    mkdirSync(nested);

    const checked = syncReferences({ root: directory, checkOnly: true });
    assert.equal(hasProblem(checked, /unexpected nested directory/), true);

    const applied = syncReferences({ root: directory });
    assert.equal(hasProblem(applied, /unexpected nested directory/), true);
    assert.equal(existsSync(nested), true);
  });
});

test("E08 detects an unexpected non-Markdown file without deleting it", () => {
  withFixture((directory) => {
    const notes = join(directory, "skills", "create", "references", "notes.txt");
    writeFileSync(notes, "user material");

    const checked = syncReferences({ root: directory, checkOnly: true });
    assert.equal(hasProblem(checked, /unexpected non-Markdown file/), true);

    const applied = syncReferences({ root: directory });
    assert.equal(hasProblem(applied, /unexpected non-Markdown file/), true);
    assert.equal(readFileSync(notes, "utf8"), "user material");
  });
});

test("E09 refuses a target junction before reading or writing external content", () => {
  withFixture((directory) => {
    const base = mkdtempSync(join(testTempRoot(), "sync-junction-"));
    try {
      const external = join(base, "external");
      mkdirSync(external);
      const sentinel = join(external, "contract.md");
      writeFileSync(sentinel, "EXTERNAL SENTINEL");

      const target = join(directory, "skills", "create", "references");
      rmSync(target, { recursive: true, force: true });
      symlinkSync(external, target, process.platform === "win32" ? "junction" : "dir");

      const reads = [];
      const result = syncReferences({
        root: directory,
        readFile: (path) => {
          reads.push(path);
          return readFileSync(path);
        },
      });

      assert.equal(hasProblem(result, /symbolic link or junction/), true);
      assert.equal(readFileSync(sentinel, "utf8"), "EXTERNAL SENTINEL");
      assert.equal(reads.some((path) => path.includes("external")), false);
      assert.equal(existsSync(join(external, "extra.md")), false);
    } finally {
      rmSync(base, { recursive: true, force: true });
    }
  });
});

test("E09 refuses a linked shared-reference source before reading its content", () => {
  withFixture((directory) => {
    const base = mkdtempSync(join(testTempRoot(), "sync-source-"));
    try {
      const external = join(base, "external");
      mkdirSync(external);
      writeFileSync(join(external, "contract.md"), "EXTERNAL SOURCE");

      const source = join(directory, "skills", "references");
      rmSync(source, { recursive: true, force: true });
      symlinkSync(external, source, process.platform === "win32" ? "junction" : "dir");

      const reads = [];
      const result = syncReferences({
        root: directory,
        readFile: (path) => {
          reads.push(path);
          return readFileSync(path);
        },
      });

      assert.equal(hasProblem(result, /symbolic link or junction/), true);
      assert.equal(reads.some((path) => path.includes("external")), false);
    } finally {
      rmSync(base, { recursive: true, force: true });
    }
  });
});

test("check mode changes no bytes", () => {
  withFixture((directory) => {
    const reference = join(directory, "skills", "create", "references", "contract.md");
    writeFileSync(reference, "stale content");
    const before = readFileSync(reference);

    const result = syncReferences({ root: directory, checkOnly: true });
    assert.notEqual(result.problems.length, 0);
    assert.equal(readFileSync(reference).equals(before), true);
  });
});
