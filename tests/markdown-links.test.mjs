import assert from "node:assert/strict";
import { test } from "node:test";
import { inspectMarkdown, isExternalTarget } from "../scripts/lib/markdown-links.mjs";

test("finds inline, reference-style and image destinations", () => {
  const inspected = inspectMarkdown(
    "[inline](./a.md)\n\n![image](./image.png)\n\n[ref][target]\n\n[target]: ./b.md\n",
  );
  assert.deepEqual(
    inspected.links.map((link) => link.url),
    ["./a.md", "./image.png", "./b.md"],
  );
});

test("does not invent a destination for plain bracket text", () => {
  const inspected = inspectMarkdown("[missing][nowhere]\n");
  assert.equal(inspected.links.length, 0);
});

test("builds GitHub-compatible duplicate heading anchors", () => {
  const inspected = inspectMarkdown("# Title\n\n## Title\n\n# Hello `code`\n");
  assert.equal(inspected.anchors.has("title"), true);
  assert.equal(inspected.anchors.has("title-1"), true);
  assert.equal(inspected.anchors.has("hello-code"), true);
});

test("ignores pseudo-headings inside code fences", () => {
  const inspected = inspectMarkdown("```\n# Not a heading\n```\n\n# Real heading\n");
  assert.equal(inspected.anchors.has("not-a-heading"), false);
  assert.equal(inspected.anchors.has("real-heading"), true);
});

test("finds links in tables and ignores external schemes", () => {
  const inspected = inspectMarkdown("| A | B |\n|---|---|\n| [local](./a.md) | [web](https://example.com) |\n");
  assert.equal(inspected.links.length, 2);
  assert.equal(isExternalTarget("https://example.com"), true);
  assert.equal(isExternalTarget("//example.com/a"), true);
  assert.equal(isExternalTarget("#anchor"), false);
  assert.equal(isExternalTarget("./a.md"), false);
});
