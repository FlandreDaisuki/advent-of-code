#!/usr/bin/env node

const getProblemText = () => {
  if (globalThis.document) {
    return document.body.textContent;
  }
  const filename = process.argv[1].replace(/.*(day\d+)[.]js/, '$1.txt');
  return require('fs').readFileSync(filename, 'utf8');
};

/** @param {string} text */
const splitLines = (text, separator = '\n') => text.split(separator)
  .map((line) => line.trim())
  .filter(Boolean);

const elvesWithPairs = splitLines(getProblemText()).map((line) => {
  const [x1, x2, y1, y2] = line
    .match(/^(\d+)[-](\d+),(\d+)[-](\d+)$/)
    .slice(1)
    .map(Number);

  return [[x1, x2], [y1, y2]];
});

const answer1 = elvesWithPairs.filter((pairs) => {
  const [pair1, pair2] = pairs;
  return [
    pair1[0] <= pair2[0] && pair2[1] <= pair1[1],
    pair2[0] <= pair1[0] && pair1[1] <= pair2[1],
  ].some(Boolean);
}).length;

console.log('answer1', answer1);

const answer2 = elvesWithPairs.filter((pairs) => {
  const [pair1, pair2] = pairs;
  return [
    pair1[0] <= pair2[0] && pair2[0] <= pair1[1],
    pair2[0] <= pair1[0] && pair1[0] <= pair2[1],
  ].some(Boolean);
}).length;

console.log('answer2', answer2);
