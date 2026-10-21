export { parseFrontmatter } from "./frontmatter.mjs";

/**
 * Compatibility helpers used by repository checks. The strict frontmatter
 * parser lives in frontmatter.mjs; this module keeps small path/link utilities
 * stable for existing consumers.
 */
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
