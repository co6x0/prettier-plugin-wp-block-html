// Ref: https://github.com/tailwindlabs/prettier-plugin-tailwindcss/blob/main/src/plugins.js
import { createRequire as req } from "module";
import type { Plugin } from "prettier";

export const loadIfExistsESM = async (name: string): Promise<Plugin> => {
  try {
    if (req(import.meta.url).resolve(name)) {
      let mod = await import(name);
      return mod.default ?? mod;
    }
  } catch (e) {
    return {
      parsers: {},
      printers: {},
    };
  }

  throw new Error(`Module '${name}' not found.`);
};
