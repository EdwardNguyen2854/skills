import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { test } from "node:test";
import { copyRepository, removeDirectory, repoRoot, runScript } from "./repo-fixture.mjs";

function runValidator(directory, cwd = directory) {
  return runScript(directory, "validate-skills.mjs", [], cwd);
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
    removeDirectory(directory);
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
    removeDirectory(directory);
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
    removeDirectory(directory);
  }
});

test("rejects skill links that escape the installed skill directory", () => {
  const directory = copyRepository();
  try {
    const skillPath = join(directory, "skills", "create", "SKILL.md");
    const skill = readFileSync(skillPath, "utf8").replace("references/contract.md", "../references/contract.md");
    writeFileSync(skillPath, skill);

    const result = runValidator(directory);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /escapes the installed skill directory/);
  } finally {
    removeDirectory(directory);
  }
});

test("rejects reference links that escape the installed references directory", () => {
  const directory = copyRepository();
  try {
    const contractPath = join(directory, "skills", "references", "contract.md");
    writeFileSync(contractPath, `${readFileSync(contractPath, "utf8")}\n[escape](../../README.md)\n`);

    const result = runValidator(directory);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /escapes the installed reference directory/);
  } finally {
    removeDirectory(directory);
  }
});
