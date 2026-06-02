import type { Printer, SupportLanguage, AstPath, Plugin } from "prettier";
import {
  parsers as prettierHtmlParsers,
  printers as prettierHtmlPrinters,
} from "prettier/plugins/html";
import { builders } from "prettier/doc";
import { loadIfExistsESM } from "./plugins.js";

const { group, indent } = builders;

export const languages: SupportLanguage[] = [
  {
    name: "WordPress Block HTML",
    parsers: ["wp-block-html"],
    extensions: [".html"],
    vscodeLanguageIds: ["html"],
  },
];

const htmlParser = prettierHtmlParsers.html;
const htmlPrinter = prettierHtmlPrinters.html as Printer;
const tailwindPlugin = await loadIfExistsESM("prettier-plugin-tailwindcss");
const tailwindHtmlParserEntry = tailwindPlugin.parsers?.html as unknown;
const tailwindHtmlParser =
  typeof tailwindHtmlParserEntry === "function"
    ? await tailwindHtmlParserEntry()
    : tailwindHtmlParserEntry;

const wpBlockHtmlParser = {
  ...htmlParser,
  ...tailwindHtmlParser,
  astFormat: "wp-block-html",
};

export const parsers: Plugin["parsers"] = {
  "wp-block-html": wpBlockHtmlParser,
  html: wpBlockHtmlParser,
};

const indentByWpBlock = {
  level: 0,
  increase: () => indentByWpBlock.level++,
  decrease: () => {
    indentByWpBlock.level = Math.max(0, indentByWpBlock.level - 1);
  },
  levelToSpace: () => {
    const countOfSpace = indentByWpBlock.level * 2;
    const indentSpaces: string = "".padEnd(countOfSpace, " ");
    return indentSpaces;
  },
};
let increaseIndentBlockParent: any;
let decreaseIndentBlockParent: any;
// 他のノードに関係しない独立した親を持つノードタイプ
const isolatedParentTypes = ["attribute", "text"];
const getNodeKind = (node: any) => {
  return node?.kind ?? node?.type;
};
const hasIsolatedParentType = (node: any) => {
  return isolatedParentTypes.includes(getNodeKind(node));
};
const isWpBlock = (node: any) => {
  return getNodeKind(node) === "comment" && node.value?.includes("wp:");
};
const isWpEndBlock = (node: any) => {
  if (!isWpBlock(node)) return false;
  const trimmedValue = node.value.trim();
  return trimmedValue.startsWith("/");
};
// 要素間のwpブロックの数
const countsWpBlockBetweenElement: number[] = [];
const resetWpBlockIndent = () => {
  indentByWpBlock.level = 0;
  increaseIndentBlockParent = undefined;
  decreaseIndentBlockParent = undefined;
  countsWpBlockBetweenElement.length = 0;
};

// 以下のファイルがexportしているメソッドを持たせる
// Ref: https://github.com/prettier/prettier/blob/main/src/language-html/printer-html.js
export const printers: Record<string, Printer> = {
  "wp-block-html": {
    preprocess: async (ast, options) => {
      // globパターンを使用したコマンドを打った時など、連続でフォーマットする場合に前回の処理に使用したデータが残っていることがあるのでリセットする
      resetWpBlockIndent();

      if (htmlPrinter.preprocess === undefined) return ast;
      return htmlPrinter.preprocess(ast, options);
    },
    print: (path: AstPath<any>, options, print) => {
      const defaultPrint = () => htmlPrinter.print(path, options, print);
      const node = path.getValue();

      if (!node) return defaultPrint();

      if (indentByWpBlock.level !== 0 && !hasIsolatedParentType(node)) {
        if (node.parent?.sourceSpan === increaseIndentBlockParent?.sourceSpan) {
          if (!isWpBlock(node)) {
            countsWpBlockBetweenElement.push(indentByWpBlock.level);
          }
        } else {
          if (!isWpEndBlock(node)) {
            indentByWpBlock.level = 0;
            decreaseIndentBlockParent = node.parent;
          }
          if (!isWpBlock(node)) {
            return defaultPrint();
          }
        }
      }

      if (getNodeKind(node) === "comment" && node.value) {
        const valueText = node.value as string;
        if (!valueText.includes("wp:")) {
          return group([indentByWpBlock.levelToSpace(), defaultPrint()]);
        }

        const trimmedValue = valueText.trim();
        // Single line wp: block
        if (trimmedValue.endsWith("/")) {
          return group([
            indentByWpBlock.levelToSpace(),
            "<!-- ",
            trimmedValue.slice(0, -1).trim(),
            " /-->",
          ]);
        }
        // Multi line wp: block end
        if (trimmedValue.startsWith("/")) {
          indentByWpBlock.decrease();
          decreaseIndentBlockParent = node.parent;
          const endBlock = group([
            indentByWpBlock.levelToSpace(),
            "<!-- /",
            trimmedValue.slice(1, trimmedValue.length).trim(),
            " -->",
          ]);
          return endBlock;
        }
        // Multi line wp: block start
        const startBlock = group([
          indentByWpBlock.levelToSpace(),
          "<!-- ",
          trimmedValue,
          " -->",
        ]);
        indentByWpBlock.increase();
        increaseIndentBlockParent = node.parent;
        return startBlock;
      }

      if (indentByWpBlock.level === 0 || hasIsolatedParentType(node)) {
        return defaultPrint();
      }

      // ここでdefaultPrintが発火し、childrenがなくなるまで print() の再帰処理が回りはじめる
      // この文以降の処理は上記の再帰処理が終わってから始まるが、別の print() 内でchildrenが無くなったときは先にそのノードが以降の処理を実行する
      // そのため、これ以降の処理は一番ネストの深いノードから浅いノードに向かって実行される
      let docWithCustomIndent = defaultPrint();

      const latestCount = countsWpBlockBetweenElement.pop();
      if (!latestCount) return defaultPrint();

      indentByWpBlock.level = 0;
      increaseIndentBlockParent = node.parent;

      for (let i = 0; i < latestCount; i++) {
        indentByWpBlock.increase();
      }
      for (let i = 0; i < indentByWpBlock.level; i++) {
        docWithCustomIndent = indent([group([docWithCustomIndent])]);
      }

      docWithCustomIndent = group([
        indentByWpBlock.levelToSpace(),
        docWithCustomIndent,
      ]);
      return docWithCustomIndent;
    },
    insertPragma: (text) => {
      if (htmlPrinter.insertPragma === undefined) return "";
      return htmlPrinter.insertPragma(text);
    },
    massageAstNode: (node, newNode, parent) => {
      if (htmlPrinter.massageAstNode === undefined) return undefined;
      return htmlPrinter.massageAstNode(node, newNode, parent);
    },
    embed: (path, options) => {
      if (htmlPrinter.embed === undefined) return null;
      return htmlPrinter.embed(path, options);
    },
    getVisitorKeys: htmlPrinter.getVisitorKeys,
  },
};

const options = {
  // option: true,
};

const defaultOptions = {
  // option: false,
};

export { options, defaultOptions };
