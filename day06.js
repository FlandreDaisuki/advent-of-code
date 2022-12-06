#!/usr/bin/env node

const getProblemText = () => {
  if (globalThis.document) {
    return document.body.textContent;
  }
  const filename = process.argv[1].replace(/.*(day\d+)[.]js/, '$1.txt');
  return require('fs').readFileSync(filename, 'utf8');
};

/** @param {number} length */
const range = (length) => Array.from({ length }, (_, i) => i);

const stream = getProblemText().trim();

const findFirstMarker = (markerSize) => (stream) =>
  range(stream.length).reduce((markerIdx, startIdx) => {
    if (markerIdx >= 0) { return markerIdx; }

    const substr = stream.slice(startIdx, startIdx + markerSize);
    if (new Set(substr).size === markerSize) {
      return startIdx + markerSize;
    }

    return -1;
  }, -1);


const answer1 = findFirstMarker(4)(stream);

console.log('answer1', answer1);

const answer2 = findFirstMarker(14)(stream);

console.log('answer2', answer2);
