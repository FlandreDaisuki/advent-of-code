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

const traverse = (canVisitNextCave) => {
  const recursiveTraverse = (footprints) => {
    const last = lastItem(footprints);
    if (last === 'end') {
      return [String(footprints)];
    }

    const all = [];
    for (const nextCave of pathHashMap[last]) {
      if (canVisitNextCave(footprints, nextCave)) {
        all.push(...recursiveTraverse(footprints.concat(nextCave)));
      }
    }
    return all;
  };
  return recursiveTraverse(['start']);
};

const canVisitNextCave1 = (footprints, nextCave) => {
  if (isBigCave(nextCave)) {
    return true;
  }
  if (isSmallCave(nextCave)) {
    return !footprints.includes(nextCave);
  }
  return false;
};

const answer1 = traverse(canVisitNextCave1).length;
console.log('answer1', answer1);


const hasSmallDuplicate = (arr) => {
  const smalls = arr.filter(isSmallCave);
  return smalls.length !== new Set(smalls).size;
};
const canVisitNextCave2 = (footprints, nextCave) => {
  if (isBigCave(nextCave)) {
    return true;
  }
  if (isSmallCave(nextCave) && nextCave !== 'start') {
    return !footprints.includes(nextCave) || !hasSmallDuplicate(footprints);
  }
  return false;
};

const answer2 = traverse(canVisitNextCave2).length;
console.log('answer2', answer2);
