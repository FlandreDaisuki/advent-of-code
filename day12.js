#!/usr/bin/env node

const getProblemText = () => {
  if (globalThis.document) {
    return document.body.textContent;
  }
  const filename = process.argv[1].replace(/.*(day\d+)[.]js/, '$1.txt');
  return require('fs').readFileSync(filename, 'utf8');
};

const lastItem = (arr) => arr?.[arr.length - 1];

const paths = getProblemText()
  .split('\n')
  .filter(Boolean)
  .map((line) => line.split('-'));

const caves = new Set(paths.flat());
const pathHashMap = Object.fromEntries([...caves].map((cave) => {
  const connected = paths
    .filter((path) => path.includes(cave)).flat()
    .filter((pathCave) => pathCave !== cave);
  return [cave, connected];
}));

const isSmallCave = (cave) => /[a-z]+/.test(cave);
const isBigCave = (cave) => /[A-Z]+/.test(cave);
const traverse = (footprints = ['start']) => {
  const last = lastItem(footprints);
  if (last === 'end') {
    return [String(footprints)];
  }

  const all = [];
  for (const nextCave of pathHashMap[last]) {
    if (isBigCave(nextCave) || (isSmallCave(nextCave) && !footprints.includes(nextCave))) {
      all.push(...traverse(footprints.concat(nextCave)));
    }
  }
  return all;
};

const answer1 = traverse().length;
console.log('answer1', answer1);


const hasSmallDuplicate = (arr) => {
  const smalls = arr.filter(isSmallCave);
  return smalls.length !== new Set(smalls).size;
};

const traverse2 = (footprints = ['start']) => {
  const last = lastItem(footprints);
  if (last === 'end') {
    return [String(footprints)];
  }

  const all = [];
  for (const nextCave of pathHashMap[last]) {
    if (isBigCave(nextCave) || (isSmallCave(nextCave) && (!footprints.includes(nextCave) || !hasSmallDuplicate(footprints)) && nextCave !== 'start')) {
      all.push(...traverse2(footprints.concat(nextCave)));
    }
  }
  return all;
};
const answer2 = traverse2().length;
console.log('answer2', answer2);
