import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { canonicalDirectory, describeEntry, inspectManagedPath, toDisplayPath } from "./path-policy.mjs";

/**
 * Plan bounded reference synchronization. All checks and inventory happen
 * before any mutation. The function accepts injected file operations so tests
 * can observe reads and mutations without a public arbitrary-root CLI.
 */
export function syncReferences({
  root,
  checkOnly = false,
  readFile = readFileSync,
  writeFile = writeFileSync,
  renameFile = renameSync,
  mkdirDirectory = mkdirSync,
  removeFile = rmSync,
} = {}) {
  const problems = [];
  const operations = [];
  const rootCheck = canonicalDirectory(root, "repository root");
  if (!rootCheck.ok) return { problems: [rootCheck.error], operations, skillCount: 0, synced: 0 };
  root = rootCheck.path;

  const sourceDir = join(root, "skills", "references");
  const skillsRoot = join(root, "skills");

  if (!existsSync(skillsRoot)) {
    return { problems: ["skills/ does not exist"], operations, skillCount: 0, synced: 0 };
  }

  if (!existsSync(sourceDir)) {
    return { problems: ["skills/references does not exist"], operations, skillCount: 0, synced: 0 };
  }

  const sourceCheck = inspectManagedPath(root, sourceDir, {
    label: "shared reference directory",
    kind: "directory",
  });
  if (!sourceCheck.ok) return { problems: [sourceCheck.error], operations, skillCount: 0, synced: 0 };

  const sourceEntries = readdirSync(sourceDir, { withFileTypes: true });
  const sourceFiles = [];
  for (const entry of sourceEntries) {
    const described = describeEntry(sourceDir, entry);
    if (described.kind === "link") {
      problems.push(`${toDisplayPath(root, described.absolute)}: shared reference must not be a symbolic link or junction`);
    } else if (described.kind !== "file") {
      problems.push(`${toDisplayPath(root, described.absolute)}: unsupported shared reference entry (${described.kind})`);
    } else if (!entry.name.endsWith(".md")) {
      problems.push(`${toDisplayPath(root, described.absolute)}: shared reference must be a Markdown file`);
    } else {
      sourceFiles.push(entry.name);
    }
  }
  sourceFiles.sort();

  if (sourceFiles.length === 0) {
    problems.push("skills/references contains no Markdown files");
  }

  const skillNames = [];
  const skillsEntries = readdirSync(skillsRoot, { withFileTypes: true });
  for (const entry of skillsEntries) {
    const described = describeEntry(skillsRoot, entry);
    if (entry.name === "references") {
      if (described.kind !== "directory") {
        problems.push(`skills/references: must be an ordinary directory`);
      }
      continue;
    }
    if (described.kind === "link") {
      problems.push(`${toDisplayPath(root, described.absolute)}: skill directory must not be a symbolic link or junction`);
      continue;
    }
    if (described.kind !== "directory") {
      problems.push(`${toDisplayPath(root, described.absolute)}: unexpected entry in skills/`);
      continue;
    }
    if (entry.name.startsWith(".")) {
      problems.push(`${toDisplayPath(root, described.absolute)}: hidden skill directory is not supported`);
      continue;
    }
    skillNames.push(entry.name);
  }
  skillNames.sort();

  for (const skillName of skillNames) {
    const targetDir = join(skillsRoot, skillName, "references");
    const skillDirCheck = inspectManagedPath(root, join(skillsRoot, skillName), {
      label: `skills/${skillName}`,
      kind: "directory",
    });
    if (!skillDirCheck.ok) {
      problems.push(skillDirCheck.error);
      continue;
    }

    const targetExists = existsSync(targetDir);
    let existingFiles = [];

    if (targetExists) {
      const targetCheck = inspectManagedPath(root, targetDir, {
        label: `skills/${skillName}/references`,
        kind: "directory",
      });
      if (!targetCheck.ok) {
        problems.push(targetCheck.error);
        continue;
      }

      for (const entry of readdirSync(targetDir, { withFileTypes: true })) {
        const described = describeEntry(targetDir, entry);
        const display = toDisplayPath(root, described.absolute);
        if (described.kind === "link") {
          problems.push(`${display}: installed reference must not be a symbolic link or junction`);
        } else if (described.kind === "directory") {
          problems.push(`${display}: unexpected nested directory in generated references`);
        } else if (described.kind !== "file") {
          problems.push(`${display}: unsupported installed reference entry (${described.kind})`);
        } else if (!entry.name.endsWith(".md")) {
          problems.push(`${display}: unexpected non-Markdown file in generated references`);
        } else {
          existingFiles.push(entry.name);
        }
      }
    }

    for (const fileName of sourceFiles) {
      const sourcePath = join(sourceDir, fileName);
      const sourceFileCheck = inspectManagedPath(root, sourcePath, {
        label: `skills/references/${fileName}`,
        kind: "file",
      });
      if (!sourceFileCheck.ok) {
        problems.push(sourceFileCheck.error);
        continue;
      }

      const targetPath = join(targetDir, fileName);
      const targetDisplay = toDisplayPath(root, targetPath);
      let targetBytes = null;

      if (existsSync(targetPath)) {
        const targetFileCheck = inspectManagedPath(root, targetPath, {
          label: targetDisplay,
          kind: "file",
        });
        if (!targetFileCheck.ok) {
          problems.push(targetFileCheck.error);
          continue;
        }
        targetBytes = readFile(targetPath);
      }

      const sourceBytes = readFile(sourcePath);
      if (targetBytes && Buffer.from(targetBytes).equals(Buffer.from(sourceBytes))) continue;

      if (checkOnly) {
        problems.push(`${targetDisplay}: missing or out of date`);
      } else {
        operations.push({
          kind: "write",
          display: targetDisplay,
          sourcePath,
          targetPath,
          targetDir,
          bytes: sourceBytes,
          needsDirectory: !targetExists,
        });
      }
    }

    for (const fileName of existingFiles) {
      if (sourceFiles.includes(fileName)) continue;
      const obsoletePath = join(targetDir, fileName);
      const display = toDisplayPath(root, obsoletePath);
      if (checkOnly) {
        problems.push(`${display}: obsolete generated copy`);
      } else {
        operations.push({ kind: "remove", display, targetPath: obsoletePath });
      }
    }
  }

  if (problems.length > 0 || checkOnly) {
    return { problems, operations, skillCount: skillNames.length, synced: 0 };
  }

  let synced = 0;
  for (const operation of operations) {
    if (operation.kind === "write") {
      if (operation.needsDirectory) {
        const directoryCheck = inspectManagedPath(root, operation.targetDir, {
          label: operation.display,
          kind: "directory",
          allowMissing: true,
        });
        if (!directoryCheck.ok) {
          problems.push(directoryCheck.error);
          break;
        }
        (mkdirDirectory ?? mkdirSync)(operation.targetDir, { recursive: true });
      }

      const recheck = inspectManagedPath(root, operation.targetPath, {
        label: operation.display,
        kind: "file",
        allowMissing: true,
      });
      if (!recheck.ok) {
        problems.push(recheck.error);
        break;
      }

      const temporaryPath = `${operation.targetPath}.tmp-${process.pid}`;
      try {
        (writeFile ?? writeFileSync)(temporaryPath, operation.bytes);
        const temporaryCheck = inspectManagedPath(root, temporaryPath, {
          label: `${operation.display} temporary file`,
          kind: "file",
        });
        if (!temporaryCheck.ok) {
          problems.push(temporaryCheck.error);
          (removeFile ?? rmSync)(temporaryPath);
          break;
        }
        (renameFile ?? renameSync)(temporaryPath, operation.targetPath);
        synced += 1;
      } catch (error) {
        try {
          (removeFile ?? rmSync)(temporaryPath);
        } catch {
          // Best-effort cleanup; the original diagnostic is more useful.
        }
        problems.push(`${operation.display}: write failed (${error.code ?? error.message})`);
        break;
      }
    } else if (operation.kind === "remove") {
      const recheck = inspectManagedPath(root, operation.targetPath, {
        label: operation.display,
        kind: "file",
      });
      if (!recheck.ok) {
        problems.push(recheck.error);
        break;
      }
      try {
        (removeFile ?? rmSync)(operation.targetPath);
        synced += 1;
      } catch (error) {
        problems.push(`${operation.display}: removal failed (${error.code ?? error.message})`);
        break;
      }
    }
  }

  return { problems, operations, skillCount: skillNames.length, synced };
}
