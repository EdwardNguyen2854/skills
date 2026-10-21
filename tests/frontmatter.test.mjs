import assert from "node:assert/strict";
import { test } from "node:test";
import { parseFrontmatter, validateSkillFrontmatter } from "../scripts/lib/frontmatter.mjs";

test("rejects unknown YAML tags rather than constructing executable values", () => {
  const result = parseFrontmatter("---\nname: demo\ndescription: !!js/function \"return 1\"\n---\n");
  assert.notEqual(result.error, null);
});

test("rejects non-mapping frontmatter", () => {
  const result = parseFrontmatter("---\n- one\n- two\n---\n");
  assert.notEqual(result.error, null);
  assert.match(result.error, /mapping/);
});

test("validates required string types and specification limits", () => {
  assert.deepEqual(validateSkillFrontmatter({ name: "demo", description: "A useful skill for owners." }, "x"), []);

  assert.match(
    validateSkillFrontmatter({ name: 7, description: "A useful skill for owners." }, "x").join("\n"),
    /name must be a non-empty string/,
  );
  assert.match(
    validateSkillFrontmatter({ name: "demo", description: true }, "x").join("\n"),
    /description must be a non-empty string/,
  );
  assert.match(
    validateSkillFrontmatter({ name: "a".repeat(65), description: "A useful skill for owners." }, "x").join("\n"),
    /max 64/,
  );
  assert.match(
    validateSkillFrontmatter({ name: "demo", description: "x".repeat(1025) }, "x").join("\n"),
    /max 1024/,
  );
});

test("validates optional metadata shape and dependency names", () => {
  const valid = validateSkillFrontmatter(
    {
      name: "create",
      description: "A useful skill for owners.",
      metadata: {
        collection: "edwardnguyen2854-skills",
        "workflow-contract": "2",
        "required-skills": "plan review",
      },
    },
    "x",
  );
  assert.deepEqual(valid, []);

  const invalid = validateSkillFrontmatter(
    {
      name: "create",
      description: "A useful skill for owners.",
      metadata: { "workflow-contract": "two", "required-skills": "create Bad_Name" },
    },
    "x",
  ).join("\n");
  assert.match(invalid, /workflow-contract must be a numeric string/);
  assert.match(invalid, /invalid name/);
  assert.match(invalid, /cannot include the skill itself/);
});
