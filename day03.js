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

/** @param {number[]} arr */
const sum = (arr) => Array.from(arr).reduce((a, b) => a + b, 0);

const rucksacks = splitLines(getProblemText());

/** @type {<T>(a: T[], b: T[]) => T[]} */
const intersect = (a, b) => {
  const sa = new Set(a);
  const sb = new Set(b);
  const si = new Set();
  for (const x of sa) {
    if (sb.has(x)) {
      si.add(x);
    }
  }
  return Array.from(si);
};

const getPriority = (char) => {
  if (/[a-z]/.test(char)) {
    return char.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
  }
  else {
    return char.charCodeAt(0) - 'A'.charCodeAt(0) + 27;
  }
};

const answer1 = sum(rucksacks.map((rucksack) => {
  const halfLength = rucksack.length / 2;
  const uniqChars = intersect(
    rucksack.slice(0, halfLength),
    rucksack.slice(halfLength),
  );

  console.assert(uniqChars.length === 1);

  return getPriority(uniqChars[0]);
}));

console.log('answer1', answer1);

/** @type {<T>(arr: T[], size: number) => T[][]} */
const chunked = (arr, size) => {
  const mutArr = Array.from(arr);
  const collection = [];
  while (mutArr.length > 0) {
    collection.push(mutArr.splice(0, size));
  }
  return collection;
};

const groups = chunked(rucksacks, 3);
console.assert(groups.every((group) => group.length === 3));


const answer2 = sum(groups.map((group) => {
  const uniqChars = intersect(group[0], intersect(group[1], group[2]));

  console.assert(uniqChars.length === 1);

  return getPriority(uniqChars[0]);
}));

console.log('answer2', answer2);
