#!/usr/bin/env node

const getProblemText = () => {
  if (globalThis.document) {
    return document.body.textContent;
  }
  const filename = process.argv[1].replace(/.*(day\d+)[.]js/, '$1.txt');
  return require('fs').readFileSync(filename, 'utf8');
};

const notes = getProblemText()
  .split('\n')
  .filter(Boolean)
  .map((line) => {
    const segments = line.match(/(\w+)/g);
    const signals = segments.slice(0, 10);
    const output = segments.slice(-4);
    return { signals, output };
  });

const answer1 = notes
  .flatMap((note) => note.output)
  .filter((output) => [2, 3, 4, 7].includes(output.length))
  .length;
console.log('answer1:', answer1);

const sortSeg = (seg) => seg.split('').sort().join('');

// len(2) = {1}
// len(3) = {7}
// len(4) = {4}
// len(5) = {2, 3, 5}
// len(6) = {0, 6, 9}
// len(7) = {8}
// segOf(7) ⊆ digit(3) ⊆ len(5)
// segOf(4) ⊆ digit(9) ⊆ len(6)
// digit(5) ⊆ {len(5) - digit(3)} ⊆ segOf(9)
// {len(5) - digit(3) - digit(5)} => digit(2)
// segOf(1) ⊆ digit(0) ⊆ {len(6) - digit(9)}
// {len(6) - digit(9) - digit(0)} => digit(6)
const recognizeSignals = (signals) => {
  const sss = signals.map(sortSeg);

  const digit1 = sss.find((signal) => signal.length === 2);
  const digit7 = sss.find((signal) => signal.length === 3);
  const digit4 = sss.find((signal) => signal.length === 4);
  const digit8 = sss.find((signal) => signal.length === 7);

  const len5 = sss.filter((signal) => signal.length === 5);
  const len6 = sss.filter((signal) => signal.length === 6);

  const digit3 = len5.find((digit) => [...digit7].every((seg) => digit.includes(seg)));
  const digit9 = len6.find((digit) => [...digit4].every((seg) => digit.includes(seg)));

  const digit2Or5 = len5.filter((digit) => digit !== digit3);

  const digit5 = digit2Or5.find((digit) => [...digit].every((seg) => digit9.includes(seg)));
  const digit2 = digit2Or5.find((digit) => digit !== digit5);

  const digit0Or6 = len6.filter((digit) => digit !== digit9);

  const digit0 = digit0Or6.find((digit) => [...digit1].every((seg) => digit.includes(seg)));
  const digit6 = digit0Or6.find((digit) => digit !== digit0);

  return [
    digit0, digit1, digit2, digit3, digit4,
    digit5, digit6, digit7, digit8, digit9,
  ];
};

const answer2 = notes
  .map((note) => {
    const indexedSignals = recognizeSignals(note.signals);
    const outputString = note.output.map((out) => {
      return indexedSignals.findIndex((digit) => digit === sortSeg(out));
    }).join('');
    return Number(outputString);
  })
  .reduce((sum, output) => sum + output, 0);
console.log('answer2:', answer2);
