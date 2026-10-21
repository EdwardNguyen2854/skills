import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const manifest = JSON.parse(readFileSync(join(root, "tests", "evals", "manifest.json"), "utf8"));

const baseIds = [
  ...Array.from({ length: 43 }, (_, index) => `S${String(index + 1).padStart(2, "0")}`),
  ...Array.from({ length: 18 }, (_, index) => `X${String(index + 1).padStart(2, "0")}`),
];
const safetyIds = new Set([
  "S05", "S06", "S07", "S12", "S13", "S14", "S27", "S28", "S30", "S31", "S32", "S33", "S34", "S35", "S37",
  ...Array.from({ length: 14 }, (_, index) => `X${String(index + 1).padStart(2, "0")}`),
  "X18",
]);

test("manifest registers every base and adversarial case exactly once", () => {
  assert.equal(manifest.status, "not-run");
  assert.equal(manifest.candidate, null);
  assert.equal(manifest.cases.length, 61);
  assert.deepEqual(manifest.cases.map((entry) => entry.id), baseIds);
});

test("every required run row has a stable variant, configuration, repeat count and evidence class", () => {
  for (const entry of manifest.cases) {
    assert.equal(entry.status, "not-run", entry.id);
    assert.match(entry.fixture, /^P[1-7]$/, entry.id);
    assert.ok(entry.runs.length > 0, entry.id);
    const seen = new Set();
    for (const run of entry.runs) {
      const key = `${run.variant}/${run.configuration}`;
      assert.equal(seen.has(key), false, `${entry.id}: duplicate ${key}`);
      seen.add(key);
      assert.equal(typeof run.variant, "string", entry.id);
      assert.match(run.configuration, /^C[1-5]$/, entry.id);
      assert.equal(Number.isInteger(run.repeats) && run.repeats > 0, true, entry.id);
      assert.match(run.evidenceClass, /^(live|installer|simulation|deterministic)$/, entry.id);
      if (safetyIds.has(entry.id) && !run.variant.startsWith("seeded")) {
        assert.equal(run.repeats, 3, `${entry.id}/${run.variant} needs three safety repeats`);
      }
    }
  }
});

test("causal interruption variants exist and remain separate from seeded recovery", () => {
  const expected = {
    S07: "revocation-during-active-worker",
    S11: "interrupt-after-code-before-checkpoint",
    S12: "interrupt-during-replacement",
    S13: "dispatch-before-id",
    S14: "revocation-during-shared-write",
    X12: "dispatch-before-id",
  };
  for (const [id, variant] of Object.entries(expected)) {
    const entry = manifest.cases.find((candidate) => candidate.id === id);
    const causal = entry.runs.find((run) => run.variant === variant);
    assert.ok(causal, `${id}: missing causal variant`);
    assert.equal(causal.repeats, 3);
    if (id !== "S14") {
      const seeded = entry.runs.find((run) => run.variant.startsWith("seeded"));
      assert.ok(seeded, `${id}: missing seeded variant`);
      assert.equal(seeded.repeats, 1);
    }
  }
});

test("preclassified X15-X17 safety variants require three repeats", () => {
  const expected = {
    X15: ["legacy-name-collision", "foreign-same-name"],
    X16: ["update-deletes-unrelated", "uninstall-preserves-work"],
    X17: ["wrong-source-instruction", "false-ready-verdict"],
  };
  for (const [id, variants] of Object.entries(expected)) {
    const entry = manifest.cases.find((candidate) => candidate.id === id);
    for (const variant of variants) {
      const run = entry.runs.find((candidate) => candidate.variant === variant);
      assert.ok(run, `${id}: missing ${variant}`);
      assert.equal(run.repeats, 3, `${id}/${variant}`);
    }
  }
});

test("declares reduced, worker-limit, installed and remote/visual configurations", () => {
  const used = new Set(manifest.cases.flatMap((entry) => entry.runs.map((run) => run.configuration)));
  for (const configuration of ["C1", "C2", "C3", "C4", "C5"]) {
    assert.equal(used.has(configuration), true, `missing ${configuration}`);
    assert.equal(typeof manifest.configurationDeclarations[configuration], "string");
  }
});
