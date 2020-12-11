const inputList = document.body.textContent.split(/\s/).filter(Boolean);

const seq = (length) => Array.from({ length }, (e, i) => i);

const eightDirection = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
];

const eightNeighbors = (board, r, c) =>
  eightDirection.map(([x, y]) => board[r + x]?.[c + y])
    .filter(Boolean)
    .reduce((acc, val) => {
      acc[val] = (acc[val] ?? 0) + 1;
      return acc;
    }, { '#': 0, 'L': 0 });

const flipBy = (neighborFn, occupyFn, emptyFn) => {
  const flip = (board) => {
    const col = board[0].length;
    const row = board.length;
    const nextBoard = seq(row).map(() => '');
    for (const r of seq(row)) {
      for (const c of seq(col)) {
        if (board[r][c] === 'L' ) {
          nextBoard[r] += occupyFn(neighborFn(board, r, c)) ? '#' : 'L';
        } else if (board[r][c] === '#') {
          nextBoard[r] += emptyFn(neighborFn(board, r, c)) ? 'L' : '#';
        } else {
          nextBoard[r] += '.';
        }
      }
    }
    if (board.flat().join('') === nextBoard.flat().join('')) {
      return nextBoard;
    } else {
      return flip(nextBoard);
    }
  };
  return flip;
};

flipBy(
  eightNeighbors,
  (neighbor) => neighbor['#'] < 1,
  (neighbor) => neighbor['#'] >= 4,
)(inputList).flat().join('').replace(/[^#]/g, '').length; // answer 1

const isNotFloor = (s) => s !== '.';

const findUntilNoFloor = (neighbors, board, r, c, i = 1) => {
  if (neighbors.every(isNotFloor)) {
    return neighbors;
  }
  const queenNext = eightDirection.map(([x, y], j) => isNotFloor(neighbors[j]) ? neighbors[j] : board[r + x * i]?.[c + y * i]);
  return findUntilNoFloor(queenNext, board, r, c, i + 1);
};

const queenNeighbors = (board, r, c) =>
  findUntilNoFloor(seq(8).map(() => '.'), board, r, c)
    .filter(Boolean)
    .reduce((acc, val) => {
      acc[val] = (acc[val] ?? 0) + 1;
      return acc;
    }, { '#': 0, 'L': 0 });

flipBy(
  queenNeighbors,
  (neighbor) => neighbor['#'] < 1,
  (neighbor) => neighbor['#'] >= 5,
)(inputList).flat().join('').replace(/[^#]/g, '').length; // answer 2
