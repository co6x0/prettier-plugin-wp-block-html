import { parsers as PrettierCoreParsers } from "prettier/parser-html";
import { builders } from "prettier/doc";
import type {
  Parser,
  Printer,
  SupportLanguage,
  AST,
  Doc,
  AstPath,
  ParserOptions,
} from "prettier";

// const HtmlPrinter = require("./printer/index.js");
const { group, indent, join, line, softline, breakParent } = builders;

// https://prettier.io/docs/en/plugins.html
export const languages: Partial<SupportLanguage>[] = [
  {
    name: "custom-html",
    parsers: ["custom-html"],
  },
];

const HtmlParser = PrettierCoreParsers.html;
const traverse = (nodes: any[]): any[] => {
  return nodes.reduce((acc: any, node: any) => {
    if (node.type === "comment") {
      const trimmedValue = node.value.trim() as string;
      const hasWpPrefix =
        trimmedValue.startsWith("wp:") || trimmedValue.startsWith("/wp:");
      if (!hasWpPrefix) return [...acc, node];

      const isSingleLine = trimmedValue.endsWith("/");
      const customNode = node;

      if (isSingleLine) {
        customNode.value = `<!-- ${trimmedValue}-->`;
        customNode.type = "comment";
        customNode.name = "wp";
        customNode.children = [];
        customNode.attrs = [];
        customNode.startSourceSpan = node.sourceSpan;
        customNode.endSourceSpan = null;
        customNode.i18n = null;
        customNode.namespace = null;
        customNode.hasExplicitNamespace = false;
        customNode.tagDefinition = {
          closedByChildren: {},
          closedByParent: true,
          canSelfClose: false,
          isVoid: true,
          implicitNamespacePrefix: null,
          contentType: 2,
          ignoreFirstLf: false,
        };

        //   nameSpan: s {
        //     start: n { file: [D], offset: 307, line: 14, col: 1 },
        //     end: n { file: [D], offset: 310, line: 14, col: 4 },
        //     details: null
        //   },
        return [...acc, customNode];
      }

      customNode.value = `<!-- ${trimmedValue} -->`;
      customNode.type = "comment";
      // customNode.sourceSpan = {
      //   start: node.sourceSpan,
      //   end: null,
      //   details: null,
      // };
      // customNode.name = "wp"
      // customNode.attr = []
      // customNode.children = node.children
      // customNode.i18n = null,
      // customNode.type = "element",
      // customNode.namespace = null,
      // customNode.hasExplicitNamespace = false,
      // tagDefinition: u {
      //   closedByChildren: {},
      //   closedByParent: false,
      //   canSelfClose: false,
      //   isVoid: false,
      //   implicitNamespacePrefix: null,
      //   contentType: 2,
      //   ignoreFirstLf: false
      // }
      // sourceSpan: s {
      //   start: n { file: [D], offset: 313, line: 15, col: 0 },
      //   end: n { file: [D], offset: 382, line: 19, col: 6 },
      //   details: null
      // },
      // startSourceSpan: s {
      //   start: n { file: [D], offset: 313, line: 15, col: 0 },
      //   end: n { file: [D], offset: 318, line: 15, col: 5 },
      //   details: null
      // },
      // endSourceSpan: s {
      //   start: n { file: [D], offset: 376, line: 19, col: 0 },
      //   end: n { file: [D], offset: 382, line: 19, col: 6 },
      //   details: null
      // },
      // nameSpan: s {
      //   start: n { file: [D], offset: 314, line: 15, col: 1 },
      //   end: n { file: [D], offset: 317, line: 15, col: 4 },
      //   details: null
      // },

      return [...acc, customNode];
    }

    if (node.children === undefined) return [...acc, node];

    const customNode = node;
    customNode.children = traverse(node.children);
    return [...acc, customNode];
  }, []);
};

let astInPreprocess: any;
export const parsers: Record<string, Parser> = {
  "custom-html": {
    ...HtmlParser,
    astFormat: "custom-html",
    preprocess: (text, options) => {
      const ast = HtmlParser.parse(text, { html: HtmlParser }, options);
      const astChildren = [...ast.children];
      astInPreprocess = ast;
      astInPreprocess.type = ast.type;
      astInPreprocess.sourceSpan = { ...ast.sourceSpan };

      const result = traverse(astChildren);
      astInPreprocess.children = result;

      return text;
    },
    parse: (text, parsers, options) => {
      return astInPreprocess;
    },
  },
};

// prettier 2.8.3にはなぜかPrinterにpreprocessが定義されていない
// Ref: https://github.com/prettier/prettier/issues/12683
type CorrectPrinterType = Printer & {
  preprocess: (ast: AST, options: object) => AST;
};
let htmlPrinterBuiltInPrettier: CorrectPrinterType;
let isInWpBlock: boolean = false;
let pendingDocs: Doc[] = [];

export const printers: Record<string, CorrectPrinterType> = {
  "custom-html": {
    // 以下のファイルがexportしているメソッドを持たせる
    // Ref: https://github.com/prettier/prettier/blob/main/src/language-html/printer-html.js
    // ここら辺の型定義が崩壊しているが、preprocessの方もoptions.plugins経由でアクセスできるようで、かなりハック的ではあるものの一応動きはする
    preprocess: (ast, options) => {
      // @ts-ignore
      htmlPrinterBuiltInPrettier = options.plugins.find(
        // @ts-ignore
        (plugin) => plugin.printers && plugin.printers.html
      ).printers.html;
      if (htmlPrinterBuiltInPrettier.preprocess === undefined) return ast;
      return htmlPrinterBuiltInPrettier.preprocess(ast, options);
    },
    print: (path, options, print) => {
      const defaultPrint = htmlPrinterBuiltInPrettier.print(
        path,
        options,
        print
      );
      const node = path.getValue();

      const hasWpPrefix = String(node.value).includes("wp:");
      const isSingleLineBlock = String(node.value).endsWith("/-->");
      const isWpEndBlock = String(node.value).startsWith("<!-- /wp:");
      // wp:プレフィックスを持つ、node.typeがcomment、単行のwpブロックでない
      if (hasWpPrefix && node.type === "comment" && !isSingleLineBlock) {
        // 後のprint処理をwp閉じタグまでスキップさせるための準備
        isInWpBlock = true;
        if (isWpEndBlock) {
          isInWpBlock = false;
          return defaultPrint;
        }

        return group(["  ", group([defaultPrint]), breakParent]);
        // pendingDocs.push(defaultPrint);
        // return "";
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
        // console.log(node.type, node.value, node);
        // pendingDocs.push(defaultPrint);
        // return "";
      }

      return defaultPrint;
    },
    insertPragma: (text) => {
      if (htmlPrinterBuiltInPrettier.insertPragma === undefined) return "";
      return htmlPrinterBuiltInPrettier.insertPragma(text);
    },
    massageAstNode: (node, newNode, parent) => {
      if (htmlPrinterBuiltInPrettier.massageAstNode === undefined)
        return undefined;
      return htmlPrinterBuiltInPrettier.massageAstNode(node, newNode, parent);
    },
    embed: (path, print, textToDoc, options) => {
      if (htmlPrinterBuiltInPrettier.embed === undefined) return null;
      return htmlPrinterBuiltInPrettier.embed(path, print, textToDoc, options);
    },
  },
};

const options = {
  // option: true,
};

const defaultOptions = {
  // option: false,
};

export { options, defaultOptions };
