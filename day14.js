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

const [template, ruleInputs] = getProblemText().split('\n\n');
const rulesMap = Object.fromEntries(
  ruleInputs.split('\n').filter(Boolean).map((rule) => {
    const [pattern, inserted] = rule.match(/^(\w+) -> (\w+)$/).slice(1);
    const [l, r] = pattern.split('');
    return [pattern, [l + inserted, inserted + r]];
  }),
);

const initPatternHistogram = ((template) => {
  const map = {};
  range0(template.length - 1).forEach((i) => {
    const pattern = template.slice(i, i + 2);
    map[pattern] = (map[pattern] ?? 0) + 1;
  });
  return map;
})(template);


const doStep = (patternHistogram) => {
  const newHistogram = {};
  for (const [pattern, count] of Object.entries(patternHistogram)) {
    rulesMap[pattern]?.forEach((patternAfterRule) => {
      newHistogram[patternAfterRule] = (newHistogram[patternAfterRule] ?? 0) + count;
    });
  }
  return newHistogram;
};

const doStepTimes = (times) => range0(times)
  .reduce((patternHistogram) => doStep(patternHistogram), initPatternHistogram);

const toCharHistogram = (patternHistogram) => {
  const histogram = {};
  for (const [pattern, count] of Object.entries(patternHistogram)) {
    const [l, r] = pattern.split('');
    histogram[l] = (histogram[l] ?? 0) + count;
    histogram[r] = (histogram[r] ?? 0) + count;
  }
  // Each char will be counted twice except for the first and last char.
  // So, we divide by 2 with rounding up instead add 1 to them.
  return Object.fromEntries(
    Object.entries(histogram).map(([char, count]) => [char, Math.ceil(count / 2)]),
  );
};

const getAnswerByHistogram = (histogram) => {
  const values = Object.values(histogram);
  return Math.max(...values) - Math.min(...values);
};

const answer1 = getAnswerByHistogram(toCharHistogram(doStepTimes(10)));
console.log('answer1', answer1);

const answer2 = getAnswerByHistogram(toCharHistogram(doStepTimes(40)));
console.log('answer2', answer2);
