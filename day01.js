#!/usr/bin/env node

const getProblemText = () => {
  if (globalThis.document) {
    return document.body.textContent;
  }
  const filename = process.argv[1].replace(/.*(day\d+)[.]js/, '$1.txt');
  return require('fs').readFileSync(filename, 'utf8');
};

const measurements = getProblemText().split('\n').map(Number);

const answer1 = measurements.filter((e, i, a) => i > 0 && e > a[i - 1]).length;

console.log('answer1', answer1);

const groupByThreeSum = measurements.map((e, i, a) => {
  if (i < 2) return NaN;
  return e + a[i - 1] + a[i - 2];
}).filter((e) => !isNaN(e));

const answer2 = groupByThreeSum.filter((e, i, a) => e > a[i - 1]).length;

console.log('answer2', answer2);
