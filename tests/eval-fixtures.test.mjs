import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const fixtures = readFileSync(join(root, "tests", "evals", "fixtures.md"), "utf8");
const schema = JSON.parse(readFileSync(join(root, "tests", "evals", "result-schema.json"), "utf8"));

test("defines every synthetic fixture referenced by the case matrix", () => {
  for (const id of ["P1", "P2", "P3", "P4", "P5", "P6", "P7"]) {
    assert.match(fixtures, new RegExp(`^## ${id} `, "m"), id);
  }
});

test("result schema freezes identity, capability, evidence and honest status fields", () => {
  assert.equal(schema.type, "object");
  for (const field of [
    "case",
    "variant",
    "configuration",
    "candidateRevision",
    "testedContentId",
    "repeat",
    "observer",
    "action",
    "result",
    "status",
    "evidence",
    "limitations",
    "capabilities",
  ]) {
    assert.equal(schema.required.includes(field), true, field);
    assert.equal(Boolean(schema.properties[field]), true, field);
  }
  assert.deepEqual(schema.properties.status.enum, ["pass", "fail", "blocked", "not-run"]);
  assert.deepEqual(schema.properties.capabilities.required, [
    "tasks",
    "workers",
    "stop",
    "status",
    "isolation",
    "remote",
    "visual",
  ]);
});

test("a pass requires evidence and a blocked result requires a limitation", () => {
  const [passRule, blockedRule] = schema.allOf;
  assert.equal(passRule.then.properties.evidence.minItems, 1);
  assert.equal(blockedRule.then.properties.limitations.minItems, 1);
});
