#!/usr/bin/env node

const getProblemText = () => {
  if (globalThis.document) {
    return document.body.textContent;
  }
  const filename = process.argv[1].replace(/.*(day\d+)[.]js/, '$1.txt');
  return require('fs').readFileSync(filename, 'utf8');
};

/** @param {number[]} arr */
const multiply = (arr) => Array.from(arr).reduce((a, b) => a * b, 1);


/** @param {number[]} arr */
const min = (arr) => Array.from(arr).reduce((a, b) => Math.min(a, b), Infinity);

/** @param {number[]} arr */
const max = (arr) => Array.from(arr).reduce((a, b) => Math.max(a, b), -Infinity);

const isFiniteOrNull = (n) => Number.isFinite(n) ? n : null;

/** @param {number} length */
const range = (length) => Array.from({ length }, (_, i) => i);

/**
 * @template T, U
 * @param {T[]} arr1
 * @param {U[]} arr2
 */
const cross = (arr1, arr2) => {
  return arr1.flatMap((e1) => {
    return arr2.map((e2) => [e1, e2]);
  });
};


/** @param {string} text */
const splitLines = (text, separator = '\n') => text.split(separator)
  .map((line) => line.trim())
  .filter(Boolean);

const forest = splitLines(getProblemText())
  .map((line) => {
    return line.split('')
      .filter(Boolean)
      .map(Number);
  });

console.assert(forest.every((row) => row.length === forest[0].length));

const treesInForest = cross(range(forest.length), range(forest[0].length))
  .map(([i, j]) => ({ i, j, h: forest[i][j] }));

const DIRECTION = Object.freeze({
  UP: Symbol(),
  RIGHT: Symbol(),
  DOWN: Symbol(),
  LEFT: Symbol(),
});

/** @type {(forest: number[][]) => (p: [number, number], d:number) => number[]} */
const getTreesInForest = (forest) => ([i, j], d) => {
  const row = forest[i];
  const col = forest.map((row) => row[j]);
  switch (d) {
    case DIRECTION.UP:
      return col.slice(0, i).reverse();
    case DIRECTION.LEFT:
      return row.slice(0, j).reverse();
    case DIRECTION.RIGHT:
      return row.slice(j + 1);
    case DIRECTION.DOWN:
      return col.slice(i + 1);
    default:
      throw new Error('Unknown direction');
  }
};

const getTreesInDirection = getTreesInForest(forest);

const answer1 = treesInForest
  .filter(({ i, j, h }) => {
    const treesOfFourDirections = Object.values(DIRECTION).map((d) => getTreesInDirection([i, j], d));
    const maxHeightOfFourDirections = treesOfFourDirections.map(max);
    return h > min(maxHeightOfFourDirections.map((n) => isFiniteOrNull(n) ?? -1));
  })
  .length;

console.log('answer1', answer1);

const answer2 = max(
  treesInForest.map(({ i, j, h }) => {

    const treesOfFourDirections = Object.values(DIRECTION).map((d) => getTreesInDirection([i, j], d));
    const visibleCountOfFourDirections = treesOfFourDirections.map((trees) => {
      if (trees.length === 0) { return 0; }
      if (trees.every((tree) => tree < h)) { return trees.length; }
      return trees.findIndex((tree) => tree >= h) + 1;
    });

    return multiply(visibleCountOfFourDirections);
  }),
);

console.log('answer2', answer2);
