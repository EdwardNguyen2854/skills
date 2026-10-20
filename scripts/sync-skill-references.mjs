import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { skillDirs } from "./lib/skill-metadata.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const sourceDir = join(root, "skills", "references");
const checkOnly = process.argv.includes("--check");
const problems = [];

if (!existsSync(sourceDir)) {
  console.error("skills/references does not exist");
  process.exit(1);
}

const sourceFiles = readdirSync(sourceDir)
  .filter((fileName) => fileName.endsWith(".md"))
  .sort();
if (sourceFiles.length === 0) {
  console.error("skills/references contains no Markdown files");
  process.exit(1);
}

const skillNames = skillDirs(readdirSync(join(root, "skills"), { withFileTypes: true }));
let synced = 0;

for (const skillName of skillNames) {
  const targetDir = join(root, "skills", skillName, "references");
  const existingFiles = existsSync(targetDir)
    ? readdirSync(targetDir).filter((fileName) => fileName.endsWith(".md"))
    : [];

  for (const fileName of sourceFiles) {
    const sourcePath = join(sourceDir, fileName);
    const targetPath = join(targetDir, fileName);
    const expected = readFileSync(sourcePath);
    const actual = existsSync(targetPath) ? readFileSync(targetPath) : null;

    if (actual && actual.equals(expected)) continue;

    if (checkOnly) {
      problems.push(`skills/${skillName}/references/${fileName}: missing or out of date`);
      continue;
    }

    mkdirSync(targetDir, { recursive: true });
    writeFileSync(targetPath, expected);
    synced += 1;
  }

  for (const fileName of existingFiles) {
    if (sourceFiles.includes(fileName)) continue;
    const obsoletePath = join(targetDir, fileName);
    if (checkOnly) {
      problems.push(`skills/${skillName}/references/${fileName}: obsolete generated copy`);
      continue;
    }
    rmSync(obsoletePath, { force: true });
    synced += 1;
  }
}

if (problems.length > 0) {
  console.error("Skill reference copies are out of date:\n");
  for (const problem of problems) console.error(`- ${problem}`);
  console.error("\nRun `npm run sync:references`.");
  process.exit(1);
}

if (checkOnly) {
  console.log(`Verified ${skillNames.length} installed skill reference sets.`);
} else {
  console.log(`Synced ${synced} reference change(s) across ${skillNames.length} skills.`);
}
