#!/usr/bin/env node

const getProblemText = () => {
  if (globalThis.document) {
    return document.body.textContent;
  }
  const filename = process.argv[1].replace(/.*(day\d+)[.]js/, '$1.txt');
  return require('fs').readFileSync(filename, 'utf8');
};

const sum = (...args) => args.flat(Infinity).reduce((a, b) => a + b, 0);

const lines = getProblemText().split('\n').filter(Boolean);

const SCORE_MAP = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
};

const LEFT = '([{<';
const RIGHT = ')]}>';
const isLeft = (c) => LEFT.includes(c);
const isRight = (c) => RIGHT.includes(c);
const isPair = (left, right) => LEFT.indexOf(left) === RIGHT.indexOf(right);

const answer1 = sum(lines.map((line) => {
  const stack = [];
  for (const c of line) {
    if (isLeft(c)) { stack.push(c); }
    if (isRight(c)) {
      const right = c;
      const last = stack.pop();
      if (!isPair(last, right)) {
        return SCORE_MAP[c];
      }
    }
  }
  return 0;
}));
console.log('answer1', answer1);

const SCORE_MAP_2 = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4,
};

const incompleteStacks = lines.map((line) => {
  const stack = [];
  for (const c of line) {
    if (isLeft(c)) { stack.push(c); }
    if (isRight(c)) {
      const right = c;
      const left = stack.pop();
      if (!isPair(left, right)) {
        return false;
      }
    }
  }
  return stack;
}).filter(Boolean);

const sortedScores = incompleteStacks.map((stack) => {
  let score = 0;
  for (const left of [...stack].reverse()) {
    const right = RIGHT[LEFT.indexOf(left)];
    score = score * 5 + SCORE_MAP_2[right];
  }
  return score;
}).sort((a, b) => a - b);

const answer2 = sortedScores[Math.floor(sortedScores.length / 2)];
console.log('answer2', answer2);
