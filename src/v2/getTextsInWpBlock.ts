export const getTextsInWpBlock = (text: string) => {
  // 「<!--ではじまり、任意の数の空白文字を挟み、wp:という文字列のあと、スラッシュで終わらない任意の数のあらゆる文字が入り、-->で終わる」正規表現
  // つまり、単行のwp:ブロックではない、複数業のwp:ブロックであるRegExpMatchArrayを取得する
  const wpBlockStartLines = [
    ...text.matchAll(RegExp("(<!--)\\s*(wp:).*[^\\/][^\\/](-->)", "g")),
  ];
  // wp:のあとに続く文字を取得し、その文字の閉じwp:ブロックを見つける
  // 複数個見つかる場合の対処が少し難しい、例えばwp:group?
  // 閉じブロックまでの間に同じ文字の開きブロックがある場合はスキップさせるような処理が必要
  const textsInWpBlock = wpBlockStartLines.map((match) => {
    if (!match.index || !match.input) return;
    const input = match.input;
    const index = match.index;

    const indexOfWpPrefixEnd = input.indexOf("wp:", index) + 3;
    if (indexOfWpPrefixEnd === -1)
      throw new Error("indexOfWpPrefixEnd is empty");
    const indexOfWpBlockName = input.indexOf(" ", indexOfWpPrefixEnd);
    if (indexOfWpBlockName === -1)
      throw new Error("indexOfWpBlockName is empty");

    const wpBlockName = input.slice(indexOfWpPrefixEnd, indexOfWpBlockName);
    const closeBlocks = [
      ...input.matchAll(
        RegExp(`(<!--)\\s*\\/\\s*(wp:${wpBlockName}).*(-->)`, "g")
      ),
    ];
    const sameNameBlocks = [
      ...input.matchAll(RegExp(`(<!--)\\s*(wp:${wpBlockName}).*(-->)`, "g")),
    ];

    const indexOfWpStartBlockEnd = input.indexOf("-->", index) + 3;
    if (closeBlocks.length === 0) {
      throw new Error(`wp:${wpBlockName} closing block is not found`);
    }
    if (closeBlocks.length === 1) {
      const wpBlockInnerText = input.slice(
        indexOfWpStartBlockEnd,
        closeBlocks[0].index
      );
      return wpBlockInnerText;
    }

    let mostNearCloseBlockIndex: number = 0;
    const mostNearCloseBlock = closeBlocks.reduce(
      (prev, current, currentIndex) => {
        if (!current.index || !prev.index) {
          mostNearCloseBlockIndex = currentIndex;
          return current;
        }
        if (index > current.index || index > prev.index) {
          mostNearCloseBlockIndex = currentIndex;
          return current;
        }
        if (prev.index - index > current.index - index) {
          mostNearCloseBlockIndex = currentIndex;
          return current;
        }
        if (prev.index - index < current.index - index) {
          return prev;
        }
        mostNearCloseBlockIndex = currentIndex;
        return current;
      }
    );
    const blocksBetweenCloseBlock = sameNameBlocks.filter((block) => {
      if (!block.index || !mostNearCloseBlock.index) return false;
      if (index < block.index && block.index < mostNearCloseBlock.index)
        return true;
    });
    const thisCloseBlock =
      closeBlocks[mostNearCloseBlockIndex + blocksBetweenCloseBlock.length];

    const wpBlockInnerText = input.slice(
      indexOfWpStartBlockEnd,
      thisCloseBlock.index
    );
    return wpBlockInnerText;
  });

  return textsInWpBlock;
};
