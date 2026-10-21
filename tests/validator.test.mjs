import assert from "node:assert/strict";
import { copyFileSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { test } from "node:test";
import { validateRepository } from "../scripts/lib/repository-checks.mjs";
import { copyRepositoryData, removeDirectory, repoRoot, runScript } from "./repo-fixture.mjs";

function hasError(result, pattern) {
  return result.errors.some((error) => pattern.test(error));
}

function withFixture(callback) {
  const directory = copyRepositoryData();
  try {
    callback(directory);
  } finally {
    removeDirectory(directory);
  }
}

test("validates the repository regardless of the caller's working directory", () => {
  const result = runScript(repoRoot, "validate-skills.mjs", [], tmpdir());
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Validated \d+ skills/);
});

test("accepts the current repository data", () => {
  const result = validateRepository(repoRoot);
  assert.deepEqual(result.errors, []);
  assert.equal(result.skillNames.length, 14);
});

test("rejects duplicate plugin entries", () => {
  withFixture((directory) => {
    const pluginPath = join(directory, ".claude-plugin", "plugin.json");
    const plugin = JSON.parse(readFileSync(pluginPath, "utf8"));
    plugin.skills.push("./skills/setup");
    writeFileSync(pluginPath, `${JSON.stringify(plugin, null, 2)}\n`);

    const result = validateRepository(directory);
    assert.equal(hasError(result, /duplicate skill entries/), true);
  });
});

test("reports malformed link encoding without crashing", () => {
  withFixture((directory) => {
    const readmePath = join(directory, "README.md");
    writeFileSync(readmePath, `${readFileSync(readmePath, "utf8")}\n[bad](./100%.md)\n`);

    const result = validateRepository(directory);
    assert.equal(hasError(result, /invalid link encoding/), true);
    assert.equal(hasError(result, /URIError/), false);
  });
});

test("rejects missing required record-template fields", () => {
  withFixture((directory) => {
    const templatesPath = join(directory, "skills", "references", "templates.md");
    const templates = readFileSync(templatesPath, "utf8").replace("Tested content ID:", "Removed field:");
    writeFileSync(templatesPath, templates);

    const result = validateRepository(directory);
    assert.equal(hasError(result, /Tested content ID/), true);
  });
});

test("rejects skill links that escape the installed skill directory", () => {
  withFixture((directory) => {
    const skillPath = join(directory, "skills", "create", "SKILL.md");
    const skill = readFileSync(skillPath, "utf8").replace("references/contract.md", "../references/contract.md");
    writeFileSync(skillPath, skill);

    const result = validateRepository(directory);
    assert.equal(hasError(result, /escapes the .* directory/), true);
  });
});

test("rejects reference links that escape the installed references directory", () => {
  withFixture((directory) => {
    const contractPath = join(directory, "skills", "references", "contract.md");
    writeFileSync(contractPath, `${readFileSync(contractPath, "utf8")}\n[escape](../../README.md)\n`);

    const result = validateRepository(directory);
    assert.equal(hasError(result, /escapes the .* directory/), true);
  });
});

test("E01 rejects duplicate YAML keys", () => {
  withFixture((directory) => {
    const skillPath = join(directory, "skills", "create", "SKILL.md");
    const skill = readFileSync(skillPath, "utf8").replace("name: create", "name: create\nname: other");
    writeFileSync(skillPath, skill);

    const result = validateRepository(directory);
    assert.equal(hasError(result, /unique/i), true);
  });
});

test("E02 rejects an unclosed quoted description", () => {
  withFixture((directory) => {
    const skillPath = join(directory, "skills", "create", "SKILL.md");
    const skill = readFileSync(skillPath, "utf8").replace(/^description: .*$/m, 'description: "unclosed');
    writeFileSync(skillPath, skill);

    const result = validateRepository(directory);
    assert.equal(hasError(result, /invalid YAML frontmatter/), true);
  });
});

test("E03 rejects a missing same-file heading anchor", () => {
  withFixture((directory) => {
    const readmePath = join(directory, "README.md");
    writeFileSync(readmePath, `${readFileSync(readmePath, "utf8")}\n[bad](#not-a-real-anchor)\n`);

    const result = validateRepository(directory);
    assert.equal(hasError(result, /missing anchor/), true);
  });
});

test("E04 rejects a missing reference-style destination", () => {
  withFixture((directory) => {
    const readmePath = join(directory, "README.md");
    writeFileSync(
      readmePath,
      `${readFileSync(readmePath, "utf8")}\n[ref][x]\n\n[x]: ./does-not-exist.md\n`,
    );

    const result = validateRepository(directory);
    assert.equal(hasError(result, /broken link/), true);
  });
});

test("E05 rejects null or wrongly shaped grouping entries", () => {
  withFixture((directory) => {
    const groupingPath = join(directory, "skills.sh.json");
    const grouping = JSON.parse(readFileSync(groupingPath, "utf8"));
    grouping.groupings.push(null);
    writeFileSync(groupingPath, `${JSON.stringify(grouping, null, 2)}\n`);

    const result = validateRepository(directory);
    assert.equal(hasError(result, /groupings\[\d+\] must be an object/), true);
  });
});

test("E06 rejects a non-string plugin entry before path operations", () => {
  withFixture((directory) => {
    const pluginPath = join(directory, ".claude-plugin", "plugin.json");
    const plugin = JSON.parse(readFileSync(pluginPath, "utf8"));
    plugin.skills.push(42);
    writeFileSync(pluginPath, `${JSON.stringify(plugin, null, 2)}\n`);

    const result = validateRepository(directory);
    assert.equal(hasError(result, /must be a string/), true);
  });
});

test("rejects a linked documentation path", () => {
  withFixture((directory) => {
    const external = join(directory, "external-docs");
    mkdirSync(external);
    writeFileSync(join(external, "README.md"), "# External\n");
    rmSync(join(directory, "docs", "examples"), { recursive: true, force: true });
    symlinkSync(external, join(directory, "docs", "examples"), process.platform === "win32" ? "junction" : "dir");

    const result = validateRepository(directory);
    assert.equal(hasError(result, /linked path|symbolic link or junction/), true);
  });
});

test("rejects a symlinked skill directory", () => {
  withFixture((directory) => {
    const external = join(directory, "external-skill");
    mkdirSync(external);
    copyFileSync(join(directory, "skills", "create", "SKILL.md"), join(external, "SKILL.md"));
    rmSync(join(directory, "skills", "create"), { recursive: true, force: true });
    symlinkSync(external, join(directory, "skills", "create"), process.platform === "win32" ? "junction" : "dir");

    const result = validateRepository(directory);
    assert.equal(hasError(result, /symbolic link or junction/), true);
  });
});
