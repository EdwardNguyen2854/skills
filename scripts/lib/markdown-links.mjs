import GithubSlugger from "github-slugger";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";

const parser = unified().use(remarkParse).use(remarkGfm);

function walk(node, visit) {
  visit(node);
  for (const child of node.children ?? []) walk(child, visit);
}

function textContent(node) {
  if (typeof node.value === "string") return node.value;
  if (node.type === "image" || node.type === "imageReference") return node.alt ?? "";
  return (node.children ?? []).map(textContent).join("");
}

/**
 * Parse Markdown and return local-capable link/image targets plus heading
 * anchors. Raw HTML ids/links and non-Markdown documents are outside this
 * supported subset; callers must not claim they were checked.
 */
export function inspectMarkdown(markdown) {
  const tree = parser.parse(String(markdown));
  const definitions = new Map();
  const links = [];
  const headings = [];

  walk(tree, (node) => {
    if (node.type === "definition" && node.identifier && node.url) {
      definitions.set(node.identifier.toLowerCase(), node.url);
    }
  });

  walk(tree, (node) => {
    if (node.type === "link" || node.type === "image") {
      links.push({
        url: node.url ?? "",
        kind: node.type,
        line: node.position?.start?.line ?? null,
        column: node.position?.start?.column ?? null,
      });
      return;
    }

    if (node.type === "linkReference" || node.type === "imageReference") {
      const identifier = String(node.identifier ?? "").toLowerCase();
      const url = definitions.get(identifier);
      links.push({
        url: url ?? null,
        kind: node.type,
        identifier: node.identifier ?? "",
        line: node.position?.start?.line ?? null,
        column: node.position?.start?.column ?? null,
      });
      return;
    }

    if (node.type === "heading") {
      headings.push({
        text: textContent(node),
        depth: node.depth,
        line: node.position?.start?.line ?? null,
      });
    }
  });

  const slugger = new GithubSlugger();
  const anchors = new Set(headings.map((heading) => slugger.slug(heading.text)));

  return { links, headings, anchors, definitions };
}

export function isExternalTarget(url) {
  const target = String(url ?? "").trim();
  return !target || /^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith("//");
}

export function collectAnchors(markdown) {
  return inspectMarkdown(markdown).anchors;
}
