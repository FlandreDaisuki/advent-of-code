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

/** @param {number} length */
const range = (length) => Array.from({ length }, (_, i) => i);

/** @param {number[]} arr */
const sum = (arr) => Array.from(arr).reduce((a, b) => a + b, 0);

/** @type {(separator?: string) => (arr: string[]) => string} */
const join = (separator) => (arr) => Array.from(arr).join(separator);


const instructions = splitLines(getProblemText());

const answer1 = (() => {
  let pc = 0;
  let circle = 0;
  let x = 1;

  const circleHistory = [];
  while (circle < 220) {
    const inst = instructions[pc % instructions.length];
    if (inst === 'noop') {
      pc += 1;
      circle += 1;
      circleHistory[circle] = x;
    }
    else {
      const v = Number(inst.split(' ').pop());
      console.assert(Number.isFinite(v));

      pc += 1;
      circle += 1;
      circleHistory[circle] = x;

      circle += 1;
      x += v;
      circleHistory[circle] = x;
    }
  }

  return sum(range(6).map((i) => {
    const signal = i * 40 + 20;
    return signal * circleHistory[signal - 1];
  }));
})();

console.log('answer1', answer1);


const renderCRT = (flattenCRT, height, width) => {
  console.assert(flattenCRT.length === height * width);
  const scanLines = [];
  for (const h of range(height)) {
    scanLines.push(flattenCRT.slice(0 + h * width, width + h * width));
  }
  return scanLines.map(join('')).join('\n');
};

const flattenCRT = (() => {
  let pc = 0;
  let sprite = 0;
  let circle = 0;
  const CRTBuffer = [];

  const drawCRT = (circle, sprite) => {
    const rowX = circle % 40;
    CRTBuffer[circle] = (rowX >= sprite && rowX <= sprite + 2) ? '#' : '.';
  };

  while (circle < 240) {
    const inst = instructions[pc % instructions.length];
    if (inst === 'noop') {
      drawCRT(circle, sprite);
      pc += 1;
      circle += 1;
    }
    else {
      const v = Number(inst.split(' ').pop());
      console.assert(Number.isFinite(v));

      drawCRT(circle, sprite);
      pc += 1;
      circle += 1;

      drawCRT(circle, sprite);
      circle += 1;
      sprite += v;
    }
  }

  return CRTBuffer;
})();

console.log('answer2');
console.log(renderCRT(flattenCRT, 6, 40));
