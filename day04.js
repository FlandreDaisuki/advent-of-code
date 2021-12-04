#!/usr/bin/env node

const getProblemText = () => {
  if (globalThis.document) {
    return document.body.textContent;
  }
  const filename = process.argv[1].replace(/.*(day\d+)[.]js/, '$1.txt');
  return require('fs').readFileSync(filename, 'utf8');
};

const sum = (...args) => args.flat(Infinity).reduce((a, b) => a + b, 0);

const [rawDrawnSequence, ...rawBoards] = getProblemText().split('\n\n');

const BOARD_DIMENSION = 5;
const drawnSequence = rawDrawnSequence.match(/\d+/g).map(Number);

const createBoards = () => rawBoards.map((rawBoard) => {
  // 1-way board
  const board = rawBoard.match(/\d+/mg).map(Number);
  const foundDrawnNumbers = [];

  const getBoardRow = (row) => board.filter((_, i) => Math.floor(i / BOARD_DIMENSION) === row);
  const getBoardColumn = (col) => board.filter((_, i) => i % BOARD_DIMENSION === col);

  const findDrawnOrNull = (drawn) => {
    const i = board.findIndex((e) => e === drawn);
    if (i === -1) { return null; }

    const row = Math.floor(i / BOARD_DIMENSION);
    const col = i % BOARD_DIMENSION;
    return { row, col };
  };

  const updateBingo = (drawn) => {
    const found = findDrawnOrNull(drawn);
    if (!found) { return false; }

    foundDrawnNumbers.push(drawn);

    const { row, col } = found;

    const isRowBingo = getBoardRow(row).every((e) => foundDrawnNumbers.includes(e));
    const isColBingo = getBoardColumn(col).every((e) => foundDrawnNumbers.includes(e));
    return isRowBingo || isColBingo;
  };

  return {
    board,
    foundDrawnNumbers,
    updateBingo,
  };
});

const winBoard = ((boards) => {
  for (const drawn of drawnSequence) {
    for (const board of boards) {
      if (board.updateBingo(drawn)) {
        return board;
      }
    }
  }
})(createBoards());

const calculateScore = (winBoard) => {
  const { foundDrawnNumbers, board } = winBoard;

  const lastDrawn = foundDrawnNumbers.slice(-1)[0];
  const nonDrawnNumbers = board.filter((e) => !foundDrawnNumbers.includes(e));

  return sum(nonDrawnNumbers) * lastDrawn;
};

const answer1 = calculateScore(winBoard);
console.log('answer1', answer1);

const lastWinBoard = ((boards) => {
  const nonBingoBoards = [...boards];

  for (const drawn of drawnSequence) {
    for (const board of [...nonBingoBoards]) {
      if (board.updateBingo(drawn)) {
        const [poppedBoard] = nonBingoBoards.splice(nonBingoBoards.indexOf(board), 1);
        if (!nonBingoBoards.length) {
          return poppedBoard;
        }
      }
    }
  }
})(createBoards());

const answer2 = calculateScore(lastWinBoard);
console.log('answer2', answer2);
