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
import GenAstPath from "./common/AstPath";

// const HtmlPrinter = require("./printer/index.js");
const { group, indent, join, line, softline, hardline, breakParent } = builders;

// https://prettier.io/docs/en/plugins.html
export const languages: Partial<SupportLanguage>[] = [
  {
    name: "custom-html",
    parsers: ["custom-html"],
  },
];

const HtmlParser = PrettierCoreParsers.html;
let flagInMultilineWpBlock: boolean = false;
let pendingCustomNode: any;

const traverse = (nodes: any[]): any[] => {
  return nodes.reduce((prev: any, node: any) => {
    if (flagInMultilineWpBlock && node.type !== "comment") {
      if (node.children === undefined) {
        pendingCustomNode.root.children.push(node);
        return [...prev];
      } else {
        // const customNode = node;
        // customNode.children = traverse(node.children);
        // pendingCustomNode.children.push(customNode);
        pendingCustomNode.root.children.push(node);
        return [...prev];
      }
    }

    if (node.type === "comment") {
      const trimmedValue = node.value.trim() as string;
      const hasWpPrefix =
        trimmedValue.startsWith("wp:") ||
        trimmedValue.startsWith("/wp:") ||
        trimmedValue.startsWith("/ wp:");

      if (flagInMultilineWpBlock && !hasWpPrefix) {
        pendingCustomNode.root.children.push(node);
        return [...prev];
      }
      if (!hasWpPrefix) return [...prev, node];

      const isSingleLine = trimmedValue.endsWith("/");
      const customNode = node;

      // プロパティを追加する場合は単行で完結するimgタグ等のASTを参考に
      if (isSingleLine) {
        const removedSlashValue = trimmedValue.slice(0, -1).trimEnd();
        customNode.value = removedSlashValue;
        customNode.type = "wpblock";
        customNode.name = "wpblock";

        if (flagInMultilineWpBlock) {
          pendingCustomNode.root.children.push(customNode);
          return [...prev];
        } else {
          return [...prev, customNode];
        }
      }

      const isEndWpBlock =
        trimmedValue.startsWith("/wp:") || trimmedValue.startsWith("/ wp:");
      if (isEndWpBlock) {
        if (flagInMultilineWpBlock) {
          flagInMultilineWpBlock = false;
          return [...prev, pendingCustomNode];
        } else {
          return [...prev, node];
        }
      }

      flagInMultilineWpBlock = true;
      customNode.value = trimmedValue;
      customNode.type = "wpblock";
      customNode.name = "wpblock";
      customNode.root = {
        type: "element",
        name: "div",
        children: [],
        attrs: [],
        sourceSpan: customNode.sourceSpan,
        startSourceSpan: customNode.sourceSpan,
        endSourceSpan: customNode.sourceSpan,
        nameSpan: customNode.sourceSpan,
        cssDisplay: "block",
      };

      pendingCustomNode = customNode;

      return [...prev];
    }

    if (node.children === undefined) return [...prev, node];

    const customNode = node;
    customNode.children = traverse(node.children);
    return [...prev, customNode];
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

// 以下のファイルがexportしているメソッドを持たせる
// Ref: https://github.com/prettier/prettier/blob/main/src/language-html/printer-html.js
export const printers: Record<string, CorrectPrinterType> = {
  "custom-html": {
    // ここら辺の型定義が崩壊しているが、preprocessの方もoptions.plugins経由でアクセスできるようで、かなりハック的ではあるものの一応動きはする
    // Ref: https://github.com/prettier/prettier/issues/8195#issuecomment-622591656
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
      const defaultPrint = () =>
        htmlPrinterBuiltInPrettier.print(path, options, print);
      const node = path.getValue();

      if (node.type === "wpblock") {
        if (node.root === undefined) {
          return `<!-- ${node.value} /-->`;
        }
        const astPath = new GenAstPath(node.root);

        const customPrint = (astPath: AstPath) => {
          return htmlPrinterBuiltInPrettier.print(
            astPath,
            options,
            customPrint
          );
        };
        const childrenDocs = customPrint(astPath);

        return group([
          `<!-- ${node.value} -->`,
          indent([softline, childrenDocs]),
          softline,
          `<!-- /${node.value} -->`,
        ]);
      }

      const hasWpPrefix = String(node.value).includes("wp:");
      const isSingleLineBlock = String(node.value).endsWith("/-->");
      const isWpEndBlock = String(node.value).startsWith("<!-- /wp:");
      // wp:プレフィックスを持つ、node.typeがcomment、単行のwpブロックでない
      if (hasWpPrefix && node.type === "comment" && !isSingleLineBlock) {
        // 後のprint処理をwp閉じタグまでスキップさせるための準備
        isInWpBlock = true;
        if (isWpEndBlock) {
          isInWpBlock = false;
          return defaultPrint();
        }

        return defaultPrint();
        // pendingDocs.push(defaultPrint);
        // return "";
      }

      if (isInWpBlock) {
        return defaultPrint();
        // console.log(node.type, node.value, node);
        // pendingDocs.push(defaultPrint);
        // return "";
      }

      return defaultPrint();
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
