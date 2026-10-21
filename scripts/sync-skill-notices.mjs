import { fileURLToPath } from "node:url";
import { syncNotices } from "./lib/notices.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const checkOnly = process.argv.includes("--check");
const result = syncNotices({ root, checkOnly });

if (result.problems.length > 0) {
  console.error("Installed license notices are out of date:\n");
  for (const problem of result.problems) console.error(`- ${problem}`);
  if (checkOnly) console.error("\nRun `npm run sync:notices`.");
  process.exit(1);
}

if (checkOnly) {
  console.log(`Verified ${result.skillCount} installed license notices.`);
} else {
  console.log(`Synced ${result.synced} license notice(s) across ${result.skillCount} skills.`);
}
