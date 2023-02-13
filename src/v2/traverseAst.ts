let flagInMultilineWpBlock: boolean = false;
let multilineWpBlockCount: number = 0;

const traverse = (nodes: any[]): any[] => {
  return nodes.reduce((prev: any, node: any) => {
    if (flagInMultilineWpBlock && node.type !== "comment") {
      if (node.children === undefined) {
        return [...prev];
      } else {
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
          return [...prev];
        } else {
          return [...prev, node];
        }
      }

      customNode.value = trimmedValue;
      customNode.type = "wpblock";
      customNode.name = "wpblock";
      flagInMultilineWpBlock = true;
      multilineWpBlockCount++;

      return [...prev, customNode];
    }

    if (node.children === undefined) return [...prev, node];

    const customNode = node;
    customNode.children = traverse(node.children);
    return [...prev, customNode];
  }, []);
};

export const traverseAst = traverse;
