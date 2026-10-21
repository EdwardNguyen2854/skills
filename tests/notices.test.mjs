import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { syncNotices } from "../scripts/lib/notices.mjs";
import { copyRepositoryData, removeDirectory, repoRoot, testTempRoot } from "./repo-fixture.mjs";

test("committed installed license notices are current", () => {
  const result = syncNotices({ root: repoRoot, checkOnly: true });
  assert.deepEqual(result.problems, []);
  assert.equal(result.skillCount, 14);
});

test("detects and repairs a missing installed notice", () => {
  const directory = copyRepositoryData();
  try {
    const notice = join(directory, "skills", "create", "LICENSE");
    rmSync(notice);

    const stale = syncNotices({ root: directory, checkOnly: true });
    assert.match(stale.problems.join("\n"), /skills\/create\/LICENSE/);

    const synced = syncNotices({ root: directory });
    assert.deepEqual(synced.problems, []);
    assert.equal(readFileSync(notice, "utf8"), readFileSync(join(directory, "LICENSE"), "utf8"));

    const checked = syncNotices({ root: directory, checkOnly: true });
    assert.deepEqual(checked.problems, []);
  } finally {
    removeDirectory(directory);
  }
});

test("rejects a linked notice target without touching external content", () => {
  const directory = copyRepositoryData();
  const base = mkdtempSync(join(testTempRoot(), "notice-junction-"));
  try {
    const external = join(base, "external");
    const notice = join(directory, "skills", "create", "LICENSE");
    rmSync(join(directory, "skills", "create"), { recursive: true, force: true });
    mkdirSync(external);
    writeFileSync(join(external, "LICENSE"), "EXTERNAL LICENSE");
    symlinkSync(external, join(directory, "skills", "create"), process.platform === "win32" ? "junction" : "dir");

    const result = syncNotices({ root: directory, checkOnly: true });
    assert.match(result.problems.join("\n"), /symbolic link or junction/);
    assert.equal(readFileSync(join(external, "LICENSE"), "utf8"), "EXTERNAL LICENSE");
    assert.equal(existsSync(notice), true);
  } finally {
    rmSync(base, { recursive: true, force: true });
    removeDirectory(directory);
  }
});
