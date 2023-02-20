import type { Parser, Printer, SupportLanguage, AST, AstPath } from "prettier";
import { parsers as PrettierCoreParsers } from "prettier/parser-html";
import { builders } from "prettier/doc";
const { group, indent } = builders;

// AstPath.getValue()の返り値
type Node = Record<string, any>;
// prettier 2.8.3にはなぜかPrinterにpreprocessが定義されていない
// Ref: https://github.com/prettier/prettier/issues/12683
type CorrectPrinterType = Printer & {
  preprocess: (ast: AST, options: Record<string, any>) => AST;
};

export const languages: Partial<SupportLanguage>[] = [
  {
    name: "wp-block-html",
    parsers: ["html"],
  },
];

const HtmlParser = PrettierCoreParsers.html;
export const parsers: Record<string, Parser> = {
  html: {
    ...HtmlParser,
    astFormat: "wp-block-html",
  },
};

// printer.print内で使用する
let htmlPrinterBuiltInPrettier: CorrectPrinterType;
const indentByWpBlock = {
  level: 0,
  increase: () => indentByWpBlock.level++,
  decrease: () => indentByWpBlock.level--,
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
const hasIsolatedParentType = (type: string) => {
  return isolatedParentTypes.includes(type);
};
const isWpBlock = (type: string, value?: string) => {
  return type === "comment" && value && value.includes("wp:");
};
const isWpEndBlock = (type: string, value?: string) => {
  if (type !== "comment" || !value || !value.includes("wp:")) return false;
  const trimmedValue = value.trim();
  return trimmedValue.startsWith("/");
};
// 要素間のwpブロックの数
const countsWpBlockBetweenElement: number[] = [];

// 以下のファイルがexportしているメソッドを持たせる
// Ref: https://github.com/prettier/prettier/blob/cf409fe6a458d080ed7f673a7347e00ec3c0b405/src/language-html/printer-html.js
export const printers: Record<string, CorrectPrinterType> = {
  "wp-block-html": {
    // 全体的に型定義が怪しくなっているが、preprocessの方もoptions.plugins経由でアクセスできるようで、ハック的ではあるものの意図した動作はする
    // Ref: https://github.com/prettier/prettier/issues/8195#issuecomment-622591656
    preprocess: (ast, options) => {
      // globパターンを使用したコマンドを打った時など、連続でフォーマットする場合に前回の処理に使用したデータが残っていることがあるのでリセットする
      indentByWpBlock.level = 0;
      increaseIndentBlockParent = undefined;
      decreaseIndentBlockParent = undefined;

      if (!("plugins" in options)) return ast;
      htmlPrinterBuiltInPrettier = options.plugins.find(
        (plugin: any) => plugin.printers && plugin.printers.html
      ).printers.html;
      if (htmlPrinterBuiltInPrettier.preprocess === undefined) return ast;
      return htmlPrinterBuiltInPrettier.preprocess(ast, options);
    },
    print: (path: AstPath<Node>, options, print) => {
      const defaultPrint = () =>
        htmlPrinterBuiltInPrettier.print(path, options, print);
      const node = path.getValue();

      if (indentByWpBlock.level !== 0 && !hasIsolatedParentType(node.type)) {
        if (node.parent.sourceSpan === increaseIndentBlockParent.sourceSpan) {
          if (!isWpBlock(node.type, node.value)) {
            countsWpBlockBetweenElement.push(indentByWpBlock.level);
          }
        } else {
          if (!isWpEndBlock(node.type, node.value)) {
            indentByWpBlock.level = 0;
            decreaseIndentBlockParent = node.parent;
          }
          if (!isWpBlock(node.type, node.value)) {
            return defaultPrint();
          }
        }
      }

      if (node.type === "comment" && node.value) {
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

      if (indentByWpBlock.level === 0 || hasIsolatedParentType(node.type)) {
        return defaultPrint();
      }

      // ここでdefaultPrintが発火し、childrenがなくなるまで print() の再帰処理が回りはじめる
      // この文以降の処理は上記の再帰処理が終わってから始まるが、別の print() 内でchildrenが無くなったときは先にそのノードが以降の処理を実行する
      // そのため、これ以降の処理は一番ネストの深いノードから浅いノードに向かって実行される
      let docWithCustomIndent = defaultPrint();

      const latestCount = countsWpBlockBetweenElement.pop();
      if (!latestCount) throw new Error("latestCount is undefined");

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
