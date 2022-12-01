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

const elvesWithFoods = getProblemText()
  .split('\n\n')
  .filter(Boolean)
  .map((foodsPerElf) => {
    return foodsPerElf.split('\n').filter(Boolean).map(Number);
  });

const elvesCalories = elvesWithFoods.map(sum);
const answer1 = Math.max(...elvesCalories);

console.log('answer1', answer1);


/** @param {number[]} arr */
const sortByAsc = (arr) => Array.from(arr).sort((a, b) => a - b);

const answer2 = sum(sortByAsc(elvesCalories).slice(-3));

console.log('answer2', answer2);
