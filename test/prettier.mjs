import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import assert from "node:assert/strict";
import * as prettier from "prettier";
import * as plugin from "../dist/index.mjs";
import * as tailwindPluginModule from "prettier-plugin-tailwindcss";

const fixturesDir = new URL("./fixtures/", import.meta.url);
const fixtureNames = await readdir(fixturesDir);
const tailwindPlugin = tailwindPluginModule.default ?? tailwindPluginModule;

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

{
  const fixtureDir = new URL("tailwind/", fixturesDir);
  const input = await readFile(new URL("input.html", fixtureDir), "utf8");
  const expected = await readFile(new URL("output.html", fixtureDir), "utf8");

  const pluginOrders = [
    ["tailwind first", [tailwindPlugin, plugin]],
    ["wp-block-html first", [plugin, tailwindPlugin]],
  ];

  for (const [label, plugins] of pluginOrders) {
    const actual = await prettier.format(input, {
      parser: "wp-block-html",
      plugins,
    });

    assert.equal(
      actual,
      expected,
      `prettier-plugin-tailwindcss should compose with wp-block-html: ${label}`,
    );
  }
}

console.log(`Formatted ${fixtureNames.length} fixture(s).`);
