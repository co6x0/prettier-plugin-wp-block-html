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
var { group, indent, join, line, softline, breakParent } = import_doc.builders;
var languages = [
  {
    name: "custom-html",
    parsers: ["custom-html"]
  }
];
var HtmlParser = import_parser_html.parsers.html;
var traverse = (nodes) => {
  return nodes.reduce((acc, node) => {
    if (node.type === "comment") {
      const trimmedValue = node.value.trim();
      const hasWpPrefix = trimmedValue.startsWith("wp:") || trimmedValue.startsWith("/wp:");
      if (!hasWpPrefix)
        return [...acc, node];
      const isSingleLine = trimmedValue.endsWith("/");
      const customNode2 = node;
      if (isSingleLine) {
        customNode2.value = `<!-- ${trimmedValue}-->`;
        customNode2.type = "comment";
        customNode2.name = "wp";
        customNode2.children = [];
        customNode2.attrs = [];
        customNode2.startSourceSpan = node.sourceSpan;
        customNode2.endSourceSpan = null;
        customNode2.i18n = null;
        customNode2.namespace = null;
        customNode2.hasExplicitNamespace = false;
        customNode2.tagDefinition = {
          closedByChildren: {},
          closedByParent: true,
          canSelfClose: false,
          isVoid: true,
          implicitNamespacePrefix: null,
          contentType: 2,
          ignoreFirstLf: false
        };
        return [...acc, customNode2];
      }
      customNode2.value = `<!-- ${trimmedValue} -->`;
      customNode2.type = "comment";
      return [...acc, customNode2];
    }
    if (node.children === void 0)
      return [...acc, node];
    const customNode = node;
    customNode.children = traverse(node.children);
    return [...acc, customNode];
  }, []);
};
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
      const result = traverse(astChildren);
      astInPreprocess.children = result;
      return text;
    },
    parse: (text, parsers2, options2) => {
      return astInPreprocess;
    }
  }
};
var htmlPrinterBuiltInPrettier;
var isInWpBlock = false;
var printers = {
  "custom-html": {
    // 以下のファイルがexportしているメソッドを持たせる
    // Ref: https://github.com/prettier/prettier/blob/main/src/language-html/printer-html.js
    // ここら辺の型定義が崩壊しているが、preprocessの方もoptions.plugins経由でアクセスできるようで、かなりハック的ではあるものの一応動きはする
    preprocess: (ast, options2) => {
      htmlPrinterBuiltInPrettier = options2.plugins.find(
        // @ts-ignore
        (plugin) => plugin.printers && plugin.printers.html
      ).printers.html;
      if (htmlPrinterBuiltInPrettier.preprocess === void 0)
        return ast;
      return htmlPrinterBuiltInPrettier.preprocess(ast, options2);
    },
    print: (path, options2, print) => {
      const defaultPrint = htmlPrinterBuiltInPrettier.print(
        path,
        options2,
        print
      );
      const node = path.getValue();
      const hasWpPrefix = String(node.value).includes("wp:");
      const isSingleLineBlock = String(node.value).endsWith("/-->");
      const isWpEndBlock = String(node.value).startsWith("<!-- /wp:");
      if (hasWpPrefix && node.type === "comment" && !isSingleLineBlock) {
        isInWpBlock = true;
        if (isWpEndBlock) {
          isInWpBlock = false;
          return defaultPrint;
        }
        return group(["  ", group([defaultPrint]), breakParent]);
      }
      if (isInWpBlock) {
        if (node.type === "text") {
          return defaultPrint;
        }
        if (node.type === "comment") {
          return group(["  ", defaultPrint]);
        }
        if (node.type === "element") {
          console.log("ELEMENT", node);
          return group(["  ", indent(["", defaultPrint])]);
        }
        return defaultPrint;
      }
      return defaultPrint;
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
