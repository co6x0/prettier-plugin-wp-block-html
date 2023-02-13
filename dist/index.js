"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/plugin.ts
var plugin_exports = {};
__export(plugin_exports, {
  defaultOptions: () => defaultOptions,
  languages: () => languages,
  options: () => options,
  parsers: () => parsers,
  printers: () => printers
});
module.exports = __toCommonJS(plugin_exports);
var import_parser_html = require("prettier/parser-html");
var import_doc = require("prettier/doc");

// src/common/AstPath/index.js
var getLast = (arr) => arr[arr.length - 1];
function getNodeHelper(path, count) {
  const stackIndex = getNodeStackIndexHelper(path.stack, count);
  return stackIndex === -1 ? null : path.stack[stackIndex];
}
function getNodeStackIndexHelper(stack, count) {
  for (let i = stack.length - 1; i >= 0; i -= 2) {
    const value = stack[i];
    if (value && !Array.isArray(value) && --count < 0) {
      return i;
    }
  }
  return -1;
}
var AstPath = class {
  constructor(value) {
    this.stack = [value];
  }
  // The name of the current property is always the penultimate element of
  // this.stack, and always a String.
  getName() {
    const { stack } = this;
    const { length } = stack;
    if (length > 1) {
      return stack[length - 2];
    }
    return null;
  }
  // The value of the current property is always the final element of
  // this.stack.
  getValue() {
    return getLast(this.stack);
  }
  getNode(count = 0) {
    return getNodeHelper(this, count);
  }
  getParentNode(count = 0) {
    return getNodeHelper(this, count + 1);
  }
  // Temporarily push properties named by string arguments given after the
  // callback function onto this.stack, then call the callback with a
  // reference to this (modified) AstPath object. Note that the stack will
  // be restored to its original state after the callback is finished, so it
  // is probably a mistake to retain a reference to the path.
  call(callback, ...names) {
    const { stack } = this;
    const { length } = stack;
    let value = getLast(stack);
    for (const name of names) {
      value = value[name];
      stack.push(name, value);
    }
    const result = callback(this);
    stack.length = length;
    return result;
  }
  callParent(callback, count = 0) {
    const stackIndex = getNodeStackIndexHelper(this.stack, count + 1);
    const parentValues = this.stack.splice(stackIndex + 1);
    const result = callback(this);
    this.stack.push(...parentValues);
    return result;
  }
  // Similar to AstPath.prototype.call, except that the value obtained by
  // accessing this.getValue()[name1][name2]... should be array. The
  // callback will be called with a reference to this path object for each
  // element of the array.
  each(callback, ...names) {
    const { stack } = this;
    const { length } = stack;
    let value = getLast(stack);
    for (const name of names) {
      value = value[name];
      stack.push(name, value);
    }
    for (let i = 0; i < value.length; ++i) {
      stack.push(i, value[i]);
      callback(this, i, value);
      stack.length -= 2;
    }
    stack.length = length;
  }
  // Similar to AstPath.prototype.each, except that the results of the
  // callback function invocations are stored in an array and returned at
  // the end of the iteration.
  map(callback, ...names) {
    const result = [];
    this.each((path, index, value) => {
      result[index] = callback(path, index, value);
    }, ...names);
    return result;
  }
  /**
   * @param {() => void} callback
   * @internal Unstable API. Don't use in plugins for now.
   */
  try(callback) {
    const { stack } = this;
    const stackBackup = [...stack];
    try {
      return callback();
    } finally {
      stack.length = 0;
      stack.push(...stackBackup);
    }
  }
  /**
   * @param {...(
   *   | ((node: any, name: string | null, number: number | null) => boolean)
   *   | undefined
   * )} predicates
   */
  match(...predicates) {
    let stackPointer = this.stack.length - 1;
    let name = null;
    let node = this.stack[stackPointer--];
    for (const predicate of predicates) {
      if (node === void 0) {
        return false;
      }
      let number = null;
      if (typeof name === "number") {
        number = name;
        name = this.stack[stackPointer--];
        node = this.stack[stackPointer--];
      }
      if (predicate && !predicate(node, name, number)) {
        return false;
      }
      name = this.stack[stackPointer--];
      node = this.stack[stackPointer--];
    }
    return true;
  }
  /**
   * Traverses the ancestors of the current node heading toward the tree root
   * until it finds a node that matches the provided predicate function. Will
   * return the first matching ancestor. If no such node exists, returns undefined.
   * @param {(node: any, name: string, number: number | null) => boolean} predicate
   * @internal Unstable API. Don't use in plugins for now.
   */
  findAncestor(predicate) {
    let stackPointer = this.stack.length - 1;
    let name = null;
    let node = this.stack[stackPointer--];
    while (node) {
      let number = null;
      if (typeof name === "number") {
        number = name;
        name = this.stack[stackPointer--];
        node = this.stack[stackPointer--];
      }
      if (name !== null && predicate(node, name, number)) {
        return node;
      }
      name = this.stack[stackPointer--];
      node = this.stack[stackPointer--];
    }
  }
};
var AstPath_default = AstPath;

// src/getTextsInWpBlock.ts
var getTextsInWpBlock = (text) => {
  const wpBlockStartLines = [
    ...text.matchAll(RegExp("(<!--)\\s*(wp:).*[^\\/][^\\/](-->)", "g"))
  ];
  const textsInWpBlock = wpBlockStartLines.map((match) => {
    if (!match.index || !match.input)
      return;
    const input = match.input;
    const index = match.index;
    const indexOfWpPrefixEnd = input.indexOf("wp:", index) + 3;
    if (indexOfWpPrefixEnd === -1)
      throw new Error("indexOfWpPrefixEnd is empty");
    const indexOfWpBlockName = input.indexOf(" ", indexOfWpPrefixEnd);
    if (indexOfWpBlockName === -1)
      throw new Error("indexOfWpBlockName is empty");
    const wpBlockName = input.slice(indexOfWpPrefixEnd, indexOfWpBlockName);
    const closeBlocks = [
      ...input.matchAll(
        RegExp(`(<!--)\\s*\\/\\s*(wp:${wpBlockName}).*(-->)`, "g")
      )
    ];
    const sameNameBlocks = [
      ...input.matchAll(RegExp(`(<!--)\\s*(wp:${wpBlockName}).*(-->)`, "g"))
    ];
    const indexOfWpStartBlockEnd = input.indexOf("-->", index) + 3;
    if (closeBlocks.length === 0) {
      throw new Error(`wp:${wpBlockName} closing block is not found`);
    }
    if (closeBlocks.length === 1) {
      const wpBlockInnerText2 = input.slice(
        indexOfWpStartBlockEnd,
        closeBlocks[0].index
      );
      return wpBlockInnerText2;
    }
    let mostNearCloseBlockIndex = 0;
    const mostNearCloseBlock = closeBlocks.reduce(
      (prev, current, currentIndex) => {
        if (!current.index || !prev.index) {
          mostNearCloseBlockIndex = currentIndex;
          return current;
        }
        if (index > current.index || index > prev.index) {
          mostNearCloseBlockIndex = currentIndex;
          return current;
        }
        if (prev.index - index > current.index - index) {
          mostNearCloseBlockIndex = currentIndex;
          return current;
        }
        if (prev.index - index < current.index - index) {
          return prev;
        }
        mostNearCloseBlockIndex = currentIndex;
        return current;
      }
    );
    const blocksBetweenCloseBlock = sameNameBlocks.filter((block) => {
      if (!block.index || !mostNearCloseBlock.index)
        return false;
      if (index < block.index && block.index < mostNearCloseBlock.index)
        return true;
    });
    const thisCloseBlock = closeBlocks[mostNearCloseBlockIndex + blocksBetweenCloseBlock.length];
    const wpBlockInnerText = input.slice(
      indexOfWpStartBlockEnd,
      thisCloseBlock.index
    );
    return wpBlockInnerText;
  });
  return textsInWpBlock;
};

// src/traverseAstIncludedWpBlock.ts
var flagInMultilineWpBlock = false;
var multilineWpBlockCount = 0;
var traverse = (nodes, astsInsideWpBlock) => {
  return nodes.reduce((prev, node) => {
    if (flagInMultilineWpBlock && node.type !== "comment") {
      if (node.children === void 0) {
        return [...prev];
      } else {
        return [...prev];
      }
    }
    if (node.type === "comment") {
      const trimmedValue = node.value.trim();
      const hasWpPrefix = trimmedValue.startsWith("wp:") || trimmedValue.startsWith("/wp:") || trimmedValue.startsWith("/ wp:");
      if (flagInMultilineWpBlock && !hasWpPrefix) {
        return [...prev];
      }
      if (!hasWpPrefix)
        return [...prev, node];
      const isSingleLine = trimmedValue.endsWith("/");
      const customNode2 = node;
      if (isSingleLine) {
        const removedSlashValue = trimmedValue.slice(0, -1).trimEnd();
        customNode2.value = removedSlashValue;
        customNode2.type = "wpblock";
        customNode2.name = "wpblock";
        if (flagInMultilineWpBlock) {
          return [...prev];
        } else {
          return [...prev, customNode2];
        }
      }
      const isEndWpBlock = trimmedValue.startsWith("/wp:") || trimmedValue.startsWith("/ wp:");
      if (isEndWpBlock) {
        if (flagInMultilineWpBlock) {
          flagInMultilineWpBlock = false;
          return [...prev];
        } else {
          return [...prev, node];
        }
      }
      if (!astsInsideWpBlock)
        return [...prev];
      customNode2.value = trimmedValue;
      customNode2.type = "wpblock";
      customNode2.name = "wpblock";
      customNode2.root = astsInsideWpBlock[multilineWpBlockCount];
      flagInMultilineWpBlock = true;
      multilineWpBlockCount++;
      return [...prev, customNode2];
    }
    if (node.children === void 0)
      return [...prev, node];
    const customNode = node;
    customNode.children = traverse(node.children, astsInsideWpBlock);
    return [...prev, customNode];
  }, []);
};
var traverseAstIncludedWpBlock = traverse;

// src/plugin.ts
var { group, indent, join, line, softline, hardline, breakParent } = import_doc.builders;
var languages = [
  {
    name: "custom-html",
    parsers: ["custom-html"]
  }
];
var HtmlParser = import_parser_html.parsers.html;
var astInPreprocess;
var parsers = {
  "custom-html": {
    ...HtmlParser,
    astFormat: "custom-html",
    preprocess: (text, options2) => {
      const ast = HtmlParser.parse(text, { html: HtmlParser }, options2);
      const astChildren = [...ast.children];
      astInPreprocess = ast;
      astInPreprocess.type = ast.type;
      astInPreprocess.sourceSpan = { ...ast.sourceSpan };
      const textsInWpBlock = getTextsInWpBlock(text);
      const astsInsideWpBlock = textsInWpBlock.map((text2) => {
        if (!text2)
          return;
        return HtmlParser.parse(text2, { html: HtmlParser }, options2);
      });
      const result = traverseAstIncludedWpBlock(astChildren, astsInsideWpBlock);
      astInPreprocess.children = result;
      return text;
    },
    parse: (text, parsers2, options2) => {
      return astInPreprocess;
    }
  }
};
var htmlPrinterBuiltInPrettier;
var preprocessOptions;
var printers = {
  "custom-html": {
    // ここら辺の型定義が崩壊しているが、preprocessの方もoptions.plugins経由でアクセスできるようで、かなりハック的ではあるものの一応動きはする
    // Ref: https://github.com/prettier/prettier/issues/8195#issuecomment-622591656
    preprocess: (ast, options2) => {
      htmlPrinterBuiltInPrettier = options2.plugins.find(
        // @ts-ignore
        (plugin) => plugin.printers && plugin.printers.html
      ).printers.html;
      preprocessOptions = options2;
      if (htmlPrinterBuiltInPrettier.preprocess === void 0)
        return ast;
      return htmlPrinterBuiltInPrettier.preprocess(ast, options2);
    },
    print: (path, options2, print) => {
      const defaultPrint = () => htmlPrinterBuiltInPrettier.print(path, options2, print);
      const node = path.getValue();
      if (node.type === "wpblock") {
        if (node.root === void 0) {
          return `<!-- ${node.value} /-->`;
        }
        const adjustAst = htmlPrinterBuiltInPrettier.preprocess(
          node.root,
          preprocessOptions
        );
        const astPath = new AstPath_default(adjustAst);
        const customPrint = (astPath2) => {
          const childNode = astPath2.map((childPath) => {
            const node2 = childPath.getValue();
            if (node2.type === "element") {
              return group([
                `<${node2.name}>`,
                breakParent,
                indent([line, group(childPath.call(customPrint, "children"))]),
                line,
                `</${node2.name}>`
              ]);
            }
            if (node2.children && node2.children.length !== 0) {
              return group(childPath.call(customPrint, "children"));
            }
            if (node2.type === "comment") {
              return group([line, "<!--", node2.value, "-->", hardline]);
            }
            return group([node2.value]);
          });
          return childNode;
        };
        const childrenDocs = astPath.call(customPrint, "children");
        return group([
          `<!-- ${node.value} -->`,
          indent([softline, childrenDocs]),
          softline,
          `<!-- /${node.value} -->`
        ]);
      }
      return defaultPrint();
    },
    insertPragma: (text) => {
      if (htmlPrinterBuiltInPrettier.insertPragma === void 0)
        return "";
      return htmlPrinterBuiltInPrettier.insertPragma(text);
    },
    massageAstNode: (node, newNode, parent) => {
      if (htmlPrinterBuiltInPrettier.massageAstNode === void 0)
        return void 0;
      return htmlPrinterBuiltInPrettier.massageAstNode(node, newNode, parent);
    },
    embed: (path, print, textToDoc, options2) => {
      if (htmlPrinterBuiltInPrettier.embed === void 0)
        return null;
      return htmlPrinterBuiltInPrettier.embed(path, print, textToDoc, options2);
    }
  }
};
var options = {
  // option: true,
};
var defaultOptions = {
  // option: false,
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  defaultOptions,
  languages,
  options,
  parsers,
  printers
});
