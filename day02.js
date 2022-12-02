#!/usr/bin/env node

const getProblemText = () => {
  if (globalThis.document) {
    return document.body.textContent;
  }
  const filename = process.argv[1].replace(/.*(day\d+)[.]js/, '$1.txt');
  return require('fs').readFileSync(filename, 'utf8');
};

/** @param {number[]} arr */
const sum = (arr) => Array.from(arr).reduce((a, b) => a + b, 0);

const rounds = getProblemText().split('\n').filter(Boolean);

const FIRST_SCORE_MAP = Object.freeze({
  'A X': 3 + 1,
  'A Y': 6 + 2,
  'A Z': 0 + 3,
  'B X': 0 + 1,
  'B Y': 3 + 2,
  'B Z': 6 + 3,
  'C X': 6 + 1,
  'C Y': 0 + 2,
  'C Z': 3 + 3,
});
const firstTotalScore = rounds.map((round) => FIRST_SCORE_MAP[round]);
const answer1 = sum(firstTotalScore);

console.log('answer1', answer1);


const SECOND_SCORE_MAP = Object.freeze({
  'A X': 3 + 0,
  'A Y': 1 + 3,
  'A Z': 2 + 6,
  'B X': 1 + 0,
  'B Y': 2 + 3,
  'B Z': 3 + 6,
  'C X': 2 + 0,
  'C Y': 3 + 3,
  'C Z': 1 + 6,
});

const secondTotalScore = rounds.map((round) => SECOND_SCORE_MAP[round]);
const answer2 = sum(secondTotalScore);

console.log('answer2', answer2);
