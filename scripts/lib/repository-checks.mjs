import { existsSync, lstatSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import {
  parseFrontmatter,
  isPlainObject,
  validateSkillFrontmatter,
} from "./frontmatter.mjs";
import { inspectMarkdown, isExternalTarget } from "./markdown-links.mjs";
import {
  canonicalDirectory,
  describeEntry,
  isInside,
  inspectManagedPath,
  toDisplayPath,
} from "./path-policy.mjs";
import { countWords, decodeSafe, splitLinkTarget } from "./skill-metadata.mjs";

const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const PLUGIN_SKILL = /^\.\/skills\/([a-z0-9]+(?:-[a-z0-9]+)*)$/;

export function validateRepository(root) {
  const rootCheck = canonicalDirectory(root, "repository root");
  if (!rootCheck.ok) return { errors: [rootCheck.error], skillNames: [] };

  const repoRoot = rootCheck.path;
  const errors = [];
  const display = (absolute) => toDisplayPath(repoRoot, absolute);

  const skillsRoot = join(repoRoot, "skills");
  if (!existsSync(skillsRoot)) {
    errors.push("skills/ does not exist");
    return { errors, skillNames: [] };
  }

  const skillsDirectoryCheck = inspectManagedPath(repoRoot, skillsRoot, {
    label: "skills/",
    kind: "directory",
  });
  if (!skillsDirectoryCheck.ok) {
    errors.push(skillsDirectoryCheck.error);
    return { errors, skillNames: [] };
  }

  const skillNames = [];
  for (const entry of readdirSync(skillsRoot, { withFileTypes: true })) {
    const described = describeEntry(skillsRoot, entry);
    if (entry.name === "references") {
      if (described.kind !== "directory") errors.push("skills/references: must be an ordinary directory");
      continue;
    }
    if (entry.name.startsWith(".")) {
      errors.push(`${display(described.absolute)}: hidden entries are not supported in skills/`);
      continue;
    }
    if (described.kind === "link") {
      errors.push(`${display(described.absolute)}: skill directory must not be a symbolic link or junction`);
      continue;
    }
    if (described.kind !== "directory") {
      errors.push(`${display(described.absolute)}: unexpected entry in skills/`);
      continue;
    }
    skillNames.push(entry.name);
  }
  skillNames.sort();

  if (skillNames.length === 0) errors.push("skills/ contains no skill directories");

  const lowerNames = new Set();
  for (const name of skillNames) {
    if (!KEBAB.test(name)) errors.push(`skills/${name}: directory name must be lowercase kebab-case`);
    if (lowerNames.has(name.toLowerCase())) errors.push(`skills/${name}: case-insensitive duplicate skill name`);
    lowerNames.add(name.toLowerCase());
  }

  const pluginPath = join(repoRoot, ".claude-plugin", "plugin.json");
  const plugin = readJsonObject(repoRoot, pluginPath, ".claude-plugin/plugin.json", errors);
  const pluginSkills = [];
  if (plugin) {
    if (!Array.isArray(plugin.skills)) {
      errors.push(".claude-plugin/plugin.json: skills must be an array");
    } else {
      for (const [index, entry] of plugin.skills.entries()) {
        if (typeof entry !== "string") {
          errors.push(`.claude-plugin/plugin.json: skills[${index}] must be a string`);
          continue;
        }
        const match = PLUGIN_SKILL.exec(entry);
        if (!match) {
          errors.push(`.claude-plugin/plugin.json: ${JSON.stringify(entry)} is not a canonical ./skills/<name> path`);
          continue;
        }
        pluginSkills.push(match[1]);
      }
    }
    if (new Set(pluginSkills).size !== pluginSkills.length) {
      errors.push(".claude-plugin/plugin.json: duplicate skill entries");
    }
  }

  const skillsShPath = join(repoRoot, "skills.sh.json");
  const skillsSh = readJsonObject(repoRoot, skillsShPath, "skills.sh.json", errors);
  const groupedSkills = [];
  if (skillsSh) {
    if (!Array.isArray(skillsSh.groupings)) {
      errors.push("skills.sh.json: groupings must be an array");
    } else {
      for (const [groupIndex, group] of skillsSh.groupings.entries()) {
        if (!isPlainObject(group)) {
          errors.push(`skills.sh.json: groupings[${groupIndex}] must be an object`);
          continue;
        }
        if (typeof group.title !== "string" || group.title.trim() === "") {
          errors.push(`skills.sh.json: groupings[${groupIndex}].title must be a non-empty string`);
        }
        if (!Array.isArray(group.skills)) {
          errors.push(`skills.sh.json: groupings[${groupIndex}].skills must be an array`);
          continue;
        }
        for (const [skillIndex, name] of group.skills.entries()) {
          if (typeof name !== "string") {
            errors.push(`skills.sh.json: groupings[${groupIndex}].skills[${skillIndex}] must be a string`);
            continue;
          }
          groupedSkills.push(name);
        }
      }
    }
    if (new Set(groupedSkills).size !== groupedSkills.length) {
      errors.push("skills.sh.json: a skill is listed more than once");
    }
  }

  const readmePath = join(repoRoot, "README.md");
  const readme = readManagedFile(repoRoot, readmePath, "README.md", errors) ?? "";

  for (const skillName of skillNames) {
    const skillDir = join(skillsRoot, skillName);
    const skillPath = join(skillDir, "SKILL.md");
    const relSkillPath = `skills/${skillName}/SKILL.md`;

    const skillDirCheck = inspectManagedPath(repoRoot, skillDir, {
      label: `skills/${skillName}`,
      kind: "directory",
    });
    if (!skillDirCheck.ok) {
      errors.push(skillDirCheck.error);
      continue;
    }

    if (!existsSync(skillPath)) {
      errors.push(`skills/${skillName}: missing SKILL.md`);
      continue;
    }

    const skillFileCheck = inspectManagedPath(repoRoot, skillPath, {
      label: relSkillPath,
      kind: "file",
    });
    if (!skillFileCheck.ok) {
      errors.push(skillFileCheck.error);
      continue;
    }

    const content = readFileSync(skillPath, "utf8");
    const parsed = parseFrontmatter(content, relSkillPath);
    if (parsed.error) errors.push(parsed.error);
    const fields = parsed.fields ?? {};

    errors.push(...validateSkillFrontmatter(fields, relSkillPath));

    if (fields.name !== skillName) {
      errors.push(`${relSkillPath}: frontmatter name must be ${skillName}`);
    }

    if (typeof fields.description === "string" && fields.description.trim() !== "") {
      const words = countWords(fields.description);
      if (words < 8) errors.push(`${relSkillPath}: description is too short to explain when to use the skill`);
      if (words > 120) errors.push(`${relSkillPath}: description is too long (${words} words, max 120)`);
    }

    const bodyLines = parsed.body.split("\n").length;
    if (bodyLines > 350) errors.push(`${relSkillPath}: body is ${bodyLines} lines (max 350)`);
    if (!/^#\s+/m.test(parsed.body)) errors.push(`${relSkillPath}: body needs a top-level heading`);

    if (isPlainObject(fields.metadata) && typeof fields.metadata["required-skills"] === "string") {
      for (const dependency of fields.metadata["required-skills"].split(/\s+/).filter(Boolean)) {
        if (!skillNames.includes(dependency)) {
          errors.push(`${relSkillPath}: required skill ${JSON.stringify(dependency)} does not exist in this collection`);
        }
      }
    }

    checkLinks({
      repoRoot,
      filePath: skillPath,
      text: parsed.body,
      boundary: skillDir,
      label: relSkillPath,
      errors,
    });

    const referencesDir = join(skillDir, "references");
    if (existsSync(referencesDir)) {
      const referencesCheck = inspectManagedPath(repoRoot, referencesDir, {
        label: `skills/${skillName}/references`,
        kind: "directory",
      });
      if (!referencesCheck.ok) {
        errors.push(referencesCheck.error);
      } else {
        for (const entry of readdirSync(referencesDir, { withFileTypes: true })) {
          const described = describeEntry(referencesDir, entry);
          if (described.kind === "link") {
            errors.push(`${display(described.absolute)}: installed reference must not be a symbolic link or junction`);
          } else if (described.kind !== "file" || !entry.name.endsWith(".md")) {
            errors.push(`${display(described.absolute)}: unsupported installed reference entry`);
          }
        }
        for (const required of ["contract.md", "templates.md"]) {
          if (!existsSync(join(referencesDir, required))) {
            errors.push(`skills/${skillName}/references/${required} is missing`);
          }
        }
      }
    }

    if (!pluginSkills.includes(skillName)) errors.push(`.claude-plugin/plugin.json: missing ./skills/${skillName}`);
    if (!readme.includes(`./${relSkillPath}`)) errors.push(`README.md: missing link to ./${relSkillPath}`);
    if (!groupedSkills.includes(skillName)) errors.push(`skills.sh.json: missing ${skillName}`);

    const docsPath = join(repoRoot, "docs", "skills", `${skillName}.md`);
    if (!existsSync(docsPath)) {
      errors.push(`docs/skills/${skillName}.md is missing`);
    } else {
      const docsCheck = inspectManagedPath(repoRoot, docsPath, {
        label: `docs/skills/${skillName}.md`,
        kind: "file",
      });
      if (!docsCheck.ok) errors.push(docsCheck.error);
    }
  }

  for (const pluginSkill of pluginSkills) {
    if (!skillNames.includes(pluginSkill)) {
      errors.push(`.claude-plugin/plugin.json: ./skills/${pluginSkill} does not match a skill directory`);
    }
  }

  for (const groupedSkill of groupedSkills) {
    if (!skillNames.includes(groupedSkill)) {
      errors.push(`skills.sh.json: ${groupedSkill} does not match a skill directory`);
    }
  }

  for (const required of ["WORKFLOW.md", "legacy/README.md", "docs/adr/0001-repo-skill-architecture.md"]) {
    const requiredPath = join(repoRoot, required);
    if (!existsSync(requiredPath)) {
      errors.push(`${required} is missing`);
      continue;
    }
    const requiredCheck = inspectManagedPath(repoRoot, requiredPath, { label: required, kind: "file" });
    if (!requiredCheck.ok) errors.push(requiredCheck.error);
  }

  const activeMarkdown = [
    "README.md",
    "WORKFLOW.md",
    "AGENTS.md",
    "legacy/README.md",
    ...skillNames.map((name) => `skills/${name}/SKILL.md`),
    ...markdownUnder(repoRoot, "skills/references", errors).map((path) => display(path)),
    ...markdownUnder(repoRoot, "docs", errors).map((path) => display(path)),
  ].filter((file) => existsSync(join(repoRoot, file)));

  for (const file of activeMarkdown) {
    const absolute = join(repoRoot, file);
    const fileCheck = inspectManagedPath(repoRoot, absolute, { label: file, kind: "file" });
    if (!fileCheck.ok) {
      errors.push(fileCheck.error);
      continue;
    }
    const text = readFileSync(absolute, "utf8");
    const boundary = file.startsWith("skills/references/")
      ? join(repoRoot, "skills", "references")
      : repoRoot;
    checkLinks({ repoRoot, filePath: absolute, text, boundary, label: file, errors });
  }

  const templatesPath = join(repoRoot, "skills", "references", "templates.md");
  const templates = readManagedFile(repoRoot, templatesPath, "skills/references/templates.md", errors);
  if (templates !== null) {
    const requiredTemplateText = [
      "Record version: 2",
      "Event ID",
      "Tested content ID:",
      "Config/dependencies verified:",
      "Stopping boundary",
      "Reviewed base:",
      "Reviewed head:",
      "Permission events are append-only",
      "## Alternatives considered",
      "## Consequences",
    ];
    for (const text of requiredTemplateText) {
      if (!templates.includes(text)) {
        errors.push(`skills/references/templates.md: missing required template text ${JSON.stringify(text)}`);
      }
    }
  }

  return { errors, skillNames };
}

function readJsonObject(repoRoot, path, label, errors) {
  const text = readManagedFile(repoRoot, path, label, errors);
  if (text === null) return null;
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (error) {
    errors.push(`${label}: invalid JSON (${error.message})`);
    return null;
  }
  if (!isPlainObject(parsed)) {
    errors.push(`${label}: expected a JSON object`);
    return null;
  }
  return parsed;
}

function readManagedFile(repoRoot, path, label, errors) {
  const check = inspectManagedPath(repoRoot, path, { label, kind: "file" });
  if (!check.ok) {
    errors.push(check.error);
    return null;
  }
  try {
    return readFileSync(path, "utf8");
  } catch (error) {
    errors.push(`${label}: cannot read (${error.code ?? error.message})`);
    return null;
  }
}

function markdownUnder(repoRoot, relativeDirectory, errors) {
  const directory = join(repoRoot, relativeDirectory);
  const check = inspectManagedPath(repoRoot, directory, {
    label: relativeDirectory,
    kind: "directory",
  });
  if (!check.ok) {
    errors.push(check.error);
    return [];
  }
  return markdownFiles(directory, { errors, repoRoot });
}

function markdownFiles(directory, { errors = null, repoRoot = null } = {}) {
  if (!existsSync(directory)) return [];
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const described = describeEntry(directory, entry);
    if (described.kind === "directory") {
      files.push(...markdownFiles(described.absolute, { errors, repoRoot }));
    } else if (described.kind === "link") {
      if (errors) {
        errors.push(`${toDisplayPath(repoRoot, described.absolute)}: linked path is not allowed in documentation`);
      }
    } else if (described.kind === "other") {
      if (errors) {
        errors.push(`${toDisplayPath(repoRoot, described.absolute)}: unsupported documentation entry`);
      }
    } else if (entry.name.endsWith(".md")) {
      files.push(described.absolute);
    }
  }
  return files;
}

function checkLinks({ repoRoot, filePath, text, boundary, label, errors }) {
  let inspected;
  try {
    inspected = inspectMarkdown(text);
  } catch (error) {
    errors.push(`${label}: cannot parse Markdown (${error.message})`);
    return;
  }

  for (const link of inspected.links) {
    if (link.url === null) {
      errors.push(
        `${label}:${link.line ?? "?"}: unresolved reference-style destination ${JSON.stringify(link.identifier)}`,
      );
      continue;
    }
    if (!link.url || isExternalTarget(link.url)) continue;

    const parts = splitLinkTarget(link.url);
    const decodedPath = decodeSafe(parts.path);
    const decodedAnchor = decodeSafe(parts.anchor);
    if (decodedPath.error || decodedAnchor.error) {
      errors.push(`${label}:${link.line ?? "?"}: invalid link encoding in ${link.url}`);
      continue;
    }

    const destination = decodedPath.value ? resolve(dirname(filePath), decodedPath.value) : filePath;

    if (!isInside(boundary, destination)) {
      const scope = boundary === repoRoot ? "repository" : toDisplayPath(repoRoot, boundary);
      errors.push(`${label}: link ${link.url} escapes the ${scope} directory`);
      continue;
    }
    if (!isInside(repoRoot, destination)) {
      errors.push(`${label}: link ${link.url} escapes the repository`);
      continue;
    }

    let stats;
    try {
      stats = lstatSync(destination);
    } catch {
      errors.push(`${label}:${link.line ?? "?"}: broken link ${link.url}`);
      continue;
    }

    const kind = stats.isDirectory() ? "directory" : "file";
    const physical = inspectManagedPath(repoRoot, destination, { label: `link ${link.url}`, kind });
    if (!physical.ok) {
      errors.push(`${label}:${link.line ?? "?"}: ${physical.error}`);
      continue;
    }

    if (decodedAnchor.value && destination.endsWith(".md")) {
      let anchors;
      try {
        anchors = inspectMarkdown(readFileSync(destination, "utf8")).anchors;
      } catch (error) {
        errors.push(`${label}: cannot read ${toDisplayPath(repoRoot, destination)} for anchor ${link.url} (${error.message})`);
        continue;
      }
      if (!anchors.has(decodedAnchor.value)) {
        errors.push(`${label}:${link.line ?? "?"}: missing anchor ${link.url}`);
      }
    }
  }
}
