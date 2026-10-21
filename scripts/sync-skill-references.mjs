import { fileURLToPath } from "node:url";
import { syncReferences } from "./lib/reference-sync.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const checkOnly = process.argv.includes("--check");
const result = syncReferences({ root, checkOnly });

if (result.problems.length > 0) {
  console.error("Skill reference copies are out of date:\n");
  for (const problem of result.problems) console.error(`- ${problem}`);
  if (checkOnly) console.error("\nRun `npm run sync:references`.");
  process.exit(1);
}

if (checkOnly) {
  console.log(`Verified ${result.skillCount} installed skill reference sets.`);
} else {
  console.log(`Synced ${result.synced} reference change(s) across ${result.skillCount} skills.`);
}
