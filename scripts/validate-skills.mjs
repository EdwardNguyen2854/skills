import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  countWords,
  decodeSafe,
  localMarkdownLinks,
  parseFrontmatter,
  skillDirs,
  splitLinkTarget,
} from "./lib/skill-metadata.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const skillsRoot = join(root, "skills");
const errors = [];

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    errors.push(`${path}: invalid JSON (${error.message})`);
    return {};
  }
}

function read(path) {
  return readFileSync(path, "utf8");
}

function relativePath(absolute) {
  return absolute.slice(root.length).replaceAll("\\", "/");
}

function markdownFiles(directory) {
  if (!existsSync(directory)) return [];
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const absolute = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...markdownFiles(absolute));
    else if (entry.isFile() && entry.name.endsWith(".md")) files.push(absolute);
  }
  return files;
}

if (!existsSync(skillsRoot)) errors.push("skills/ does not exist");

const skillNames = existsSync(skillsRoot) ? skillDirs(readdirSync(skillsRoot, { withFileTypes: true })) : [];
if (skillNames.length === 0) errors.push("skills/ contains no skill directories");

const readme = existsSync(join(root, "README.md")) ? read(join(root, "README.md")) : "";
const pluginPath = join(root, ".claude-plugin", "plugin.json");
const skillsShPath = join(root, "skills.sh.json");
const plugin = existsSync(pluginPath) ? readJson(pluginPath) : { skills: [] };
const skillsSh = existsSync(skillsShPath) ? readJson(skillsShPath) : { groupings: [] };
const rawPluginSkills = Array.isArray(plugin.skills) ? plugin.skills : [];
const rawGroupedSkills = Array.isArray(skillsSh.groupings)
  ? skillsSh.groupings.flatMap((group) => (Array.isArray(group.skills) ? group.skills : []))
  : [];
const pluginSkills = new Set(rawPluginSkills);
const groupedSkills = new Set(rawGroupedSkills);

if (pluginSkills.size !== rawPluginSkills.length) {
  errors.push(".claude-plugin/plugin.json: duplicate skill entries");
}
if (groupedSkills.size !== rawGroupedSkills.length) {
  errors.push("skills.sh.json: a skill is listed more than once");
}

const lowerNames = new Set();
for (const skillName of skillNames) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(skillName)) {
    errors.push(`skills/${skillName}: directory name must be lowercase kebab-case`);
  }
  if (lowerNames.has(skillName.toLowerCase())) {
    errors.push(`skills/${skillName}: case-insensitive duplicate skill name`);
  }
  lowerNames.add(skillName.toLowerCase());

  const skillDir = join(skillsRoot, skillName);
  const skillPath = join(skillDir, "SKILL.md");
  const relSkillDir = `skills/${skillName}`;
  const relSkillPath = `${relSkillDir}/SKILL.md`;

  if (!existsSync(skillPath)) {
    errors.push(`${relSkillDir}: missing SKILL.md`);
    continue;
  }

  const content = read(skillPath);
  const { fields, body, error } = parseFrontmatter(content, relSkillPath);
  if (error) errors.push(error);

  if (fields.name !== skillName) {
    errors.push(`${relSkillPath}: frontmatter name must be ${skillName}`);
  }

  if (!fields.description) {
    errors.push(`${relSkillPath}: missing description`);
  } else {
    const words = countWords(fields.description);
    if (words < 8) errors.push(`${relSkillPath}: description is too short to explain when to use the skill`);
    if (words > 120) errors.push(`${relSkillPath}: description is too long (${words} words, max 120)`);
  }

  const bodyLines = body.split("\n").length;
  if (bodyLines > 350) errors.push(`${relSkillPath}: body is ${bodyLines} lines (max 350)`);
  if (!/^#\s+/m.test(body)) errors.push(`${relSkillPath}: body needs a top-level heading`);

  for (const target of localMarkdownLinks(body)) {
    const parts = splitLinkTarget(target);
    const decoded = decodeSafe(parts.path);
    if (decoded.error) {
      errors.push(`${relSkillPath}: ${decoded.error} in link ${target}`);
      continue;
    }
    if (!decoded.value) continue;
    const destination = resolve(dirname(skillPath), decoded.value);
    const insideSkill = relative(skillDir, destination);
    if (insideSkill.startsWith("..") || isAbsolute(insideSkill)) {
      errors.push(`${relSkillPath}: link ${target} escapes the installed skill directory`);
      continue;
    }
    if (!existsSync(destination)) {
      errors.push(`${relSkillPath}: broken relative link ${target}`);
    }
  }

  if (!pluginSkills.has(`./${relSkillDir}`)) errors.push(`.claude-plugin/plugin.json: missing ./${relSkillDir}`);
  if (!readme.includes(`./${relSkillPath}`)) errors.push(`README.md: missing link to ./${relSkillPath}`);
  if (!groupedSkills.has(skillName)) errors.push(`skills.sh.json: missing ${skillName}`);

  const docsPath = join(root, "docs", "skills", `${skillName}.md`);
  if (!existsSync(docsPath)) errors.push(`docs/skills/${skillName}.md is missing`);
}

for (const pluginSkill of pluginSkills) {
  const skillName = pluginSkill.split("/").at(-1);
  if (!skillNames.includes(skillName)) {
    errors.push(`.claude-plugin/plugin.json: ${pluginSkill} does not match a skill directory`);
  }
}

for (const groupedSkill of groupedSkills) {
  if (!skillNames.includes(groupedSkill)) {
    errors.push(`skills.sh.json: ${groupedSkill} does not match a skill directory`);
  }
}

for (const required of ["README.md", "WORKFLOW.md", "legacy/README.md", "docs/adr/0001-repo-skill-architecture.md"]) {
  if (!existsSync(join(root, required))) errors.push(`${required} is missing`);
}

function slug(text) {
  return text
    .toLowerCase()
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_~]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}

function headings(path) {
  return [...read(path).matchAll(/^#{1,6}\s+(.+)$/gm)].map((match) => slug(match[1]));
}

const activeMarkdown = [
  "README.md",
  "WORKFLOW.md",
  "AGENTS.md",
  "legacy/README.md",
  ...skillNames.map((name) => `skills/${name}/SKILL.md`),
  ...markdownFiles(join(root, "skills", "references")).map(relativePath),
  ...markdownFiles(join(root, "docs")).map(relativePath),
].filter((file) => existsSync(join(root, file)));

for (const file of activeMarkdown) {
  const absolute = join(root, file);
  const text = read(absolute);
  for (const target of localMarkdownLinks(text)) {
    const parts = splitLinkTarget(target);
    const decodedPath = decodeSafe(parts.path);
    const decodedAnchor = decodeSafe(parts.anchor);
    if (decodedPath.error || decodedAnchor.error) {
      errors.push(`${file}: invalid link encoding in ${target}`);
      continue;
    }

    const destination = decodedPath.value ? resolve(dirname(absolute), decodedPath.value) : absolute;
    if (file.startsWith("skills/references/")) {
      const insideReference = relative(join(root, "skills", "references"), destination);
      if (insideReference.startsWith("..") || isAbsolute(insideReference)) {
        errors.push(`${file}: link ${target} escapes the installed reference directory`);
        continue;
      }
    }
    if (!existsSync(destination)) {
      errors.push(`${file}: broken link ${target}`);
      continue;
    }
    if (decodedAnchor.value && destination.endsWith(".md")) {
      if (!headings(destination).includes(decodedAnchor.value)) errors.push(`${file}: missing anchor ${target}`);
    }
  }
}

const templatesPath = join(root, "skills", "references", "templates.md");
if (existsSync(templatesPath)) {
  const templates = read(templatesPath);
  const requiredTemplateText = [
    "Feature ID:",
    "Tested content ID:",
    "Config/dependencies verified:",
    "Stopping boundary",
    "Reviewed base:",
    "Reviewed head:",
    "Permission rows are append-only",
    "## Alternatives considered",
    "## Consequences",
  ];
  for (const text of requiredTemplateText) {
    if (!templates.includes(text)) errors.push(`skills/references/templates.md: missing required template text ${JSON.stringify(text)}`);
  }
}

if (errors.length > 0) {
  console.error("Skill validation failed:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Validated ${skillNames.length} skills and repository metadata.`);
}
