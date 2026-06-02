import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import assert from "node:assert/strict";
import * as prettier from "prettier";
import * as plugin from "../dist/index.mjs";

const fixturesDir = new URL("./fixtures/", import.meta.url);
const fixtureNames = await readdir(fixturesDir);

for (const fixtureName of fixtureNames) {
  const fixtureDir = new URL(`${fixtureName}/`, fixturesDir);
  const input = await readFile(new URL("input.html", fixtureDir), "utf8");
  const expected = await readFile(new URL("output.html", fixtureDir), "utf8");

  const actual = await prettier.format(input, {
    parser: "wp-block-html",
    plugins: [plugin],
  });

  assert.equal(
    actual,
    expected,
    `${join("test/fixtures", fixtureName)} did not match expected output`,
  );

  const secondPass = await prettier.format(actual, {
    parser: "wp-block-html",
    plugins: [plugin],
  });

  assert.equal(
    secondPass,
    actual,
    `${join("test/fixtures", fixtureName)} is not idempotent`,
  );
}

console.log(`Formatted ${fixtureNames.length} fixture(s).`);
