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

const initialFishes = getProblemText().match(/(\d+)/g).map(Number);
const fishesByWaitDays = (() => {
  const histogram = Array.from({ length: 9 }, () => 0);
  for (const fish of initialFishes) {
    histogram[fish] += 1;
  }
  return histogram;
})();

const getFishesAfterDays = (fishes, day) => {
  const cloned = fishes.slice();

  range0(day).forEach(() => {
    const motherFishes = cloned.shift();
    cloned.push(motherFishes);
    cloned[6] += motherFishes;
  });

  return cloned;
};

const answer1 = sum(getFishesAfterDays(fishesByWaitDays, 80));
console.log('answer1', answer1);

const answer2 = sum(getFishesAfterDays(fishesByWaitDays, 256));
console.log('answer2', answer2);
