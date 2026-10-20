import { cpSync, mkdtempSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, sep } from "node:path";
import { fileURLToPath } from "node:url";

export const repoRoot = fileURLToPath(new URL("../", import.meta.url));

export function copyRepository() {
  const destination = mkdtempSync(join(tmpdir(), "skills-fixture-"));
  cpSync(repoRoot, destination, {
    recursive: true,
    filter: (source) =>
      !source.includes(`${sep}.git${sep}`) &&
      !source.endsWith(`${sep}.git`) &&
      !source.includes(`${sep}node_modules${sep}`),
  });
  return destination;
}

export function runScript(directory, script, args = [], cwd = directory) {
  return spawnSync(process.execPath, [join(directory, "scripts", script), ...args], {
    cwd,
    encoding: "utf8",
  });
}

export function removeDirectory(directory) {
  rmSync(directory, { recursive: true, force: true });
}
