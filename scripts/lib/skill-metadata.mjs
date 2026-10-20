import { readFileSync } from "node:fs";

/**
 * Parse the small YAML frontmatter subset used by SKILL.md files.
 * Supports LF/CRLF, a UTF-8 BOM, plain/quoted scalars, `|`/`>` block
 * scalars, and comments outside quotes. Unsupported constructs are kept
 * as text rather than silently disappearing.
 */
export function parseFrontmatter(content, filePath = "SKILL.md") {
  const normalized = String(content).replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
  const match = normalized.match(/^---\n([\s\S]*?)\n---[ \t]*(?:\n|$)/);
  if (!match) {
    return { fields: {}, body: normalized, error: `${filePath}: missing YAML frontmatter` };
  }

  const lines = match[1].split("\n");
  const fields = {};

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.trim() || line.trimStart().startsWith("#")) continue;

    const field = line.match(/^([a-zA-Z0-9_-]+):[ \t]*(.*)$/);
    if (!field) continue;

    const key = field[1];
    const rawValue = field[2].trim();

    if (/^[|>][+-]?$/.test(rawValue)) {
      const style = rawValue[0];
      const chomp = rawValue[1] ?? "";
      const blockLines = [];
      let blockIndent = null;

      while (index + 1 < lines.length) {
        const next = lines[index + 1];
        if (next.trim() === "") {
          blockLines.push("");
          index += 1;
          continue;
        }
        const indent = next.match(/^[ \t]*/)[0].length;
        if (indent === 0) break;
        blockIndent ??= indent;
        if (indent < blockIndent) break;
        blockLines.push(next.slice(blockIndent));
        index += 1;
      }

      let value = style === "|" ? blockLines.join("\n") : foldBlock(blockLines);
      if (chomp !== "-") value += "\n";
      if (chomp === "+") value = blockLines.join("\n") + "\n";
      fields[key] = value;
      continue;
    }

    fields[key] = parseScalar(rawValue);
  }

  return {
    fields,
    body: normalized.slice(match[0].length).replace(/^\n/, ""),
    error: null,
  };
}

function foldBlock(lines) {
  let result = "";
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (index === 0) result = line;
    else if (line === "" || lines[index - 1] === "") result += `\n${line}`;
    else result += ` ${line}`;
  }
  return result;
}

function parseScalar(rawValue) {
  const value = stripComment(rawValue).trim();
  if (value.length >= 2 && value.startsWith("'") && value.endsWith("'")) {
    return value.slice(1, -1).replace(/''/g, "'");
  }
  if (value.length >= 2 && value.startsWith('"') && value.endsWith('"')) {
    try {
      return JSON.parse(value);
    } catch {
      return value.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\");
    }
  }
  return value;
}

function stripComment(value) {
  let single = false;
  let double = false;
  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];
    if (character === "'" && !double) single = !single;
    else if (character === '"' && !single && value[index - 1] !== "\\") double = !double;
    else if (character === "#" && !single && !double && (index === 0 || /\s/.test(value[index - 1]))) {
      return value.slice(0, index);
    }
  }
  return value;
}

export function skillDirs(entries) {
  return entries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "references")
    .map((entry) => entry.name)
    .sort();
}

export function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function localMarkdownLinks(markdown) {
  return [...markdown.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)]
    .map((match) => match[1])
    .filter((target) => {
      const path = splitLinkTarget(target).path;
      return path && !/^[a-z][a-z0-9+.-]*:/i.test(path) && !path.startsWith("//");
    });
}

export function splitLinkTarget(rawTarget) {
  let target = String(rawTarget).trim();

  if (target.startsWith("<")) {
    const end = target.indexOf(">");
    if (end !== -1) target = target.slice(1, end);
  } else {
    target = target.replace(/\s+(?:"[^"]*"|'[^']*')$/, "");
  }

  const hashIndex = target.indexOf("#");
  const queryIndex = target.indexOf("?");
  const pathEnd = [hashIndex, queryIndex].filter((index) => index !== -1).sort((a, b) => a - b)[0] ?? target.length;
  return {
    path: target.slice(0, pathEnd),
    anchor: hashIndex === -1 ? "" : target.slice(hashIndex + 1).split("?")[0],
  };
}

export function decodeSafe(value) {
  try {
    return { value: decodeURIComponent(value), error: null };
  } catch {
    return { value, error: `invalid URI encoding in ${value}` };
  }
}

export function readUtf8(path) {
  return readFileSync(path, "utf8");
}
