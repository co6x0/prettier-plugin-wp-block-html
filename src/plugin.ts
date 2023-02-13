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
import { getTextsInWpBlock } from "./getTextsInWpBlock";
import { traverseAstIncludedWpBlock } from "./traverseAstIncludedWpBlock";

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

      // parseの段階でwpブロックを見つけ出し、その範囲のtextだけをparseする。そして、それをcustomNode.rootに加える
      const textsInWpBlock = getTextsInWpBlock(text);
      const astsInsideWpBlock = textsInWpBlock.map((text) => {
        if (!text) return;
        return HtmlParser.parse(text, { html: HtmlParser }, options);
      });

      const result = traverseAstIncludedWpBlock(astChildren, astsInsideWpBlock);
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
          const node = astPath.getValue();
          console.log(node.type, astPath);
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
