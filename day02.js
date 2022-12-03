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
  'A X': 1 + 3, // 🪨 🪨 draw
  'A Y': 2 + 6, // 🪨 📜 win
  'A Z': 3 + 0, // 🪨 ✂️ lose
  'B X': 1 + 0, // 📜 🪨 lose
  'B Y': 2 + 3, // 📜 📜 draw
  'B Z': 3 + 6, // 📜 ✂️ win
  'C X': 1 + 6, // ✂️ 🪨 win
  'C Y': 2 + 0, // ✂️ 📜 lose
  'C Z': 3 + 3, // ✂️ ✂️ draw
});
const firstTotalScore = rounds.map((round) => FIRST_SCORE_MAP[round]);
const answer1 = sum(firstTotalScore);

console.log('answer1', answer1);


const SECOND_SCORE_MAP = Object.freeze({
  'A X': 3 + 0, // 🪨 ✂️ lose
  'A Y': 1 + 3, // 🪨 🪨 draw
  'A Z': 2 + 6, // 🪨 📜 win
  'B X': 1 + 0, // 📜 🪨 lose
  'B Y': 2 + 3, // 📜 📜 draw
  'B Z': 3 + 6, // 📜 ✂️ win
  'C X': 2 + 0, // ✂️ 📜 lose
  'C Y': 3 + 3, // ✂️ ✂️ draw
  'C Z': 1 + 6, // ✂️ 🪨 win
});

const secondTotalScore = rounds.map((round) => SECOND_SCORE_MAP[round]);
const answer2 = sum(secondTotalScore);

console.log('answer2', answer2);
