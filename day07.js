#!/usr/bin/env node

const getProblemText = () => {
  if (globalThis.document) {
    return document.body.textContent;
  }
  const filename = process.argv[1].replace(/.*(day\d+)[.]js/, '$1.txt');
  return require('fs').readFileSync(filename, 'utf8');
};

const range = (start, end) => Array.from({ length: end - start }, (_, i) => start + i);
const range0 = (end) => range(0, end);
const sum = (...args) => args.flat(Infinity).reduce((a, b) => a + b, 0);

const crabPositions = getProblemText().match(/(\d+)/g).map(Number);

const answer1 = Math.min(...crabPositions.map((p) =>
  sum(crabPositions.map((q) => Math.abs(p - q))),
));
console.log(answer1);

const newStepCost = (n) => (1 + n) * n / 2;
const answer2 = Math.min(...range0(crabPositions.length).map((p) =>
  sum(crabPositions.map((q) => newStepCost(Math.abs(p - q)))),
));
console.log(answer2);
