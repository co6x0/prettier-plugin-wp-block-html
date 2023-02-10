"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b ||= {})
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// src/document/doc-builders.js
var require_doc_builders = __commonJS({
  "src/document/doc-builders.js"(exports2, module2) {
    "use strict";
    function assertDoc(val) {
      if (typeof val === "string") {
        return;
      }
      if (Array.isArray(val)) {
        for (const doc of val) {
          assertDoc(doc);
        }
        return;
      }
      if (val && typeof val.type === "string") {
        return;
      }
      throw new Error("Value " + JSON.stringify(val) + " is not a valid document");
    }
    function concat(parts) {
      if (process.env.NODE_ENV !== "production") {
        for (const part of parts) {
          assertDoc(part);
        }
      }
      return { type: "concat", parts };
    }
    function indent(contents) {
      if (process.env.NODE_ENV !== "production") {
        assertDoc(contents);
      }
      return { type: "indent", contents };
    }
    function align(widthOrString, contents) {
      if (process.env.NODE_ENV !== "production") {
        assertDoc(contents);
      }
      return { type: "align", contents, n: widthOrString };
    }
    function group2(contents, opts = {}) {
      if (process.env.NODE_ENV !== "production") {
        assertDoc(contents);
      }
      return {
        type: "group",
        id: opts.id,
        contents,
        break: Boolean(opts.shouldBreak),
        expandedStates: opts.expandedStates
      };
    }
    function dedentToRoot(contents) {
      return align(Number.NEGATIVE_INFINITY, contents);
    }
    function markAsRoot(contents) {
      return align({ type: "root" }, contents);
    }
    function dedent(contents) {
      return align(-1, contents);
    }
    function conditionalGroup(states, opts) {
      return group2(states[0], __spreadProps(__spreadValues({}, opts), { expandedStates: states }));
    }
    function fill2(parts) {
      if (process.env.NODE_ENV !== "production") {
        for (const part of parts) {
          assertDoc(part);
        }
      }
      return { type: "fill", parts };
    }
    function ifBreak(breakContents, flatContents, opts = {}) {
      if (process.env.NODE_ENV !== "production") {
        if (breakContents) {
          assertDoc(breakContents);
        }
        if (flatContents) {
          assertDoc(flatContents);
        }
      }
      return {
        type: "if-break",
        breakContents,
        flatContents,
        groupId: opts.groupId
      };
    }
    function indentIfBreak(contents, opts) {
      return {
        type: "indent-if-break",
        contents,
        groupId: opts.groupId,
        negate: opts.negate
      };
    }
    function lineSuffix(contents) {
      if (process.env.NODE_ENV !== "production") {
        assertDoc(contents);
      }
      return { type: "line-suffix", contents };
    }
    var lineSuffixBoundary = { type: "line-suffix-boundary" };
    var breakParent = { type: "break-parent" };
    var trim = { type: "trim" };
    var hardlineWithoutBreakParent = { type: "line", hard: true };
    var literallineWithoutBreakParent = {
      type: "line",
      hard: true,
      literal: true
    };
    var line = { type: "line" };
    var softline = { type: "line", soft: true };
    var hardline2 = concat([hardlineWithoutBreakParent, breakParent]);
    var literalline2 = concat([literallineWithoutBreakParent, breakParent]);
    var cursor = { type: "cursor", placeholder: Symbol("cursor") };
    function join(sep, arr) {
      const res = [];
      for (let i = 0; i < arr.length; i++) {
        if (i !== 0) {
          res.push(sep);
        }
        res.push(arr[i]);
      }
      return concat(res);
    }
    function addAlignmentToDoc(doc, size, tabWidth) {
      let aligned = doc;
      if (size > 0) {
        for (let i = 0; i < Math.floor(size / tabWidth); ++i) {
          aligned = indent(aligned);
        }
        aligned = align(size % tabWidth, aligned);
        aligned = align(Number.NEGATIVE_INFINITY, aligned);
      }
      return aligned;
    }
    function label(label2, contents) {
      return { type: "label", label: label2, contents };
    }
    module2.exports = {
      concat,
      join,
      line,
      softline,
      hardline: hardline2,
      literalline: literalline2,
      group: group2,
      conditionalGroup,
      fill: fill2,
      lineSuffix,
      lineSuffixBoundary,
      cursor,
      breakParent,
      ifBreak,
      trim,
      indent,
      indentIfBreak,
      align,
      addAlignmentToDoc,
      markAsRoot,
      dedentToRoot,
      dedent,
      hardlineWithoutBreakParent,
      literallineWithoutBreakParent,
      label
    };
  }
});

// src/common/end-of-line.js
var require_end_of_line = __commonJS({
  "src/common/end-of-line.js"(exports2, module2) {
    "use strict";
    function guessEndOfLine(text) {
      const index = text.indexOf("\r");
      if (index >= 0) {
        return text.charAt(index + 1) === "\n" ? "crlf" : "cr";
      }
      return "lf";
    }
    function convertEndOfLineToChars(value) {
      switch (value) {
        case "cr":
          return "\r";
        case "crlf":
          return "\r\n";
        default:
          return "\n";
      }
    }
    function countEndOfLineChars(text, eol) {
      let regex;
      switch (eol) {
        case "\n":
          regex = /\n/g;
          break;
        case "\r":
          regex = /\r/g;
          break;
        case "\r\n":
          regex = /\r\n/g;
          break;
        default:
          throw new Error(`Unexpected "eol" ${JSON.stringify(eol)}.`);
      }
      const endOfLines = text.match(regex);
      return endOfLines ? endOfLines.length : 0;
    }
    function normalizeEndOfLine(text) {
      return text.replace(/\r\n?/g, "\n");
    }
    module2.exports = {
      guessEndOfLine,
      convertEndOfLineToChars,
      countEndOfLineChars,
      normalizeEndOfLine
    };
  }
});

// src/utils/get-last.js
var require_get_last = __commonJS({
  "src/utils/get-last.js"(exports2, module2) {
    "use strict";
    var getLast = (arr) => arr[arr.length - 1];
    module2.exports = getLast;
  }
});

// vendors/string-width.js
var require_string_width = __commonJS({
  "vendors/string-width.js"(exports2, module2) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __commonJS2 = (cb, mod) => function __require() {
      return mod || (0, cb[__getOwnPropNames2(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    };
    var __export = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
      isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", { value: mod, enumerable: true }) : target,
      mod
    ));
    var __toCommonJS = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
    var require_emoji_regex = __commonJS2({
      "node_modules/emoji-regex/index.js"(exports3, module22) {
        "use strict";
        module22.exports = function() {
          return /\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67)\uDB40\uDC7F|(?:\uD83E\uDDD1\uD83C\uDFFF\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFE])|(?:\uD83E\uDDD1\uD83C\uDFFE\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFD\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFC\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFB\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFB\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFC-\uDFFF])|\uD83D\uDC68(?:\uD83C\uDFFB(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF]))|\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFC-\uDFFF])|[\u2695\u2696\u2708]\uFE0F|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))?|(?:\uD83C[\uDFFC-\uDFFF])\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF]))|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFE])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])\uFE0F|\u200D(?:(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D[\uDC66\uDC67])|\uD83C\uDFFF|\uD83C\uDFFE|\uD83C\uDFFD|\uD83C\uDFFC)?|(?:\uD83D\uDC69(?:\uD83C\uDFFB\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|(?:\uD83C[\uDFFC-\uDFFF])\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69]))|\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1)(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC69(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83E\uDDD1(?:\u200D(?:\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83E\uDDD1(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|\uD83D\uDC69(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|\uD83D\uDE36\u200D\uD83C\uDF2B|\uD83C\uDFF3\uFE0F\u200D\u26A7|\uD83D\uDC3B\u200D\u2744|(?:(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\uD83C\uDFF4\u200D\u2620|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD])\u200D[\u2640\u2642]|[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u2328\u23CF\u23ED-\u23EF\u23F1\u23F2\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB\u25FC\u2600-\u2604\u260E\u2611\u2618\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u2692\u2694-\u2697\u2699\u269B\u269C\u26A0\u26A7\u26B0\u26B1\u26C8\u26CF\u26D1\u26D3\u26E9\u26F0\u26F1\u26F4\u26F7\u26F8\u2702\u2708\u2709\u270F\u2712\u2714\u2716\u271D\u2721\u2733\u2734\u2744\u2747\u2763\u27A1\u2934\u2935\u2B05-\u2B07\u3030\u303D\u3297\u3299]|\uD83C[\uDD70\uDD71\uDD7E\uDD7F\uDE02\uDE37\uDF21\uDF24-\uDF2C\uDF36\uDF7D\uDF96\uDF97\uDF99-\uDF9B\uDF9E\uDF9F\uDFCD\uDFCE\uDFD4-\uDFDF\uDFF5\uDFF7]|\uD83D[\uDC3F\uDCFD\uDD49\uDD4A\uDD6F\uDD70\uDD73\uDD76-\uDD79\uDD87\uDD8A-\uDD8D\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA\uDECB\uDECD-\uDECF\uDEE0-\uDEE5\uDEE9\uDEF0\uDEF3])\uFE0F|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83D\uDE35\u200D\uD83D\uDCAB|\uD83D\uDE2E\u200D\uD83D\uDCA8|\uD83D\uDC15\u200D\uD83E\uDDBA|\uD83E\uDDD1(?:\uD83C\uDFFF|\uD83C\uDFFE|\uD83C\uDFFD|\uD83C\uDFFC|\uD83C\uDFFB)?|\uD83D\uDC69(?:\uD83C\uDFFF|\uD83C\uDFFE|\uD83C\uDFFD|\uD83C\uDFFC|\uD83C\uDFFB)?|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF6\uD83C\uDDE6|\uD83C\uDDF4\uD83C\uDDF2|\uD83D\uDC08\u200D\u2B1B|\u2764\uFE0F\u200D(?:\uD83D\uDD25|\uD83E\uDE79)|\uD83D\uDC41\uFE0F|\uD83C\uDFF3\uFE0F|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|[#\*0-9]\uFE0F\u20E3|\u2764\uFE0F|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])|\uD83C\uDFF4|(?:[\u270A\u270B]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDC8F\uDC91\uDCAA\uDD7A\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2\uDDD3\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270C\u270D]|\uD83D[\uDD74\uDD90])(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])|[\u270A\u270B]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC08\uDC15\uDC3B\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDC8F\uDC91\uDCAA\uDD7A\uDD95\uDD96\uDE2E\uDE35\uDE36\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2\uDDD3\uDDD5]|\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD]|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF]|[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF84\uDF86-\uDF93\uDFA0-\uDFC1\uDFC5\uDFC6\uDFC8\uDFC9\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC07\uDC09-\uDC14\uDC16-\uDC3A\uDC3C-\uDC3E\uDC40\uDC44\uDC45\uDC51-\uDC65\uDC6A\uDC79-\uDC7B\uDC7D-\uDC80\uDC84\uDC88-\uDC8E\uDC90\uDC92-\uDCA9\uDCAB-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDDA4\uDDFB-\uDE2D\uDE2F-\uDE34\uDE37-\uDE44\uDE48-\uDE4A\uDE80-\uDEA2\uDEA4-\uDEB3\uDEB7-\uDEBF\uDEC1-\uDEC5\uDED0-\uDED2\uDED5-\uDED7\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB]|\uD83E[\uDD0D\uDD0E\uDD10-\uDD17\uDD1D\uDD20-\uDD25\uDD27-\uDD2F\uDD3A\uDD3F-\uDD45\uDD47-\uDD76\uDD78\uDD7A-\uDDB4\uDDB7\uDDBA\uDDBC-\uDDCB\uDDD0\uDDE0-\uDDFF\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6]|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDED5-\uDED7\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB]|\uD83E[\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDD78\uDD7A-\uDDCB\uDDCD-\uDDFF\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26A7\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDED5-\uDED7\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEFC\uDFE0-\uDFEB]|\uD83E[\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDD78\uDD7A-\uDDCB\uDDCD-\uDDFF\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDC8F\uDC91\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1F\uDD26\uDD30-\uDD39\uDD3C-\uDD3E\uDD77\uDDB5\uDDB6\uDDB8\uDDB9\uDDBB\uDDCD-\uDDCF\uDDD1-\uDDDD])/g;
        };
      }
    });
    var string_width_exports = {};
    __export(string_width_exports, {
      default: () => stringWidth
    });
    module2.exports = __toCommonJS(string_width_exports);
    function ansiRegex({ onlyFirst = false } = {}) {
      const pattern = [
        "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
        "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))"
      ].join("|");
      return new RegExp(pattern, onlyFirst ? void 0 : "g");
    }
    function stripAnsi(string) {
      if (typeof string !== "string") {
        throw new TypeError(`Expected a \`string\`, got \`${typeof string}\``);
      }
      return string.replace(ansiRegex(), "");
    }
    function isFullwidthCodePoint(codePoint) {
      if (!Number.isInteger(codePoint)) {
        return false;
      }
      return codePoint >= 4352 && (codePoint <= 4447 || codePoint === 9001 || codePoint === 9002 || 11904 <= codePoint && codePoint <= 12871 && codePoint !== 12351 || 12880 <= codePoint && codePoint <= 19903 || 19968 <= codePoint && codePoint <= 42182 || 43360 <= codePoint && codePoint <= 43388 || 44032 <= codePoint && codePoint <= 55203 || 63744 <= codePoint && codePoint <= 64255 || 65040 <= codePoint && codePoint <= 65049 || 65072 <= codePoint && codePoint <= 65131 || 65281 <= codePoint && codePoint <= 65376 || 65504 <= codePoint && codePoint <= 65510 || 110592 <= codePoint && codePoint <= 110593 || 127488 <= codePoint && codePoint <= 127569 || 131072 <= codePoint && codePoint <= 262141);
    }
    var import_emoji_regex = __toESM(require_emoji_regex(), 1);
    function stringWidth(string) {
      if (typeof string !== "string" || string.length === 0) {
        return 0;
      }
      string = stripAnsi(string);
      if (string.length === 0) {
        return 0;
      }
      string = string.replace((0, import_emoji_regex.default)(), "  ");
      let width = 0;
      for (let index = 0; index < string.length; index++) {
        const codePoint = string.codePointAt(index);
        if (codePoint <= 31 || codePoint >= 127 && codePoint <= 159) {
          continue;
        }
        if (codePoint >= 768 && codePoint <= 879) {
          continue;
        }
        if (codePoint > 65535) {
          index++;
        }
        width += isFullwidthCodePoint(codePoint) ? 2 : 1;
      }
      return width;
    }
  }
});

// src/utils/get-string-width.js
var require_get_string_width = __commonJS({
  "src/utils/get-string-width.js"(exports2, module2) {
    "use strict";
    var stringWidth = require_string_width().default;
    var notAsciiRegex = /[^\x20-\x7F]/;
    function getStringWidth(text) {
      if (!text) {
        return 0;
      }
      if (!notAsciiRegex.test(text)) {
        return text.length;
      }
      return stringWidth(text);
    }
    module2.exports = getStringWidth;
  }
});

// src/document/doc-utils.js
var require_doc_utils = __commonJS({
  "src/document/doc-utils.js"(exports2, module2) {
    "use strict";
    var getLast = require_get_last();
    var { literalline: literalline2, join } = require_doc_builders();
    var isConcat2 = (doc) => Array.isArray(doc) || doc && doc.type === "concat";
    var getDocParts2 = (doc) => {
      if (Array.isArray(doc)) {
        return doc;
      }
      if (doc.type !== "concat" && doc.type !== "fill") {
        throw new Error("Expect doc type to be `concat` or `fill`.");
      }
      return doc.parts;
    };
    var traverseDocOnExitStackMarker = {};
    function traverseDoc(doc, onEnter, onExit, shouldTraverseConditionalGroups) {
      const docsStack = [doc];
      while (docsStack.length > 0) {
        const doc2 = docsStack.pop();
        if (doc2 === traverseDocOnExitStackMarker) {
          onExit(docsStack.pop());
          continue;
        }
        if (onExit) {
          docsStack.push(doc2, traverseDocOnExitStackMarker);
        }
        if (!onEnter || onEnter(doc2) !== false) {
          if (isConcat2(doc2) || doc2.type === "fill") {
            const parts = getDocParts2(doc2);
            for (let ic = parts.length, i = ic - 1; i >= 0; --i) {
              docsStack.push(parts[i]);
            }
          } else if (doc2.type === "if-break") {
            if (doc2.flatContents) {
              docsStack.push(doc2.flatContents);
            }
            if (doc2.breakContents) {
              docsStack.push(doc2.breakContents);
            }
          } else if (doc2.type === "group" && doc2.expandedStates) {
            if (shouldTraverseConditionalGroups) {
              for (let ic = doc2.expandedStates.length, i = ic - 1; i >= 0; --i) {
                docsStack.push(doc2.expandedStates[i]);
              }
            } else {
              docsStack.push(doc2.contents);
            }
          } else if (doc2.contents) {
            docsStack.push(doc2.contents);
          }
        }
      }
    }
    function mapDoc(doc, cb) {
      const mapped = /* @__PURE__ */ new Map();
      return rec(doc);
      function rec(doc2) {
        if (mapped.has(doc2)) {
          return mapped.get(doc2);
        }
        const result = process2(doc2);
        mapped.set(doc2, result);
        return result;
      }
      function process2(doc2) {
        if (Array.isArray(doc2)) {
          return cb(doc2.map(rec));
        }
        if (doc2.type === "concat" || doc2.type === "fill") {
          const parts = doc2.parts.map(rec);
          return cb(__spreadProps(__spreadValues({}, doc2), { parts }));
        }
        if (doc2.type === "if-break") {
          const breakContents = doc2.breakContents && rec(doc2.breakContents);
          const flatContents = doc2.flatContents && rec(doc2.flatContents);
          return cb(__spreadProps(__spreadValues({}, doc2), { breakContents, flatContents }));
        }
        if (doc2.type === "group" && doc2.expandedStates) {
          const expandedStates = doc2.expandedStates.map(rec);
          const contents = expandedStates[0];
          return cb(__spreadProps(__spreadValues({}, doc2), { contents, expandedStates }));
        }
        if (doc2.contents) {
          const contents = rec(doc2.contents);
          return cb(__spreadProps(__spreadValues({}, doc2), { contents }));
        }
        return cb(doc2);
      }
    }
    function findInDoc(doc, fn, defaultValue) {
      let result = defaultValue;
      let hasStopped = false;
      function findInDocOnEnterFn(doc2) {
        const maybeResult = fn(doc2);
        if (maybeResult !== void 0) {
          hasStopped = true;
          result = maybeResult;
        }
        if (hasStopped) {
          return false;
        }
      }
      traverseDoc(doc, findInDocOnEnterFn);
      return result;
    }
    function willBreakFn(doc) {
      if (doc.type === "group" && doc.break) {
        return true;
      }
      if (doc.type === "line" && doc.hard) {
        return true;
      }
      if (doc.type === "break-parent") {
        return true;
      }
    }
    function willBreak(doc) {
      return findInDoc(doc, willBreakFn, false);
    }
    function breakParentGroup(groupStack) {
      if (groupStack.length > 0) {
        const parentGroup = getLast(groupStack);
        if (!parentGroup.expandedStates && !parentGroup.break) {
          parentGroup.break = "propagated";
        }
      }
      return null;
    }
    function propagateBreaks(doc) {
      const alreadyVisitedSet = /* @__PURE__ */ new Set();
      const groupStack = [];
      function propagateBreaksOnEnterFn(doc2) {
        if (doc2.type === "break-parent") {
          breakParentGroup(groupStack);
        }
        if (doc2.type === "group") {
          groupStack.push(doc2);
          if (alreadyVisitedSet.has(doc2)) {
            return false;
          }
          alreadyVisitedSet.add(doc2);
        }
      }
      function propagateBreaksOnExitFn(doc2) {
        if (doc2.type === "group") {
          const group2 = groupStack.pop();
          if (group2.break) {
            breakParentGroup(groupStack);
          }
        }
      }
      traverseDoc(
        doc,
        propagateBreaksOnEnterFn,
        propagateBreaksOnExitFn,
        true
      );
    }
    function removeLinesFn(doc) {
      if (doc.type === "line" && !doc.hard) {
        return doc.soft ? "" : " ";
      }
      if (doc.type === "if-break") {
        return doc.flatContents || "";
      }
      return doc;
    }
    function removeLines(doc) {
      return mapDoc(doc, removeLinesFn);
    }
    var isHardline = (doc, nextDoc) => doc && doc.type === "line" && doc.hard && nextDoc && nextDoc.type === "break-parent";
    function stripDocTrailingHardlineFromDoc(doc) {
      if (!doc) {
        return doc;
      }
      if (isConcat2(doc) || doc.type === "fill") {
        const parts = getDocParts2(doc);
        while (parts.length > 1 && isHardline(...parts.slice(-2))) {
          parts.length -= 2;
        }
        if (parts.length > 0) {
          const lastPart = stripDocTrailingHardlineFromDoc(getLast(parts));
          parts[parts.length - 1] = lastPart;
        }
        return Array.isArray(doc) ? parts : __spreadProps(__spreadValues({}, doc), { parts });
      }
      switch (doc.type) {
        case "align":
        case "indent":
        case "indent-if-break":
        case "group":
        case "line-suffix":
        case "label": {
          const contents = stripDocTrailingHardlineFromDoc(doc.contents);
          return __spreadProps(__spreadValues({}, doc), { contents });
        }
        case "if-break": {
          const breakContents = stripDocTrailingHardlineFromDoc(doc.breakContents);
          const flatContents = stripDocTrailingHardlineFromDoc(doc.flatContents);
          return __spreadProps(__spreadValues({}, doc), { breakContents, flatContents });
        }
      }
      return doc;
    }
    function stripTrailingHardline(doc) {
      return stripDocTrailingHardlineFromDoc(cleanDoc2(doc));
    }
    function cleanDocFn(doc) {
      switch (doc.type) {
        case "fill":
          if (doc.parts.every((part) => part === "")) {
            return "";
          }
          break;
        case "group":
          if (!doc.contents && !doc.id && !doc.break && !doc.expandedStates) {
            return "";
          }
          if (doc.contents.type === "group" && doc.contents.id === doc.id && doc.contents.break === doc.break && doc.contents.expandedStates === doc.expandedStates) {
            return doc.contents;
          }
          break;
        case "align":
        case "indent":
        case "indent-if-break":
        case "line-suffix":
          if (!doc.contents) {
            return "";
          }
          break;
        case "if-break":
          if (!doc.flatContents && !doc.breakContents) {
            return "";
          }
          break;
      }
      if (!isConcat2(doc)) {
        return doc;
      }
      const parts = [];
      for (const part of getDocParts2(doc)) {
        if (!part) {
          continue;
        }
        const [currentPart, ...restParts] = isConcat2(part) ? getDocParts2(part) : [part];
        if (typeof currentPart === "string" && typeof getLast(parts) === "string") {
          parts[parts.length - 1] += currentPart;
        } else {
          parts.push(currentPart);
        }
        parts.push(...restParts);
      }
      if (parts.length === 0) {
        return "";
      }
      if (parts.length === 1) {
        return parts[0];
      }
      return Array.isArray(doc) ? parts : __spreadProps(__spreadValues({}, doc), { parts });
    }
    function cleanDoc2(doc) {
      return mapDoc(doc, (currentDoc) => cleanDocFn(currentDoc));
    }
    function normalizeParts(parts) {
      const newParts = [];
      const restParts = parts.filter(Boolean);
      while (restParts.length > 0) {
        const part = restParts.shift();
        if (!part) {
          continue;
        }
        if (isConcat2(part)) {
          restParts.unshift(...getDocParts2(part));
          continue;
        }
        if (newParts.length > 0 && typeof getLast(newParts) === "string" && typeof part === "string") {
          newParts[newParts.length - 1] += part;
          continue;
        }
        newParts.push(part);
      }
      return newParts;
    }
    function normalizeDoc(doc) {
      return mapDoc(doc, (currentDoc) => {
        if (Array.isArray(currentDoc)) {
          return normalizeParts(currentDoc);
        }
        if (!currentDoc.parts) {
          return currentDoc;
        }
        return __spreadProps(__spreadValues({}, currentDoc), {
          parts: normalizeParts(currentDoc.parts)
        });
      });
    }
    function replaceEndOfLine(doc) {
      return mapDoc(
        doc,
        (currentDoc) => typeof currentDoc === "string" && currentDoc.includes("\n") ? replaceTextEndOfLine2(currentDoc) : currentDoc
      );
    }
    function replaceTextEndOfLine2(text, replacement = literalline2) {
      return join(replacement, text.split("\n")).parts;
    }
    function canBreakFn(doc) {
      if (doc.type === "line") {
        return true;
      }
    }
    function canBreak(doc) {
      return findInDoc(doc, canBreakFn, false);
    }
    module2.exports = {
      isConcat: isConcat2,
      getDocParts: getDocParts2,
      willBreak,
      traverseDoc,
      findInDoc,
      mapDoc,
      propagateBreaks,
      removeLines,
      stripTrailingHardline,
      normalizeParts,
      normalizeDoc,
      cleanDoc: cleanDoc2,
      replaceTextEndOfLine: replaceTextEndOfLine2,
      replaceEndOfLine,
      canBreak
    };
  }
});

// src/document/doc-printer.js
var require_doc_printer = __commonJS({
  "src/document/doc-printer.js"(exports2, module2) {
    "use strict";
    var { convertEndOfLineToChars } = require_end_of_line();
    var getLast = require_get_last();
    var getStringWidth = require_get_string_width();
    var { fill: fill2, cursor, indent } = require_doc_builders();
    var { isConcat: isConcat2, getDocParts: getDocParts2 } = require_doc_utils();
    var groupModeMap;
    var MODE_BREAK = 1;
    var MODE_FLAT = 2;
    function rootIndent() {
      return { value: "", length: 0, queue: [] };
    }
    function makeIndent(ind, options) {
      return generateInd(ind, { type: "indent" }, options);
    }
    function makeAlign(indent2, widthOrDoc, options) {
      if (widthOrDoc === Number.NEGATIVE_INFINITY) {
        return indent2.root || rootIndent();
      }
      if (widthOrDoc < 0) {
        return generateInd(indent2, { type: "dedent" }, options);
      }
      if (!widthOrDoc) {
        return indent2;
      }
      if (widthOrDoc.type === "root") {
        return __spreadProps(__spreadValues({}, indent2), { root: indent2 });
      }
      const alignType = typeof widthOrDoc === "string" ? "stringAlign" : "numberAlign";
      return generateInd(indent2, { type: alignType, n: widthOrDoc }, options);
    }
    function generateInd(ind, newPart, options) {
      const queue = newPart.type === "dedent" ? ind.queue.slice(0, -1) : [...ind.queue, newPart];
      let value = "";
      let length = 0;
      let lastTabs = 0;
      let lastSpaces = 0;
      for (const part of queue) {
        switch (part.type) {
          case "indent":
            flush();
            if (options.useTabs) {
              addTabs(1);
            } else {
              addSpaces(options.tabWidth);
            }
            break;
          case "stringAlign":
            flush();
            value += part.n;
            length += part.n.length;
            break;
          case "numberAlign":
            lastTabs += 1;
            lastSpaces += part.n;
            break;
          default:
            throw new Error(`Unexpected type '${part.type}'`);
        }
      }
      flushSpaces();
      return __spreadProps(__spreadValues({}, ind), { value, length, queue });
      function addTabs(count) {
        value += "	".repeat(count);
        length += options.tabWidth * count;
      }
      function addSpaces(count) {
        value += " ".repeat(count);
        length += count;
      }
      function flush() {
        if (options.useTabs) {
          flushTabs();
        } else {
          flushSpaces();
        }
      }
      function flushTabs() {
        if (lastTabs > 0) {
          addTabs(lastTabs);
        }
        resetLast();
      }
      function flushSpaces() {
        if (lastSpaces > 0) {
          addSpaces(lastSpaces);
        }
        resetLast();
      }
      function resetLast() {
        lastTabs = 0;
        lastSpaces = 0;
      }
    }
    function trim(out) {
      if (out.length === 0) {
        return 0;
      }
      let trimCount = 0;
      while (out.length > 0 && typeof getLast(out) === "string" && /^[\t ]*$/.test(getLast(out))) {
        trimCount += out.pop().length;
      }
      if (out.length > 0 && typeof getLast(out) === "string") {
        const trimmed = getLast(out).replace(/[\t ]*$/, "");
        trimCount += getLast(out).length - trimmed.length;
        out[out.length - 1] = trimmed;
      }
      return trimCount;
    }
    function fits(next, restCommands, width, hasLineSuffix, mustBeFlat) {
      let restIdx = restCommands.length;
      const cmds = [next];
      const out = [];
      while (width >= 0) {
        if (cmds.length === 0) {
          if (restIdx === 0) {
            return true;
          }
          cmds.push(restCommands[--restIdx]);
          continue;
        }
        const { mode, doc } = cmds.pop();
        if (typeof doc === "string") {
          out.push(doc);
          width -= getStringWidth(doc);
        } else if (isConcat2(doc) || doc.type === "fill") {
          const parts = getDocParts2(doc);
          for (let i = parts.length - 1; i >= 0; i--) {
            cmds.push({ mode, doc: parts[i] });
          }
        } else {
          switch (doc.type) {
            case "indent":
            case "align":
            case "indent-if-break":
            case "label":
              cmds.push({ mode, doc: doc.contents });
              break;
            case "trim":
              width += trim(out);
              break;
            case "group": {
              if (mustBeFlat && doc.break) {
                return false;
              }
              const groupMode = doc.break ? MODE_BREAK : mode;
              const contents = doc.expandedStates && groupMode === MODE_BREAK ? getLast(doc.expandedStates) : doc.contents;
              cmds.push({ mode: groupMode, doc: contents });
              break;
            }
            case "if-break": {
              const groupMode = doc.groupId ? groupModeMap[doc.groupId] || MODE_FLAT : mode;
              const contents = groupMode === MODE_BREAK ? doc.breakContents : doc.flatContents;
              if (contents) {
                cmds.push({ mode, doc: contents });
              }
              break;
            }
            case "line":
              if (mode === MODE_BREAK || doc.hard) {
                return true;
              }
              if (!doc.soft) {
                out.push(" ");
                width--;
              }
              break;
            case "line-suffix":
              hasLineSuffix = true;
              break;
            case "line-suffix-boundary":
              if (hasLineSuffix) {
                return false;
              }
              break;
          }
        }
      }
      return false;
    }
    function printDocToString(doc, options) {
      groupModeMap = {};
      const width = options.printWidth;
      const newLine = convertEndOfLineToChars(options.endOfLine);
      let pos = 0;
      const cmds = [{ ind: rootIndent(), mode: MODE_BREAK, doc }];
      const out = [];
      let shouldRemeasure = false;
      const lineSuffix = [];
      while (cmds.length > 0) {
        const { ind, mode, doc: doc2 } = cmds.pop();
        if (typeof doc2 === "string") {
          const formatted = newLine !== "\n" ? doc2.replace(/\n/g, newLine) : doc2;
          out.push(formatted);
          pos += getStringWidth(formatted);
        } else if (isConcat2(doc2)) {
          const parts = getDocParts2(doc2);
          for (let i = parts.length - 1; i >= 0; i--) {
            cmds.push({ ind, mode, doc: parts[i] });
          }
        } else {
          switch (doc2.type) {
            case "cursor":
              out.push(cursor.placeholder);
              break;
            case "indent":
              cmds.push({ ind: makeIndent(ind, options), mode, doc: doc2.contents });
              break;
            case "align":
              cmds.push({
                ind: makeAlign(ind, doc2.n, options),
                mode,
                doc: doc2.contents
              });
              break;
            case "trim":
              pos -= trim(out);
              break;
            case "group":
              switch (mode) {
                case MODE_FLAT:
                  if (!shouldRemeasure) {
                    cmds.push({
                      ind,
                      mode: doc2.break ? MODE_BREAK : MODE_FLAT,
                      doc: doc2.contents
                    });
                    break;
                  }
                case MODE_BREAK: {
                  shouldRemeasure = false;
                  const next = { ind, mode: MODE_FLAT, doc: doc2.contents };
                  const rem = width - pos;
                  const hasLineSuffix = lineSuffix.length > 0;
                  if (!doc2.break && fits(next, cmds, rem, hasLineSuffix)) {
                    cmds.push(next);
                  } else {
                    if (doc2.expandedStates) {
                      const mostExpanded = getLast(doc2.expandedStates);
                      if (doc2.break) {
                        cmds.push({ ind, mode: MODE_BREAK, doc: mostExpanded });
                        break;
                      } else {
                        for (let i = 1; i < doc2.expandedStates.length + 1; i++) {
                          if (i >= doc2.expandedStates.length) {
                            cmds.push({ ind, mode: MODE_BREAK, doc: mostExpanded });
                            break;
                          } else {
                            const state = doc2.expandedStates[i];
                            const cmd = { ind, mode: MODE_FLAT, doc: state };
                            if (fits(cmd, cmds, rem, hasLineSuffix)) {
                              cmds.push(cmd);
                              break;
                            }
                          }
                        }
                      }
                    } else {
                      cmds.push({ ind, mode: MODE_BREAK, doc: doc2.contents });
                    }
                  }
                  break;
                }
              }
              if (doc2.id) {
                groupModeMap[doc2.id] = getLast(cmds).mode;
              }
              break;
            case "fill": {
              const rem = width - pos;
              const { parts } = doc2;
              if (parts.length === 0) {
                break;
              }
              const [content, whitespace] = parts;
              const contentFlatCmd = { ind, mode: MODE_FLAT, doc: content };
              const contentBreakCmd = { ind, mode: MODE_BREAK, doc: content };
              const contentFits = fits(
                contentFlatCmd,
                [],
                rem,
                lineSuffix.length > 0,
                true
              );
              if (parts.length === 1) {
                if (contentFits) {
                  cmds.push(contentFlatCmd);
                } else {
                  cmds.push(contentBreakCmd);
                }
                break;
              }
              const whitespaceFlatCmd = { ind, mode: MODE_FLAT, doc: whitespace };
              const whitespaceBreakCmd = { ind, mode: MODE_BREAK, doc: whitespace };
              if (parts.length === 2) {
                if (contentFits) {
                  cmds.push(whitespaceFlatCmd, contentFlatCmd);
                } else {
                  cmds.push(whitespaceBreakCmd, contentBreakCmd);
                }
                break;
              }
              parts.splice(0, 2);
              const remainingCmd = { ind, mode, doc: fill2(parts) };
              const secondContent = parts[0];
              const firstAndSecondContentFlatCmd = {
                ind,
                mode: MODE_FLAT,
                doc: [content, whitespace, secondContent]
              };
              const firstAndSecondContentFits = fits(
                firstAndSecondContentFlatCmd,
                [],
                rem,
                lineSuffix.length > 0,
                true
              );
              if (firstAndSecondContentFits) {
                cmds.push(remainingCmd, whitespaceFlatCmd, contentFlatCmd);
              } else if (contentFits) {
                cmds.push(remainingCmd, whitespaceBreakCmd, contentFlatCmd);
              } else {
                cmds.push(remainingCmd, whitespaceBreakCmd, contentBreakCmd);
              }
              break;
            }
            case "if-break":
            case "indent-if-break": {
              const groupMode = doc2.groupId ? groupModeMap[doc2.groupId] : mode;
              if (groupMode === MODE_BREAK) {
                const breakContents = doc2.type === "if-break" ? doc2.breakContents : doc2.negate ? doc2.contents : indent(doc2.contents);
                if (breakContents) {
                  cmds.push({ ind, mode, doc: breakContents });
                }
              }
              if (groupMode === MODE_FLAT) {
                const flatContents = doc2.type === "if-break" ? doc2.flatContents : doc2.negate ? indent(doc2.contents) : doc2.contents;
                if (flatContents) {
                  cmds.push({ ind, mode, doc: flatContents });
                }
              }
              break;
            }
            case "line-suffix":
              lineSuffix.push({ ind, mode, doc: doc2.contents });
              break;
            case "line-suffix-boundary":
              if (lineSuffix.length > 0) {
                cmds.push({ ind, mode, doc: { type: "line", hard: true } });
              }
              break;
            case "line":
              switch (mode) {
                case MODE_FLAT:
                  if (!doc2.hard) {
                    if (!doc2.soft) {
                      out.push(" ");
                      pos += 1;
                    }
                    break;
                  } else {
                    shouldRemeasure = true;
                  }
                case MODE_BREAK:
                  if (lineSuffix.length > 0) {
                    cmds.push({ ind, mode, doc: doc2 }, ...lineSuffix.reverse());
                    lineSuffix.length = 0;
                    break;
                  }
                  if (doc2.literal) {
                    if (ind.root) {
                      out.push(newLine, ind.root.value);
                      pos = ind.root.length;
                    } else {
                      out.push(newLine);
                      pos = 0;
                    }
                  } else {
                    pos -= trim(out);
                    out.push(newLine + ind.value);
                    pos = ind.length;
                  }
                  break;
              }
              break;
            case "label":
              cmds.push({ ind, mode, doc: doc2.contents });
              break;
            default:
          }
        }
        if (cmds.length === 0 && lineSuffix.length > 0) {
          cmds.push(...lineSuffix.reverse());
          lineSuffix.length = 0;
        }
      }
      const cursorPlaceholderIndex = out.indexOf(cursor.placeholder);
      if (cursorPlaceholderIndex !== -1) {
        const otherCursorPlaceholderIndex = out.indexOf(
          cursor.placeholder,
          cursorPlaceholderIndex + 1
        );
        const beforeCursor = out.slice(0, cursorPlaceholderIndex).join("");
        const aroundCursor = out.slice(cursorPlaceholderIndex + 1, otherCursorPlaceholderIndex).join("");
        const afterCursor = out.slice(otherCursorPlaceholderIndex + 1).join("");
        return {
          formatted: beforeCursor + aroundCursor + afterCursor,
          cursorNodeStart: beforeCursor.length,
          cursorNodeText: aroundCursor
        };
      }
      return { formatted: out.join("") };
    }
    module2.exports = { printDocToString };
  }
});

// src/document/doc-debug.js
var require_doc_debug = __commonJS({
  "src/document/doc-debug.js"(exports2, module2) {
    "use strict";
    var { isConcat: isConcat2, getDocParts: getDocParts2 } = require_doc_utils();
    function flattenDoc(doc) {
      if (!doc) {
        return "";
      }
      if (isConcat2(doc)) {
        const res = [];
        for (const part of getDocParts2(doc)) {
          if (isConcat2(part)) {
            res.push(...flattenDoc(part).parts);
          } else {
            const flattened = flattenDoc(part);
            if (flattened !== "") {
              res.push(flattened);
            }
          }
        }
        return { type: "concat", parts: res };
      }
      if (doc.type === "if-break") {
        return __spreadProps(__spreadValues({}, doc), {
          breakContents: flattenDoc(doc.breakContents),
          flatContents: flattenDoc(doc.flatContents)
        });
      }
      if (doc.type === "group") {
        return __spreadProps(__spreadValues({}, doc), {
          contents: flattenDoc(doc.contents),
          expandedStates: doc.expandedStates && doc.expandedStates.map(flattenDoc)
        });
      }
      if (doc.type === "fill") {
        return { type: "fill", parts: doc.parts.map(flattenDoc) };
      }
      if (doc.contents) {
        return __spreadProps(__spreadValues({}, doc), { contents: flattenDoc(doc.contents) });
      }
      return doc;
    }
    function printDocToDebug(doc) {
      const printedSymbols = /* @__PURE__ */ Object.create(null);
      const usedKeysForSymbols = /* @__PURE__ */ new Set();
      return printDoc(flattenDoc(doc));
      function printDoc(doc2, index, parentParts) {
        if (typeof doc2 === "string") {
          return JSON.stringify(doc2);
        }
        if (isConcat2(doc2)) {
          const printed = getDocParts2(doc2).map(printDoc).filter(Boolean);
          return printed.length === 1 ? printed[0] : `[${printed.join(", ")}]`;
        }
        if (doc2.type === "line") {
          const withBreakParent = Array.isArray(parentParts) && parentParts[index + 1] && parentParts[index + 1].type === "break-parent";
          if (doc2.literal) {
            return withBreakParent ? "literalline" : "literallineWithoutBreakParent";
          }
          if (doc2.hard) {
            return withBreakParent ? "hardline" : "hardlineWithoutBreakParent";
          }
          if (doc2.soft) {
            return "softline";
          }
          return "line";
        }
        if (doc2.type === "break-parent") {
          const afterHardline = Array.isArray(parentParts) && parentParts[index - 1] && parentParts[index - 1].type === "line" && parentParts[index - 1].hard;
          return afterHardline ? void 0 : "breakParent";
        }
        if (doc2.type === "trim") {
          return "trim";
        }
        if (doc2.type === "indent") {
          return "indent(" + printDoc(doc2.contents) + ")";
        }
        if (doc2.type === "align") {
          return doc2.n === Number.NEGATIVE_INFINITY ? "dedentToRoot(" + printDoc(doc2.contents) + ")" : doc2.n < 0 ? "dedent(" + printDoc(doc2.contents) + ")" : doc2.n.type === "root" ? "markAsRoot(" + printDoc(doc2.contents) + ")" : "align(" + JSON.stringify(doc2.n) + ", " + printDoc(doc2.contents) + ")";
        }
        if (doc2.type === "if-break") {
          return "ifBreak(" + printDoc(doc2.breakContents) + (doc2.flatContents ? ", " + printDoc(doc2.flatContents) : "") + (doc2.groupId ? (!doc2.flatContents ? ', ""' : "") + `, { groupId: ${printGroupId(doc2.groupId)} }` : "") + ")";
        }
        if (doc2.type === "indent-if-break") {
          const optionsParts = [];
          if (doc2.negate) {
            optionsParts.push("negate: true");
          }
          if (doc2.groupId) {
            optionsParts.push(`groupId: ${printGroupId(doc2.groupId)}`);
          }
          const options = optionsParts.length > 0 ? `, { ${optionsParts.join(", ")} }` : "";
          return `indentIfBreak(${printDoc(doc2.contents)}${options})`;
        }
        if (doc2.type === "group") {
          const optionsParts = [];
          if (doc2.break && doc2.break !== "propagated") {
            optionsParts.push("shouldBreak: true");
          }
          if (doc2.id) {
            optionsParts.push(`id: ${printGroupId(doc2.id)}`);
          }
          const options = optionsParts.length > 0 ? `, { ${optionsParts.join(", ")} }` : "";
          if (doc2.expandedStates) {
            return `conditionalGroup([${doc2.expandedStates.map((part) => printDoc(part)).join(",")}]${options})`;
          }
          return `group(${printDoc(doc2.contents)}${options})`;
        }
        if (doc2.type === "fill") {
          return `fill([${doc2.parts.map((part) => printDoc(part)).join(", ")}])`;
        }
        if (doc2.type === "line-suffix") {
          return "lineSuffix(" + printDoc(doc2.contents) + ")";
        }
        if (doc2.type === "line-suffix-boundary") {
          return "lineSuffixBoundary";
        }
        if (doc2.type === "label") {
          return `label(${JSON.stringify(doc2.label)}, ${printDoc(doc2.contents)})`;
        }
        throw new Error("Unknown doc type " + doc2.type);
      }
      function printGroupId(id) {
        if (typeof id !== "symbol") {
          return JSON.stringify(String(id));
        }
        if (id in printedSymbols) {
          return printedSymbols[id];
        }
        const prefix = String(id).slice(7, -1) || "symbol";
        for (let counter = 0; ; counter++) {
          const key = prefix + (counter > 0 ? ` #${counter}` : "");
          if (!usedKeysForSymbols.has(key)) {
            usedKeysForSymbols.add(key);
            return printedSymbols[id] = `Symbol.for(${JSON.stringify(key)})`;
          }
        }
      }
    }
    module2.exports = { printDocToDebug };
  }
});

// src/document/index.js
var require_document = __commonJS({
  "src/document/index.js"(exports2, module2) {
    "use strict";
    module2.exports = {
      builders: require_doc_builders(),
      printer: require_doc_printer(),
      utils: require_doc_utils(),
      debug: require_doc_debug()
    };
  }
});

// vendors/escape-string-regexp.js
var require_escape_string_regexp = __commonJS({
  "vendors/escape-string-regexp.js"(exports2, module2) {
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
    var escape_string_regexp_exports = {};
    __export(escape_string_regexp_exports, {
      default: () => escapeStringRegexp
    });
    module2.exports = __toCommonJS(escape_string_regexp_exports);
    function escapeStringRegexp(string) {
      if (typeof string !== "string") {
        throw new TypeError("Expected a string");
      }
      return string.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
    }
  }
});

// node_modules/semver/internal/debug.js
var require_debug = __commonJS({
  "node_modules/semver/internal/debug.js"(exports2, module2) {
    var debug = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...args) => console.error("SEMVER", ...args) : () => {
    };
    module2.exports = debug;
  }
});

// node_modules/semver/internal/constants.js
var require_constants = __commonJS({
  "node_modules/semver/internal/constants.js"(exports2, module2) {
    var SEMVER_SPEC_VERSION = "2.0.0";
    var MAX_LENGTH = 256;
    var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;
    var MAX_SAFE_COMPONENT_LENGTH = 16;
    module2.exports = {
      SEMVER_SPEC_VERSION,
      MAX_LENGTH,
      MAX_SAFE_INTEGER,
      MAX_SAFE_COMPONENT_LENGTH
    };
  }
});

// node_modules/semver/internal/re.js
var require_re = __commonJS({
  "node_modules/semver/internal/re.js"(exports2, module2) {
    var { MAX_SAFE_COMPONENT_LENGTH } = require_constants();
    var debug = require_debug();
    exports2 = module2.exports = {};
    var re = exports2.re = [];
    var src = exports2.src = [];
    var t = exports2.t = {};
    var R = 0;
    var createToken = (name, value, isGlobal) => {
      const index = R++;
      debug(name, index, value);
      t[name] = index;
      src[index] = value;
      re[index] = new RegExp(value, isGlobal ? "g" : void 0);
    };
    createToken("NUMERICIDENTIFIER", "0|[1-9]\\d*");
    createToken("NUMERICIDENTIFIERLOOSE", "[0-9]+");
    createToken("NONNUMERICIDENTIFIER", "\\d*[a-zA-Z-][a-zA-Z0-9-]*");
    createToken("MAINVERSION", `(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})`);
    createToken("MAINVERSIONLOOSE", `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})`);
    createToken("PRERELEASEIDENTIFIER", `(?:${src[t.NUMERICIDENTIFIER]}|${src[t.NONNUMERICIDENTIFIER]})`);
    createToken("PRERELEASEIDENTIFIERLOOSE", `(?:${src[t.NUMERICIDENTIFIERLOOSE]}|${src[t.NONNUMERICIDENTIFIER]})`);
    createToken("PRERELEASE", `(?:-(${src[t.PRERELEASEIDENTIFIER]}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`);
    createToken("PRERELEASELOOSE", `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`);
    createToken("BUILDIDENTIFIER", "[0-9A-Za-z-]+");
    createToken("BUILD", `(?:\\+(${src[t.BUILDIDENTIFIER]}(?:\\.${src[t.BUILDIDENTIFIER]})*))`);
    createToken("FULLPLAIN", `v?${src[t.MAINVERSION]}${src[t.PRERELEASE]}?${src[t.BUILD]}?`);
    createToken("FULL", `^${src[t.FULLPLAIN]}$`);
    createToken("LOOSEPLAIN", `[v=\\s]*${src[t.MAINVERSIONLOOSE]}${src[t.PRERELEASELOOSE]}?${src[t.BUILD]}?`);
    createToken("LOOSE", `^${src[t.LOOSEPLAIN]}$`);
    createToken("GTLT", "((?:<|>)?=?)");
    createToken("XRANGEIDENTIFIERLOOSE", `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
    createToken("XRANGEIDENTIFIER", `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`);
    createToken("XRANGEPLAIN", `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:${src[t.PRERELEASE]})?${src[t.BUILD]}?)?)?`);
    createToken("XRANGEPLAINLOOSE", `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:${src[t.PRERELEASELOOSE]})?${src[t.BUILD]}?)?)?`);
    createToken("XRANGE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`);
    createToken("XRANGELOOSE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("COERCE", `${"(^|[^\\d])(\\d{1,"}${MAX_SAFE_COMPONENT_LENGTH}})(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?(?:$|[^\\d])`);
    createToken("COERCERTL", src[t.COERCE], true);
    createToken("LONETILDE", "(?:~>?)");
    createToken("TILDETRIM", `(\\s*)${src[t.LONETILDE]}\\s+`, true);
    exports2.tildeTrimReplace = "$1~";
    createToken("TILDE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`);
    createToken("TILDELOOSE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("LONECARET", "(?:\\^)");
    createToken("CARETTRIM", `(\\s*)${src[t.LONECARET]}\\s+`, true);
    exports2.caretTrimReplace = "$1^";
    createToken("CARET", `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`);
    createToken("CARETLOOSE", `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("COMPARATORLOOSE", `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`);
    createToken("COMPARATOR", `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`);
    createToken("COMPARATORTRIM", `(\\s*)${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true);
    exports2.comparatorTrimReplace = "$1$2$3";
    createToken("HYPHENRANGE", `^\\s*(${src[t.XRANGEPLAIN]})\\s+-\\s+(${src[t.XRANGEPLAIN]})\\s*$`);
    createToken("HYPHENRANGELOOSE", `^\\s*(${src[t.XRANGEPLAINLOOSE]})\\s+-\\s+(${src[t.XRANGEPLAINLOOSE]})\\s*$`);
    createToken("STAR", "(<|>)?=?\\s*\\*");
    createToken("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
    createToken("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
  }
});

// node_modules/semver/internal/parse-options.js
var require_parse_options = __commonJS({
  "node_modules/semver/internal/parse-options.js"(exports2, module2) {
    var opts = ["includePrerelease", "loose", "rtl"];
    var parseOptions = (options) => !options ? {} : typeof options !== "object" ? { loose: true } : opts.filter((k) => options[k]).reduce((o, k) => {
      o[k] = true;
      return o;
    }, {});
    module2.exports = parseOptions;
  }
});

// node_modules/semver/internal/identifiers.js
var require_identifiers = __commonJS({
  "node_modules/semver/internal/identifiers.js"(exports2, module2) {
    var numeric = /^[0-9]+$/;
    var compareIdentifiers = (a, b) => {
      const anum = numeric.test(a);
      const bnum = numeric.test(b);
      if (anum && bnum) {
        a = +a;
        b = +b;
      }
      return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
    };
    var rcompareIdentifiers = (a, b) => compareIdentifiers(b, a);
    module2.exports = {
      compareIdentifiers,
      rcompareIdentifiers
    };
  }
});

// node_modules/semver/classes/semver.js
var require_semver = __commonJS({
  "node_modules/semver/classes/semver.js"(exports2, module2) {
    var debug = require_debug();
    var { MAX_LENGTH, MAX_SAFE_INTEGER } = require_constants();
    var { re, t } = require_re();
    var parseOptions = require_parse_options();
    var { compareIdentifiers } = require_identifiers();
    var SemVer = class {
      constructor(version, options) {
        options = parseOptions(options);
        if (version instanceof SemVer) {
          if (version.loose === !!options.loose && version.includePrerelease === !!options.includePrerelease) {
            return version;
          } else {
            version = version.version;
          }
        } else if (typeof version !== "string") {
          throw new TypeError(`Invalid Version: ${version}`);
        }
        if (version.length > MAX_LENGTH) {
          throw new TypeError(
            `version is longer than ${MAX_LENGTH} characters`
          );
        }
        debug("SemVer", version, options);
        this.options = options;
        this.loose = !!options.loose;
        this.includePrerelease = !!options.includePrerelease;
        const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL]);
        if (!m) {
          throw new TypeError(`Invalid Version: ${version}`);
        }
        this.raw = version;
        this.major = +m[1];
        this.minor = +m[2];
        this.patch = +m[3];
        if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
          throw new TypeError("Invalid major version");
        }
        if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
          throw new TypeError("Invalid minor version");
        }
        if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
          throw new TypeError("Invalid patch version");
        }
        if (!m[4]) {
          this.prerelease = [];
        } else {
          this.prerelease = m[4].split(".").map((id) => {
            if (/^[0-9]+$/.test(id)) {
              const num = +id;
              if (num >= 0 && num < MAX_SAFE_INTEGER) {
                return num;
              }
            }
            return id;
          });
        }
        this.build = m[5] ? m[5].split(".") : [];
        this.format();
      }
      format() {
        this.version = `${this.major}.${this.minor}.${this.patch}`;
        if (this.prerelease.length) {
          this.version += `-${this.prerelease.join(".")}`;
        }
        return this.version;
      }
      toString() {
        return this.version;
      }
      compare(other) {
        debug("SemVer.compare", this.version, this.options, other);
        if (!(other instanceof SemVer)) {
          if (typeof other === "string" && other === this.version) {
            return 0;
          }
          other = new SemVer(other, this.options);
        }
        if (other.version === this.version) {
          return 0;
        }
        return this.compareMain(other) || this.comparePre(other);
      }
      compareMain(other) {
        if (!(other instanceof SemVer)) {
          other = new SemVer(other, this.options);
        }
        return compareIdentifiers(this.major, other.major) || compareIdentifiers(this.minor, other.minor) || compareIdentifiers(this.patch, other.patch);
      }
      comparePre(other) {
        if (!(other instanceof SemVer)) {
          other = new SemVer(other, this.options);
        }
        if (this.prerelease.length && !other.prerelease.length) {
          return -1;
        } else if (!this.prerelease.length && other.prerelease.length) {
          return 1;
        } else if (!this.prerelease.length && !other.prerelease.length) {
          return 0;
        }
        let i = 0;
        do {
          const a = this.prerelease[i];
          const b = other.prerelease[i];
          debug("prerelease compare", i, a, b);
          if (a === void 0 && b === void 0) {
            return 0;
          } else if (b === void 0) {
            return 1;
          } else if (a === void 0) {
            return -1;
          } else if (a === b) {
            continue;
          } else {
            return compareIdentifiers(a, b);
          }
        } while (++i);
      }
      compareBuild(other) {
        if (!(other instanceof SemVer)) {
          other = new SemVer(other, this.options);
        }
        let i = 0;
        do {
          const a = this.build[i];
          const b = other.build[i];
          debug("prerelease compare", i, a, b);
          if (a === void 0 && b === void 0) {
            return 0;
          } else if (b === void 0) {
            return 1;
          } else if (a === void 0) {
            return -1;
          } else if (a === b) {
            continue;
          } else {
            return compareIdentifiers(a, b);
          }
        } while (++i);
      }
      inc(release, identifier) {
        switch (release) {
          case "premajor":
            this.prerelease.length = 0;
            this.patch = 0;
            this.minor = 0;
            this.major++;
            this.inc("pre", identifier);
            break;
          case "preminor":
            this.prerelease.length = 0;
            this.patch = 0;
            this.minor++;
            this.inc("pre", identifier);
            break;
          case "prepatch":
            this.prerelease.length = 0;
            this.inc("patch", identifier);
            this.inc("pre", identifier);
            break;
          case "prerelease":
            if (this.prerelease.length === 0) {
              this.inc("patch", identifier);
            }
            this.inc("pre", identifier);
            break;
          case "major":
            if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
              this.major++;
            }
            this.minor = 0;
            this.patch = 0;
            this.prerelease = [];
            break;
          case "minor":
            if (this.patch !== 0 || this.prerelease.length === 0) {
              this.minor++;
            }
            this.patch = 0;
            this.prerelease = [];
            break;
          case "patch":
            if (this.prerelease.length === 0) {
              this.patch++;
            }
            this.prerelease = [];
            break;
          case "pre":
            if (this.prerelease.length === 0) {
              this.prerelease = [0];
            } else {
              let i = this.prerelease.length;
              while (--i >= 0) {
                if (typeof this.prerelease[i] === "number") {
                  this.prerelease[i]++;
                  i = -2;
                }
              }
              if (i === -1) {
                this.prerelease.push(0);
              }
            }
            if (identifier) {
              if (compareIdentifiers(this.prerelease[0], identifier) === 0) {
                if (isNaN(this.prerelease[1])) {
                  this.prerelease = [identifier, 0];
                }
              } else {
                this.prerelease = [identifier, 0];
              }
            }
            break;
          default:
            throw new Error(`invalid increment argument: ${release}`);
        }
        this.format();
        this.raw = this.version;
        return this;
      }
    };
    module2.exports = SemVer;
  }
});

// node_modules/semver/functions/compare.js
var require_compare = __commonJS({
  "node_modules/semver/functions/compare.js"(exports2, module2) {
    var SemVer = require_semver();
    var compare = (a, b, loose) => new SemVer(a, loose).compare(new SemVer(b, loose));
    module2.exports = compare;
  }
});

// node_modules/semver/functions/lt.js
var require_lt = __commonJS({
  "node_modules/semver/functions/lt.js"(exports2, module2) {
    var compare = require_compare();
    var lt = (a, b, loose) => compare(a, b, loose) < 0;
    module2.exports = lt;
  }
});

// node_modules/semver/functions/gte.js
var require_gte = __commonJS({
  "node_modules/semver/functions/gte.js"(exports2, module2) {
    var compare = require_compare();
    var gte = (a, b, loose) => compare(a, b, loose) >= 0;
    module2.exports = gte;
  }
});

// src/utils/arrayify.js
var require_arrayify = __commonJS({
  "src/utils/arrayify.js"(exports2, module2) {
    "use strict";
    module2.exports = (object, keyName) => Object.entries(object).map(([key, value]) => __spreadValues({
      [keyName]: key
    }, value));
  }
});

// package.json
var require_package = __commonJS({
  "package.json"(exports2, module2) {
    module2.exports = {
      name: "prettier",
      version: "2.9.0-dev",
      description: "Prettier is an opinionated code formatter",
      bin: "./bin/prettier.js",
      repository: "prettier/prettier",
      funding: "https://github.com/prettier/prettier?sponsor=1",
      homepage: "https://prettier.io",
      author: "James Long",
      license: "MIT",
      main: "./index.js",
      browser: "./standalone.js",
      unpkg: "./standalone.js",
      engines: {
        node: ">=14"
      },
      files: [
        "index.js",
        "standalone.js",
        "src",
        "bin",
        "vendors"
      ],
      dependencies: {
        "@angular/compiler": "12.2.16",
        "@babel/code-frame": "7.18.6",
        "@babel/parser": "7.20.7",
        "@glimmer/syntax": "0.84.2",
        "@iarna/toml": "2.2.5",
        "@typescript-eslint/typescript-estree": "5.45.0",
        acorn: "8.8.1",
        "acorn-jsx": "5.3.2",
        "angular-estree-parser": "2.5.1",
        "angular-html-parser": "1.8.0",
        camelcase: "6.3.0",
        chalk: "5.0.1",
        "ci-info": "3.3.0",
        "cjk-regex": "2.0.1",
        "collapse-white-space": "1.0.6",
        cosmiconfig: "7.0.1",
        "css-units-list": "1.1.0",
        dashify: "2.0.0",
        diff: "5.0.0",
        editorconfig: "0.15.3",
        "editorconfig-to-prettier": "0.2.0",
        "escape-string-regexp": "5.0.0",
        espree: "9.4.1",
        esutils: "2.0.3",
        "fast-glob": "3.2.12",
        "fast-json-stable-stringify": "2.1.0",
        "file-entry-cache": "6.0.1",
        "find-cache-dir": "3.3.2",
        "find-parent-dir": "0.3.1",
        "flow-parser": "0.180.0",
        "get-stdin": "8.0.0",
        graphql: "15.6.1",
        "html-element-attributes": "3.1.0",
        "html-styles": "1.0.0",
        "html-tag-names": "2.0.1",
        ignore: "5.2.0",
        "jest-docblock": "28.1.1",
        json5: "2.2.2",
        leven: "4.0.0",
        "lines-and-columns": "2.0.3",
        "linguist-languages": "7.21.0",
        mem: "9.0.2",
        meriyah: "4.2.1",
        micromatch: "4.0.5",
        minimist: "1.2.6",
        "n-readlines": "1.0.1",
        outdent: "0.8.0",
        "parse-srcset": "ikatyang/parse-srcset#54eb9c1cb21db5c62b4d0e275d7249516df6f0ee",
        "please-upgrade-node": "3.2.0",
        "postcss-less": "3.1.4",
        "postcss-media-query-parser": "0.2.3",
        "postcss-scss": "2.1.1",
        "postcss-selector-parser": "2.2.3",
        "postcss-values-parser": "2.0.1",
        "regexp-util": "1.2.2",
        "remark-footnotes": "2.0.0",
        "remark-math": "3.0.1",
        "remark-parse": "8.0.3",
        resolve: "1.22.1",
        sdbm: "2.0.0",
        semver: "7.3.7",
        "string-width": "5.0.1",
        "strip-ansi": "7.0.1",
        typescript: "4.9.3",
        "unicode-regex": "3.0.0",
        unified: "9.2.1",
        vnopts: "1.0.2",
        wcwidth: "1.0.1",
        "yaml-unist-parser": "1.3.1"
      },
      devDependencies: {
        "@babel/core": "7.20.7",
        "@babel/preset-env": "7.20.2",
        "@babel/types": "7.20.7",
        "@esbuild-plugins/node-modules-polyfill": "0.1.4",
        "@glimmer/reference": "0.84.2",
        "@types/estree": "0.0.51",
        "@types/file-entry-cache": "5.0.2",
        "@types/find-cache-dir": "3.2.1",
        "@types/jest": "27.4.1",
        "@typescript-eslint/eslint-plugin": "5.36.2",
        "babel-jest": "27.5.1",
        benchmark: "2.1.4",
        "browserslist-to-esbuild": "1.2.0",
        "core-js": "3.26.1",
        "cross-env": "7.0.3",
        cspell: "5.19.7",
        enquirer: "2.3.6",
        esbuild: "0.16.10",
        "esbuild-visualizer": "0.4.0",
        eslint: "8.30.0",
        "eslint-config-prettier": "8.5.0",
        "eslint-formatter-friendly": "7.0.0",
        "eslint-plugin-compat": "4.0.2",
        "eslint-plugin-import": "2.26.0",
        "eslint-plugin-jest": "26.1.5",
        "eslint-plugin-prettier-internal-rules": "2.0.1",
        "eslint-plugin-react": "7.29.4",
        "eslint-plugin-regexp": "1.7.0",
        "eslint-plugin-unicorn": "43.0.0",
        "esm-utils": "3.0.0",
        execa: "6.1.0",
        jest: "27.5.1",
        "jest-snapshot-serializer-ansi": "1.0.0",
        "jest-snapshot-serializer-raw": "1.2.0",
        "jest-watch-typeahead": "1.0.0",
        "magic-string": "0.27.0",
        "node-actionlint": "1.2.2",
        "node-fetch": "3.2.10",
        "npm-run-all": "4.1.5",
        "path-browserify": "1.0.1",
        prettier: "2.8.3",
        "pretty-bytes": "6.0.0",
        rimraf: "3.0.2",
        "rollup-plugin-license": "2.7.0",
        "snapshot-diff": "0.9.0",
        tempy: "2.0.0"
      },
      scripts: {
        prepublishOnly: 'echo "Error: must publish from dist/" && exit 1',
        test: "jest",
        "test:dev-package": "cross-env INSTALL_PACKAGE=1 jest",
        "test:dist": "cross-env NODE_ENV=production jest",
        "test:dist-standalone": "cross-env NODE_ENV=production TEST_STANDALONE=1 jest",
        "test:integration": "jest tests/integration",
        "test:dist-lint": 'eslint --no-eslintrc --no-ignore --no-inline-config --config=./scripts/bundle-eslint-config.cjs "dist/**/*.{js,mjs}"',
        perf: "yarn && yarn build && cross-env NODE_ENV=production node ./dist/bin-prettier.js",
        "perf:inspect": "yarn && yarn build && cross-env NODE_ENV=production node --inspect-brk ./dist/bin-prettier.js",
        "perf:benchmark": "yarn perf --debug-benchmark",
        "perf:compare": "./scripts/benchmark/compare.sh",
        lint: "run-p lint:*",
        "lint:typecheck": "tsc",
        "lint:eslint": "cross-env EFF_NO_LINK_RULES=true eslint . --format friendly",
        "lint:changelog": "node ./scripts/lint-changelog.mjs",
        "lint:prettier": 'prettier . "!test*" --check',
        "lint:spellcheck": "cspell --no-progress --relative --dot --gitignore",
        "lint:deps": "node ./scripts/check-deps.mjs",
        "lint:actionlint": "node-actionlint",
        fix: "run-s fix:eslint fix:prettier",
        "fix:eslint": "yarn lint:eslint --fix",
        "fix:prettier": "yarn lint:prettier --write",
        build: "node ./scripts/build/build.mjs",
        "build:website": "node ./scripts/build-website.mjs",
        "vendors:bundle": "node ./scripts/vendors/bundle-vendors.mjs"
      },
      browserslist: [
        ">0.5%",
        "not ie 11",
        "not safari 5.1",
        "not op_mini all"
      ]
    };
  }
});

// node_modules/outdent/lib/index.js
var require_lib = __commonJS({
  "node_modules/outdent/lib/index.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.outdent = void 0;
    function noop() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
    }
    function createWeakMap() {
      if (typeof WeakMap !== "undefined") {
        return /* @__PURE__ */ new WeakMap();
      } else {
        return fakeSetOrMap();
      }
    }
    function fakeSetOrMap() {
      return {
        add: noop,
        delete: noop,
        get: noop,
        set: noop,
        has: function(k) {
          return false;
        }
      };
    }
    var hop = Object.prototype.hasOwnProperty;
    var has = function(obj, prop) {
      return hop.call(obj, prop);
    };
    function extend(target, source) {
      for (var prop in source) {
        if (has(source, prop)) {
          target[prop] = source[prop];
        }
      }
      return target;
    }
    var reLeadingNewline = /^[ \t]*(?:\r\n|\r|\n)/;
    var reTrailingNewline = /(?:\r\n|\r|\n)[ \t]*$/;
    var reStartsWithNewlineOrIsEmpty = /^(?:[\r\n]|$)/;
    var reDetectIndentation = /(?:\r\n|\r|\n)([ \t]*)(?:[^ \t\r\n]|$)/;
    var reOnlyWhitespaceWithAtLeastOneNewline = /^[ \t]*[\r\n][ \t\r\n]*$/;
    function _outdentArray(strings, firstInterpolatedValueSetsIndentationLevel, options) {
      var indentationLevel = 0;
      var match = strings[0].match(reDetectIndentation);
      if (match) {
        indentationLevel = match[1].length;
      }
      var reSource = "(\\r\\n|\\r|\\n).{0," + indentationLevel + "}";
      var reMatchIndent = new RegExp(reSource, "g");
      if (firstInterpolatedValueSetsIndentationLevel) {
        strings = strings.slice(1);
      }
      var newline = options.newline, trimLeadingNewline = options.trimLeadingNewline, trimTrailingNewline = options.trimTrailingNewline;
      var normalizeNewlines = typeof newline === "string";
      var l = strings.length;
      var outdentedStrings = strings.map(function(v, i) {
        v = v.replace(reMatchIndent, "$1");
        if (i === 0 && trimLeadingNewline) {
          v = v.replace(reLeadingNewline, "");
        }
        if (i === l - 1 && trimTrailingNewline) {
          v = v.replace(reTrailingNewline, "");
        }
        if (normalizeNewlines) {
          v = v.replace(/\r\n|\n|\r/g, function(_) {
            return newline;
          });
        }
        return v;
      });
      return outdentedStrings;
    }
    function concatStringsAndValues(strings, values) {
      var ret = "";
      for (var i = 0, l = strings.length; i < l; i++) {
        ret += strings[i];
        if (i < l - 1) {
          ret += values[i];
        }
      }
      return ret;
    }
    function isTemplateStringsArray(v) {
      return has(v, "raw") && has(v, "length");
    }
    function createInstance(options) {
      var arrayAutoIndentCache = createWeakMap();
      var arrayFirstInterpSetsIndentCache = createWeakMap();
      function outdent(stringsOrOptions) {
        var values = [];
        for (var _i = 1; _i < arguments.length; _i++) {
          values[_i - 1] = arguments[_i];
        }
        if (isTemplateStringsArray(stringsOrOptions)) {
          var strings = stringsOrOptions;
          var firstInterpolatedValueSetsIndentationLevel = (values[0] === outdent || values[0] === defaultOutdent) && reOnlyWhitespaceWithAtLeastOneNewline.test(strings[0]) && reStartsWithNewlineOrIsEmpty.test(strings[1]);
          var cache = firstInterpolatedValueSetsIndentationLevel ? arrayFirstInterpSetsIndentCache : arrayAutoIndentCache;
          var renderedArray = cache.get(strings);
          if (!renderedArray) {
            renderedArray = _outdentArray(strings, firstInterpolatedValueSetsIndentationLevel, options);
            cache.set(strings, renderedArray);
          }
          if (values.length === 0) {
            return renderedArray[0];
          }
          var rendered = concatStringsAndValues(renderedArray, firstInterpolatedValueSetsIndentationLevel ? values.slice(1) : values);
          return rendered;
        } else {
          return createInstance(extend(extend({}, options), stringsOrOptions || {}));
        }
      }
      var fullOutdent = extend(outdent, {
        string: function(str) {
          return _outdentArray([str], false, options)[0];
        }
      });
      return fullOutdent;
    }
    var defaultOutdent = createInstance({
      trimLeadingNewline: true,
      trimTrailingNewline: true
    });
    exports2.outdent = defaultOutdent;
    exports2.default = defaultOutdent;
    if (typeof module2 !== "undefined") {
      try {
        module2.exports = defaultOutdent;
        Object.defineProperty(defaultOutdent, "__esModule", { value: true });
        defaultOutdent.default = defaultOutdent;
        defaultOutdent.outdent = defaultOutdent;
      } catch (e) {
      }
    }
  }
});

// src/main/core-options.js
var require_core_options = __commonJS({
  "src/main/core-options.js"(exports2, module2) {
    "use strict";
    var { outdent } = require_lib();
    var CATEGORY_CONFIG = "Config";
    var CATEGORY_EDITOR = "Editor";
    var CATEGORY_FORMAT = "Format";
    var CATEGORY_OTHER = "Other";
    var CATEGORY_OUTPUT = "Output";
    var CATEGORY_GLOBAL = "Global";
    var CATEGORY_SPECIAL = "Special";
    var options = {
      cursorOffset: {
        since: "1.4.0",
        category: CATEGORY_SPECIAL,
        type: "int",
        default: -1,
        range: { start: -1, end: Number.POSITIVE_INFINITY, step: 1 },
        description: outdent`
      Print (to stderr) where a cursor at the given position would move to after formatting.
      This option cannot be used with --range-start and --range-end.
    `,
        cliCategory: CATEGORY_EDITOR
      },
      endOfLine: {
        since: "1.15.0",
        category: CATEGORY_GLOBAL,
        type: "choice",
        default: [
          { since: "1.15.0", value: "auto" },
          { since: "2.0.0", value: "lf" }
        ],
        description: "Which end of line characters to apply.",
        choices: [
          {
            value: "lf",
            description: "Line Feed only (\\n), common on Linux and macOS as well as inside git repos"
          },
          {
            value: "crlf",
            description: "Carriage Return + Line Feed characters (\\r\\n), common on Windows"
          },
          {
            value: "cr",
            description: "Carriage Return character only (\\r), used very rarely"
          },
          {
            value: "auto",
            description: outdent`
          Maintain existing
          (mixed values within one file are normalised by looking at what's used after the first line)
        `
          }
        ]
      },
      filepath: {
        since: "1.4.0",
        category: CATEGORY_SPECIAL,
        type: "path",
        description: "Specify the input filepath. This will be used to do parser inference.",
        cliName: "stdin-filepath",
        cliCategory: CATEGORY_OTHER,
        cliDescription: "Path to the file to pretend that stdin comes from."
      },
      insertPragma: {
        since: "1.8.0",
        category: CATEGORY_SPECIAL,
        type: "boolean",
        default: false,
        description: "Insert @format pragma into file's first docblock comment.",
        cliCategory: CATEGORY_OTHER
      },
      parser: {
        since: "0.0.10",
        category: CATEGORY_GLOBAL,
        type: "choice",
        default: [
          { since: "0.0.10", value: "babylon" },
          { since: "1.13.0", value: void 0 }
        ],
        description: "Which parser to use.",
        exception: (value) => typeof value === "string" || typeof value === "function",
        choices: [
          { value: "flow", description: "Flow" },
          { value: "babel", since: "1.16.0", description: "JavaScript" },
          { value: "babel-flow", since: "1.16.0", description: "Flow" },
          { value: "babel-ts", since: "2.0.0", description: "TypeScript" },
          { value: "typescript", since: "1.4.0", description: "TypeScript" },
          { value: "acorn", since: "2.6.0", description: "JavaScript" },
          { value: "espree", since: "2.2.0", description: "JavaScript" },
          { value: "meriyah", since: "2.2.0", description: "JavaScript" },
          { value: "css", since: "1.7.1", description: "CSS" },
          { value: "less", since: "1.7.1", description: "Less" },
          { value: "scss", since: "1.7.1", description: "SCSS" },
          { value: "json", since: "1.5.0", description: "JSON" },
          { value: "json5", since: "1.13.0", description: "JSON5" },
          {
            value: "json-stringify",
            since: "1.13.0",
            description: "JSON.stringify"
          },
          { value: "graphql", since: "1.5.0", description: "GraphQL" },
          { value: "markdown", since: "1.8.0", description: "Markdown" },
          { value: "mdx", since: "1.15.0", description: "MDX" },
          { value: "vue", since: "1.10.0", description: "Vue" },
          { value: "yaml", since: "1.14.0", description: "YAML" },
          { value: "glimmer", since: "2.3.0", description: "Ember / Handlebars" },
          { value: "html", since: "1.15.0", description: "HTML" },
          { value: "angular", since: "1.15.0", description: "Angular" },
          {
            value: "lwc",
            since: "1.17.0",
            description: "Lightning Web Components"
          }
        ]
      },
      plugins: {
        since: "1.10.0",
        type: "path",
        array: true,
        default: [{ value: [] }],
        category: CATEGORY_GLOBAL,
        description: "Add a plugin. Multiple plugins can be passed as separate `--plugin`s.",
        exception: (value) => typeof value === "string" || typeof value === "object",
        cliName: "plugin",
        cliCategory: CATEGORY_CONFIG
      },
      pluginSearchDirs: {
        since: "1.13.0",
        type: "path",
        array: true,
        default: [{ value: [] }],
        category: CATEGORY_GLOBAL,
        description: outdent`
      Custom directory that contains prettier plugins in node_modules subdirectory.
      Overrides default behavior when plugins are searched relatively to the location of Prettier.
      Multiple values are accepted.
    `,
        exception: (value) => typeof value === "string" || typeof value === "object",
        cliName: "plugin-search-dir",
        cliCategory: CATEGORY_CONFIG
      },
      printWidth: {
        since: "0.0.0",
        category: CATEGORY_GLOBAL,
        type: "int",
        default: 80,
        description: "The line length where Prettier will try wrap.",
        range: { start: 0, end: Number.POSITIVE_INFINITY, step: 1 }
      },
      rangeEnd: {
        since: "1.4.0",
        category: CATEGORY_SPECIAL,
        type: "int",
        default: Number.POSITIVE_INFINITY,
        range: { start: 0, end: Number.POSITIVE_INFINITY, step: 1 },
        description: outdent`
      Format code ending at a given character offset (exclusive).
      The range will extend forwards to the end of the selected statement.
      This option cannot be used with --cursor-offset.
    `,
        cliCategory: CATEGORY_EDITOR
      },
      rangeStart: {
        since: "1.4.0",
        category: CATEGORY_SPECIAL,
        type: "int",
        default: 0,
        range: { start: 0, end: Number.POSITIVE_INFINITY, step: 1 },
        description: outdent`
      Format code starting at a given character offset.
      The range will extend backwards to the start of the first line containing the selected statement.
      This option cannot be used with --cursor-offset.
    `,
        cliCategory: CATEGORY_EDITOR
      },
      requirePragma: {
        since: "1.7.0",
        category: CATEGORY_SPECIAL,
        type: "boolean",
        default: false,
        description: outdent`
      Require either '@prettier' or '@format' to be present in the file's first docblock comment
      in order for it to be formatted.
    `,
        cliCategory: CATEGORY_OTHER
      },
      tabWidth: {
        type: "int",
        category: CATEGORY_GLOBAL,
        default: 2,
        description: "Number of spaces per indentation level.",
        range: { start: 0, end: Number.POSITIVE_INFINITY, step: 1 }
      },
      useTabs: {
        since: "1.0.0",
        category: CATEGORY_GLOBAL,
        type: "boolean",
        default: false,
        description: "Indent with tabs instead of spaces."
      },
      embeddedLanguageFormatting: {
        since: "2.1.0",
        category: CATEGORY_GLOBAL,
        type: "choice",
        default: [{ since: "2.1.0", value: "auto" }],
        description: "Control how Prettier formats quoted code embedded in the file.",
        choices: [
          {
            value: "auto",
            description: "Format embedded code if Prettier can automatically identify it."
          },
          {
            value: "off",
            description: "Never automatically format embedded code."
          }
        ]
      }
    };
    module2.exports = {
      CATEGORY_CONFIG,
      CATEGORY_EDITOR,
      CATEGORY_FORMAT,
      CATEGORY_OTHER,
      CATEGORY_OUTPUT,
      CATEGORY_GLOBAL,
      CATEGORY_SPECIAL,
      options
    };
  }
});

// src/main/support.js
var require_support = __commonJS({
  "src/main/support.js"(exports2, module2) {
    "use strict";
    var semver = {
      compare: require_compare(),
      lt: require_lt(),
      gte: require_gte()
    };
    var arrayify = require_arrayify();
    var currentVersion = require_package().version;
    var coreOptions = require_core_options().options;
    function getSupportInfo({
      plugins = [],
      showUnreleased = false,
      showDeprecated = false,
      showInternal = false
    } = {}) {
      const version = currentVersion.split("-", 1)[0];
      const languages = plugins.flatMap((plugin) => plugin.languages || []).filter(filterSince);
      const options = arrayify(
        Object.assign({}, ...plugins.map(({ options: options2 }) => options2), coreOptions),
        "name"
      ).filter((option) => filterSince(option) && filterDeprecated(option)).sort((a, b) => a.name === b.name ? 0 : a.name < b.name ? -1 : 1).map(mapInternal).map((option) => {
        option = __spreadValues({}, option);
        if (Array.isArray(option.default)) {
          option.default = option.default.length === 1 ? option.default[0].value : option.default.filter(filterSince).sort(
            (info1, info2) => semver.compare(info2.since, info1.since)
          )[0].value;
        }
        if (Array.isArray(option.choices)) {
          option.choices = option.choices.filter(
            (option2) => filterSince(option2) && filterDeprecated(option2)
          );
          if (option.name === "parser") {
            collectParsersFromLanguages(option, languages, plugins);
          }
        }
        const pluginDefaults = Object.fromEntries(
          plugins.filter(
            (plugin) => plugin.defaultOptions && plugin.defaultOptions[option.name] !== void 0
          ).map((plugin) => [plugin.name, plugin.defaultOptions[option.name]])
        );
        return __spreadProps(__spreadValues({}, option), { pluginDefaults });
      });
      return { languages, options };
      function filterSince(object) {
        return showUnreleased || !("since" in object) || object.since && semver.gte(version, object.since);
      }
      function filterDeprecated(object) {
        return showDeprecated || !("deprecated" in object) || object.deprecated && semver.lt(version, object.deprecated);
      }
      function mapInternal(object) {
        if (showInternal) {
          return object;
        }
        const _a = object, { cliName, cliCategory, cliDescription } = _a, newObject = __objRest(_a, ["cliName", "cliCategory", "cliDescription"]);
        return newObject;
      }
    }
    function collectParsersFromLanguages(option, languages, plugins) {
      const existingValues = new Set(option.choices.map((choice) => choice.value));
      for (const language of languages) {
        if (language.parsers) {
          for (const value of language.parsers) {
            if (!existingValues.has(value)) {
              existingValues.add(value);
              const plugin = plugins.find(
                (plugin2) => plugin2.parsers && plugin2.parsers[value]
              );
              let description = language.name;
              if (plugin && plugin.name) {
                description += ` (plugin: ${plugin.name})`;
              }
              option.choices.push({ value, description });
            }
          }
        }
      }
    }
    module2.exports = {
      getSupportInfo
    };
  }
});

// src/utils/is-non-empty-array.js
var require_is_non_empty_array = __commonJS({
  "src/utils/is-non-empty-array.js"(exports2, module2) {
    "use strict";
    function isNonEmptyArray(object) {
      return Array.isArray(object) && object.length > 0;
    }
    module2.exports = isNonEmptyArray;
  }
});

// src/utils/text/skip.js
var require_skip = __commonJS({
  "src/utils/text/skip.js"(exports2, module2) {
    "use strict";
    function skip(chars) {
      return (text, index, opts) => {
        const backwards = opts && opts.backwards;
        if (index === false) {
          return false;
        }
        const { length } = text;
        let cursor = index;
        while (cursor >= 0 && cursor < length) {
          const c = text.charAt(cursor);
          if (chars instanceof RegExp) {
            if (!chars.test(c)) {
              return cursor;
            }
          } else if (!chars.includes(c)) {
            return cursor;
          }
          backwards ? cursor-- : cursor++;
        }
        if (cursor === -1 || cursor === length) {
          return cursor;
        }
        return false;
      };
    }
    var skipWhitespace = skip(/\s/);
    var skipSpaces = skip(" 	");
    var skipToLineEnd = skip(",; 	");
    var skipEverythingButNewLine = skip(/[^\n\r]/);
    module2.exports = {
      skipWhitespace,
      skipSpaces,
      skipToLineEnd,
      skipEverythingButNewLine
    };
  }
});

// src/utils/text/skip-inline-comment.js
var require_skip_inline_comment = __commonJS({
  "src/utils/text/skip-inline-comment.js"(exports2, module2) {
    "use strict";
    function skipInlineComment(text, index) {
      if (index === false) {
        return false;
      }
      if (text.charAt(index) === "/" && text.charAt(index + 1) === "*") {
        for (let i = index + 2; i < text.length; ++i) {
          if (text.charAt(i) === "*" && text.charAt(i + 1) === "/") {
            return i + 2;
          }
        }
      }
      return index;
    }
    module2.exports = skipInlineComment;
  }
});

// src/utils/text/skip-trailing-comment.js
var require_skip_trailing_comment = __commonJS({
  "src/utils/text/skip-trailing-comment.js"(exports2, module2) {
    "use strict";
    var { skipEverythingButNewLine } = require_skip();
    function skipTrailingComment(text, index) {
      if (index === false) {
        return false;
      }
      if (text.charAt(index) === "/" && text.charAt(index + 1) === "/") {
        return skipEverythingButNewLine(text, index);
      }
      return index;
    }
    module2.exports = skipTrailingComment;
  }
});

// src/utils/text/skip-newline.js
var require_skip_newline = __commonJS({
  "src/utils/text/skip-newline.js"(exports2, module2) {
    "use strict";
    function skipNewline(text, index, opts) {
      const backwards = opts && opts.backwards;
      if (index === false) {
        return false;
      }
      const atIndex = text.charAt(index);
      if (backwards) {
        if (text.charAt(index - 1) === "\r" && atIndex === "\n") {
          return index - 2;
        }
        if (atIndex === "\n" || atIndex === "\r" || atIndex === "\u2028" || atIndex === "\u2029") {
          return index - 1;
        }
      } else {
        if (atIndex === "\r" && text.charAt(index + 1) === "\n") {
          return index + 2;
        }
        if (atIndex === "\n" || atIndex === "\r" || atIndex === "\u2028" || atIndex === "\u2029") {
          return index + 1;
        }
      }
      return index;
    }
    module2.exports = skipNewline;
  }
});

// src/utils/text/get-next-non-space-non-comment-character-index-with-start-index.js
var require_get_next_non_space_non_comment_character_index_with_start_index = __commonJS({
  "src/utils/text/get-next-non-space-non-comment-character-index-with-start-index.js"(exports2, module2) {
    "use strict";
    var skipInlineComment = require_skip_inline_comment();
    var skipNewline = require_skip_newline();
    var skipTrailingComment = require_skip_trailing_comment();
    var { skipSpaces } = require_skip();
    function getNextNonSpaceNonCommentCharacterIndexWithStartIndex(text, idx) {
      let oldIdx = null;
      let nextIdx = idx;
      while (nextIdx !== oldIdx) {
        oldIdx = nextIdx;
        nextIdx = skipSpaces(text, nextIdx);
        nextIdx = skipInlineComment(text, nextIdx);
        nextIdx = skipTrailingComment(text, nextIdx);
        nextIdx = skipNewline(text, nextIdx);
      }
      return nextIdx;
    }
    module2.exports = getNextNonSpaceNonCommentCharacterIndexWithStartIndex;
  }
});

// src/common/util.js
var require_util = __commonJS({
  "src/common/util.js"(exports2, module2) {
    "use strict";
    var {
      default: escapeStringRegexp
    } = require_escape_string_regexp();
    var getLast = require_get_last();
    var { getSupportInfo } = require_support();
    var isNonEmptyArray = require_is_non_empty_array();
    var getStringWidth = require_get_string_width();
    var {
      skipWhitespace,
      skipSpaces,
      skipToLineEnd,
      skipEverythingButNewLine
    } = require_skip();
    var skipInlineComment = require_skip_inline_comment();
    var skipTrailingComment = require_skip_trailing_comment();
    var skipNewline = require_skip_newline();
    var getNextNonSpaceNonCommentCharacterIndexWithStartIndex = require_get_next_non_space_non_comment_character_index_with_start_index();
    var getPenultimate = (arr) => arr[arr.length - 2];
    function skip(chars) {
      return (text, index, opts) => {
        const backwards = opts && opts.backwards;
        if (index === false) {
          return false;
        }
        const { length } = text;
        let cursor = index;
        while (cursor >= 0 && cursor < length) {
          const c = text.charAt(cursor);
          if (chars instanceof RegExp) {
            if (!chars.test(c)) {
              return cursor;
            }
          } else if (!chars.includes(c)) {
            return cursor;
          }
          backwards ? cursor-- : cursor++;
        }
        if (cursor === -1 || cursor === length) {
          return cursor;
        }
        return false;
      };
    }
    function hasNewline(text, index, opts = {}) {
      const idx = skipSpaces(text, opts.backwards ? index - 1 : index, opts);
      const idx2 = skipNewline(text, idx, opts);
      return idx !== idx2;
    }
    function hasNewlineInRange(text, start, end) {
      for (let i = start; i < end; ++i) {
        if (text.charAt(i) === "\n") {
          return true;
        }
      }
      return false;
    }
    function isPreviousLineEmpty(text, node, locStart2) {
      let idx = locStart2(node) - 1;
      idx = skipSpaces(text, idx, { backwards: true });
      idx = skipNewline(text, idx, { backwards: true });
      idx = skipSpaces(text, idx, { backwards: true });
      const idx2 = skipNewline(text, idx, { backwards: true });
      return idx !== idx2;
    }
    function isNextLineEmptyAfterIndex(text, index) {
      let oldIdx = null;
      let idx = index;
      while (idx !== oldIdx) {
        oldIdx = idx;
        idx = skipToLineEnd(text, idx);
        idx = skipInlineComment(text, idx);
        idx = skipSpaces(text, idx);
      }
      idx = skipTrailingComment(text, idx);
      idx = skipNewline(text, idx);
      return idx !== false && hasNewline(text, idx);
    }
    function isNextLineEmpty(text, node, locEnd2) {
      return isNextLineEmptyAfterIndex(text, locEnd2(node));
    }
    function getNextNonSpaceNonCommentCharacterIndex(text, node, locEnd2) {
      return getNextNonSpaceNonCommentCharacterIndexWithStartIndex(
        text,
        locEnd2(node)
      );
    }
    function getNextNonSpaceNonCommentCharacter(text, node, locEnd2) {
      return text.charAt(
        getNextNonSpaceNonCommentCharacterIndex(text, node, locEnd2)
      );
    }
    function hasSpaces(text, index, opts = {}) {
      const idx = skipSpaces(text, opts.backwards ? index - 1 : index, opts);
      return idx !== index;
    }
    function getAlignmentSize(value, tabWidth, startIndex = 0) {
      let size = 0;
      for (let i = startIndex; i < value.length; ++i) {
        if (value[i] === "	") {
          size = size + tabWidth - size % tabWidth;
        } else {
          size++;
        }
      }
      return size;
    }
    function getIndentSize(value, tabWidth) {
      const lastNewlineIndex = value.lastIndexOf("\n");
      if (lastNewlineIndex === -1) {
        return 0;
      }
      return getAlignmentSize(
        value.slice(lastNewlineIndex + 1).match(/^[\t ]*/)[0],
        tabWidth
      );
    }
    function getPreferredQuote(rawContent, preferredQuote) {
      const double = { quote: '"', regex: /"/g, escaped: "&quot;" };
      const single = { quote: "'", regex: /'/g, escaped: "&apos;" };
      const preferred = preferredQuote === "'" ? single : double;
      const alternate = preferred === single ? double : single;
      let result = preferred;
      if (rawContent.includes(preferred.quote) || rawContent.includes(alternate.quote)) {
        const numPreferredQuotes = (rawContent.match(preferred.regex) || []).length;
        const numAlternateQuotes = (rawContent.match(alternate.regex) || []).length;
        result = numPreferredQuotes > numAlternateQuotes ? alternate : preferred;
      }
      return result;
    }
    function printString(raw, options) {
      const rawContent = raw.slice(1, -1);
      const enclosingQuote = options.parser === "json" || options.parser === "json5" && options.quoteProps === "preserve" && !options.singleQuote ? '"' : options.__isInHtmlAttribute ? "'" : getPreferredQuote(rawContent, options.singleQuote ? "'" : '"').quote;
      return makeString(
        rawContent,
        enclosingQuote,
        !(options.parser === "css" || options.parser === "less" || options.parser === "scss" || options.__embeddedInHtml)
      );
    }
    function makeString(rawContent, enclosingQuote, unescapeUnnecessaryEscapes) {
      const otherQuote = enclosingQuote === '"' ? "'" : '"';
      const regex = new RegExp(`\\\\(.)|(["'])`, "gs");
      const newContent = rawContent.replace(regex, (match, escaped, quote) => {
        if (escaped === otherQuote) {
          return escaped;
        }
        if (quote === enclosingQuote) {
          return "\\" + quote;
        }
        if (quote) {
          return quote;
        }
        return unescapeUnnecessaryEscapes && /^[^\n\r"'0-7\\bfnrt-vx\u2028\u2029]$/.test(escaped) ? escaped : "\\" + escaped;
      });
      return enclosingQuote + newContent + enclosingQuote;
    }
    function printNumber(rawNumber) {
      return rawNumber.toLowerCase().replace(/^([+-]?[\d.]+e)(?:\+|(-))?0*(\d)/, "$1$2$3").replace(/^([+-]?[\d.]+)e[+-]?0+$/, "$1").replace(/^([+-])?\./, "$10.").replace(/(\.\d+?)0+(?=e|$)/, "$1").replace(/\.(?=e|$)/, "");
    }
    function getMaxContinuousCount(str, target) {
      const results = str.match(
        new RegExp(`(${escapeStringRegexp(target)})+`, "g")
      );
      if (results === null) {
        return 0;
      }
      return results.reduce(
        (maxCount, result) => Math.max(maxCount, result.length / target.length),
        0
      );
    }
    function getMinNotPresentContinuousCount(str, target) {
      const matches = str.match(
        new RegExp(`(${escapeStringRegexp(target)})+`, "g")
      );
      if (matches === null) {
        return 0;
      }
      const countPresent = /* @__PURE__ */ new Map();
      let max = 0;
      for (const match of matches) {
        const count = match.length / target.length;
        countPresent.set(count, true);
        if (count > max) {
          max = count;
        }
      }
      for (let i = 1; i < max; i++) {
        if (!countPresent.get(i)) {
          return i;
        }
      }
      return max + 1;
    }
    function addCommentHelper(node, comment) {
      const comments = node.comments || (node.comments = []);
      comments.push(comment);
      comment.printed = false;
      comment.nodeDescription = describeNodeForDebugging(node);
    }
    function addLeadingComment(node, comment) {
      comment.leading = true;
      comment.trailing = false;
      addCommentHelper(node, comment);
    }
    function addDanglingComment(node, comment, marker) {
      comment.leading = false;
      comment.trailing = false;
      if (marker) {
        comment.marker = marker;
      }
      addCommentHelper(node, comment);
    }
    function addTrailingComment(node, comment) {
      comment.leading = false;
      comment.trailing = true;
      addCommentHelper(node, comment);
    }
    function inferParserByLanguage(language, options) {
      const { languages } = getSupportInfo({ plugins: options.plugins });
      const matched = languages.find(({ name }) => name.toLowerCase() === language) || languages.find(
        ({ aliases }) => Array.isArray(aliases) && aliases.includes(language)
      ) || languages.find(
        ({ extensions }) => Array.isArray(extensions) && extensions.includes(`.${language}`)
      );
      return matched && matched.parsers[0];
    }
    function isFrontMatterNode(node) {
      return node && node.type === "front-matter";
    }
    function createGroupIdMapper(description) {
      const groupIds = /* @__PURE__ */ new WeakMap();
      return function(node) {
        if (!groupIds.has(node)) {
          groupIds.set(node, Symbol(description));
        }
        return groupIds.get(node);
      };
    }
    function describeNodeForDebugging(node) {
      const nodeType = node.type || node.kind || "(unknown type)";
      let nodeName = String(
        node.name || node.id && (typeof node.id === "object" ? node.id.name : node.id) || node.key && (typeof node.key === "object" ? node.key.name : node.key) || node.value && (typeof node.value === "object" ? "" : String(node.value)) || node.operator || ""
      );
      if (nodeName.length > 20) {
        nodeName = nodeName.slice(0, 19) + "\u2026";
      }
      return nodeType + (nodeName ? " " + nodeName : "");
    }
    module2.exports = {
      inferParserByLanguage,
      getStringWidth,
      getMaxContinuousCount,
      getMinNotPresentContinuousCount,
      getPenultimate,
      getLast,
      getNextNonSpaceNonCommentCharacterIndexWithStartIndex,
      getNextNonSpaceNonCommentCharacterIndex,
      getNextNonSpaceNonCommentCharacter,
      skip,
      skipWhitespace,
      skipSpaces,
      skipToLineEnd,
      skipEverythingButNewLine,
      skipInlineComment,
      skipTrailingComment,
      skipNewline,
      isNextLineEmptyAfterIndex,
      isNextLineEmpty,
      isPreviousLineEmpty,
      hasNewline,
      hasNewlineInRange,
      hasSpaces,
      getAlignmentSize,
      getIndentSize,
      getPreferredQuote,
      printString,
      printNumber,
      makeString,
      addLeadingComment,
      addDanglingComment,
      addTrailingComment,
      isFrontMatterNode,
      isNonEmptyArray,
      createGroupIdMapper
    };
  }
});

// src/language-html/clean.js
var require_clean = __commonJS({
  "src/language-html/clean.js"(exports2, module2) {
    "use strict";
    var { isFrontMatterNode } = require_util();
    var ignoredProperties = /* @__PURE__ */ new Set([
      "sourceSpan",
      "startSourceSpan",
      "endSourceSpan",
      "nameSpan",
      "valueSpan"
    ]);
    function clean2(ast, newNode) {
      if (ast.type === "text" || ast.type === "comment") {
        return null;
      }
      if (isFrontMatterNode(ast) || ast.type === "yaml" || ast.type === "toml") {
        return null;
      }
      if (ast.type === "attribute") {
        delete newNode.value;
      }
      if (ast.type === "docType") {
        delete newNode.value;
      }
    }
    clean2.ignoredProperties = ignoredProperties;
    module2.exports = clean2;
  }
});

// node_modules/html-styles/index.json
var require_html_styles = __commonJS({
  "node_modules/html-styles/index.json"(exports2, module2) {
    module2.exports = [
      {
        selectorText: "[hidden], area, base, basefont, datalist, head, link, meta,\nnoembed, noframes, param, rp, script, source, style, template, track, title",
        type: "CSSStyleRule",
        style: {
          display: "none"
        }
      },
      {
        selectorText: "embed[hidden]",
        type: "CSSStyleRule",
        style: {
          display: "inline",
          height: "0",
          width: "0"
        }
      },
      {
        selectorText: "input[type=hidden i]",
        type: "CSSStyleRule",
        style: {
          display: "none"
        }
      },
      {
        selectorText: "html, body",
        type: "CSSStyleRule",
        style: {
          display: "block"
        }
      },
      {
        selectorText: "address, blockquote, center, div, figure, figcaption, footer, form, header, hr,\nlegend, listing, main, p, plaintext, pre, xmp",
        type: "CSSStyleRule",
        style: {
          display: "block"
        }
      },
      {
        selectorText: "blockquote, figure, listing, p, plaintext, pre, xmp",
        type: "CSSStyleRule",
        style: {
          "margin-block-start": "1em",
          "margin-block-end": "1em"
        }
      },
      {
        selectorText: "blockquote, figure",
        type: "CSSStyleRule",
        style: {
          "margin-inline-start": "40px",
          "margin-inline-end": "40px"
        }
      },
      {
        selectorText: "address",
        type: "CSSStyleRule",
        style: {
          "font-style": "italic"
        }
      },
      {
        selectorText: "listing, plaintext, pre, xmp",
        type: "CSSStyleRule",
        style: {
          "font-family": "monospace",
          "white-space": "pre"
        }
      },
      {
        selectorText: "dialog:not([open])",
        type: "CSSStyleRule",
        style: {
          display: "none"
        }
      },
      {
        selectorText: "dialog",
        type: "CSSStyleRule",
        style: {
          position: "absolute",
          left: "0",
          right: "0",
          width: "fit-content",
          height: "fit-content",
          margin: "auto",
          border: "solid",
          padding: "1em",
          background: "white",
          color: "black"
        }
      },
      {
        selectorText: "dialog::backdrop",
        type: "CSSStyleRule",
        style: {
          background: "rgba(0,0,0,0.1)"
        }
      },
      {
        selectorText: "slot",
        type: "CSSStyleRule",
        style: {
          display: "contents"
        }
      },
      {
        selectorText: "pre[wrap]",
        type: "CSSStyleRule",
        style: {
          "white-space": "pre-wrap"
        }
      },
      {
        selectorText: "form",
        type: "CSSStyleRule",
        style: {
          "margin-block-end": "1em"
        }
      },
      {
        selectorText: "cite, dfn, em, i, var",
        type: "CSSStyleRule",
        style: {
          "font-style": "italic"
        }
      },
      {
        selectorText: "b, strong",
        type: "CSSStyleRule",
        style: {
          "font-weight": "bolder"
        }
      },
      {
        selectorText: "code, kbd, samp, tt",
        type: "CSSStyleRule",
        style: {
          "font-family": "monospace"
        }
      },
      {
        selectorText: "big",
        type: "CSSStyleRule",
        style: {
          "font-size": "larger"
        }
      },
      {
        selectorText: "small",
        type: "CSSStyleRule",
        style: {
          "font-size": "smaller"
        }
      },
      {
        selectorText: "sub",
        type: "CSSStyleRule",
        style: {
          "vertical-align": "sub"
        }
      },
      {
        selectorText: "sup",
        type: "CSSStyleRule",
        style: {
          "vertical-align": "super"
        }
      },
      {
        selectorText: "sub, sup",
        type: "CSSStyleRule",
        style: {
          "line-height": "normal",
          "font-size": "smaller"
        }
      },
      {
        selectorText: "ruby",
        type: "CSSStyleRule",
        style: {
          display: "ruby"
        }
      },
      {
        selectorText: "rt",
        type: "CSSStyleRule",
        style: {
          display: "ruby-text"
        }
      },
      {
        selectorText: ":link",
        type: "CSSStyleRule",
        style: {
          color: "#0000EE"
        }
      },
      {
        selectorText: ":visited",
        type: "CSSStyleRule",
        style: {
          color: "#551A8B"
        }
      },
      {
        selectorText: ":link:active, :visited:active",
        type: "CSSStyleRule",
        style: {
          color: "#FF0000"
        }
      },
      {
        selectorText: ":link, :visited",
        type: "CSSStyleRule",
        style: {
          "text-decoration": "underline",
          cursor: "pointer"
        }
      },
      {
        selectorText: "a:link[rel~=help], a:visited[rel~=help],\narea:link[rel~=help], area:visited[rel~=help]",
        type: "CSSStyleRule",
        style: {
          cursor: "help"
        }
      },
      {
        selectorText: ":focus",
        type: "CSSStyleRule",
        style: {
          outline: "auto"
        }
      },
      {
        selectorText: "mark",
        type: "CSSStyleRule",
        style: {
          background: "yellow",
          color: "black"
        }
      },
      {
        selectorText: "abbr[title], acronym[title]",
        type: "CSSStyleRule",
        style: {
          "text-decoration": "dotted underline"
        }
      },
      {
        selectorText: "ins, u",
        type: "CSSStyleRule",
        style: {
          "text-decoration": "underline"
        }
      },
      {
        selectorText: "del, s, strike",
        type: "CSSStyleRule",
        style: {
          "text-decoration": "line-through"
        }
      },
      {
        selectorText: "blink",
        type: "CSSStyleRule",
        style: {
          "text-decoration": "blink"
        }
      },
      {
        selectorText: "q::before",
        type: "CSSStyleRule",
        style: {
          content: "open-quote"
        }
      },
      {
        selectorText: "q::after",
        type: "CSSStyleRule",
        style: {
          content: "close-quote"
        }
      },
      {
        selectorText: "br",
        type: "CSSStyleRule",
        style: {
          "display-outside": "newline"
        }
      },
      {
        selectorText: "nobr",
        type: "CSSStyleRule",
        style: {
          "white-space": "nowrap"
        }
      },
      {
        selectorText: "wbr",
        type: "CSSStyleRule",
        style: {
          "display-outside": "break-opportunity"
        }
      },
      {
        selectorText: "nobr wbr",
        type: "CSSStyleRule",
        style: {
          "white-space": "normal"
        }
      },
      {
        selectorText: "br[clear=left i]",
        type: "CSSStyleRule",
        style: {
          clear: "left"
        }
      },
      {
        selectorText: "br[clear=right i]",
        type: "CSSStyleRule",
        style: {
          clear: "right"
        }
      },
      {
        selectorText: "br[clear=all i], br[clear=both i]",
        type: "CSSStyleRule",
        style: {
          clear: "both"
        }
      },
      {
        selectorText: "[dir]:dir(ltr), bdi:dir(ltr), input[type=tel i]:dir(ltr)",
        type: "CSSStyleRule",
        style: {
          direction: "ltr"
        }
      },
      {
        selectorText: "[dir]:dir(rtl), bdi:dir(rtl)",
        type: "CSSStyleRule",
        style: {
          direction: "rtl"
        }
      },
      {
        selectorText: "address, blockquote, center, div, figure, figcaption, footer, form, header, hr,\nlegend, listing, main, p, plaintext, pre, summary, xmp, article, aside, h1, h2,\nh3, h4, h5, h6, hgroup, nav, section, table, caption, colgroup, col, thead,\ntbody, tfoot, tr, td, th, dir, dd, dl, dt, ol, ul, li, bdi, output,\n[dir=ltr i], [dir=rtl i], [dir=auto i]",
        type: "CSSStyleRule",
        style: {
          "unicode-bidi": "isolate"
        }
      },
      {
        selectorText: "bdo, bdo[dir]",
        type: "CSSStyleRule",
        style: {
          "unicode-bidi": "isolate-override"
        }
      },
      {
        selectorText: "input[dir=auto i][type=search i], input[dir=auto i][type=tel i], input[dir=auto i][type=url i], input[dir=auto i][type=email i], textarea[dir=auto i], pre[dir=auto i]",
        type: "CSSStyleRule",
        style: {
          "unicode-bidi": "plaintext"
        }
      },
      {
        selectorText: "address, blockquote, center, div, figure, figcaption, footer, form, header, hr,\nlegend, listing, main, p, plaintext, pre, summary, xmp, article, aside, h1, h2,\nh3, h4, h5, h6, hgroup, nav, section, table, caption, colgroup, col, thead,\ntbody, tfoot, tr, td, th, dir, dd, dl, dt, ol, ul, li, [dir=ltr i],\n[dir=rtl i], [dir=auto i], *|*",
        type: "CSSStyleRule",
        style: {
          "unicode-bidi": "bidi-override"
        }
      },
      {
        selectorText: "input:not([type=submit i]):not([type=reset i]):not([type=button i]),\ntextarea",
        type: "CSSStyleRule",
        style: {
          "unicode-bidi": "normal"
        }
      },
      {
        selectorText: "article, aside, h1, h2, h3, h4, h5, h6, hgroup, nav, section",
        type: "CSSStyleRule",
        style: {
          display: "block"
        }
      },
      {
        selectorText: "h1",
        type: "CSSStyleRule",
        style: {
          "margin-block-start": "0.67em",
          "margin-block-end": "0.67em",
          "font-size": "2.00em",
          "font-weight": "bold"
        }
      },
      {
        selectorText: "h2",
        type: "CSSStyleRule",
        style: {
          "margin-block-start": "0.83em",
          "margin-block-end": "0.83em",
          "font-size": "1.50em",
          "font-weight": "bold"
        }
      },
      {
        selectorText: "h3",
        type: "CSSStyleRule",
        style: {
          "margin-block-start": "1.00em",
          "margin-block-end": "1.00em",
          "font-size": "1.17em",
          "font-weight": "bold"
        }
      },
      {
        selectorText: "h4",
        type: "CSSStyleRule",
        style: {
          "margin-block-start": "1.33em",
          "margin-block-end": "1.33em",
          "font-size": "1.00em",
          "font-weight": "bold"
        }
      },
      {
        selectorText: "h5",
        type: "CSSStyleRule",
        style: {
          "margin-block-start": "1.67em",
          "margin-block-end": "1.67em",
          "font-size": "0.83em",
          "font-weight": "bold"
        }
      },
      {
        selectorText: "h6",
        type: "CSSStyleRule",
        style: {
          "margin-block-start": "2.33em",
          "margin-block-end": "2.33em",
          "font-size": "0.67em",
          "font-weight": "bold"
        }
      },
      {
        selectorText: "x h1",
        type: "CSSStyleRule",
        style: {
          "margin-block-start": "0.83em",
          "margin-block-end": "0.83em",
          "font-size": "1.50em"
        }
      },
      {
        selectorText: "x x h1",
        type: "CSSStyleRule",
        style: {
          "margin-block-start": "1.00em",
          "margin-block-end": "1.00em",
          "font-size": "1.17em"
        }
      },
      {
        selectorText: "x x x h1",
        type: "CSSStyleRule",
        style: {
          "margin-block-start": "1.33em",
          "margin-block-end": "1.33em",
          "font-size": "1.00em"
        }
      },
      {
        selectorText: "x x x x h1",
        type: "CSSStyleRule",
        style: {
          "margin-block-start": "1.67em",
          "margin-block-end": "1.67em",
          "font-size": "0.83em"
        }
      },
      {
        selectorText: "x x x x x h1",
        type: "CSSStyleRule",
        style: {
          "margin-block-start": "2.33em",
          "margin-block-end": "2.33em",
          "font-size": "0.67em"
        }
      },
      {
        selectorText: "x hgroup > h1 ~ h2",
        type: "CSSStyleRule",
        style: {
          "margin-block-start": "1.00em",
          "margin-block-end": "1.00em",
          "font-size": "1.17em"
        }
      },
      {
        selectorText: "x x hgroup > h1 ~ h2",
        type: "CSSStyleRule",
        style: {
          "margin-block-start": "1.33em",
          "margin-block-end": "1.33em",
          "font-size": "1.00em"
        }
      },
      {
        selectorText: "x x x hgroup > h1 ~ h2",
        type: "CSSStyleRule",
        style: {
          "margin-block-start": "1.67em",
          "margin-block-end": "1.67em",
          "font-size": "0.83em"
        }
      },
      {
        selectorText: "x x x x hgroup > h1 ~ h2",
        type: "CSSStyleRule",
        style: {
          "margin-block-start": "2.33em",
          "margin-block-end": "2.33em",
          "font-size": "0.67em"
        }
      },
      {
        selectorText: "x hgroup > h1 ~ h3",
        type: "CSSStyleRule",
        style: {
          "margin-block-start": "1.33em",
          "margin-block-end": "1.33em",
          "font-size": "1.00em"
        }
      },
      {
        selectorText: "x x hgroup > h1 ~ h3",
        type: "CSSStyleRule",
        style: {
          "margin-block-start": "1.67em",
          "margin-block-end": "1.67em",
          "font-size": "0.83em"
        }
      },
      {
        selectorText: "x x x hgroup > h1 ~ h3",
        type: "CSSStyleRule",
        style: {
          "margin-block-start": "2.33em",
          "margin-block-end": "2.33em",
          "font-size": "0.67em"
        }
      },
      {
        selectorText: "x hgroup > h1 ~ h4",
        type: "CSSStyleRule",
        style: {
          "margin-block-start": "1.67em",
          "margin-block-end": "1.67em",
          "font-size": "0.83em"
        }
      },
      {
        selectorText: "x x hgroup > h1 ~ h4",
        type: "CSSStyleRule",
        style: {
          "margin-block-start": "2.33em",
          "margin-block-end": "2.33em",
          "font-size": "0.67em"
        }
      },
      {
        selectorText: "x hgroup > h1 ~ h5",
        type: "CSSStyleRule",
        style: {
          "margin-block-start": "2.33em",
          "margin-block-end": "2.33em",
          "font-size": "0.67em"
        }
      },
      {
        selectorText: "dir, dd, dl, dt, ol, ul",
        type: "CSSStyleRule",
        style: {
          display: "block"
        }
      },
      {
        selectorText: "li",
        type: "CSSStyleRule",
        style: {
          display: "list-item"
        }
      },
      {
        selectorText: "dir, dl, ol, ul",
        type: "CSSStyleRule",
        style: {
          "margin-block-start": "1em",
          "margin-block-end": "1em"
        }
      },
      {
        selectorText: "dir dir, dl dir, ol dir, ul dir, dir dl, dl dl, ol dl, ul dl, dir ol, dl ol, ol ol, ul ol, dir ul, dl ul, ol ul, ul ul",
        type: "CSSStyleRule",
        style: {
          "margin-block-start": "0",
          "margin-block-end": "0"
        }
      },
      {
        selectorText: "dd",
        type: "CSSStyleRule",
        style: {
          "margin-inline-start": "40px"
        }
      },
      {
        selectorText: "dir, ol, ul",
        type: "CSSStyleRule",
        style: {
          "padding-inline-start": "40px"
        }
      },
      {
        selectorText: "ol",
        type: "CSSStyleRule",
        style: {
          "list-style-type": "decimal"
        }
      },
      {
        selectorText: "dir, ul",
        type: "CSSStyleRule",
        style: {
          "list-style-type": "disc"
        }
      },
      {
        selectorText: "dir dir, ol dir, ul dir, dir ul, ol ul, ul ul",
        type: "CSSStyleRule",
        style: {
          "list-style-type": "circle"
        }
      },
      {
        selectorText: "dir dir dir, ol dir dir, ul dir dir, dir ol dir, ol ol dir, ul ol dir, dir ul dir, ol ul dir, ul ul dir, dir dir ul, ol dir ul, ul dir ul, dir ol ul, ol ol ul, ul ol ul, dir ul ul, ol ul ul, ul ul ul",
        type: "CSSStyleRule",
        style: {
          "list-style-type": "square"
        }
      },
      {
        selectorText: 'ol[type="1"], li[type="1"]',
        type: "CSSStyleRule",
        style: {
          "list-style-type": "decimal"
        }
      },
      {
        selectorText: "ol[type=a], li[type=a]",
        type: "CSSStyleRule",
        style: {
          "list-style-type": "lower-alpha"
        }
      },
      {
        selectorText: "ol[type=A], li[type=A]",
        type: "CSSStyleRule",
        style: {
          "list-style-type": "upper-alpha"
        }
      },
      {
        selectorText: "ol[type=i], li[type=i]",
        type: "CSSStyleRule",
        style: {
          "list-style-type": "lower-roman"
        }
      },
      {
        selectorText: "ol[type=I], li[type=I]",
        type: "CSSStyleRule",
        style: {
          "list-style-type": "upper-roman"
        }
      },
      {
        selectorText: "ul[type=none i], li[type=none i]",
        type: "CSSStyleRule",
        style: {
          "list-style-type": "none"
        }
      },
      {
        selectorText: "ul[type=disc i], li[type=disc i]",
        type: "CSSStyleRule",
        style: {
          "list-style-type": "disc"
        }
      },
      {
        selectorText: "ul[type=circle i], li[type=circle i]",
        type: "CSSStyleRule",
        style: {
          "list-style-type": "circle"
        }
      },
      {
        selectorText: "ul[type=square i], li[type=square i]",
        type: "CSSStyleRule",
        style: {
          "list-style-type": "square"
        }
      },
      {
        selectorText: "table",
        type: "CSSStyleRule",
        style: {
          display: "table"
        }
      },
      {
        selectorText: "caption",
        type: "CSSStyleRule",
        style: {
          display: "table-caption"
        }
      },
      {
        selectorText: "colgroup, colgroup[hidden]",
        type: "CSSStyleRule",
        style: {
          display: "table-column-group"
        }
      },
      {
        selectorText: "col, col[hidden]",
        type: "CSSStyleRule",
        style: {
          display: "table-column"
        }
      },
      {
        selectorText: "thead, thead[hidden]",
        type: "CSSStyleRule",
        style: {
          display: "table-header-group"
        }
      },
      {
        selectorText: "tbody, tbody[hidden]",
        type: "CSSStyleRule",
        style: {
          display: "table-row-group"
        }
      },
      {
        selectorText: "tfoot, tfoot[hidden]",
        type: "CSSStyleRule",
        style: {
          display: "table-footer-group"
        }
      },
      {
        selectorText: "tr, tr[hidden]",
        type: "CSSStyleRule",
        style: {
          display: "table-row"
        }
      },
      {
        selectorText: "td, th, td[hidden], th[hidden]",
        type: "CSSStyleRule",
        style: {
          display: "table-cell"
        }
      },
      {
        selectorText: "colgroup[hidden], col[hidden], thead[hidden], tbody[hidden],\ntfoot[hidden], tr[hidden], td[hidden], th[hidden]",
        type: "CSSStyleRule",
        style: {
          visibility: "collapse"
        }
      },
      {
        selectorText: "table",
        type: "CSSStyleRule",
        style: {
          "box-sizing": "border-box",
          "border-spacing": "2px",
          "border-collapse": "separate",
          "text-indent": "initial"
        }
      },
      {
        selectorText: "td, th",
        type: "CSSStyleRule",
        style: {
          padding: "1px"
        }
      },
      {
        selectorText: "th",
        type: "CSSStyleRule",
        style: {
          "font-weight": "bold"
        }
      },
      {
        selectorText: "caption",
        type: "CSSStyleRule",
        style: {
          "text-align": "center"
        }
      },
      {
        selectorText: "thead, tbody, tfoot, table > tr",
        type: "CSSStyleRule",
        style: {
          "vertical-align": "middle"
        }
      },
      {
        selectorText: "tr, td, th",
        type: "CSSStyleRule",
        style: {
          "vertical-align": "inherit"
        }
      },
      {
        selectorText: "table, td, th",
        type: "CSSStyleRule",
        style: {
          "border-color": "gray"
        }
      },
      {
        selectorText: "thead, tbody, tfoot, tr",
        type: "CSSStyleRule",
        style: {
          "border-color": "inherit"
        }
      },
      {
        selectorText: "table[rules=none i], table[rules=groups i], table[rules=rows i],\ntable[rules=cols i], table[rules=all i], table[frame=void i],\ntable[frame=above i], table[frame=below i], table[frame=hsides i],\ntable[frame=lhs i], table[frame=rhs i], table[frame=vsides i],\ntable[frame=box i], table[frame=border i],\ntable[rules=none i] > tr > td, table[rules=none i] > tr > th,\ntable[rules=groups i] > tr > td, table[rules=groups i] > tr > th,\ntable[rules=rows i] > tr > td, table[rules=rows i] > tr > th,\ntable[rules=cols i] > tr > td, table[rules=cols i] > tr > th,\ntable[rules=all i] > tr > td, table[rules=all i] > tr > th,\ntable[rules=none i] > thead > tr > td, table[rules=none i] > thead > tr > th,\ntable[rules=groups i] > thead > tr > td, table[rules=groups i] > thead > tr > th,\ntable[rules=rows i] > thead > tr > td, table[rules=rows i] > thead > tr > th,\ntable[rules=cols i] > thead > tr > td, table[rules=cols i] > thead > tr > th,\ntable[rules=all i] > thead > tr > td, table[rules=all i] > thead > tr > th,\ntable[rules=none i] > tbody > tr > td, table[rules=none i] > tbody > tr > th,\ntable[rules=groups i] > tbody > tr > td, table[rules=groups i] > tbody > tr > th,\ntable[rules=rows i] > tbody > tr > td, table[rules=rows i] > tbody > tr > th,\ntable[rules=cols i] > tbody > tr > td, table[rules=cols i] > tbody > tr > th,\ntable[rules=all i] > tbody > tr > td, table[rules=all i] > tbody > tr > th,\ntable[rules=none i] > tfoot > tr > td, table[rules=none i] > tfoot > tr > th,\ntable[rules=groups i] > tfoot > tr > td, table[rules=groups i] > tfoot > tr > th,\ntable[rules=rows i] > tfoot > tr > td, table[rules=rows i] > tfoot > tr > th,\ntable[rules=cols i] > tfoot > tr > td, table[rules=cols i] > tfoot > tr > th,\ntable[rules=all i] > tfoot > tr > td, table[rules=all i] > tfoot > tr > th",
        type: "CSSStyleRule",
        style: {
          "border-color": "black"
        }
      },
      {
        selectorText: "table[align=left i]",
        type: "CSSStyleRule",
        style: {
          float: "left"
        }
      },
      {
        selectorText: "table[align=right i]",
        type: "CSSStyleRule",
        style: {
          float: "right"
        }
      },
      {
        selectorText: "table[align=center i]",
        type: "CSSStyleRule",
        style: {
          "margin-inline-start": "auto",
          "margin-inline-end": "auto"
        }
      },
      {
        selectorText: "thead[align=absmiddle i], tbody[align=absmiddle i], tfoot[align=absmiddle i],\ntr[align=absmiddle i], td[align=absmiddle i], th[align=absmiddle i]",
        type: "CSSStyleRule",
        style: {
          "text-align": "center"
        }
      },
      {
        selectorText: "caption[align=bottom i]",
        type: "CSSStyleRule",
        style: {
          "caption-side": "bottom"
        }
      },
      {
        selectorText: "p[align=left i], h1[align=left i], h2[align=left i], h3[align=left i],\nh4[align=left i], h5[align=left i], h6[align=left i]",
        type: "CSSStyleRule",
        style: {
          "text-align": "left"
        }
      },
      {
        selectorText: "p[align=right i], h1[align=right i], h2[align=right i], h3[align=right i],\nh4[align=right i], h5[align=right i], h6[align=right i]",
        type: "CSSStyleRule",
        style: {
          "text-align": "right"
        }
      },
      {
        selectorText: "p[align=center i], h1[align=center i], h2[align=center i], h3[align=center i],\nh4[align=center i], h5[align=center i], h6[align=center i]",
        type: "CSSStyleRule",
        style: {
          "text-align": "center"
        }
      },
      {
        selectorText: "p[align=justify i], h1[align=justify i], h2[align=justify i], h3[align=justify i],\nh4[align=justify i], h5[align=justify i], h6[align=justify i]",
        type: "CSSStyleRule",
        style: {
          "text-align": "justify"
        }
      },
      {
        selectorText: "thead[valign=top i], tbody[valign=top i], tfoot[valign=top i],\ntr[valign=top i], td[valign=top i], th[valign=top i]",
        type: "CSSStyleRule",
        style: {
          "vertical-align": "top"
        }
      },
      {
        selectorText: "thead[valign=middle i], tbody[valign=middle i], tfoot[valign=middle i],\ntr[valign=middle i], td[valign=middle i], th[valign=middle i]",
        type: "CSSStyleRule",
        style: {
          "vertical-align": "middle"
        }
      },
      {
        selectorText: "thead[valign=bottom i], tbody[valign=bottom i], tfoot[valign=bottom i],\ntr[valign=bottom i], td[valign=bottom i], th[valign=bottom i]",
        type: "CSSStyleRule",
        style: {
          "vertical-align": "bottom"
        }
      },
      {
        selectorText: "thead[valign=baseline i], tbody[valign=baseline i], tfoot[valign=baseline i],\ntr[valign=baseline i], td[valign=baseline i], th[valign=baseline i]",
        type: "CSSStyleRule",
        style: {
          "vertical-align": "baseline"
        }
      },
      {
        selectorText: "td[nowrap], th[nowrap]",
        type: "CSSStyleRule",
        style: {
          "white-space": "nowrap"
        }
      },
      {
        selectorText: "table[rules=none i], table[rules=groups i], table[rules=rows i],\ntable[rules=cols i], table[rules=all i]",
        type: "CSSStyleRule",
        style: {
          "border-style": "hidden",
          "border-collapse": "collapse"
        }
      },
      {
        selectorText: "table[border]",
        type: "CSSStyleRule",
        style: {
          "border-style": "outset"
        }
      },
      {
        selectorText: "table[frame=void i]",
        type: "CSSStyleRule",
        style: {
          "border-style": "hidden"
        }
      },
      {
        selectorText: "table[frame=above i]",
        type: "CSSStyleRule",
        style: {
          "border-style": "outset hidden hidden hidden"
        }
      },
      {
        selectorText: "table[frame=below i]",
        type: "CSSStyleRule",
        style: {
          "border-style": "hidden hidden outset hidden"
        }
      },
      {
        selectorText: "table[frame=hsides i]",
        type: "CSSStyleRule",
        style: {
          "border-style": "outset hidden outset hidden"
        }
      },
      {
        selectorText: "table[frame=lhs i]",
        type: "CSSStyleRule",
        style: {
          "border-style": "hidden hidden hidden outset"
        }
      },
      {
        selectorText: "table[frame=rhs i]",
        type: "CSSStyleRule",
        style: {
          "border-style": "hidden outset hidden hidden"
        }
      },
      {
        selectorText: "table[frame=vsides i]",
        type: "CSSStyleRule",
        style: {
          "border-style": "hidden outset"
        }
      },
      {
        selectorText: "table[frame=box i], table[frame=border i]",
        type: "CSSStyleRule",
        style: {
          "border-style": "outset"
        }
      },
      {
        selectorText: "table[border] > tr > td, table[border] > tr > th,\ntable[border] > thead > tr > td, table[border] > thead > tr > th,\ntable[border] > tbody > tr > td, table[border] > tbody > tr > th,\ntable[border] > tfoot > tr > td, table[border] > tfoot > tr > th",
        type: "CSSStyleRule",
        style: {
          "border-width": "1px",
          "border-style": "inset"
        }
      },
      {
        selectorText: "table[rules=none i] > tr > td, table[rules=none i] > tr > th,\ntable[rules=none i] > thead > tr > td, table[rules=none i] > thead > tr > th,\ntable[rules=none i] > tbody > tr > td, table[rules=none i] > tbody > tr > th,\ntable[rules=none i] > tfoot > tr > td, table[rules=none i] > tfoot > tr > th,\ntable[rules=groups i] > tr > td, table[rules=groups i] > tr > th,\ntable[rules=groups i] > thead > tr > td, table[rules=groups i] > thead > tr > th,\ntable[rules=groups i] > tbody > tr > td, table[rules=groups i] > tbody > tr > th,\ntable[rules=groups i] > tfoot > tr > td, table[rules=groups i] > tfoot > tr > th,\ntable[rules=rows i] > tr > td, table[rules=rows i] > tr > th,\ntable[rules=rows i] > thead > tr > td, table[rules=rows i] > thead > tr > th,\ntable[rules=rows i] > tbody > tr > td, table[rules=rows i] > tbody > tr > th,\ntable[rules=rows i] > tfoot > tr > td, table[rules=rows i] > tfoot > tr > th",
        type: "CSSStyleRule",
        style: {
          "border-width": "1px",
          "border-style": "none"
        }
      },
      {
        selectorText: "table[rules=cols i] > tr > td, table[rules=cols i] > tr > th,\ntable[rules=cols i] > thead > tr > td, table[rules=cols i] > thead > tr > th,\ntable[rules=cols i] > tbody > tr > td, table[rules=cols i] > tbody > tr > th,\ntable[rules=cols i] > tfoot > tr > td, table[rules=cols i] > tfoot > tr > th",
        type: "CSSStyleRule",
        style: {
          "border-width": "1px",
          "block-start-style": "none",
          "border-inline-end-style": "solid",
          "border-block-end-style": "none",
          "border-inline-start-style": "solid"
        }
      },
      {
        selectorText: "table[rules=all i] > tr > td, table[rules=all i] > tr > th,\ntable[rules=all i] > thead > tr > td, table[rules=all i] > thead > tr > th,\ntable[rules=all i] > tbody > tr > td, table[rules=all i] > tbody > tr > th,\ntable[rules=all i] > tfoot > tr > td, table[rules=all i] > tfoot > tr > th",
        type: "CSSStyleRule",
        style: {
          "border-width": "1px",
          "border-style": "solid"
        }
      },
      {
        selectorText: "table[rules=groups i] > colgroup",
        type: "CSSStyleRule",
        style: {
          "border-inline-start-width": "1px",
          "border-inline-start-style": "solid",
          "border-inline-end-width": "1px",
          "border-inline-end-style": "solid"
        }
      },
      {
        selectorText: "table[rules=groups i] > thead,\ntable[rules=groups i] > tbody,\ntable[rules=groups i] > tfoot",
        type: "CSSStyleRule",
        style: {
          "border-block-start-width": "1px",
          "border-block-start-style": "solid",
          "border-block-end-width": "1px",
          "border-block-end-style": "solid"
        }
      },
      {
        selectorText: "table[rules=rows i] > tr, table[rules=rows i] > thead > tr,\ntable[rules=rows i] > tbody > tr, table[rules=rows i] > tfoot > tr",
        type: "CSSStyleRule",
        style: {
          "border-block-start-width": "1px",
          "border-block-start-style": "solid",
          "border-block-end-width": "1px",
          "border-block-end-style": "solid"
        }
      },
      {
        selectorText: "table",
        type: "CSSStyleRule",
        style: {
          "font-weight": "initial",
          "font-style": "initial",
          "font-variant": "initial",
          "font-size": "initial",
          "line-height": "initial",
          "white-space": "initial",
          "text-align": "initial"
        }
      },
      {
        selectorText: "table > form, thead > form, tbody > form, tfoot > form, tr > form",
        type: "CSSStyleRule",
        style: {
          display: "none"
        }
      },
      {
        selectorText: "input, select, option, optgroup, button, textarea",
        type: "CSSStyleRule",
        style: {
          "text-indent": "initial"
        }
      },
      {
        selectorText: "input[type=radio i], input[type=checkbox i], input[type=reset i], input[type=button i], input[type=submit i], input[type=search i], select, button",
        type: "CSSStyleRule",
        style: {
          "box-sizing": "border-box"
        }
      },
      {
        selectorText: "textarea",
        type: "CSSStyleRule",
        style: {
          "white-space": "pre-wrap"
        }
      },
      {
        selectorText: "input:not([type=image i]), textarea",
        type: "CSSStyleRule",
        style: {
          "box-sizing": "border-box"
        }
      },
      {
        selectorText: "hr",
        type: "CSSStyleRule",
        style: {
          color: "gray",
          "border-style": "inset",
          "border-width": "1px",
          "margin-block-start": "0.5em",
          "margin-inline-end": "auto",
          "margin-block-end": "0.5em",
          "margin-inline-start": "auto"
        }
      },
      {
        selectorText: "hr[align=left i]",
        type: "CSSStyleRule",
        style: {
          "margin-left": "0",
          "margin-right": "auto"
        }
      },
      {
        selectorText: "hr[align=right i]",
        type: "CSSStyleRule",
        style: {
          "margin-left": "auto",
          "margin-right": "0"
        }
      },
      {
        selectorText: "hr[align=center i]",
        type: "CSSStyleRule",
        style: {
          "margin-left": "auto",
          "margin-right": "auto"
        }
      },
      {
        selectorText: "hr[color], hr[noshade]",
        type: "CSSStyleRule",
        style: {
          "border-style": "solid"
        }
      },
      {
        selectorText: "fieldset",
        type: "CSSStyleRule",
        style: {
          display: "block",
          "margin-inline-start": "2px",
          "margin-inline-end": "2px",
          border: "groove 2px ThreeDFace",
          "padding-block-start": "0.35em",
          "padding-inline-end": "0.625em",
          "padding-block-end": "0.75em",
          "padding-inline-start": "0.625em",
          "min-width": "min-content"
        }
      },
      {
        selectorText: "legend",
        type: "CSSStyleRule",
        style: {
          "padding-inline-start": "2px",
          "padding-inline-end": "2px"
        }
      },
      {
        selectorText: "iframe",
        type: "CSSStyleRule",
        style: {
          border: "2px inset"
        }
      },
      {
        selectorText: "video",
        type: "CSSStyleRule",
        style: {
          "object-fit": "contain"
        }
      },
      {
        selectorText: "img[align=left i]",
        type: "CSSStyleRule",
        style: {
          "margin-right": "3px"
        }
      },
      {
        selectorText: "img[align=right i]",
        type: "CSSStyleRule",
        style: {
          "margin-left": "3px"
        }
      },
      {
        selectorText: 'iframe[frameborder="0"], iframe[frameborder=no i]',
        type: "CSSStyleRule",
        style: {
          border: "none"
        }
      },
      {
        selectorText: "applet[align=left i], embed[align=left i], iframe[align=left i],\nimg[align=left i], input[type=image i][align=left i], object[align=left i]",
        type: "CSSStyleRule",
        style: {
          float: "left"
        }
      },
      {
        selectorText: "applet[align=right i], embed[align=right i], iframe[align=right i],\nimg[align=right i], input[type=image i][align=right i], object[align=right i]",
        type: "CSSStyleRule",
        style: {
          float: "right"
        }
      },
      {
        selectorText: "applet[align=top i], embed[align=top i], iframe[align=top i],\nimg[align=top i], input[type=image i][align=top i], object[align=top i]",
        type: "CSSStyleRule",
        style: {
          "vertical-align": "top"
        }
      },
      {
        selectorText: "applet[align=baseline i], embed[align=baseline i], iframe[align=baseline i],\nimg[align=baseline i], input[type=image i][align=baseline i], object[align=baseline i]",
        type: "CSSStyleRule",
        style: {
          "vertical-align": "baseline"
        }
      },
      {
        selectorText: "applet[align=texttop i], embed[align=texttop i], iframe[align=texttop i],\nimg[align=texttop i], input[type=image i][align=texttop i], object[align=texttop i]",
        type: "CSSStyleRule",
        style: {
          "vertical-align": "text-top"
        }
      },
      {
        selectorText: "applet[align=absmiddle i], embed[align=absmiddle i], iframe[align=absmiddle i],\nimg[align=absmiddle i], input[type=image i][align=absmiddle i], object[align=absmiddle i],\napplet[align=abscenter i], embed[align=abscenter i], iframe[align=abscenter i],\nimg[align=abscenter i], input[type=image i][align=abscenter i], object[align=abscenter i]",
        type: "CSSStyleRule",
        style: {
          "vertical-align": "middle"
        }
      },
      {
        selectorText: "applet[align=bottom i], embed[align=bottom i], iframe[align=bottom i],\nimg[align=bottom i], input[type=image i][align=bottom i],\nobject[align=bottom i]",
        type: "CSSStyleRule",
        style: {
          "vertical-align": "bottom"
        }
      },
      {
        selectorText: "textarea",
        type: "CSSStyleRule",
        style: {
          "white-space": "pre-wrap"
        }
      }
    ];
  }
});

// node_modules/html-styles/index.js
var require_html_styles2 = __commonJS({
  "node_modules/html-styles/index.js"(exports2, module2) {
    module2.exports = require_html_styles();
  }
});

// src/language-html/constants.evaluate.js
var require_constants_evaluate = __commonJS({
  "src/language-html/constants.evaluate.js"(exports2, module2) {
    "use strict";
    var htmlStyles = require_html_styles2();
    var getCssStyleTags = (property) => Object.fromEntries(
      htmlStyles.filter((htmlStyle) => htmlStyle.style[property]).flatMap(
        (htmlStyle) => htmlStyle.selectorText.split(",").map((selector) => selector.trim()).filter((selector) => /^[\dA-Za-z]+$/.test(selector)).map((tagName) => [tagName, htmlStyle.style[property]])
      )
    );
    var CSS_DISPLAY_TAGS = __spreadProps(__spreadValues({}, getCssStyleTags("display")), {
      button: "inline-block",
      template: "inline",
      source: "block",
      track: "block",
      script: "block",
      param: "block",
      details: "block",
      summary: "block",
      dialog: "block",
      meter: "inline-block",
      progress: "inline-block",
      object: "inline-block",
      video: "inline-block",
      audio: "inline-block",
      select: "inline-block",
      option: "block",
      optgroup: "block"
    });
    var CSS_DISPLAY_DEFAULT = "inline";
    var CSS_WHITE_SPACE_TAGS = getCssStyleTags("white-space");
    var CSS_WHITE_SPACE_DEFAULT = "normal";
    module2.exports = {
      CSS_DISPLAY_TAGS,
      CSS_DISPLAY_DEFAULT,
      CSS_WHITE_SPACE_TAGS,
      CSS_WHITE_SPACE_DEFAULT
    };
  }
});

// src/language-html/utils/is-unknown-namespace.js
var require_is_unknown_namespace = __commonJS({
  "src/language-html/utils/is-unknown-namespace.js"(exports2, module2) {
    "use strict";
    function isUnknownNamespace(node) {
      return node.type === "element" && !node.hasExplicitNamespace && !["html", "svg"].includes(node.namespace);
    }
    module2.exports = isUnknownNamespace;
  }
});

// src/language-html/utils/index.js
var require_utils = __commonJS({
  "src/language-html/utils/index.js"(exports2, module2) {
    "use strict";
    var {
      inferParserByLanguage,
      isFrontMatterNode
    } = require_util();
    var {
      builders: { line, hardline: hardline2, join },
      utils: { getDocParts: getDocParts2, replaceTextEndOfLine: replaceTextEndOfLine2 }
    } = require_document();
    var {
      CSS_DISPLAY_TAGS,
      CSS_DISPLAY_DEFAULT,
      CSS_WHITE_SPACE_TAGS,
      CSS_WHITE_SPACE_DEFAULT
    } = require_constants_evaluate();
    var isUnknownNamespace = require_is_unknown_namespace();
    var HTML_WHITESPACE = /* @__PURE__ */ new Set(["	", "\n", "\f", "\r", " "]);
    var htmlTrimStart = (string) => string.replace(/^[\t\n\f\r ]+/, "");
    var htmlTrimEnd = (string) => string.replace(/[\t\n\f\r ]+$/, "");
    var htmlTrim = (string) => htmlTrimStart(htmlTrimEnd(string));
    var htmlTrimLeadingBlankLines = (string) => string.replace(/^[\t\f\r ]*\n/g, "");
    var htmlTrimPreserveIndentation = (string) => htmlTrimLeadingBlankLines(htmlTrimEnd(string));
    var splitByHtmlWhitespace = (string) => string.split(/[\t\n\f\r ]+/);
    var getLeadingHtmlWhitespace = (string) => string.match(/^[\t\n\f\r ]*/)[0];
    var getLeadingAndTrailingHtmlWhitespace = (string) => {
      const [, leadingWhitespace, text, trailingWhitespace] = string.match(
        new RegExp("^([\\t\\n\\f\\r ]*)(.*?)([\\t\\n\\f\\r ]*)$", "s")
      );
      return {
        leadingWhitespace,
        trailingWhitespace,
        text
      };
    };
    var hasHtmlWhitespace = (string) => /[\t\n\f\r ]/.test(string);
    function shouldPreserveContent(node, options) {
      if (node.type === "ieConditionalComment" && node.lastChild && !node.lastChild.isSelfClosing && !node.lastChild.endSourceSpan) {
        return true;
      }
      if (node.type === "ieConditionalComment" && !node.complete) {
        return true;
      }
      if (isPreLikeNode(node) && node.children.some(
        (child) => child.type !== "text" && child.type !== "interpolation"
      )) {
        return true;
      }
      if (isVueNonHtmlBlock(node, options) && !isScriptLikeTag(node) && node.type !== "interpolation") {
        return true;
      }
      return false;
    }
    function hasPrettierIgnore(node) {
      if (node.type === "attribute") {
        return false;
      }
      if (!node.parent) {
        return false;
      }
      if (!node.prev) {
        return false;
      }
      return isPrettierIgnore(node.prev);
    }
    function isPrettierIgnore(node) {
      return node.type === "comment" && node.value.trim() === "prettier-ignore";
    }
    function isTextLikeNode(node) {
      return node.type === "text" || node.type === "comment";
    }
    function isScriptLikeTag(node) {
      return node.type === "element" && (node.fullName === "script" || node.fullName === "style" || node.fullName === "svg:style" || isUnknownNamespace(node) && (node.name === "script" || node.name === "style"));
    }
    function canHaveInterpolation(node) {
      return node.children && !isScriptLikeTag(node);
    }
    function isWhitespaceSensitiveNode(node) {
      return isScriptLikeTag(node) || node.type === "interpolation" || isIndentationSensitiveNode(node);
    }
    function isIndentationSensitiveNode(node) {
      return getNodeCssStyleWhiteSpace(node).startsWith("pre");
    }
    function isLeadingSpaceSensitiveNode(node, options) {
      const isLeadingSpaceSensitive = _isLeadingSpaceSensitiveNode();
      if (isLeadingSpaceSensitive && !node.prev && node.parent && node.parent.tagDefinition && node.parent.tagDefinition.ignoreFirstLf) {
        return node.type === "interpolation";
      }
      return isLeadingSpaceSensitive;
      function _isLeadingSpaceSensitiveNode() {
        if (isFrontMatterNode(node)) {
          return false;
        }
        if ((node.type === "text" || node.type === "interpolation") && node.prev && (node.prev.type === "text" || node.prev.type === "interpolation")) {
          return true;
        }
        if (!node.parent || node.parent.cssDisplay === "none") {
          return false;
        }
        if (isPreLikeNode(node.parent)) {
          return true;
        }
        if (!node.prev && (node.parent.type === "root" || isPreLikeNode(node) && node.parent || isScriptLikeTag(node.parent) || isVueCustomBlock(node.parent, options) || !isFirstChildLeadingSpaceSensitiveCssDisplay(node.parent.cssDisplay))) {
          return false;
        }
        if (node.prev && !isNextLeadingSpaceSensitiveCssDisplay(node.prev.cssDisplay)) {
          return false;
        }
        return true;
      }
    }
    function isTrailingSpaceSensitiveNode(node, options) {
      if (isFrontMatterNode(node)) {
        return false;
      }
      if ((node.type === "text" || node.type === "interpolation") && node.next && (node.next.type === "text" || node.next.type === "interpolation")) {
        return true;
      }
      if (!node.parent || node.parent.cssDisplay === "none") {
        return false;
      }
      if (isPreLikeNode(node.parent)) {
        return true;
      }
      if (!node.next && (node.parent.type === "root" || isPreLikeNode(node) && node.parent || isScriptLikeTag(node.parent) || isVueCustomBlock(node.parent, options) || !isLastChildTrailingSpaceSensitiveCssDisplay(node.parent.cssDisplay))) {
        return false;
      }
      if (node.next && !isPrevTrailingSpaceSensitiveCssDisplay(node.next.cssDisplay)) {
        return false;
      }
      return true;
    }
    function isDanglingSpaceSensitiveNode(node) {
      return isDanglingSpaceSensitiveCssDisplay(node.cssDisplay) && !isScriptLikeTag(node);
    }
    function forceNextEmptyLine(node) {
      return isFrontMatterNode(node) || node.next && node.sourceSpan.end && node.sourceSpan.end.line + 1 < node.next.sourceSpan.start.line;
    }
    function forceBreakContent(node) {
      return forceBreakChildren(node) || node.type === "element" && node.children.length > 0 && (["body", "script", "style"].includes(node.name) || node.children.some((child) => hasNonTextChild(child))) || node.firstChild && node.firstChild === node.lastChild && node.firstChild.type !== "text" && hasLeadingLineBreak(node.firstChild) && (!node.lastChild.isTrailingSpaceSensitive || hasTrailingLineBreak(node.lastChild));
    }
    function forceBreakChildren(node) {
      return node.type === "element" && node.children.length > 0 && (["html", "head", "ul", "ol", "select"].includes(node.name) || node.cssDisplay.startsWith("table") && node.cssDisplay !== "table-cell");
    }
    function preferHardlineAsLeadingSpaces(node) {
      return preferHardlineAsSurroundingSpaces(node) || node.prev && preferHardlineAsTrailingSpaces(node.prev) || hasSurroundingLineBreak(node);
    }
    function preferHardlineAsTrailingSpaces(node) {
      return preferHardlineAsSurroundingSpaces(node) || node.type === "element" && node.fullName === "br" || hasSurroundingLineBreak(node);
    }
    function hasSurroundingLineBreak(node) {
      return hasLeadingLineBreak(node) && hasTrailingLineBreak(node);
    }
    function hasLeadingLineBreak(node) {
      return node.hasLeadingSpaces && (node.prev ? node.prev.sourceSpan.end.line < node.sourceSpan.start.line : node.parent.type === "root" || node.parent.startSourceSpan.end.line < node.sourceSpan.start.line);
    }
    function hasTrailingLineBreak(node) {
      return node.hasTrailingSpaces && (node.next ? node.next.sourceSpan.start.line > node.sourceSpan.end.line : node.parent.type === "root" || node.parent.endSourceSpan && node.parent.endSourceSpan.start.line > node.sourceSpan.end.line);
    }
    function preferHardlineAsSurroundingSpaces(node) {
      switch (node.type) {
        case "ieConditionalComment":
        case "comment":
        case "directive":
          return true;
        case "element":
          return ["script", "select"].includes(node.name);
      }
      return false;
    }
    function getLastDescendant(node) {
      return node.lastChild ? getLastDescendant(node.lastChild) : node;
    }
    function hasNonTextChild(node) {
      return node.children && node.children.some((child) => child.type !== "text");
    }
    function _inferScriptParser(node) {
      const { type, lang } = node.attrMap;
      if (type === "module" || type === "text/javascript" || type === "text/babel" || type === "application/javascript" || lang === "jsx") {
        return "babel";
      }
      if (type === "application/x-typescript" || lang === "ts" || lang === "tsx") {
        return "typescript";
      }
      if (type === "text/markdown") {
        return "markdown";
      }
      if (type === "text/html") {
        return "html";
      }
      if (type && (type.endsWith("json") || type.endsWith("importmap")) || type === "speculationrules") {
        return "json";
      }
      if (type === "text/x-handlebars-template") {
        return "glimmer";
      }
    }
    function inferStyleParser(node, options) {
      const { lang } = node.attrMap;
      if (!lang || lang === "postcss" || lang === "css") {
        return "css";
      }
      if (lang === "scss") {
        return "scss";
      }
      if (lang === "less") {
        return "less";
      }
      if (lang === "stylus") {
        return inferParserByLanguage("stylus", options);
      }
    }
    function inferScriptParser(node, options) {
      if (node.name === "script" && !node.attrMap.src) {
        if (!node.attrMap.lang && !node.attrMap.type) {
          return "babel";
        }
        return _inferScriptParser(node);
      }
      if (node.name === "style") {
        return inferStyleParser(node, options);
      }
      if (options && isVueNonHtmlBlock(node, options)) {
        return _inferScriptParser(node) || !("src" in node.attrMap) && inferParserByLanguage(node.attrMap.lang, options);
      }
    }
    function isBlockLikeCssDisplay(cssDisplay) {
      return cssDisplay === "block" || cssDisplay === "list-item" || cssDisplay.startsWith("table");
    }
    function isFirstChildLeadingSpaceSensitiveCssDisplay(cssDisplay) {
      return !isBlockLikeCssDisplay(cssDisplay) && cssDisplay !== "inline-block";
    }
    function isLastChildTrailingSpaceSensitiveCssDisplay(cssDisplay) {
      return !isBlockLikeCssDisplay(cssDisplay) && cssDisplay !== "inline-block";
    }
    function isPrevTrailingSpaceSensitiveCssDisplay(cssDisplay) {
      return !isBlockLikeCssDisplay(cssDisplay);
    }
    function isNextLeadingSpaceSensitiveCssDisplay(cssDisplay) {
      return !isBlockLikeCssDisplay(cssDisplay);
    }
    function isDanglingSpaceSensitiveCssDisplay(cssDisplay) {
      return !isBlockLikeCssDisplay(cssDisplay) && cssDisplay !== "inline-block";
    }
    function isPreLikeNode(node) {
      return getNodeCssStyleWhiteSpace(node).startsWith("pre");
    }
    function countParents(path, predicate) {
      let counter = 0;
      for (let i = path.stack.length - 1; i >= 0; i--) {
        const value = path.stack[i];
        if (value && typeof value === "object" && !Array.isArray(value) && predicate(value)) {
          counter++;
        }
      }
      return counter;
    }
    function hasParent(node, fn) {
      let current = node;
      while (current) {
        if (fn(current)) {
          return true;
        }
        current = current.parent;
      }
      return false;
    }
    function getNodeCssStyleDisplay(node, options) {
      if (node.prev && node.prev.type === "comment") {
        const match = node.prev.value.match(/^\s*display:\s*([a-z]+)\s*$/);
        if (match) {
          return match[1];
        }
      }
      let isInSvgForeignObject = false;
      if (node.type === "element" && node.namespace === "svg") {
        if (hasParent(node, (parent) => parent.fullName === "svg:foreignObject")) {
          isInSvgForeignObject = true;
        } else {
          return node.name === "svg" ? "inline-block" : "block";
        }
      }
      switch (options.htmlWhitespaceSensitivity) {
        case "strict":
          return "inline";
        case "ignore":
          return "block";
        default: {
          if (options.parser === "vue" && node.parent && node.parent.type === "root") {
            return "block";
          }
          return node.type === "element" && (!node.namespace || isInSvgForeignObject || isUnknownNamespace(node)) && CSS_DISPLAY_TAGS[node.name] || CSS_DISPLAY_DEFAULT;
        }
      }
    }
    function getNodeCssStyleWhiteSpace(node) {
      return node.type === "element" && (!node.namespace || isUnknownNamespace(node)) && CSS_WHITE_SPACE_TAGS[node.name] || CSS_WHITE_SPACE_DEFAULT;
    }
    function getMinIndentation(text) {
      let minIndentation = Number.POSITIVE_INFINITY;
      for (const lineText of text.split("\n")) {
        if (lineText.length === 0) {
          continue;
        }
        if (!HTML_WHITESPACE.has(lineText[0])) {
          return 0;
        }
        const indentation = getLeadingHtmlWhitespace(lineText).length;
        if (lineText.length === indentation) {
          continue;
        }
        if (indentation < minIndentation) {
          minIndentation = indentation;
        }
      }
      return minIndentation === Number.POSITIVE_INFINITY ? 0 : minIndentation;
    }
    function dedentString(text, minIndent = getMinIndentation(text)) {
      return minIndent === 0 ? text : text.split("\n").map((lineText) => lineText.slice(minIndent)).join("\n");
    }
    function countChars2(text, char) {
      let counter = 0;
      for (let i = 0; i < text.length; i++) {
        if (text[i] === char) {
          counter++;
        }
      }
      return counter;
    }
    function unescapeQuoteEntities2(text) {
      return text.replace(/&apos;/g, "'").replace(/&quot;/g, '"');
    }
    var vueRootElementsSet = /* @__PURE__ */ new Set(["template", "style", "script"]);
    function isVueCustomBlock(node, options) {
      return isVueSfcBlock(node, options) && !vueRootElementsSet.has(node.fullName);
    }
    function isVueSfcBlock(node, options) {
      return options.parser === "vue" && node.type === "element" && node.parent.type === "root" && node.fullName.toLowerCase() !== "html";
    }
    function isVueNonHtmlBlock(node, options) {
      return isVueSfcBlock(node, options) && (isVueCustomBlock(node, options) || node.attrMap.lang && node.attrMap.lang !== "html");
    }
    function isVueSlotAttribute(attribute) {
      const attributeName = attribute.fullName;
      return attributeName.charAt(0) === "#" || attributeName === "slot-scope" || attributeName === "v-slot" || attributeName.startsWith("v-slot:");
    }
    function isVueSfcBindingsAttribute(attribute, options) {
      const element = attribute.parent;
      if (!isVueSfcBlock(element, options)) {
        return false;
      }
      const tagName = element.fullName;
      const attributeName = attribute.fullName;
      return tagName === "script" && attributeName === "setup" || tagName === "style" && attributeName === "vars";
    }
    function getTextValueParts2(node, value = node.value) {
      return node.parent.isWhitespaceSensitive ? node.parent.isIndentationSensitive ? replaceTextEndOfLine2(value) : replaceTextEndOfLine2(
        dedentString(htmlTrimPreserveIndentation(value)),
        hardline2
      ) : getDocParts2(join(line, splitByHtmlWhitespace(value)));
    }
    function isVueScriptTag(node, options) {
      return isVueSfcBlock(node, options) && node.name === "script";
    }
    module2.exports = {
      htmlTrim,
      htmlTrimPreserveIndentation,
      hasHtmlWhitespace,
      getLeadingAndTrailingHtmlWhitespace,
      canHaveInterpolation,
      countChars: countChars2,
      countParents,
      dedentString,
      forceBreakChildren,
      forceBreakContent,
      forceNextEmptyLine,
      getLastDescendant,
      getNodeCssStyleDisplay,
      getNodeCssStyleWhiteSpace,
      hasPrettierIgnore,
      inferScriptParser,
      isVueCustomBlock,
      isVueNonHtmlBlock,
      isVueScriptTag,
      isVueSlotAttribute,
      isVueSfcBindingsAttribute,
      isVueSfcBlock,
      isDanglingSpaceSensitiveNode,
      isIndentationSensitiveNode,
      isLeadingSpaceSensitiveNode,
      isPreLikeNode,
      isScriptLikeTag,
      isTextLikeNode,
      isTrailingSpaceSensitiveNode,
      isWhitespaceSensitiveNode,
      isUnknownNamespace,
      preferHardlineAsLeadingSpaces,
      preferHardlineAsTrailingSpaces,
      shouldPreserveContent,
      unescapeQuoteEntities: unescapeQuoteEntities2,
      getTextValueParts: getTextValueParts2
    };
  }
});

// node_modules/angular-html-parser/lib/compiler/src/chars.js
var require_chars = __commonJS({
  "node_modules/angular-html-parser/lib/compiler/src/chars.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.$EOF = 0;
    exports2.$BSPACE = 8;
    exports2.$TAB = 9;
    exports2.$LF = 10;
    exports2.$VTAB = 11;
    exports2.$FF = 12;
    exports2.$CR = 13;
    exports2.$SPACE = 32;
    exports2.$BANG = 33;
    exports2.$DQ = 34;
    exports2.$HASH = 35;
    exports2.$$ = 36;
    exports2.$PERCENT = 37;
    exports2.$AMPERSAND = 38;
    exports2.$SQ = 39;
    exports2.$LPAREN = 40;
    exports2.$RPAREN = 41;
    exports2.$STAR = 42;
    exports2.$PLUS = 43;
    exports2.$COMMA = 44;
    exports2.$MINUS = 45;
    exports2.$PERIOD = 46;
    exports2.$SLASH = 47;
    exports2.$COLON = 58;
    exports2.$SEMICOLON = 59;
    exports2.$LT = 60;
    exports2.$EQ = 61;
    exports2.$GT = 62;
    exports2.$QUESTION = 63;
    exports2.$0 = 48;
    exports2.$7 = 55;
    exports2.$9 = 57;
    exports2.$A = 65;
    exports2.$E = 69;
    exports2.$F = 70;
    exports2.$X = 88;
    exports2.$Z = 90;
    exports2.$LBRACKET = 91;
    exports2.$BACKSLASH = 92;
    exports2.$RBRACKET = 93;
    exports2.$CARET = 94;
    exports2.$_ = 95;
    exports2.$a = 97;
    exports2.$b = 98;
    exports2.$e = 101;
    exports2.$f = 102;
    exports2.$n = 110;
    exports2.$r = 114;
    exports2.$t = 116;
    exports2.$u = 117;
    exports2.$v = 118;
    exports2.$x = 120;
    exports2.$z = 122;
    exports2.$LBRACE = 123;
    exports2.$BAR = 124;
    exports2.$RBRACE = 125;
    exports2.$NBSP = 160;
    exports2.$PIPE = 124;
    exports2.$TILDA = 126;
    exports2.$AT = 64;
    exports2.$BT = 96;
    function isWhitespace(code) {
      return code >= exports2.$TAB && code <= exports2.$SPACE || code == exports2.$NBSP;
    }
    exports2.isWhitespace = isWhitespace;
    function isDigit(code) {
      return exports2.$0 <= code && code <= exports2.$9;
    }
    exports2.isDigit = isDigit;
    function isAsciiLetter(code) {
      return code >= exports2.$a && code <= exports2.$z || code >= exports2.$A && code <= exports2.$Z;
    }
    exports2.isAsciiLetter = isAsciiLetter;
    function isAsciiHexDigit(code) {
      return code >= exports2.$a && code <= exports2.$f || code >= exports2.$A && code <= exports2.$F || isDigit(code);
    }
    exports2.isAsciiHexDigit = isAsciiHexDigit;
    function isNewLine(code) {
      return code === exports2.$LF || code === exports2.$CR;
    }
    exports2.isNewLine = isNewLine;
    function isOctalDigit(code) {
      return exports2.$0 <= code && code <= exports2.$7;
    }
    exports2.isOctalDigit = isOctalDigit;
  }
});

// node_modules/angular-html-parser/lib/compiler/src/aot/static_symbol.js
var require_static_symbol = __commonJS({
  "node_modules/angular-html-parser/lib/compiler/src/aot/static_symbol.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var StaticSymbol = class {
      constructor(filePath, name, members) {
        this.filePath = filePath;
        this.name = name;
        this.members = members;
      }
      assertNoMembers() {
        if (this.members.length) {
          throw new Error(`Illegal state: symbol without members expected, but got ${JSON.stringify(this)}.`);
        }
      }
    };
    exports2.StaticSymbol = StaticSymbol;
    var StaticSymbolCache = class {
      constructor() {
        this.cache = /* @__PURE__ */ new Map();
      }
      get(declarationFile, name, members) {
        members = members || [];
        const memberSuffix = members.length ? `.${members.join(".")}` : "";
        const key = `"${declarationFile}".${name}${memberSuffix}`;
        let result = this.cache.get(key);
        if (!result) {
          result = new StaticSymbol(declarationFile, name, members);
          this.cache.set(key, result);
        }
        return result;
      }
    };
    exports2.StaticSymbolCache = StaticSymbolCache;
  }
});

// node_modules/angular-html-parser/lib/compiler/src/util.js
var require_util2 = __commonJS({
  "node_modules/angular-html-parser/lib/compiler/src/util.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var DASH_CASE_REGEXP = /-+([a-z0-9])/g;
    function dashCaseToCamelCase(input) {
      return input.replace(DASH_CASE_REGEXP, (...m) => m[1].toUpperCase());
    }
    exports2.dashCaseToCamelCase = dashCaseToCamelCase;
    function splitAtColon(input, defaultValues) {
      return _splitAt(input, ":", defaultValues);
    }
    exports2.splitAtColon = splitAtColon;
    function splitAtPeriod(input, defaultValues) {
      return _splitAt(input, ".", defaultValues);
    }
    exports2.splitAtPeriod = splitAtPeriod;
    function _splitAt(input, character, defaultValues) {
      const characterIndex = input.indexOf(character);
      if (characterIndex == -1)
        return defaultValues;
      return [input.slice(0, characterIndex).trim(), input.slice(characterIndex + 1).trim()];
    }
    function visitValue(value, visitor, context) {
      if (Array.isArray(value)) {
        return visitor.visitArray(value, context);
      }
      if (isStrictStringMap(value)) {
        return visitor.visitStringMap(value, context);
      }
      if (value == null || typeof value == "string" || typeof value == "number" || typeof value == "boolean") {
        return visitor.visitPrimitive(value, context);
      }
      return visitor.visitOther(value, context);
    }
    exports2.visitValue = visitValue;
    function isDefined(val) {
      return val !== null && val !== void 0;
    }
    exports2.isDefined = isDefined;
    function noUndefined(val) {
      return val === void 0 ? null : val;
    }
    exports2.noUndefined = noUndefined;
    var ValueTransformer = class {
      visitArray(arr, context) {
        return arr.map((value) => visitValue(value, this, context));
      }
      visitStringMap(map, context) {
        const result = {};
        Object.keys(map).forEach((key) => {
          result[key] = visitValue(map[key], this, context);
        });
        return result;
      }
      visitPrimitive(value, context) {
        return value;
      }
      visitOther(value, context) {
        return value;
      }
    };
    exports2.ValueTransformer = ValueTransformer;
    exports2.SyncAsync = {
      assertSync: (value) => {
        if (isPromise(value)) {
          throw new Error(`Illegal state: value cannot be a promise`);
        }
        return value;
      },
      then: (value, cb) => {
        return isPromise(value) ? value.then(cb) : cb(value);
      },
      all: (syncAsyncValues) => {
        return syncAsyncValues.some(isPromise) ? Promise.all(syncAsyncValues) : syncAsyncValues;
      }
    };
    function error(msg) {
      throw new Error(`Internal Error: ${msg}`);
    }
    exports2.error = error;
    function syntaxError(msg, parseErrors) {
      const error2 = Error(msg);
      error2[ERROR_SYNTAX_ERROR] = true;
      if (parseErrors)
        error2[ERROR_PARSE_ERRORS] = parseErrors;
      return error2;
    }
    exports2.syntaxError = syntaxError;
    var ERROR_SYNTAX_ERROR = "ngSyntaxError";
    var ERROR_PARSE_ERRORS = "ngParseErrors";
    function isSyntaxError(error2) {
      return error2[ERROR_SYNTAX_ERROR];
    }
    exports2.isSyntaxError = isSyntaxError;
    function getParseErrors(error2) {
      return error2[ERROR_PARSE_ERRORS] || [];
    }
    exports2.getParseErrors = getParseErrors;
    function escapeRegExp(s) {
      return s.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
    }
    exports2.escapeRegExp = escapeRegExp;
    var STRING_MAP_PROTO = Object.getPrototypeOf({});
    function isStrictStringMap(obj) {
      return typeof obj === "object" && obj !== null && Object.getPrototypeOf(obj) === STRING_MAP_PROTO;
    }
    function utf8Encode(str) {
      let encoded = "";
      for (let index = 0; index < str.length; index++) {
        let codePoint = str.charCodeAt(index);
        if (codePoint >= 55296 && codePoint <= 56319 && str.length > index + 1) {
          const low = str.charCodeAt(index + 1);
          if (low >= 56320 && low <= 57343) {
            index++;
            codePoint = (codePoint - 55296 << 10) + low - 56320 + 65536;
          }
        }
        if (codePoint <= 127) {
          encoded += String.fromCharCode(codePoint);
        } else if (codePoint <= 2047) {
          encoded += String.fromCharCode(codePoint >> 6 & 31 | 192, codePoint & 63 | 128);
        } else if (codePoint <= 65535) {
          encoded += String.fromCharCode(codePoint >> 12 | 224, codePoint >> 6 & 63 | 128, codePoint & 63 | 128);
        } else if (codePoint <= 2097151) {
          encoded += String.fromCharCode(codePoint >> 18 & 7 | 240, codePoint >> 12 & 63 | 128, codePoint >> 6 & 63 | 128, codePoint & 63 | 128);
        }
      }
      return encoded;
    }
    exports2.utf8Encode = utf8Encode;
    function stringify(token) {
      if (typeof token === "string") {
        return token;
      }
      if (token instanceof Array) {
        return "[" + token.map(stringify).join(", ") + "]";
      }
      if (token == null) {
        return "" + token;
      }
      if (token.overriddenName) {
        return `${token.overriddenName}`;
      }
      if (token.name) {
        return `${token.name}`;
      }
      if (!token.toString) {
        return "object";
      }
      const res = token.toString();
      if (res == null) {
        return "" + res;
      }
      const newLineIndex = res.indexOf("\n");
      return newLineIndex === -1 ? res : res.substring(0, newLineIndex);
    }
    exports2.stringify = stringify;
    function resolveForwardRef(type) {
      if (typeof type === "function" && type.hasOwnProperty("__forward_ref__")) {
        return type();
      } else {
        return type;
      }
    }
    exports2.resolveForwardRef = resolveForwardRef;
    function isPromise(obj) {
      return !!obj && typeof obj.then === "function";
    }
    exports2.isPromise = isPromise;
    var Version = class {
      constructor(full) {
        this.full = full;
        const splits = full.split(".");
        this.major = splits[0];
        this.minor = splits[1];
        this.patch = splits.slice(2).join(".");
      }
    };
    exports2.Version = Version;
    var __window = typeof window !== "undefined" && window;
    var __self = typeof self !== "undefined" && typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope && self;
    var __global = typeof global !== "undefined" && global;
    var _global = __global || __window || __self;
    exports2.global = _global;
  }
});

// node_modules/angular-html-parser/lib/compiler/src/compile_metadata.js
var require_compile_metadata = __commonJS({
  "node_modules/angular-html-parser/lib/compiler/src/compile_metadata.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var static_symbol_1 = require_static_symbol();
    var util_1 = require_util2();
    var HOST_REG_EXP = /^(?:(?:\[([^\]]+)\])|(?:\(([^\)]+)\)))|(\@[-\w]+)$/;
    function sanitizeIdentifier(name) {
      return name.replace(/\W/g, "_");
    }
    exports2.sanitizeIdentifier = sanitizeIdentifier;
    var _anonymousTypeIndex = 0;
    function identifierName(compileIdentifier) {
      if (!compileIdentifier || !compileIdentifier.reference) {
        return null;
      }
      const ref = compileIdentifier.reference;
      if (ref instanceof static_symbol_1.StaticSymbol) {
        return ref.name;
      }
      if (ref["__anonymousType"]) {
        return ref["__anonymousType"];
      }
      let identifier = util_1.stringify(ref);
      if (identifier.indexOf("(") >= 0) {
        identifier = `anonymous_${_anonymousTypeIndex++}`;
        ref["__anonymousType"] = identifier;
      } else {
        identifier = sanitizeIdentifier(identifier);
      }
      return identifier;
    }
    exports2.identifierName = identifierName;
    function identifierModuleUrl(compileIdentifier) {
      const ref = compileIdentifier.reference;
      if (ref instanceof static_symbol_1.StaticSymbol) {
        return ref.filePath;
      }
      return `./${util_1.stringify(ref)}`;
    }
    exports2.identifierModuleUrl = identifierModuleUrl;
    function viewClassName(compType, embeddedTemplateIndex) {
      return `View_${identifierName({ reference: compType })}_${embeddedTemplateIndex}`;
    }
    exports2.viewClassName = viewClassName;
    function rendererTypeName(compType) {
      return `RenderType_${identifierName({ reference: compType })}`;
    }
    exports2.rendererTypeName = rendererTypeName;
    function hostViewClassName(compType) {
      return `HostView_${identifierName({ reference: compType })}`;
    }
    exports2.hostViewClassName = hostViewClassName;
    function componentFactoryName(compType) {
      return `${identifierName({ reference: compType })}NgFactory`;
    }
    exports2.componentFactoryName = componentFactoryName;
    var CompileSummaryKind;
    (function(CompileSummaryKind2) {
      CompileSummaryKind2[CompileSummaryKind2["Pipe"] = 0] = "Pipe";
      CompileSummaryKind2[CompileSummaryKind2["Directive"] = 1] = "Directive";
      CompileSummaryKind2[CompileSummaryKind2["NgModule"] = 2] = "NgModule";
      CompileSummaryKind2[CompileSummaryKind2["Injectable"] = 3] = "Injectable";
    })(CompileSummaryKind = exports2.CompileSummaryKind || (exports2.CompileSummaryKind = {}));
    function tokenName(token) {
      return token.value != null ? sanitizeIdentifier(token.value) : identifierName(token.identifier);
    }
    exports2.tokenName = tokenName;
    function tokenReference(token) {
      if (token.identifier != null) {
        return token.identifier.reference;
      } else {
        return token.value;
      }
    }
    exports2.tokenReference = tokenReference;
    var CompileStylesheetMetadata = class {
      constructor({ moduleUrl, styles, styleUrls } = {}) {
        this.moduleUrl = moduleUrl || null;
        this.styles = _normalizeArray(styles);
        this.styleUrls = _normalizeArray(styleUrls);
      }
    };
    exports2.CompileStylesheetMetadata = CompileStylesheetMetadata;
    var CompileTemplateMetadata = class {
      constructor({ encapsulation, template, templateUrl, htmlAst, styles, styleUrls, externalStylesheets, animations, ngContentSelectors, interpolation, isInline, preserveWhitespaces }) {
        this.encapsulation = encapsulation;
        this.template = template;
        this.templateUrl = templateUrl;
        this.htmlAst = htmlAst;
        this.styles = _normalizeArray(styles);
        this.styleUrls = _normalizeArray(styleUrls);
        this.externalStylesheets = _normalizeArray(externalStylesheets);
        this.animations = animations ? flatten(animations) : [];
        this.ngContentSelectors = ngContentSelectors || [];
        if (interpolation && interpolation.length != 2) {
          throw new Error(`'interpolation' should have a start and an end symbol.`);
        }
        this.interpolation = interpolation;
        this.isInline = isInline;
        this.preserveWhitespaces = preserveWhitespaces;
      }
      toSummary() {
        return {
          ngContentSelectors: this.ngContentSelectors,
          encapsulation: this.encapsulation,
          styles: this.styles,
          animations: this.animations
        };
      }
    };
    exports2.CompileTemplateMetadata = CompileTemplateMetadata;
    var CompileDirectiveMetadata = class {
      static create({ isHost, type, isComponent, selector, exportAs, changeDetection, inputs, outputs, host, providers, viewProviders, queries, guards, viewQueries, entryComponents, template, componentViewType, rendererType, componentFactory }) {
        const hostListeners = {};
        const hostProperties = {};
        const hostAttributes = {};
        if (host != null) {
          Object.keys(host).forEach((key) => {
            const value = host[key];
            const matches = key.match(HOST_REG_EXP);
            if (matches === null) {
              hostAttributes[key] = value;
            } else if (matches[1] != null) {
              hostProperties[matches[1]] = value;
            } else if (matches[2] != null) {
              hostListeners[matches[2]] = value;
            }
          });
        }
        const inputsMap = {};
        if (inputs != null) {
          inputs.forEach((bindConfig) => {
            const parts = util_1.splitAtColon(bindConfig, [bindConfig, bindConfig]);
            inputsMap[parts[0]] = parts[1];
          });
        }
        const outputsMap = {};
        if (outputs != null) {
          outputs.forEach((bindConfig) => {
            const parts = util_1.splitAtColon(bindConfig, [bindConfig, bindConfig]);
            outputsMap[parts[0]] = parts[1];
          });
        }
        return new CompileDirectiveMetadata({
          isHost,
          type,
          isComponent: !!isComponent,
          selector,
          exportAs,
          changeDetection,
          inputs: inputsMap,
          outputs: outputsMap,
          hostListeners,
          hostProperties,
          hostAttributes,
          providers,
          viewProviders,
          queries,
          guards,
          viewQueries,
          entryComponents,
          template,
          componentViewType,
          rendererType,
          componentFactory
        });
      }
      constructor({ isHost, type, isComponent, selector, exportAs, changeDetection, inputs, outputs, hostListeners, hostProperties, hostAttributes, providers, viewProviders, queries, guards, viewQueries, entryComponents, template, componentViewType, rendererType, componentFactory }) {
        this.isHost = !!isHost;
        this.type = type;
        this.isComponent = isComponent;
        this.selector = selector;
        this.exportAs = exportAs;
        this.changeDetection = changeDetection;
        this.inputs = inputs;
        this.outputs = outputs;
        this.hostListeners = hostListeners;
        this.hostProperties = hostProperties;
        this.hostAttributes = hostAttributes;
        this.providers = _normalizeArray(providers);
        this.viewProviders = _normalizeArray(viewProviders);
        this.queries = _normalizeArray(queries);
        this.guards = guards;
        this.viewQueries = _normalizeArray(viewQueries);
        this.entryComponents = _normalizeArray(entryComponents);
        this.template = template;
        this.componentViewType = componentViewType;
        this.rendererType = rendererType;
        this.componentFactory = componentFactory;
      }
      toSummary() {
        return {
          summaryKind: CompileSummaryKind.Directive,
          type: this.type,
          isComponent: this.isComponent,
          selector: this.selector,
          exportAs: this.exportAs,
          inputs: this.inputs,
          outputs: this.outputs,
          hostListeners: this.hostListeners,
          hostProperties: this.hostProperties,
          hostAttributes: this.hostAttributes,
          providers: this.providers,
          viewProviders: this.viewProviders,
          queries: this.queries,
          guards: this.guards,
          viewQueries: this.viewQueries,
          entryComponents: this.entryComponents,
          changeDetection: this.changeDetection,
          template: this.template && this.template.toSummary(),
          componentViewType: this.componentViewType,
          rendererType: this.rendererType,
          componentFactory: this.componentFactory
        };
      }
    };
    exports2.CompileDirectiveMetadata = CompileDirectiveMetadata;
    var CompilePipeMetadata = class {
      constructor({ type, name, pure }) {
        this.type = type;
        this.name = name;
        this.pure = !!pure;
      }
      toSummary() {
        return {
          summaryKind: CompileSummaryKind.Pipe,
          type: this.type,
          name: this.name,
          pure: this.pure
        };
      }
    };
    exports2.CompilePipeMetadata = CompilePipeMetadata;
    var CompileShallowModuleMetadata = class {
    };
    exports2.CompileShallowModuleMetadata = CompileShallowModuleMetadata;
    var CompileNgModuleMetadata = class {
      constructor({ type, providers, declaredDirectives, exportedDirectives, declaredPipes, exportedPipes, entryComponents, bootstrapComponents, importedModules, exportedModules, schemas, transitiveModule, id }) {
        this.type = type || null;
        this.declaredDirectives = _normalizeArray(declaredDirectives);
        this.exportedDirectives = _normalizeArray(exportedDirectives);
        this.declaredPipes = _normalizeArray(declaredPipes);
        this.exportedPipes = _normalizeArray(exportedPipes);
        this.providers = _normalizeArray(providers);
        this.entryComponents = _normalizeArray(entryComponents);
        this.bootstrapComponents = _normalizeArray(bootstrapComponents);
        this.importedModules = _normalizeArray(importedModules);
        this.exportedModules = _normalizeArray(exportedModules);
        this.schemas = _normalizeArray(schemas);
        this.id = id || null;
        this.transitiveModule = transitiveModule || null;
      }
      toSummary() {
        const module3 = this.transitiveModule;
        return {
          summaryKind: CompileSummaryKind.NgModule,
          type: this.type,
          entryComponents: module3.entryComponents,
          providers: module3.providers,
          modules: module3.modules,
          exportedDirectives: module3.exportedDirectives,
          exportedPipes: module3.exportedPipes
        };
      }
    };
    exports2.CompileNgModuleMetadata = CompileNgModuleMetadata;
    var TransitiveCompileNgModuleMetadata = class {
      constructor() {
        this.directivesSet = /* @__PURE__ */ new Set();
        this.directives = [];
        this.exportedDirectivesSet = /* @__PURE__ */ new Set();
        this.exportedDirectives = [];
        this.pipesSet = /* @__PURE__ */ new Set();
        this.pipes = [];
        this.exportedPipesSet = /* @__PURE__ */ new Set();
        this.exportedPipes = [];
        this.modulesSet = /* @__PURE__ */ new Set();
        this.modules = [];
        this.entryComponentsSet = /* @__PURE__ */ new Set();
        this.entryComponents = [];
        this.providers = [];
      }
      addProvider(provider, module3) {
        this.providers.push({ provider, module: module3 });
      }
      addDirective(id) {
        if (!this.directivesSet.has(id.reference)) {
          this.directivesSet.add(id.reference);
          this.directives.push(id);
        }
      }
      addExportedDirective(id) {
        if (!this.exportedDirectivesSet.has(id.reference)) {
          this.exportedDirectivesSet.add(id.reference);
          this.exportedDirectives.push(id);
        }
      }
      addPipe(id) {
        if (!this.pipesSet.has(id.reference)) {
          this.pipesSet.add(id.reference);
          this.pipes.push(id);
        }
      }
      addExportedPipe(id) {
        if (!this.exportedPipesSet.has(id.reference)) {
          this.exportedPipesSet.add(id.reference);
          this.exportedPipes.push(id);
        }
      }
      addModule(id) {
        if (!this.modulesSet.has(id.reference)) {
          this.modulesSet.add(id.reference);
          this.modules.push(id);
        }
      }
      addEntryComponent(ec) {
        if (!this.entryComponentsSet.has(ec.componentType)) {
          this.entryComponentsSet.add(ec.componentType);
          this.entryComponents.push(ec);
        }
      }
    };
    exports2.TransitiveCompileNgModuleMetadata = TransitiveCompileNgModuleMetadata;
    function _normalizeArray(obj) {
      return obj || [];
    }
    var ProviderMeta = class {
      constructor(token, { useClass, useValue, useExisting, useFactory, deps, multi }) {
        this.token = token;
        this.useClass = useClass || null;
        this.useValue = useValue;
        this.useExisting = useExisting;
        this.useFactory = useFactory || null;
        this.dependencies = deps || null;
        this.multi = !!multi;
      }
    };
    exports2.ProviderMeta = ProviderMeta;
    function flatten(list) {
      return list.reduce((flat, item) => {
        const flatItem = Array.isArray(item) ? flatten(item) : item;
        return flat.concat(flatItem);
      }, []);
    }
    exports2.flatten = flatten;
    function jitSourceUrl(url) {
      return url.replace(/(\w+:\/\/[\w:-]+)?(\/+)?/, "ng:///");
    }
    function templateSourceUrl(ngModuleType, compMeta, templateMeta) {
      let url;
      if (templateMeta.isInline) {
        if (compMeta.type.reference instanceof static_symbol_1.StaticSymbol) {
          url = `${compMeta.type.reference.filePath}.${compMeta.type.reference.name}.html`;
        } else {
          url = `${identifierName(ngModuleType)}/${identifierName(compMeta.type)}.html`;
        }
      } else {
        url = templateMeta.templateUrl;
      }
      return compMeta.type.reference instanceof static_symbol_1.StaticSymbol ? url : jitSourceUrl(url);
    }
    exports2.templateSourceUrl = templateSourceUrl;
    function sharedStylesheetJitUrl(meta, id) {
      const pathParts = meta.moduleUrl.split(/\/\\/g);
      const baseName = pathParts[pathParts.length - 1];
      return jitSourceUrl(`css/${id}${baseName}.ngstyle.js`);
    }
    exports2.sharedStylesheetJitUrl = sharedStylesheetJitUrl;
    function ngModuleJitUrl(moduleMeta) {
      return jitSourceUrl(`${identifierName(moduleMeta.type)}/module.ngfactory.js`);
    }
    exports2.ngModuleJitUrl = ngModuleJitUrl;
    function templateJitUrl(ngModuleType, compMeta) {
      return jitSourceUrl(`${identifierName(ngModuleType)}/${identifierName(compMeta.type)}.ngfactory.js`);
    }
    exports2.templateJitUrl = templateJitUrl;
  }
});

// node_modules/angular-html-parser/lib/compiler/src/parse_util.js
var require_parse_util = __commonJS({
  "node_modules/angular-html-parser/lib/compiler/src/parse_util.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var chars = require_chars();
    var compile_metadata_1 = require_compile_metadata();
    var ParseLocation = class {
      constructor(file, offset, line, col) {
        this.file = file;
        this.offset = offset;
        this.line = line;
        this.col = col;
      }
      toString() {
        return this.offset != null ? `${this.file.url}@${this.line}:${this.col}` : this.file.url;
      }
      moveBy(delta) {
        const source = this.file.content;
        const len = source.length;
        let offset = this.offset;
        let line = this.line;
        let col = this.col;
        while (offset > 0 && delta < 0) {
          offset--;
          delta++;
          const ch = source.charCodeAt(offset);
          if (ch == chars.$LF) {
            line--;
            const priorLine = source.substr(0, offset - 1).lastIndexOf(String.fromCharCode(chars.$LF));
            col = priorLine > 0 ? offset - priorLine : offset;
          } else {
            col--;
          }
        }
        while (offset < len && delta > 0) {
          const ch = source.charCodeAt(offset);
          offset++;
          delta--;
          if (ch == chars.$LF) {
            line++;
            col = 0;
          } else {
            col++;
          }
        }
        return new ParseLocation(this.file, offset, line, col);
      }
      getContext(maxChars, maxLines) {
        const content = this.file.content;
        let startOffset = this.offset;
        if (startOffset != null) {
          if (startOffset > content.length - 1) {
            startOffset = content.length - 1;
          }
          let endOffset = startOffset;
          let ctxChars = 0;
          let ctxLines = 0;
          while (ctxChars < maxChars && startOffset > 0) {
            startOffset--;
            ctxChars++;
            if (content[startOffset] == "\n") {
              if (++ctxLines == maxLines) {
                break;
              }
            }
          }
          ctxChars = 0;
          ctxLines = 0;
          while (ctxChars < maxChars && endOffset < content.length - 1) {
            endOffset++;
            ctxChars++;
            if (content[endOffset] == "\n") {
              if (++ctxLines == maxLines) {
                break;
              }
            }
          }
          return {
            before: content.substring(startOffset, this.offset),
            after: content.substring(this.offset, endOffset + 1)
          };
        }
        return null;
      }
    };
    exports2.ParseLocation = ParseLocation;
    var ParseSourceFile = class {
      constructor(content, url) {
        this.content = content;
        this.url = url;
      }
    };
    exports2.ParseSourceFile = ParseSourceFile;
    var ParseSourceSpan = class {
      constructor(start, end, details = null) {
        this.start = start;
        this.end = end;
        this.details = details;
      }
      toString() {
        return this.start.file.content.substring(this.start.offset, this.end.offset);
      }
    };
    exports2.ParseSourceSpan = ParseSourceSpan;
    exports2.EMPTY_PARSE_LOCATION = new ParseLocation(new ParseSourceFile("", ""), 0, 0, 0);
    exports2.EMPTY_SOURCE_SPAN = new ParseSourceSpan(exports2.EMPTY_PARSE_LOCATION, exports2.EMPTY_PARSE_LOCATION);
    var ParseErrorLevel;
    (function(ParseErrorLevel2) {
      ParseErrorLevel2[ParseErrorLevel2["WARNING"] = 0] = "WARNING";
      ParseErrorLevel2[ParseErrorLevel2["ERROR"] = 1] = "ERROR";
    })(ParseErrorLevel = exports2.ParseErrorLevel || (exports2.ParseErrorLevel = {}));
    var ParseError = class {
      constructor(span, msg, level = ParseErrorLevel.ERROR) {
        this.span = span;
        this.msg = msg;
        this.level = level;
      }
      contextualMessage() {
        const ctx = this.span.start.getContext(100, 3);
        return ctx ? `${this.msg} ("${ctx.before}[${ParseErrorLevel[this.level]} ->]${ctx.after}")` : this.msg;
      }
      toString() {
        const details = this.span.details ? `, ${this.span.details}` : "";
        return `${this.contextualMessage()}: ${this.span.start}${details}`;
      }
    };
    exports2.ParseError = ParseError;
    function typeSourceSpan(kind, type) {
      const moduleUrl = compile_metadata_1.identifierModuleUrl(type);
      const sourceFileName = moduleUrl != null ? `in ${kind} ${compile_metadata_1.identifierName(type)} in ${moduleUrl}` : `in ${kind} ${compile_metadata_1.identifierName(type)}`;
      const sourceFile = new ParseSourceFile("", sourceFileName);
      return new ParseSourceSpan(new ParseLocation(sourceFile, -1, -1, -1), new ParseLocation(sourceFile, -1, -1, -1));
    }
    exports2.typeSourceSpan = typeSourceSpan;
    function r3JitTypeSourceSpan(kind, typeName, sourceUrl) {
      const sourceFileName = `in ${kind} ${typeName} in ${sourceUrl}`;
      const sourceFile = new ParseSourceFile("", sourceFileName);
      return new ParseSourceSpan(new ParseLocation(sourceFile, -1, -1, -1), new ParseLocation(sourceFile, -1, -1, -1));
    }
    exports2.r3JitTypeSourceSpan = r3JitTypeSourceSpan;
  }
});

// src/language-html/print-preprocess.js
var require_print_preprocess = __commonJS({
  "src/language-html/print-preprocess.js"(exports2, module2) {
    "use strict";
    var {
      ParseSourceSpan
    } = require_parse_util();
    var {
      htmlTrim,
      getLeadingAndTrailingHtmlWhitespace,
      hasHtmlWhitespace,
      canHaveInterpolation,
      getNodeCssStyleDisplay,
      isDanglingSpaceSensitiveNode,
      isIndentationSensitiveNode,
      isLeadingSpaceSensitiveNode,
      isTrailingSpaceSensitiveNode,
      isWhitespaceSensitiveNode,
      isVueScriptTag
    } = require_utils();
    var PREPROCESS_PIPELINE = [
      removeIgnorableFirstLf,
      mergeIfConditionalStartEndCommentIntoElementOpeningTag,
      mergeCdataIntoText,
      extractInterpolation,
      extractWhitespaces,
      addCssDisplay,
      addIsSelfClosing,
      addHasHtmComponentClosingTag,
      addIsSpaceSensitive,
      mergeSimpleElementIntoText,
      markTsScript
    ];
    function preprocess2(ast, options) {
      for (const fn of PREPROCESS_PIPELINE) {
        fn(ast, options);
      }
      return ast;
    }
    function removeIgnorableFirstLf(ast) {
      ast.walk((node) => {
        if (node.type === "element" && node.tagDefinition.ignoreFirstLf && node.children.length > 0 && node.children[0].type === "text" && node.children[0].value[0] === "\n") {
          const text = node.children[0];
          if (text.value.length === 1) {
            node.removeChild(text);
          } else {
            text.value = text.value.slice(1);
          }
        }
      });
    }
    function mergeIfConditionalStartEndCommentIntoElementOpeningTag(ast) {
      const isTarget = (node) => node.type === "element" && node.prev && node.prev.type === "ieConditionalStartComment" && node.prev.sourceSpan.end.offset === node.startSourceSpan.start.offset && node.firstChild && node.firstChild.type === "ieConditionalEndComment" && node.firstChild.sourceSpan.start.offset === node.startSourceSpan.end.offset;
      ast.walk((node) => {
        if (node.children) {
          for (let i = 0; i < node.children.length; i++) {
            const child = node.children[i];
            if (!isTarget(child)) {
              continue;
            }
            const ieConditionalStartComment = child.prev;
            const ieConditionalEndComment = child.firstChild;
            node.removeChild(ieConditionalStartComment);
            i--;
            const startSourceSpan = new ParseSourceSpan(
              ieConditionalStartComment.sourceSpan.start,
              ieConditionalEndComment.sourceSpan.end
            );
            const sourceSpan = new ParseSourceSpan(
              startSourceSpan.start,
              child.sourceSpan.end
            );
            child.condition = ieConditionalStartComment.condition;
            child.sourceSpan = sourceSpan;
            child.startSourceSpan = startSourceSpan;
            child.removeChild(ieConditionalEndComment);
          }
        }
      });
    }
    function mergeNodeIntoText(ast, shouldMerge, getValue) {
      ast.walk((node) => {
        if (node.children) {
          for (let i = 0; i < node.children.length; i++) {
            const child = node.children[i];
            if (child.type !== "text" && !shouldMerge(child)) {
              continue;
            }
            if (child.type !== "text") {
              child.type = "text";
              child.value = getValue(child);
            }
            const prevChild = child.prev;
            if (!prevChild || prevChild.type !== "text") {
              continue;
            }
            prevChild.value += child.value;
            prevChild.sourceSpan = new ParseSourceSpan(
              prevChild.sourceSpan.start,
              child.sourceSpan.end
            );
            node.removeChild(child);
            i--;
          }
        }
      });
    }
    function mergeCdataIntoText(ast) {
      return mergeNodeIntoText(
        ast,
        (node) => node.type === "cdata",
        (node) => `<![CDATA[${node.value}]]>`
      );
    }
    function mergeSimpleElementIntoText(ast) {
      const isSimpleElement = (node) => node.type === "element" && node.attrs.length === 0 && node.children.length === 1 && node.firstChild.type === "text" && !hasHtmlWhitespace(node.children[0].value) && !node.firstChild.hasLeadingSpaces && !node.firstChild.hasTrailingSpaces && node.isLeadingSpaceSensitive && !node.hasLeadingSpaces && node.isTrailingSpaceSensitive && !node.hasTrailingSpaces && node.prev && node.prev.type === "text" && node.next && node.next.type === "text";
      ast.walk((node) => {
        if (node.children) {
          for (let i = 0; i < node.children.length; i++) {
            const child = node.children[i];
            if (!isSimpleElement(child)) {
              continue;
            }
            const prevChild = child.prev;
            const nextChild = child.next;
            prevChild.value += `<${child.rawName}>` + child.firstChild.value + `</${child.rawName}>` + nextChild.value;
            prevChild.sourceSpan = new ParseSourceSpan(
              prevChild.sourceSpan.start,
              nextChild.sourceSpan.end
            );
            prevChild.isTrailingSpaceSensitive = nextChild.isTrailingSpaceSensitive;
            prevChild.hasTrailingSpaces = nextChild.hasTrailingSpaces;
            node.removeChild(child);
            i--;
            node.removeChild(nextChild);
          }
        }
      });
    }
    function extractInterpolation(ast, options) {
      if (options.parser === "html") {
        return;
      }
      const interpolationRegex = new RegExp("{{(.+?)}}", "s");
      ast.walk((node) => {
        if (!canHaveInterpolation(node)) {
          return;
        }
        for (const child of node.children) {
          if (child.type !== "text") {
            continue;
          }
          let startSourceSpan = child.sourceSpan.start;
          let endSourceSpan = null;
          const components = child.value.split(interpolationRegex);
          for (let i = 0; i < components.length; i++, startSourceSpan = endSourceSpan) {
            const value = components[i];
            if (i % 2 === 0) {
              endSourceSpan = startSourceSpan.moveBy(value.length);
              if (value.length > 0) {
                node.insertChildBefore(child, {
                  type: "text",
                  value,
                  sourceSpan: new ParseSourceSpan(startSourceSpan, endSourceSpan)
                });
              }
              continue;
            }
            endSourceSpan = startSourceSpan.moveBy(value.length + 4);
            node.insertChildBefore(child, {
              type: "interpolation",
              sourceSpan: new ParseSourceSpan(startSourceSpan, endSourceSpan),
              children: value.length === 0 ? [] : [
                {
                  type: "text",
                  value,
                  sourceSpan: new ParseSourceSpan(
                    startSourceSpan.moveBy(2),
                    endSourceSpan.moveBy(-2)
                  )
                }
              ]
            });
          }
          node.removeChild(child);
        }
      });
    }
    function extractWhitespaces(ast) {
      ast.walk((node) => {
        if (!node.children) {
          return;
        }
        if (node.children.length === 0 || node.children.length === 1 && node.children[0].type === "text" && htmlTrim(node.children[0].value).length === 0) {
          node.hasDanglingSpaces = node.children.length > 0;
          node.children = [];
          return;
        }
        const isWhitespaceSensitive = isWhitespaceSensitiveNode(node);
        const isIndentationSensitive = isIndentationSensitiveNode(node);
        if (!isWhitespaceSensitive) {
          for (let i = 0; i < node.children.length; i++) {
            const child = node.children[i];
            if (child.type !== "text") {
              continue;
            }
            const { leadingWhitespace, text, trailingWhitespace } = getLeadingAndTrailingHtmlWhitespace(child.value);
            const prevChild = child.prev;
            const nextChild = child.next;
            if (!text) {
              node.removeChild(child);
              i--;
              if (leadingWhitespace || trailingWhitespace) {
                if (prevChild) {
                  prevChild.hasTrailingSpaces = true;
                }
                if (nextChild) {
                  nextChild.hasLeadingSpaces = true;
                }
              }
            } else {
              child.value = text;
              child.sourceSpan = new ParseSourceSpan(
                child.sourceSpan.start.moveBy(leadingWhitespace.length),
                child.sourceSpan.end.moveBy(-trailingWhitespace.length)
              );
              if (leadingWhitespace) {
                if (prevChild) {
                  prevChild.hasTrailingSpaces = true;
                }
                child.hasLeadingSpaces = true;
              }
              if (trailingWhitespace) {
                child.hasTrailingSpaces = true;
                if (nextChild) {
                  nextChild.hasLeadingSpaces = true;
                }
              }
            }
          }
        }
        node.isWhitespaceSensitive = isWhitespaceSensitive;
        node.isIndentationSensitive = isIndentationSensitive;
      });
    }
    function addIsSelfClosing(ast) {
      ast.walk((node) => {
        node.isSelfClosing = !node.children || node.type === "element" && (node.tagDefinition.isVoid || node.startSourceSpan === node.endSourceSpan);
      });
    }
    function addHasHtmComponentClosingTag(ast, options) {
      ast.walk((node) => {
        if (node.type !== "element") {
          return;
        }
        node.hasHtmComponentClosingTag = node.endSourceSpan && /^<\s*\/\s*\/\s*>$/.test(
          options.originalText.slice(
            node.endSourceSpan.start.offset,
            node.endSourceSpan.end.offset
          )
        );
      });
    }
    function addCssDisplay(ast, options) {
      ast.walk((node) => {
        node.cssDisplay = getNodeCssStyleDisplay(node, options);
      });
    }
    function addIsSpaceSensitive(ast, options) {
      ast.walk((node) => {
        const { children } = node;
        if (!children) {
          return;
        }
        if (children.length === 0) {
          node.isDanglingSpaceSensitive = isDanglingSpaceSensitiveNode(node);
          return;
        }
        for (const child of children) {
          child.isLeadingSpaceSensitive = isLeadingSpaceSensitiveNode(
            child,
            options
          );
          child.isTrailingSpaceSensitive = isTrailingSpaceSensitiveNode(
            child,
            options
          );
        }
        for (let index = 0; index < children.length; index++) {
          const child = children[index];
          child.isLeadingSpaceSensitive = index === 0 ? child.isLeadingSpaceSensitive : child.prev.isTrailingSpaceSensitive && child.isLeadingSpaceSensitive;
          child.isTrailingSpaceSensitive = index === children.length - 1 ? child.isTrailingSpaceSensitive : child.next.isLeadingSpaceSensitive && child.isTrailingSpaceSensitive;
        }
      });
    }
    function markTsScript(ast, options) {
      if (options.parser === "vue") {
        const vueScriptTag = ast.children.find(
          (child) => isVueScriptTag(child, options)
        );
        if (!vueScriptTag) {
          return;
        }
        const { lang } = vueScriptTag.attrMap;
        if (lang === "ts" || lang === "typescript") {
          options.__should_parse_vue_template_with_ts = true;
        }
      }
    }
    module2.exports = preprocess2;
  }
});

// src/language-html/pragma.js
var require_pragma = __commonJS({
  "src/language-html/pragma.js"(exports2, module2) {
    "use strict";
    function hasPragma(text) {
      return /^\s*<!--\s*@(?:format|prettier)\s*-->/.test(text);
    }
    function insertPragma2(text) {
      return "<!-- @format -->\n\n" + text.replace(/^\s*\n/, "");
    }
    module2.exports = {
      hasPragma,
      insertPragma: insertPragma2
    };
  }
});

// src/language-html/loc.js
var require_loc = __commonJS({
  "src/language-html/loc.js"(exports2, module2) {
    "use strict";
    function locStart2(node) {
      return node.sourceSpan.start.offset;
    }
    function locEnd2(node) {
      return node.sourceSpan.end.offset;
    }
    module2.exports = { locStart: locStart2, locEnd: locEnd2 };
  }
});

// src/utils/front-matter/print.js
var require_print = __commonJS({
  "src/utils/front-matter/print.js"(exports2, module2) {
    "use strict";
    var {
      builders: { hardline: hardline2, markAsRoot }
    } = require_document();
    function print(node, textToDoc) {
      if (node.lang === "yaml") {
        const value = node.value.trim();
        const doc = value ? textToDoc(value, { parser: "yaml" }, { stripTrailingHardline: true }) : "";
        return markAsRoot([
          node.startDelimiter,
          hardline2,
          doc,
          doc ? hardline2 : "",
          node.endDelimiter
        ]);
      }
    }
    module2.exports = print;
  }
});

// src/language-html/print/tag.js
var require_tag = __commonJS({
  "src/language-html/print/tag.js"(exports2, module2) {
    "use strict";
    var assert = require("assert");
    var { isNonEmptyArray } = require_util();
    var {
      builders: { indent, join, line, softline, hardline: hardline2 },
      utils: { replaceTextEndOfLine: replaceTextEndOfLine2 }
    } = require_document();
    var { locStart: locStart2, locEnd: locEnd2 } = require_loc();
    var {
      isTextLikeNode,
      getLastDescendant,
      isPreLikeNode,
      hasPrettierIgnore,
      shouldPreserveContent,
      isVueSfcBlock
    } = require_utils();
    function printClosingTag(node, options) {
      return [
        node.isSelfClosing ? "" : printClosingTagStart(node, options),
        printClosingTagEnd2(node, options)
      ];
    }
    function printClosingTagStart(node, options) {
      return node.lastChild && needsToBorrowParentClosingTagStartMarker(node.lastChild) ? "" : [
        printClosingTagPrefix(node, options),
        printClosingTagStartMarker(node, options)
      ];
    }
    function printClosingTagEnd2(node, options) {
      return (node.next ? needsToBorrowPrevClosingTagEndMarker(node.next) : needsToBorrowLastChildClosingTagEndMarker(node.parent)) ? "" : [
        printClosingTagEndMarker(node, options),
        printClosingTagSuffix2(node, options)
      ];
    }
    function printClosingTagPrefix(node, options) {
      return needsToBorrowLastChildClosingTagEndMarker(node) ? printClosingTagEndMarker(node.lastChild, options) : "";
    }
    function printClosingTagSuffix2(node, options) {
      return needsToBorrowParentClosingTagStartMarker(node) ? printClosingTagStartMarker(node.parent, options) : needsToBorrowNextOpeningTagStartMarker(node) ? printOpeningTagStartMarker(node.next) : "";
    }
    function printClosingTagStartMarker(node, options) {
      assert(!node.isSelfClosing);
      if (shouldNotPrintClosingTag(node, options)) {
        return "";
      }
      switch (node.type) {
        case "ieConditionalComment":
          return "<!";
        case "element":
          if (node.hasHtmComponentClosingTag) {
            return "<//";
          }
        default:
          return `</${node.rawName}`;
      }
    }
    function printClosingTagEndMarker(node, options) {
      if (shouldNotPrintClosingTag(node, options)) {
        return "";
      }
      switch (node.type) {
        case "ieConditionalComment":
        case "ieConditionalEndComment":
          return "[endif]-->";
        case "ieConditionalStartComment":
          return "]><!-->";
        case "interpolation":
          return "}}";
        case "element":
          if (node.isSelfClosing) {
            return "/>";
          }
        default:
          return ">";
      }
    }
    function shouldNotPrintClosingTag(node, options) {
      return !node.isSelfClosing && !node.endSourceSpan && (hasPrettierIgnore(node) || shouldPreserveContent(node.parent, options));
    }
    function needsToBorrowPrevClosingTagEndMarker(node) {
      return node.prev && node.prev.type !== "docType" && !isTextLikeNode(node.prev) && node.isLeadingSpaceSensitive && !node.hasLeadingSpaces;
    }
    function needsToBorrowLastChildClosingTagEndMarker(node) {
      return node.lastChild && node.lastChild.isTrailingSpaceSensitive && !node.lastChild.hasTrailingSpaces && !isTextLikeNode(getLastDescendant(node.lastChild)) && !isPreLikeNode(node);
    }
    function needsToBorrowParentClosingTagStartMarker(node) {
      return !node.next && !node.hasTrailingSpaces && node.isTrailingSpaceSensitive && isTextLikeNode(getLastDescendant(node));
    }
    function needsToBorrowNextOpeningTagStartMarker(node) {
      return node.next && !isTextLikeNode(node.next) && isTextLikeNode(node) && node.isTrailingSpaceSensitive && !node.hasTrailingSpaces;
    }
    function getPrettierIgnoreAttributeCommentData(value) {
      const match = value.trim().match(new RegExp("^prettier-ignore-attribute(?:\\s+(.+))?$", "s"));
      if (!match) {
        return false;
      }
      if (!match[1]) {
        return true;
      }
      return match[1].split(/\s+/);
    }
    function needsToBorrowParentOpeningTagEndMarker(node) {
      return !node.prev && node.isLeadingSpaceSensitive && !node.hasLeadingSpaces;
    }
    function printAttributes(path, options, print) {
      const node = path.getValue();
      if (!isNonEmptyArray(node.attrs)) {
        return node.isSelfClosing ? " " : "";
      }
      const ignoreAttributeData = node.prev && node.prev.type === "comment" && getPrettierIgnoreAttributeCommentData(node.prev.value);
      const hasPrettierIgnoreAttribute = typeof ignoreAttributeData === "boolean" ? () => ignoreAttributeData : Array.isArray(ignoreAttributeData) ? (attribute) => ignoreAttributeData.includes(attribute.rawName) : () => false;
      const printedAttributes = path.map((attributePath) => {
        const attribute = attributePath.getValue();
        return hasPrettierIgnoreAttribute(attribute) ? replaceTextEndOfLine2(
          options.originalText.slice(locStart2(attribute), locEnd2(attribute))
        ) : print();
      }, "attrs");
      const forceNotToBreakAttrContent = node.type === "element" && node.fullName === "script" && node.attrs.length === 1 && node.attrs[0].fullName === "src" && node.children.length === 0;
      const shouldPrintAttributePerLine = options.singleAttributePerLine && node.attrs.length > 1 && !isVueSfcBlock(node, options);
      const attributeLine = shouldPrintAttributePerLine ? hardline2 : line;
      const parts = [
        indent([
          forceNotToBreakAttrContent ? " " : line,
          join(attributeLine, printedAttributes)
        ])
      ];
      if (node.firstChild && needsToBorrowParentOpeningTagEndMarker(node.firstChild) || node.isSelfClosing && needsToBorrowLastChildClosingTagEndMarker(node.parent) || forceNotToBreakAttrContent) {
        parts.push(node.isSelfClosing ? " " : "");
      } else {
        parts.push(
          options.bracketSameLine ? node.isSelfClosing ? " " : "" : node.isSelfClosing ? line : softline
        );
      }
      return parts;
    }
    function printOpeningTagEnd(node) {
      return node.firstChild && needsToBorrowParentOpeningTagEndMarker(node.firstChild) ? "" : printOpeningTagEndMarker(node);
    }
    function printOpeningTag(path, options, print) {
      const node = path.getValue();
      return [
        printOpeningTagStart2(node, options),
        printAttributes(path, options, print),
        node.isSelfClosing ? "" : printOpeningTagEnd(node)
      ];
    }
    function printOpeningTagStart2(node, options) {
      return node.prev && needsToBorrowNextOpeningTagStartMarker(node.prev) ? "" : [printOpeningTagPrefix2(node, options), printOpeningTagStartMarker(node)];
    }
    function printOpeningTagPrefix2(node, options) {
      return needsToBorrowParentOpeningTagEndMarker(node) ? printOpeningTagEndMarker(node.parent) : needsToBorrowPrevClosingTagEndMarker(node) ? printClosingTagEndMarker(node.prev, options) : "";
    }
    function printOpeningTagStartMarker(node) {
      switch (node.type) {
        case "ieConditionalComment":
        case "ieConditionalStartComment":
          return `<!--[if ${node.condition}`;
        case "ieConditionalEndComment":
          return "<!--<!";
        case "interpolation":
          return "{{";
        case "docType":
          return "<!DOCTYPE";
        case "element":
          if (node.condition) {
            return `<!--[if ${node.condition}]><!--><${node.rawName}`;
          }
        default:
          return `<${node.rawName}`;
      }
    }
    function printOpeningTagEndMarker(node) {
      assert(!node.isSelfClosing);
      switch (node.type) {
        case "ieConditionalComment":
          return "]>";
        case "element":
          if (node.condition) {
            return "><!--<![endif]-->";
          }
        default:
          return ">";
      }
    }
    module2.exports = {
      printClosingTag,
      printClosingTagStart,
      printClosingTagStartMarker,
      printClosingTagEndMarker,
      printClosingTagSuffix: printClosingTagSuffix2,
      printClosingTagEnd: printClosingTagEnd2,
      needsToBorrowLastChildClosingTagEndMarker,
      needsToBorrowParentClosingTagStartMarker,
      needsToBorrowPrevClosingTagEndMarker,
      printOpeningTag,
      printOpeningTagStart: printOpeningTagStart2,
      printOpeningTagPrefix: printOpeningTagPrefix2,
      printOpeningTagStartMarker,
      printOpeningTagEndMarker,
      needsToBorrowNextOpeningTagStartMarker,
      needsToBorrowParentOpeningTagEndMarker
    };
  }
});

// node_modules/parse-srcset/src/parse-srcset.js
var require_parse_srcset = __commonJS({
  "node_modules/parse-srcset/src/parse-srcset.js"(exports2, module2) {
    (function(root, factory) {
      if (typeof define === "function" && define.amd) {
        define([], factory);
      } else if (typeof module2 === "object" && module2.exports) {
        module2.exports = factory();
      } else {
        root.parseSrcset = factory();
      }
    })(exports2, function() {
      return function(input, options) {
        var logger = options && options.logger || console;
        function isSpace(c2) {
          return c2 === " " || c2 === "	" || c2 === "\n" || c2 === "\f" || c2 === "\r";
        }
        function collectCharacters(regEx) {
          var chars, match = regEx.exec(input.substring(pos));
          if (match) {
            chars = match[0];
            pos += chars.length;
            return chars;
          }
        }
        var inputLength = input.length, regexLeadingSpaces = /^[ \t\n\r\u000c]+/, regexLeadingCommasOrSpaces = /^[, \t\n\r\u000c]+/, regexLeadingNotSpaces = /^[^ \t\n\r\u000c]+/, regexTrailingCommas = /[,]+$/, regexNonNegativeInteger = /^\d+$/, regexFloatingPoint = /^-?(?:[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?$/, url, descriptors, currentDescriptor, state, c, pos = 0, candidates = [];
        while (true) {
          collectCharacters(regexLeadingCommasOrSpaces);
          if (pos >= inputLength) {
            return candidates;
          }
          url = collectCharacters(regexLeadingNotSpaces);
          descriptors = [];
          if (url.slice(-1) === ",") {
            url = url.replace(regexTrailingCommas, "");
            parseDescriptors();
          } else {
            tokenize();
          }
        }
        function tokenize() {
          collectCharacters(regexLeadingSpaces);
          currentDescriptor = "";
          state = "in descriptor";
          while (true) {
            c = input.charAt(pos);
            if (state === "in descriptor") {
              if (isSpace(c)) {
                if (currentDescriptor) {
                  descriptors.push(currentDescriptor);
                  currentDescriptor = "";
                  state = "after descriptor";
                }
              } else if (c === ",") {
                pos += 1;
                if (currentDescriptor) {
                  descriptors.push(currentDescriptor);
                }
                parseDescriptors();
                return;
              } else if (c === "(") {
                currentDescriptor = currentDescriptor + c;
                state = "in parens";
              } else if (c === "") {
                if (currentDescriptor) {
                  descriptors.push(currentDescriptor);
                }
                parseDescriptors();
                return;
              } else {
                currentDescriptor = currentDescriptor + c;
              }
            } else if (state === "in parens") {
              if (c === ")") {
                currentDescriptor = currentDescriptor + c;
                state = "in descriptor";
              } else if (c === "") {
                descriptors.push(currentDescriptor);
                parseDescriptors();
                return;
              } else {
                currentDescriptor = currentDescriptor + c;
              }
            } else if (state === "after descriptor") {
              if (isSpace(c)) {
              } else if (c === "") {
                parseDescriptors();
                return;
              } else {
                state = "in descriptor";
                pos -= 1;
              }
            }
            pos += 1;
          }
        }
        function parseDescriptors() {
          var pError = false, w, d, h, i, candidate = {}, desc, lastChar, value, intVal, floatVal;
          for (i = 0; i < descriptors.length; i++) {
            desc = descriptors[i];
            lastChar = desc[desc.length - 1];
            value = desc.substring(0, desc.length - 1);
            intVal = parseInt(value, 10);
            floatVal = parseFloat(value);
            if (regexNonNegativeInteger.test(value) && lastChar === "w") {
              if (w || d) {
                pError = true;
              }
              if (intVal === 0) {
                pError = true;
              } else {
                w = intVal;
              }
            } else if (regexFloatingPoint.test(value) && lastChar === "x") {
              if (w || d || h) {
                pError = true;
              }
              if (floatVal < 0) {
                pError = true;
              } else {
                d = floatVal;
              }
            } else if (regexNonNegativeInteger.test(value) && lastChar === "h") {
              if (h || d) {
                pError = true;
              }
              if (intVal === 0) {
                pError = true;
              } else {
                h = intVal;
              }
            } else {
              pError = true;
            }
          }
          if (!pError) {
            candidate.url = url;
            if (w) {
              candidate.w = w;
            }
            if (d) {
              candidate.d = d;
            }
            if (h) {
              candidate.h = h;
            }
            candidates.push(candidate);
          } else if (logger && logger.error) {
            logger.error("Invalid srcset descriptor found in '" + input + "' at '" + desc + "'.");
          }
        }
      };
    });
  }
});

// src/language-html/syntax-attribute.js
var require_syntax_attribute = __commonJS({
  "src/language-html/syntax-attribute.js"(exports2, module2) {
    "use strict";
    var parseSrcset = require_parse_srcset();
    var {
      builders: { ifBreak, join, line }
    } = require_document();
    function printImgSrcset(value) {
      const srcset = parseSrcset(value, {
        logger: {
          error(message) {
            throw new Error(message);
          }
        }
      });
      const hasW = srcset.some(({ w }) => w);
      const hasH = srcset.some(({ h }) => h);
      const hasX = srcset.some(({ d }) => d);
      if (hasW + hasH + hasX > 1) {
        throw new Error("Mixed descriptor in srcset is not supported");
      }
      const key = hasW ? "w" : hasH ? "h" : "d";
      const unit = hasW ? "w" : hasH ? "h" : "x";
      const getMax = (values) => Math.max(...values);
      const urls = srcset.map((src) => src.url);
      const maxUrlLength = getMax(urls.map((url) => url.length));
      const descriptors = srcset.map((src) => src[key]).map((descriptor) => descriptor ? descriptor.toString() : "");
      const descriptorLeftLengths = descriptors.map((descriptor) => {
        const index = descriptor.indexOf(".");
        return index === -1 ? descriptor.length : index;
      });
      const maxDescriptorLeftLength = getMax(descriptorLeftLengths);
      return join(
        [",", line],
        urls.map((url, index) => {
          const parts = [url];
          const descriptor = descriptors[index];
          if (descriptor) {
            const urlPadding = maxUrlLength - url.length + 1;
            const descriptorPadding = maxDescriptorLeftLength - descriptorLeftLengths[index];
            const alignment = " ".repeat(urlPadding + descriptorPadding);
            parts.push(ifBreak(alignment, " "), descriptor + unit);
          }
          return parts;
        })
      );
    }
    function printClassNames(value) {
      return value.trim().split(/\s+/).join(" ");
    }
    module2.exports = {
      printImgSrcset,
      printClassNames
    };
  }
});

// src/language-html/syntax-vue.js
var require_syntax_vue = __commonJS({
  "src/language-html/syntax-vue.js"(exports2, module2) {
    "use strict";
    var {
      builders: { group: group2 }
    } = require_document();
    function printVueFor(value, textToDoc) {
      const { left, operator, right } = parseVueFor(value);
      return [
        group2(
          textToDoc(`function _(${left}) {}`, {
            parser: "babel",
            __isVueForBindingLeft: true
          })
        ),
        " ",
        operator,
        " ",
        textToDoc(
          right,
          { parser: "__js_expression" },
          { stripTrailingHardline: true }
        )
      ];
    }
    function parseVueFor(value) {
      const forAliasRE = new RegExp("(.*?)\\s+(in|of)\\s+(.*)", "s");
      const forIteratorRE = /,([^,\]}]*)(?:,([^,\]}]*))?$/;
      const stripParensRE = /^\(|\)$/g;
      const inMatch = value.match(forAliasRE);
      if (!inMatch) {
        return;
      }
      const res = {};
      res.for = inMatch[3].trim();
      if (!res.for) {
        return;
      }
      const alias = inMatch[1].trim().replace(stripParensRE, "");
      const iteratorMatch = alias.match(forIteratorRE);
      if (iteratorMatch) {
        res.alias = alias.replace(forIteratorRE, "");
        res.iterator1 = iteratorMatch[1].trim();
        if (iteratorMatch[2]) {
          res.iterator2 = iteratorMatch[2].trim();
        }
      } else {
        res.alias = alias;
      }
      const left = [res.alias, res.iterator1, res.iterator2];
      if (left.some(
        (part, index) => !part && (index === 0 || left.slice(index + 1).some(Boolean))
      )) {
        return;
      }
      return {
        left: left.filter(Boolean).join(","),
        operator: inMatch[2],
        right: res.for
      };
    }
    function printVueBindings(value, textToDoc) {
      return textToDoc(`function _(${value}) {}`, {
        parser: "babel",
        __isVueBindings: true
      });
    }
    function isVueEventBindingExpression(eventBindingValue) {
      const fnExpRE = /^(?:[\w$]+|\([^)]*\))\s*=>|^function\s*\(/;
      const simplePathRE = /^[$A-Z_a-z][\w$]*(?:\.[$A-Z_a-z][\w$]*|\['[^']*']|\["[^"]*"]|\[\d+]|\[[$A-Z_a-z][\w$]*])*$/;
      const value = eventBindingValue.trim();
      return fnExpRE.test(value) || simplePathRE.test(value);
    }
    module2.exports = {
      isVueEventBindingExpression,
      printVueFor,
      printVueBindings
    };
  }
});

// src/language-html/get-node-content.js
var require_get_node_content = __commonJS({
  "src/language-html/get-node-content.js"(exports2, module2) {
    "use strict";
    var {
      needsToBorrowParentClosingTagStartMarker,
      printClosingTagStartMarker,
      needsToBorrowLastChildClosingTagEndMarker,
      printClosingTagEndMarker,
      needsToBorrowParentOpeningTagEndMarker,
      printOpeningTagEndMarker
    } = require_tag();
    function getNodeContent(node, options) {
      let start = node.startSourceSpan.end.offset;
      if (node.firstChild && needsToBorrowParentOpeningTagEndMarker(node.firstChild)) {
        start -= printOpeningTagEndMarker(node).length;
      }
      let end = node.endSourceSpan.start.offset;
      if (node.lastChild && needsToBorrowParentClosingTagStartMarker(node.lastChild)) {
        end += printClosingTagStartMarker(node, options).length;
      } else if (needsToBorrowLastChildClosingTagEndMarker(node)) {
        end -= printClosingTagEndMarker(node.lastChild, options).length;
      }
      return options.originalText.slice(start, end);
    }
    module2.exports = getNodeContent;
  }
});

// src/language-html/embed.js
var require_embed = __commonJS({
  "src/language-html/embed.js"(exports2, module2) {
    "use strict";
    var {
      builders: { breakParent, group: group2, hardline: hardline2, indent, line, fill: fill2, softline },
      utils: { mapDoc, replaceTextEndOfLine: replaceTextEndOfLine2 }
    } = require_document();
    var printFrontMatter = require_print();
    var {
      printClosingTag,
      printClosingTagSuffix: printClosingTagSuffix2,
      needsToBorrowPrevClosingTagEndMarker,
      printOpeningTagPrefix: printOpeningTagPrefix2,
      printOpeningTag
    } = require_tag();
    var { printImgSrcset, printClassNames } = require_syntax_attribute();
    var {
      printVueFor,
      printVueBindings,
      isVueEventBindingExpression
    } = require_syntax_vue();
    var {
      isScriptLikeTag,
      isVueNonHtmlBlock,
      inferScriptParser,
      htmlTrimPreserveIndentation,
      dedentString,
      unescapeQuoteEntities: unescapeQuoteEntities2,
      isVueSlotAttribute,
      isVueSfcBindingsAttribute,
      getTextValueParts: getTextValueParts2
    } = require_utils();
    var getNodeContent = require_get_node_content();
    function printEmbeddedAttributeValue(node, htmlTextToDoc, options) {
      const isKeyMatched = (patterns) => new RegExp(patterns.join("|")).test(node.fullName);
      const getValue = () => unescapeQuoteEntities2(node.value);
      let shouldHug = false;
      const __onHtmlBindingRoot = (root, options2) => {
        const rootNode = root.type === "NGRoot" ? root.node.type === "NGMicrosyntax" && root.node.body.length === 1 && root.node.body[0].type === "NGMicrosyntaxExpression" ? root.node.body[0].expression : root.node : root.type === "JsExpressionRoot" ? root.node : root;
        if (rootNode && (rootNode.type === "ObjectExpression" || rootNode.type === "ArrayExpression" || options2.parser === "__vue_expression" && (rootNode.type === "TemplateLiteral" || rootNode.type === "StringLiteral"))) {
          shouldHug = true;
        }
      };
      const printHug = (doc) => group2(doc);
      const printExpand = (doc, canHaveTrailingWhitespace = true) => group2([indent([softline, doc]), canHaveTrailingWhitespace ? softline : ""]);
      const printMaybeHug = (doc) => shouldHug ? printHug(doc) : printExpand(doc);
      const attributeTextToDoc = (code, opts) => htmlTextToDoc(code, __spreadValues({
        __onHtmlBindingRoot,
        __embeddedInHtml: true
      }, opts));
      if (node.fullName === "srcset" && (node.parent.fullName === "img" || node.parent.fullName === "source")) {
        return printExpand(printImgSrcset(getValue()));
      }
      if (node.fullName === "class" && !options.parentParser) {
        const value = getValue();
        if (!value.includes("{{")) {
          return printClassNames(value);
        }
      }
      if (node.fullName === "style" && !options.parentParser) {
        const value = getValue();
        if (!value.includes("{{")) {
          return printExpand(
            attributeTextToDoc(value, {
              parser: "css",
              __isHTMLStyleAttribute: true
            })
          );
        }
      }
      if (options.parser === "vue") {
        if (node.fullName === "v-for") {
          return printVueFor(getValue(), attributeTextToDoc);
        }
        if (isVueSlotAttribute(node) || isVueSfcBindingsAttribute(node, options)) {
          return printVueBindings(getValue(), attributeTextToDoc);
        }
        const vueEventBindingPatterns = ["^@", "^v-on:"];
        const vueExpressionBindingPatterns = ["^:", "^v-bind:"];
        const jsExpressionBindingPatterns = ["^v-"];
        if (isKeyMatched(vueEventBindingPatterns)) {
          const value = getValue();
          const parser = isVueEventBindingExpression(value) ? "__js_expression" : options.__should_parse_vue_template_with_ts ? "__vue_ts_event_binding" : "__vue_event_binding";
          return printMaybeHug(
            attributeTextToDoc(value, {
              parser
            })
          );
        }
        if (isKeyMatched(vueExpressionBindingPatterns)) {
          return printMaybeHug(
            attributeTextToDoc(getValue(), { parser: "__vue_expression" })
          );
        }
        if (isKeyMatched(jsExpressionBindingPatterns)) {
          return printMaybeHug(
            attributeTextToDoc(getValue(), { parser: "__js_expression" })
          );
        }
      }
      if (options.parser === "angular") {
        const ngTextToDoc = (code, opts) => attributeTextToDoc(code, __spreadProps(__spreadValues({}, opts), { trailingComma: "none" }));
        const ngDirectiveBindingPatterns = ["^\\*"];
        const ngStatementBindingPatterns = ["^\\(.+\\)$", "^on-"];
        const ngExpressionBindingPatterns = [
          "^\\[.+\\]$",
          "^bind(on)?-",
          "^ng-(if|show|hide|class|style)$"
        ];
        const ngI18nPatterns = ["^i18n(-.+)?$"];
        if (isKeyMatched(ngStatementBindingPatterns)) {
          return printMaybeHug(ngTextToDoc(getValue(), { parser: "__ng_action" }));
        }
        if (isKeyMatched(ngExpressionBindingPatterns)) {
          return printMaybeHug(ngTextToDoc(getValue(), { parser: "__ng_binding" }));
        }
        if (isKeyMatched(ngI18nPatterns)) {
          const value2 = getValue().trim();
          return printExpand(
            fill2(getTextValueParts2(node, value2)),
            !value2.includes("@@")
          );
        }
        if (isKeyMatched(ngDirectiveBindingPatterns)) {
          return printMaybeHug(
            ngTextToDoc(getValue(), { parser: "__ng_directive" })
          );
        }
        const interpolationRegex = new RegExp("{{(.+?)}}", "s");
        const value = getValue();
        if (interpolationRegex.test(value)) {
          const parts = [];
          for (const [index, part] of value.split(interpolationRegex).entries()) {
            if (index % 2 === 0) {
              parts.push(replaceTextEndOfLine2(part));
            } else {
              try {
                parts.push(
                  group2([
                    "{{",
                    indent([
                      line,
                      ngTextToDoc(part, {
                        parser: "__ng_interpolation",
                        __isInHtmlInterpolation: true
                      })
                    ]),
                    line,
                    "}}"
                  ])
                );
              } catch (e) {
                parts.push("{{", replaceTextEndOfLine2(part), "}}");
              }
            }
          }
          return group2(parts);
        }
      }
      return null;
    }
    function embed2(path, print, textToDoc, options) {
      const node = path.getValue();
      switch (node.type) {
        case "element": {
          if (isScriptLikeTag(node) || node.type === "interpolation") {
            return;
          }
          if (!node.isSelfClosing && isVueNonHtmlBlock(node, options)) {
            const parser = inferScriptParser(node, options);
            if (!parser) {
              return;
            }
            const content = getNodeContent(node, options);
            let isEmpty = /^\s*$/.test(content);
            let doc = "";
            if (!isEmpty) {
              doc = textToDoc(
                htmlTrimPreserveIndentation(content),
                { parser, __embeddedInHtml: true },
                { stripTrailingHardline: true }
              );
              isEmpty = doc === "";
            }
            return [
              printOpeningTagPrefix2(node, options),
              group2(printOpeningTag(path, options, print)),
              isEmpty ? "" : hardline2,
              doc,
              isEmpty ? "" : hardline2,
              printClosingTag(node, options),
              printClosingTagSuffix2(node, options)
            ];
          }
          break;
        }
        case "text": {
          if (isScriptLikeTag(node.parent)) {
            const parser = inferScriptParser(node.parent, options);
            if (parser) {
              const value = parser === "markdown" ? dedentString(node.value.replace(/^[^\S\n]*\n/, "")) : node.value;
              const textToDocOptions = { parser, __embeddedInHtml: true };
              if (options.parser === "html" && parser === "babel") {
                let sourceType = "script";
                const { attrMap } = node.parent;
                if (attrMap && (attrMap.type === "module" || attrMap.type === "text/babel" && attrMap["data-type"] === "module")) {
                  sourceType = "module";
                }
                textToDocOptions.__babelSourceType = sourceType;
              }
              return [
                breakParent,
                printOpeningTagPrefix2(node, options),
                textToDoc(value, textToDocOptions, {
                  stripTrailingHardline: true
                }),
                printClosingTagSuffix2(node, options)
              ];
            }
          } else if (node.parent.type === "interpolation") {
            const textToDocOptions = {
              __isInHtmlInterpolation: true,
              __embeddedInHtml: true
            };
            if (options.parser === "angular") {
              textToDocOptions.parser = "__ng_interpolation";
              textToDocOptions.trailingComma = "none";
            } else if (options.parser === "vue") {
              textToDocOptions.parser = options.__should_parse_vue_template_with_ts ? "__vue_ts_expression" : "__vue_expression";
            } else {
              textToDocOptions.parser = "__js_expression";
            }
            return [
              indent([
                line,
                textToDoc(node.value, textToDocOptions, {
                  stripTrailingHardline: true
                })
              ]),
              node.parent.next && needsToBorrowPrevClosingTagEndMarker(node.parent.next) ? " " : line
            ];
          }
          break;
        }
        case "attribute": {
          if (!node.value) {
            break;
          }
          if (/^PRETTIER_HTML_PLACEHOLDER_\d+_\d+_IN_JS$/.test(
            options.originalText.slice(
              node.valueSpan.start.offset,
              node.valueSpan.end.offset
            )
          )) {
            return [node.rawName, "=", node.value];
          }
          if (options.parser === "lwc") {
            const interpolationRegex = new RegExp("^{.*}$", "s");
            if (interpolationRegex.test(
              options.originalText.slice(
                node.valueSpan.start.offset,
                node.valueSpan.end.offset
              )
            )) {
              return [node.rawName, "=", node.value];
            }
          }
          const embeddedAttributeValueDoc = printEmbeddedAttributeValue(
            node,
            (code, opts) => textToDoc(
              code,
              __spreadValues({ __isInHtmlAttribute: true, __embeddedInHtml: true }, opts),
              { stripTrailingHardline: true }
            ),
            options
          );
          if (embeddedAttributeValueDoc) {
            return [
              node.rawName,
              '="',
              group2(
                mapDoc(
                  embeddedAttributeValueDoc,
                  (doc) => typeof doc === "string" ? doc.replace(/"/g, "&quot;") : doc
                )
              ),
              '"'
            ];
          }
          break;
        }
        case "front-matter":
          return printFrontMatter(node, textToDoc);
      }
    }
    module2.exports = embed2;
  }
});

// src/language-html/print/children.js
var require_children = __commonJS({
  "src/language-html/print/children.js"(exports2, module2) {
    "use strict";
    var {
      builders: { breakParent, group: group2, ifBreak, line, softline, hardline: hardline2 },
      utils: { replaceTextEndOfLine: replaceTextEndOfLine2 }
    } = require_document();
    var { locStart: locStart2, locEnd: locEnd2 } = require_loc();
    var {
      forceBreakChildren,
      forceNextEmptyLine,
      isTextLikeNode,
      hasPrettierIgnore,
      preferHardlineAsLeadingSpaces
    } = require_utils();
    var {
      printOpeningTagPrefix: printOpeningTagPrefix2,
      needsToBorrowNextOpeningTagStartMarker,
      printOpeningTagStartMarker,
      needsToBorrowPrevClosingTagEndMarker,
      printClosingTagEndMarker,
      printClosingTagSuffix: printClosingTagSuffix2,
      needsToBorrowParentClosingTagStartMarker
    } = require_tag();
    function printChild(childPath, options, print) {
      const child = childPath.getValue();
      if (hasPrettierIgnore(child)) {
        return [
          printOpeningTagPrefix2(child, options),
          ...replaceTextEndOfLine2(
            options.originalText.slice(
              locStart2(child) + (child.prev && needsToBorrowNextOpeningTagStartMarker(child.prev) ? printOpeningTagStartMarker(child).length : 0),
              locEnd2(child) - (child.next && needsToBorrowPrevClosingTagEndMarker(child.next) ? printClosingTagEndMarker(child, options).length : 0)
            )
          ),
          printClosingTagSuffix2(child, options)
        ];
      }
      return print();
    }
    function printBetweenLine(prevNode, nextNode) {
      return isTextLikeNode(prevNode) && isTextLikeNode(nextNode) ? prevNode.isTrailingSpaceSensitive ? prevNode.hasTrailingSpaces ? preferHardlineAsLeadingSpaces(nextNode) ? hardline2 : line : "" : preferHardlineAsLeadingSpaces(nextNode) ? hardline2 : softline : needsToBorrowNextOpeningTagStartMarker(prevNode) && (hasPrettierIgnore(nextNode) || nextNode.firstChild || nextNode.isSelfClosing || nextNode.type === "element" && nextNode.attrs.length > 0) || prevNode.type === "element" && prevNode.isSelfClosing && needsToBorrowPrevClosingTagEndMarker(nextNode) ? "" : !nextNode.isLeadingSpaceSensitive || preferHardlineAsLeadingSpaces(nextNode) || needsToBorrowPrevClosingTagEndMarker(nextNode) && prevNode.lastChild && needsToBorrowParentClosingTagStartMarker(prevNode.lastChild) && prevNode.lastChild.lastChild && needsToBorrowParentClosingTagStartMarker(prevNode.lastChild.lastChild) ? hardline2 : nextNode.hasLeadingSpaces ? line : softline;
    }
    function printChildren2(path, options, print) {
      const node = path.getValue();
      if (forceBreakChildren(node)) {
        return [
          breakParent,
          ...path.map((childPath) => {
            const childNode = childPath.getValue();
            const prevBetweenLine = !childNode.prev ? "" : printBetweenLine(childNode.prev, childNode);
            return [
              !prevBetweenLine ? "" : [
                prevBetweenLine,
                forceNextEmptyLine(childNode.prev) ? hardline2 : ""
              ],
              printChild(childPath, options, print)
            ];
          }, "children")
        ];
      }
      const groupIds = node.children.map(() => Symbol(""));
      return path.map((childPath, childIndex) => {
        const childNode = childPath.getValue();
        if (isTextLikeNode(childNode)) {
          if (childNode.prev && isTextLikeNode(childNode.prev)) {
            const prevBetweenLine2 = printBetweenLine(childNode.prev, childNode);
            if (prevBetweenLine2) {
              if (forceNextEmptyLine(childNode.prev)) {
                return [hardline2, hardline2, printChild(childPath, options, print)];
              }
              return [prevBetweenLine2, printChild(childPath, options, print)];
            }
          }
          return printChild(childPath, options, print);
        }
        const prevParts = [];
        const leadingParts = [];
        const trailingParts = [];
        const nextParts = [];
        const prevBetweenLine = childNode.prev ? printBetweenLine(childNode.prev, childNode) : "";
        const nextBetweenLine = childNode.next ? printBetweenLine(childNode, childNode.next) : "";
        if (prevBetweenLine) {
          if (forceNextEmptyLine(childNode.prev)) {
            prevParts.push(hardline2, hardline2);
          } else if (prevBetweenLine === hardline2) {
            prevParts.push(hardline2);
          } else {
            if (isTextLikeNode(childNode.prev)) {
              leadingParts.push(prevBetweenLine);
            } else {
              leadingParts.push(
                ifBreak("", softline, {
                  groupId: groupIds[childIndex - 1]
                })
              );
            }
          }
        }
        if (nextBetweenLine) {
          if (forceNextEmptyLine(childNode)) {
            if (isTextLikeNode(childNode.next)) {
              nextParts.push(hardline2, hardline2);
            }
          } else if (nextBetweenLine === hardline2) {
            if (isTextLikeNode(childNode.next)) {
              nextParts.push(hardline2);
            }
          } else {
            trailingParts.push(nextBetweenLine);
          }
        }
        return [
          ...prevParts,
          group2([
            ...leadingParts,
            group2([printChild(childPath, options, print), ...trailingParts], {
              id: groupIds[childIndex]
            })
          ]),
          ...nextParts
        ];
      }, "children");
    }
    module2.exports = { printChildren: printChildren2 };
  }
});

// src/language-html/print/element.js
var require_element = __commonJS({
  "src/language-html/print/element.js"(exports2, module2) {
    "use strict";
    var {
      builders: {
        breakParent,
        dedentToRoot,
        group: group2,
        ifBreak,
        indentIfBreak,
        indent,
        line,
        softline
      },
      utils: { replaceTextEndOfLine: replaceTextEndOfLine2 }
    } = require_document();
    var getNodeContent = require_get_node_content();
    var {
      shouldPreserveContent,
      isScriptLikeTag,
      isVueCustomBlock,
      countParents,
      forceBreakContent
    } = require_utils();
    var {
      printOpeningTagPrefix: printOpeningTagPrefix2,
      printOpeningTag,
      printClosingTagSuffix: printClosingTagSuffix2,
      printClosingTag,
      needsToBorrowPrevClosingTagEndMarker,
      needsToBorrowLastChildClosingTagEndMarker
    } = require_tag();
    var { printChildren: printChildren2 } = require_children();
    function printElement2(path, options, print) {
      const node = path.getValue();
      if (shouldPreserveContent(node, options)) {
        return [
          printOpeningTagPrefix2(node, options),
          group2(printOpeningTag(path, options, print)),
          ...replaceTextEndOfLine2(getNodeContent(node, options)),
          ...printClosingTag(node, options),
          printClosingTagSuffix2(node, options)
        ];
      }
      const shouldHugContent = node.children.length === 1 && node.firstChild.type === "interpolation" && node.firstChild.isLeadingSpaceSensitive && !node.firstChild.hasLeadingSpaces && node.lastChild.isTrailingSpaceSensitive && !node.lastChild.hasTrailingSpaces;
      const attrGroupId = Symbol("element-attr-group-id");
      const printTag = (doc) => group2([
        group2(printOpeningTag(path, options, print), { id: attrGroupId }),
        doc,
        printClosingTag(node, options)
      ]);
      const printChildrenDoc = (childrenDoc) => {
        if (shouldHugContent) {
          return indentIfBreak(childrenDoc, { groupId: attrGroupId });
        }
        if ((isScriptLikeTag(node) || isVueCustomBlock(node, options)) && node.parent.type === "root" && options.parser === "vue" && !options.vueIndentScriptAndStyle) {
          return childrenDoc;
        }
        return indent(childrenDoc);
      };
      const printLineBeforeChildren = () => {
        if (shouldHugContent) {
          return ifBreak(softline, "", { groupId: attrGroupId });
        }
        if (node.firstChild.hasLeadingSpaces && node.firstChild.isLeadingSpaceSensitive) {
          return line;
        }
        if (node.firstChild.type === "text" && node.isWhitespaceSensitive && node.isIndentationSensitive) {
          return dedentToRoot(softline);
        }
        return softline;
      };
      const printLineAfterChildren = () => {
        const needsToBorrow = node.next ? needsToBorrowPrevClosingTagEndMarker(node.next) : needsToBorrowLastChildClosingTagEndMarker(node.parent);
        if (needsToBorrow) {
          if (node.lastChild.hasTrailingSpaces && node.lastChild.isTrailingSpaceSensitive) {
            return " ";
          }
          return "";
        }
        if (shouldHugContent) {
          return ifBreak(softline, "", { groupId: attrGroupId });
        }
        if (node.lastChild.hasTrailingSpaces && node.lastChild.isTrailingSpaceSensitive) {
          return line;
        }
        if ((node.lastChild.type === "comment" || node.lastChild.type === "text" && node.isWhitespaceSensitive && node.isIndentationSensitive) && new RegExp(
          `\\n[\\t ]{${options.tabWidth * countParents(
            path,
            (node2) => node2.parent && node2.parent.type !== "root"
          )}}$`
        ).test(node.lastChild.value)) {
          return "";
        }
        return softline;
      };
      if (node.children.length === 0) {
        return printTag(
          node.hasDanglingSpaces && node.isDanglingSpaceSensitive ? line : ""
        );
      }
      return printTag([
        forceBreakContent(node) ? breakParent : "",
        printChildrenDoc([
          printLineBeforeChildren(),
          printChildren2(path, options, print)
        ]),
        printLineAfterChildren()
      ]);
    }
    module2.exports = { printElement: printElement2 };
  }
});

// src/language-html/printer-html.js
var {
  builders: { fill, group, hardline, literalline },
  utils: { cleanDoc, getDocParts, isConcat, replaceTextEndOfLine }
} = require_document();
var clean = require_clean();
var {
  countChars,
  unescapeQuoteEntities,
  getTextValueParts
} = require_utils();
var preprocess = require_print_preprocess();
var { insertPragma } = require_pragma();
var { locStart, locEnd } = require_loc();
var embed = require_embed();
var {
  printClosingTagSuffix,
  printClosingTagEnd,
  printOpeningTagPrefix,
  printOpeningTagStart
} = require_tag();
var { printElement } = require_element();
var { printChildren } = require_children();
function genericPrint(path, options, print) {
  const node = path.getValue();
  switch (node.type) {
    case "front-matter":
      return replaceTextEndOfLine(node.raw);
    case "root":
      if (options.__onHtmlRoot) {
        options.__onHtmlRoot(node);
      }
      return [group(printChildren(path, options, print)), hardline];
    case "element":
    case "ieConditionalComment": {
      return printElement(path, options, print);
    }
    case "ieConditionalStartComment":
    case "ieConditionalEndComment":
      return [printOpeningTagStart(node), printClosingTagEnd(node)];
    case "interpolation":
      return [
        printOpeningTagStart(node, options),
        ...path.map(print, "children"),
        printClosingTagEnd(node, options)
      ];
    case "text": {
      if (node.parent.type === "interpolation") {
        const trailingNewlineRegex = /\n[^\S\n]*$/;
        const hasTrailingNewline = trailingNewlineRegex.test(node.value);
        const value = hasTrailingNewline ? node.value.replace(trailingNewlineRegex, "") : node.value;
        return [
          ...replaceTextEndOfLine(value),
          hasTrailingNewline ? hardline : ""
        ];
      }
      const printed = cleanDoc([
        printOpeningTagPrefix(node, options),
        ...getTextValueParts(node),
        printClosingTagSuffix(node, options)
      ]);
      if (isConcat(printed) || printed.type === "fill") {
        return fill(getDocParts(printed));
      }
      return printed;
    }
    case "docType":
      return [
        group([
          printOpeningTagStart(node, options),
          " ",
          node.value.replace(/^html\b/i, "html").replace(/\s+/g, " ")
        ]),
        printClosingTagEnd(node, options)
      ];
    case "comment": {
      return [
        printOpeningTagPrefix(node, options),
        ...replaceTextEndOfLine(
          options.originalText.slice(locStart(node), locEnd(node)),
          literalline
        ),
        printClosingTagSuffix(node, options)
      ];
    }
    case "attribute": {
      if (node.value === null) {
        return node.rawName;
      }
      const value = unescapeQuoteEntities(node.value);
      const singleQuoteCount = countChars(value, "'");
      const doubleQuoteCount = countChars(value, '"');
      const quote = singleQuoteCount < doubleQuoteCount ? "'" : '"';
      return [
        node.rawName,
        "=",
        quote,
        ...replaceTextEndOfLine(
          quote === '"' ? value.replace(/"/g, "&quot;") : value.replace(/'/g, "&apos;")
        ),
        quote
      ];
    }
    default:
      throw new Error(`Unexpected node type ${node.type}`);
  }
}
module.exports = {
  preprocess,
  print: genericPrint,
  insertPragma,
  massageAstNode: clean,
  embed
};
/*! Bundled license information:

angular-html-parser/lib/compiler/src/chars.js:
  (**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   *)

angular-html-parser/lib/compiler/src/aot/static_symbol.js:
  (**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   *)

angular-html-parser/lib/compiler/src/util.js:
  (**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   *)

angular-html-parser/lib/compiler/src/compile_metadata.js:
  (**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   *)

angular-html-parser/lib/compiler/src/parse_util.js:
  (**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   *)
*/
