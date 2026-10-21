import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { parseFrontmatter } from "../scripts/lib/frontmatter.mjs";
import { canonicalDirectory } from "../scripts/lib/path-policy.mjs";
import { repoRoot } from "./repo-fixture.mjs";

function filesUnder(directory, suffix, { followLinks = false, seen = new Set() } = {}) {
  if (!existsSync(directory)) return [];
  const real = realpathSync(directory);
  if (seen.has(real)) return [];
  seen.add(real);
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const absolute = join(directory, entry.name);
    let isDirectory = entry.isDirectory();
    let isFile = entry.isFile();
    if (!isDirectory && !isFile && followLinks && entry.isSymbolicLink()) {
      try {
        const stats = statSync(absolute);
        isDirectory = stats.isDirectory();
        isFile = stats.isFile();
      } catch {
        isDirectory = false;
      }
    }
    if (isDirectory) files.push(...filesUnder(absolute, suffix, { followLinks, seen }));
    else if (isFile && entry.name.endsWith(suffix)) files.push(absolute);
  }
  return files;
}

const skillNames = readdirSync(join(repoRoot, "skills"), { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && entry.name !== "references")
  .map((entry) => entry.name)
  .sort();

test("the recursive source tree exposes no discoverable legacy SKILL.md", () => {
  assert.deepEqual(filesUnder(join(repoRoot, "legacy"), "SKILL.md"), []);
  assert.equal(filesUnder(join(repoRoot, "legacy"), "SKILL.historical.md").length, 11);
});

test("every active skill ships the canonical MIT notice", () => {
  const license = readFileSync(join(repoRoot, "LICENSE"), "utf8");
  assert.equal(skillNames.length, 14);
  for (const name of skillNames) {
    const notice = join(repoRoot, "skills", name, "LICENSE");
    assert.equal(existsSync(notice), true, `${name}: missing LICENSE`);
    assert.equal(readFileSync(notice, "utf8"), license, `${name}: stale LICENSE`);
  }
});

test("every active skill declares one collection identity and contract version", () => {
  for (const name of skillNames) {
    const content = readFileSync(join(repoRoot, "skills", name, "SKILL.md"), "utf8");
    const { fields, error } = parseFrontmatter(content, name);
    assert.equal(error, null, `${name}: ${error}`);
    assert.equal(fields.metadata?.collection, "edwardnguyen2854-skills", name);
    assert.equal(fields.metadata?.["workflow-contract"], "2", name);
  }
});

test("each installed reference set exactly matches the shared Markdown inventory", () => {
  const sourceNames = readdirSync(join(repoRoot, "skills", "references"))
    .filter((name) => name.endsWith(".md"))
    .sort();
  for (const name of skillNames) {
    const installed = readdirSync(join(repoRoot, "skills", name, "references"))
      .filter((entry) => entry.endsWith(".md"))
      .sort();
    assert.deepEqual(installed, sourceNames, name);
  }
});

test("pinned external installer checks run only when explicitly configured", (context) => {
  const command = process.env.SKILLS_INSTALLER_CMD;
  if (!command) {
    context.skip("SKILLS_INSTALLER_CMD is not configured; installer lifecycle remains unverified.");
    return;
  }

  const version = process.env.SKILLS_INSTALLER_VERSION;
  const installedRoot = process.env.SKILLS_INSTALLED_ROOT;
  const mode = process.env.SKILLS_INSTALLER_MODE ?? "copy";
  assert.match(version ?? "", /^\d+\.\d+\.\d+/, "Set SKILLS_INSTALLER_VERSION to the exact pinned installer version.");
  assert.ok(installedRoot, "Set SKILLS_INSTALLED_ROOT to the isolated installed collection root.");
  assert.match(mode, /^(copy|symlink)$/, "SKILLS_INSTALLER_MODE must be copy or symlink.");

  const sentinelPath = process.env.SKILLS_INSTALLER_SENTINEL;
  const sentinelBefore = sentinelPath ? readFileSync(sentinelPath) : null;

  const result = spawnSync(command, {
    shell: true,
    cwd: repoRoot,
    encoding: "utf8",
    env: {
      ...process.env,
      SKILLS_INSTALLER_ISOLATED: "1",
      SKILLS_INSTALLER_VERSION: version,
    },
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);

  const rootCheck = canonicalDirectory(installedRoot, "installed collection root");
  assert.equal(rootCheck.ok, true, rootCheck.error);

  const followLinks = mode === "symlink";
  const installedSkillFiles = filesUnder(rootCheck.path, "SKILL.md", { followLinks });
  const installedNames = installedSkillFiles.map((file) => basename(dirname(file))).sort();
  assert.deepEqual(installedNames, skillNames, "installed collection must contain every active skill exactly once");

  for (const file of installedSkillFiles) {
    const directory = dirname(file);
    const parsed = parseFrontmatter(readFileSync(file, "utf8"), file);
    assert.equal(parsed.error, null, `${file}: ${parsed.error}`);
    assert.equal(parsed.fields.metadata?.collection, "edwardnguyen2854-skills", file);
    assert.equal(parsed.fields.metadata?.["workflow-contract"], "2", file);
    for (const relative of ["references/contract.md", "references/templates.md", "LICENSE"]) {
      assert.equal(existsSync(join(directory, relative)), true, `${file}: missing ${relative}`);
    }
  }

  assert.deepEqual(
    filesUnder(rootCheck.path, "SKILL.historical.md", { followLinks }),
    [],
    "legacy skills must not be installed as discoverable files",
  );
  if (sentinelPath) {
    assert.deepEqual(readFileSync(sentinelPath), sentinelBefore, "installer changed an unrelated sentinel file");
  }
});
