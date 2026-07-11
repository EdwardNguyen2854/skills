import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const skillsRoot = join(root, "skills", "engineering");
const errors = [];

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function read(path) {
  return readFileSync(path, "utf8");
}

function parseFrontmatter(content, filePath) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    errors.push(`${filePath}: missing YAML frontmatter`);
    return {};
  }

  const fields = {};
  for (const line of match[1].split("\n")) {
    const field = line.match(/^([a-zA-Z0-9-]+):\s*(.*)$/);
    if (!field) continue;
    fields[field[1]] = field[2].replace(/^['\"]|['\"]$/g, "");
  }
  return fields;
}

if (!existsSync(skillsRoot)) {
  errors.push("skills/engineering does not exist");
}

const skillNames = existsSync(skillsRoot)
  ? readdirSync(skillsRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort()
  : [];

const readme = existsSync(join(root, "README.md")) ? read(join(root, "README.md")) : "";
const pluginPath = join(root, ".claude-plugin", "plugin.json");
const skillsShPath = join(root, "skills.sh.json");
const plugin = existsSync(pluginPath) ? readJson(pluginPath) : { skills: [] };
const skillsSh = existsSync(skillsShPath) ? readJson(skillsShPath) : { groupings: [] };
const pluginSkills = new Set(plugin.skills ?? []);
const groupedSkills = new Set((skillsSh.groupings ?? []).flatMap((group) => group.skills ?? []));

for (const skillName of skillNames) {
  const skillDir = join(skillsRoot, skillName);
  const skillPath = join(skillDir, "SKILL.md");
  const relSkillDir = `skills/engineering/${skillName}`;
  const relSkillPath = `${relSkillDir}/SKILL.md`;

  if (!existsSync(skillPath)) {
    errors.push(`${relSkillDir}: missing SKILL.md`);
    continue;
  }

  const content = read(skillPath);
  const frontmatter = parseFrontmatter(content, relSkillPath);

  if (frontmatter.name !== skillName) {
    errors.push(`${relSkillPath}: frontmatter name must be ${skillName}`);
  }

  if (!frontmatter.description) {
    errors.push(`${relSkillPath}: missing description`);
  } else if (/[<>]/.test(frontmatter.description)) {
    errors.push(`${relSkillPath}: description must not contain < or >`);
  }

  if (!pluginSkills.has(`./${relSkillDir}`)) {
    errors.push(`.claude-plugin/plugin.json: missing ./${relSkillDir}`);
  }

  if (!readme.includes(`./${relSkillPath}`)) {
    errors.push(`README.md: missing link to ./${relSkillPath}`);
  }

  if (!existsSync(join(root, "docs", "engineering", `${skillName}.md`))) {
    errors.push(`docs/engineering/${skillName}.md is missing`);
  }

  if (!groupedSkills.has(skillName)) {
    errors.push(`skills.sh.json: missing ${skillName}`);
  }
}

for (const pluginSkill of pluginSkills) {
  const skillName = pluginSkill.split("/").at(-1);
  if (!skillNames.includes(skillName)) {
    errors.push(`.claude-plugin/plugin.json: ${pluginSkill} does not match a skill directory`);
  }
}

if (errors.length > 0) {
  console.error("Skill validation failed:\n");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Validated ${skillNames.length} skills.`);
