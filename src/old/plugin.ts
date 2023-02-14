import { parsers as PrettierCoreParsers } from "prettier/parser-html";
import { builders } from "prettier/doc";
import type {
  Parser,
  Printer,
  SupportLanguage,
  AST,
  Doc,
  AstPath,
} from "prettier";
import GenAstPath from "../common/AstPath";
import { getTextsInWpBlock } from "./getTextsInWpBlock";
import { traverseAstIncludedWpBlock } from "./traverseAstIncludedWpBlock";

const { group, indent, line, softline, hardline, breakParent } = builders;

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
let preprocessOptions: object;

// 以下のファイルがexportしているメソッドを持たせる
// Ref: https://github.com/prettier/prettier/blob/main/src/language-html/printer-html.js
export const printers: Record<string, CorrectPrinterType> = {
  "custom-html": {
    // 全体的に型定義が雑になっているが、preprocessの方もoptions.plugins経由でアクセスできるようで、かなりハック的ではあるものの一応動きはする
    // Ref: https://github.com/prettier/prettier/issues/8195#issuecomment-622591656
    preprocess: (ast, options) => {
      // @ts-ignore
      htmlPrinterBuiltInPrettier = options.plugins.find(
        // @ts-ignore
        (plugin) => plugin.printers && plugin.printers.html
      ).printers.html;
      preprocessOptions = options;
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

        const adjustAst = htmlPrinterBuiltInPrettier.preprocess(
          node.root,
          preprocessOptions
        );
        const astPath = new GenAstPath(adjustAst);

        // 実質HTMLPrinterの再発明になるので、この設計方針は間違えているかもしれない（ここだけではなくコード全体に対して）
        // 本プラグインの前提条件は変わってしまうが、PrettierのHTMLPrinterのコードをフォークしてカスタマイズした方が良さそうなのは確か
        const customPrint = (astPath: AstPath) => {
          const childNode = astPath.map((childPath) => {
            const node = childPath.getValue() as any;

            if (node.type === "element") {
              return group([
                `<${node.name}>`,
                breakParent,
                indent([line, group(childPath.call(customPrint, "children"))]),
                line,
                `</${node.name}>`,
              ]);
            }
            if (node.children && node.children.length !== 0) {
              return group(childPath.call(customPrint, "children"));
            }
            if (node.type === "comment") {
              return group([line, "<!--", node.value, "-->", hardline]);
            }
            return group([node.value]);
          });
          return childNode;
        };
        const childrenDocs = astPath.call(customPrint, "children");

        return group([
          `<!-- ${node.value} -->`,
          indent([softline, childrenDocs]),
          softline,
          `<!-- /${node.value} -->`,
        ]);
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
