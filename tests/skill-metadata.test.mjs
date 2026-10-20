import assert from "node:assert/strict";
import { test } from "node:test";
import {
  countWords,
  decodeSafe,
  localMarkdownLinks,
  parseFrontmatter,
  splitLinkTarget,
} from "../scripts/lib/skill-metadata.mjs";

test("parses LF frontmatter", () => {
  const result = parseFrontmatter("---\nname: demo\ndescription: A useful skill\n---\n\n# Demo\n");
  assert.equal(result.error, null);
  assert.equal(result.fields.name, "demo");
  assert.equal(result.fields.description, "A useful skill");
  assert.match(result.body, /^# Demo/);
});

test("parses CRLF frontmatter", () => {
  const result = parseFrontmatter("---\r\nname: demo\r\ndescription: A useful skill\r\n---\r\n\r\n# Demo\r\n");
  assert.equal(result.error, null);
  assert.equal(result.fields.name, "demo");
  assert.equal(result.fields.description, "A useful skill");
  assert.match(result.body, /^# Demo/);
});

test("parses BOM and mixed line endings", () => {
  const result = parseFrontmatter("\uFEFF---\r\nname: demo\ndescription: \"Quoted description\"\r\n---\n# Demo\n");
  assert.equal(result.error, null);
  assert.equal(result.fields.description, "Quoted description");
});

test("reports missing frontmatter", () => {
  const result = parseFrontmatter("# Demo\n");
  assert.match(result.error, /missing YAML frontmatter/);
  assert.equal(result.fields.name, undefined);
});

test("ignores comments and unrecognised frontmatter lines", () => {
  const result = parseFrontmatter("---\n# comment\nname: demo\nbad line\ndescription: Has: a colon\n---\n");
  assert.equal(result.fields.name, "demo");
  assert.equal(result.fields.description, "Has: a colon");
});

test("parses folded and literal block scalars", () => {
  const folded = parseFrontmatter("---\nname: demo\ndescription: >-\n  A useful skill\n  for a product owner.\n---\n");
  assert.equal(folded.fields.description, "A useful skill for a product owner.");

  const literal = parseFrontmatter("---\nname: demo\ndescription: |\n  First line.\n  Second line.\n---\n");
  assert.equal(literal.fields.description, "First line.\nSecond line.\n");
});

test("strips YAML comments outside quoted values", () => {
  const result = parseFrontmatter("---\nname: demo\ndescription: A useful skill # note\nquote: \"literal # not a comment\"\n---\n");
  assert.equal(result.fields.description, "A useful skill");
  assert.equal(result.fields.quote, "literal # not a comment");
});

test("counts words without counting formatting whitespace", () => {
  assert.equal(countWords("  one   two\nthree  "), 3);
  assert.equal(countWords(""), 0);
});

test("finds local links but ignores URLs and anchors", () => {
  assert.deepEqual(
    localMarkdownLinks("[a](../ref.md) [b](https://example.com) [c](#section) [d](templates.md#x)"),
    ["../ref.md", "templates.md#x"],
  );
});

test("splits paths, anchors, queries and link titles safely", () => {
  assert.deepEqual(splitLinkTarget("templates.md#x"), { path: "templates.md", anchor: "x" });
  assert.deepEqual(splitLinkTarget("<some file.md> \"title\""), { path: "some file.md", anchor: "" });
  assert.deepEqual(splitLinkTarget("page.md?q=1#part"), { path: "page.md", anchor: "part" });
});

test("reports invalid URI encoding instead of throwing", () => {
  assert.equal(decodeSafe("100%").error !== null, true);
  assert.equal(decodeSafe("normal%20file").value, "normal file");
});
