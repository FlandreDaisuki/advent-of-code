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

const [pointsInput, foldInstructionsInput] = getProblemText().split('\n\n');
const points = pointsInput
  .split('\n')
  .filter(Boolean)
  .map((line) => line.match(/(\d+),(\d+)/).slice(1).map(Number));


const foldInstructions = foldInstructionsInput
  .split('\n')
  .filter(Boolean)
  .map((line) => {
    const [foldAxis, foldAt] = line.match(/([xy])=(\d+)/).slice(1);
    return [foldAxis, Number(foldAt)];
  });

const firstFoldSet = new Set(
  points.map((point) => {
    const p = point.slice();
    const [foldAxis, foldAt] = foldInstructions[0];
    if (foldAxis === 'x' && p[0] > foldAt) {
      p[0] = foldAt * 2 - p[0];
    } else if (foldAxis === 'y' && p[1] > foldAt) {
      p[1] = foldAt * 2 - p[1];
    }
    return p.join(',');
  }),
);

const answer1 = firstFoldSet.size;
console.log('answer1', answer1);

const foldAllSet = new Set(
  points.map((point) => {
    const p = point.slice();
    for (const [foldAxis, foldAt] of foldInstructions) {
      if (foldAxis === 'x' && p[0] > foldAt) {
        p[0] = foldAt * 2 - p[0];
      } else if (foldAxis === 'y' && p[1] > foldAt) {
        p[1] = foldAt * 2 - p[1];
      }
    }
    return p.join(',');
  }),
);

const dots = [...foldAllSet].map((point) => point.split(',').map(Number));
const maxX = Math.max(...dots.map(([x]) => x));
const maxY = Math.max(...dots.map(([, y]) => y));
const canvas = range0(maxY + 1).map((r) =>
  range0(maxX + 1).map((c) =>
    foldAllSet.has(`${c},${r}`) ? '█' : ' ',
  ));
const drawCanvas = (canvas) => canvas.map((row) => row.join('')).join('\n');
// do OCR ??
console.log('answer2');
console.log(drawCanvas(canvas));
