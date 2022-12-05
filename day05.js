#!/usr/bin/env node

const getProblemText = () => {
  if (globalThis.document) {
    return document.body.textContent;
  }
  const filename = process.argv[1].replace(/.*(day\d+)[.]js/, '$1.txt');
  return require('fs').readFileSync(filename, 'utf8');
};

/** @param {string} text */
const splitLinesNoTrim = (text, separator = '\n') => text.split(separator)
  .filter(Boolean);

/** @param {string} text */
const splitLines = (text, separator = '\n') => text.split(separator)
  .map((line) => line.trim())
  .filter(Boolean);

const simpleDeepClone = (o) => JSON.parse(JSON.stringify(o));

const [startingStacksRaw, proceduresRaw] = splitLinesNoTrim(getProblemText(), '\n\n');

const procedures = splitLines(proceduresRaw);

/** @returns {Record<number, string[]>} */
const initStacks = () => splitLinesNoTrim(startingStacksRaw)
  .reduceRight((stacks, stacksOrCratesRaw) => {
    const clonedStacks = simpleDeepClone(stacks);
    if (/\d+/.test(stacksOrCratesRaw)) {
      for (const stackId of stacksOrCratesRaw.match(/\d+/g)) {
        clonedStacks[stackId] = [];
      }
      return clonedStacks;
    }

    let stackId = 1;
    for (const crate of stacksOrCratesRaw.match(/.{3}(?:\s|$)/g)) {
      const crateId = crate.match(/\w/)?.[0];
      if (crateId){
        clonedStacks[stackId].push(crateId);
      }
      stackId += 1;
    }
    return clonedStacks;
  }, []);

const startingStacks = initStacks();

const executeProcedure = (stacks, procedure) => {
  const [crateCount, srcStackId, dstStackId] = procedure.match(/\d+/g).map(Number);
  console.assert([crateCount, srcStackId, dstStackId].every(Number.isFinite));

  const clonedStacks = simpleDeepClone(stacks);
  // remove in-place last {crateCount} crates
  const movingCrates = clonedStacks[srcStackId].splice(-crateCount, crateCount);
  clonedStacks[dstStackId].push(...movingCrates.reverse());
  return clonedStacks;
};

const answer1 = procedures
  .reduce(executeProcedure, startingStacks)
  .filter(Boolean)
  .map((stack) => stack.at(-1))
  .join('');

console.log('answer1', answer1);

const executeProcedure9001 = (stacks, procedure) => {
  const [crateCount, srcStackId, dstStackId] = procedure.match(/\d+/g).map(Number);
  console.assert([crateCount, srcStackId, dstStackId].every(Number.isFinite));

  const clonedStacks = simpleDeepClone(stacks);
  // remove in-place last {crateCount} crates
  const movingCrates = clonedStacks[srcStackId].splice(-crateCount, crateCount);
  clonedStacks[dstStackId].push(...movingCrates);
  return clonedStacks;
};


const answer2 = procedures
  .reduce(executeProcedure9001, startingStacks)
  .filter(Boolean)
  .map((stack) => stack.at(-1))
  .join('');

console.log('answer2', answer2);
