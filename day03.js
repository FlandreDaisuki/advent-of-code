#!/usr/bin/env node

const getProblemText = () => {
  if (globalThis.document) {
    return document.body.textContent;
  }
  const filename = process.argv[1].replace(/.*(day\d+)[.]js/, '$1.txt');
  return require('fs').readFileSync(filename, 'utf8');
};

const report = getProblemText()
  .split('\n')
  .filter(Boolean)
  .map((line) => [...line]);

const bitCount = report[0].length;
const reportCount = report.length;

const bitCountAccumulator = report.reduce((acc, bits) => {
  bits.forEach((bit, idx) => {
    if (bit === '1') {
      acc[idx] += 1;
    }
  });
  return acc;
}, Array.from({ length: bitCount }).fill(0));

const gammaRateBinaryString = bitCountAccumulator
  .map((acc) => Number(acc > (reportCount / 2))).join('');

const epsilonRateBinaryString = [...gammaRateBinaryString]
  .map((bit) => bit ^ 1).join('');

const gammaRate = parseInt(gammaRateBinaryString, 2);
const epsilonRate = parseInt(epsilonRateBinaryString, 2);

const answer1 = gammaRate * epsilonRate;
console.log('answer1', answer1);

const range = (length) => Array.from({ length }).map((_, idx) => idx);
const countOneOnPosition = (report, pos) => {
  let count = 0;
  for (const bits of report) {
    if (bits[pos] === '1') {
      count += 1;
    }
  }
  return count;
};

const oxygenGeneratorRating = ((report) => {
  let cloned = JSON.parse(JSON.stringify(report));

  for (const bitPos of range(bitCount)) {
    const cloneLength = cloned.length;
    const onesCount = countOneOnPosition(cloned, bitPos);
    const keepBit = onesCount >= (cloneLength / 2) ? '1' : '0';
    cloned = cloned.filter((bits) => bits[bitPos] === keepBit);
    if (cloned.length === 1) {
      break;
    }
  }
  return parseInt(cloned[0].join(''), 2);
})(report);

const CO2ScrubberRating = ((report) => {
  let cloned = JSON.parse(JSON.stringify(report));

  for (const bitPos of range(bitCount)) {
    const cloneLength = cloned.length;
    const onesCount = countOneOnPosition(cloned, bitPos);
    const keepBit = onesCount >= (cloneLength / 2) ? '0' : '1';
    cloned = cloned.filter((bits) => bits[bitPos] === keepBit);
    if (cloned.length === 1) {
      break;
    }
  }
  return parseInt(cloned[0].join(''), 2);
})(report);

const answer2 = oxygenGeneratorRating * CO2ScrubberRating;
console.log('answer2', answer2);
