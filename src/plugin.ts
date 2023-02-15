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

      console.log(node);

      if (indentByWpBlock.level !== 0) {
        if (
          // HTMLタグの属性が複数個あると改行される場合があり、そのときのparentはその属性を持つ要素になるので、この処理では対象外とする
          node.type !== "attribute" &&
          node.parent.sourceSpan !== increaseIndentBlockParent.sourceSpan
        ) {
          indentByWpBlock.decrease();
          decreaseIndentBlockParent = node.parent;
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

      // levelが0でないときでも、typeがattributeのノードはそれ以上のインデントが必要ないのでdefaultPrintで返す
      if (indentByWpBlock.level === 0 || node.type === "attribute") {
        return defaultPrint();
      }

      // ここでdefaultPrintが発火するので、print()が始まる
      let docWithCustomIndent = defaultPrint();
      // print()冒頭の条件分岐によってlevelが0になっているとき、以下のfor処理が終わっている
      // この再帰処理では子から処理が進んでいくので、最後に親をうまく処理するための形となっている
      if (indentByWpBlock.level === 0 && node.type === "element") {
        if (node.parent.sourceSpan !== decreaseIndentBlockParent.sourceSpan) {
          indentByWpBlock.increase();
          decreaseIndentBlockParent = node.parent;
        }
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
