import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, sep } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const repoRoot = fileURLToPath(new URL("../", import.meta.url));

function copyRepository() {
  const destination = mkdtempSync(join(tmpdir(), "skills-validator-"));
  cpSync(repoRoot, destination, {
    recursive: true,
    filter: (source) => !source.includes(`${sep}.git${sep}`) && !source.endsWith(`${sep}.git`),
  });
  return destination;
}

function runValidator(directory, cwd = directory) {
  return spawnSync(process.execPath, [join(directory, "scripts", "validate-skills.mjs")], {
    cwd,
    encoding: "utf8",
  });
}

test("validates the repository regardless of the caller's working directory", () => {
  const result = runValidator(repoRoot, tmpdir());
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Validated \d+ skills/);
});

test("rejects duplicate plugin entries", () => {
  const directory = copyRepository();
  try {
    const pluginPath = join(directory, ".claude-plugin", "plugin.json");
    const plugin = JSON.parse(readFileSync(pluginPath, "utf8"));
    plugin.skills.push("./skills/setup");
    writeFileSync(pluginPath, `${JSON.stringify(plugin, null, 2)}\n`);

    const result = runValidator(directory);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /duplicate skill entries/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("reports malformed link encoding without crashing", () => {
  const directory = copyRepository();
  try {
    const readmePath = join(directory, "README.md");
    writeFileSync(readmePath, `${readFileSync(readmePath, "utf8")}\n[bad](./100%.md)\n`);

    const result = runValidator(directory);
    assert.notEqual(result.status, 0);
    assert.doesNotMatch(result.stderr, /URIError/);
    assert.match(result.stderr, /invalid link encoding/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("rejects missing required record-template fields", () => {
  const directory = copyRepository();
  try {
    const templatesPath = join(directory, "skills", "references", "templates.md");
    const templates = readFileSync(templatesPath, "utf8").replace("Tested content ID:", "Removed field:");
    writeFileSync(templatesPath, templates);

    const result = runValidator(directory);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Tested content ID/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
