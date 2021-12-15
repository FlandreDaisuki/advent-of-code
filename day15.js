#!/usr/bin/env node

const getProblemText = () => {
  if (globalThis.document) {
    return document.body.textContent;
  }
  const filename = process.argv[1].replace(/.*(day\d+)[.]js/, '$1.txt');
  // return require('fs').readFileSync(filename + '.in', 'utf8');
  return require('fs').readFileSync(filename, 'utf8');
};

const range = (start, end) => Array.from({ length: end - start }, (_, i) => start + i);
const range0 = (end) => range(0, end);

const riskTable = getProblemText()
  .split('\n')
  .filter(Boolean)
  .map((line) => line.match(/\d/g).map(Number));

const ROW_COUNT = riskTable.length;
const COLUMN_COUNT = riskTable[0].length;

const riskHashMap = Object.fromEntries(
  range0(ROW_COUNT).flatMap((r) => range0(COLUMN_COUNT).map((c) => [`${r},${c}`, riskTable[r][c]])),
);

const countLowestRisk = (riskHashMap, rowCount, columnCount) => {
  const riskSumHashMap = {};
  for (const r of range0(rowCount)) {
    for (const c of range0(columnCount)) {
      if (r === 0 && c === 0) {
        riskSumHashMap[`${r},${c}`] = 0;
      } else {
        const left = riskSumHashMap[`${r},${c - 1}`] ?? Infinity;
        const top = riskSumHashMap[`${r - 1},${c}`] ?? Infinity;
        riskSumHashMap[`${r},${c}`] = riskHashMap[`${r},${c}`] + Math.min(left, top);
      }
    }
  }
  return riskSumHashMap[`${rowCount - 1},${columnCount - 1}`];
};

const answer1 = countLowestRisk(riskHashMap, ROW_COUNT, COLUMN_COUNT);
console.log('answer1', answer1);

const largeRiskHashMap = Object.fromEntries(
  range0(ROW_COUNT * 5).flatMap((r) => {
    return range0(COLUMN_COUNT * 5).map((c) => {
      // quotient and remainder
      const [rq, rr] = [Math.floor(r / ROW_COUNT), r % ROW_COUNT];
      const [cq, cr] = [Math.floor(c / COLUMN_COUNT), c % COLUMN_COUNT];
      const originalRisk = riskTable[rr][cr];
      const newRisk = (originalRisk + rq + cq) % 9;
      return [`${r},${c}`, newRisk === 0 ? 9 : newRisk];
    });
  }),
);
const answer2 = countLowestRisk(largeRiskHashMap, ROW_COUNT * 5, COLUMN_COUNT * 5);
console.log('answer2', answer2);
