import { fileURLToPath } from "node:url";
import { validateRepository } from "./lib/repository-checks.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const { errors, skillNames } = validateRepository(root);

if (errors.length > 0) {
  console.error("Skill validation failed:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Validated ${skillNames.length} skills and repository metadata.`);
}
