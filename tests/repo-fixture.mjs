import { randomUUID } from "node:crypto";
import { cpSync, existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

export const repoRoot = fileURLToPath(new URL("../", import.meta.url));
const FIXTURE_MARKER = ".skills-fixture-owner";

// Copy only repository data used by checks. Never copy ignored secrets, .git,
// node_modules, globally installed skills or unrelated user files.
const REPOSITORY_DATA = [
  "skills",
  "docs",
  "legacy",
  ".claude-plugin",
  "skills.sh.json",
  "README.md",
  "WORKFLOW.md",
  "AGENTS.md",
  "LICENSE",
  "package.json",
];

export function testTempRoot() {
  return process.env.SKILLS_TEST_TMP || tmpdir();
}

export function copyRepositoryData() {
  const destination = mkdtempSync(join(testTempRoot(), "skills-fixture-"));
  for (const entry of REPOSITORY_DATA) {
    const source = join(repoRoot, entry);
    if (existsSync(source)) cpSync(source, join(destination, entry), { recursive: true });
  }
  writeFileSync(join(destination, FIXTURE_MARKER), randomUUID());
  return destination;
}

export const copyRepository = copyRepositoryData;

export function runScript(directory, script, args = [], cwd = directory) {
  return spawnSync(process.execPath, [join(directory, "scripts", script), ...args], {
    cwd,
    encoding: "utf8",
  });
}

export function removeDirectory(directory) {
  if (!existsSync(join(directory, FIXTURE_MARKER))) {
    throw new Error(`refusing to remove unowned fixture: ${directory}`);
  }
  rmSync(directory, { recursive: true, force: true });
}
