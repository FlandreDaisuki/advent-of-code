#!/usr/bin/env node

const getProblemText = () => {
  if (globalThis.document) {
    return document.body.textContent;
  }
  const filename = process.argv[1].replace(/.*(day\d+)[.]js/, '$1.txt');
  return require('fs').readFileSync(filename, 'utf8');
};

const octopuses2D = getProblemText()
  .split('\n')
  .filter(Boolean)
  .map((line, r) =>
    line.match(/\d/g).map(Number).map((energy, c) => ({ r, c, energy })),
  );

globalThis.draw = function(octopuses) {
  const energy2D = octopuses2D.map((line) => line.map((octopus) => octopus.energy));
  for (const octopus of octopuses) {
    energy2D[octopus.r][octopus.c] = octopus.energy;
  }
  console.log(energy2D.map((line) => line.join(' ')).join('\n'));
};

const R = octopuses2D.length;
const C = octopuses2D[0].length;
const octopuses = octopuses2D.flat();
const get8Neighbors = (octopuses) => (octopus) => {
  const neighbors = [];
  const { r, c } = octopus;
  if (r > 0) neighbors.push(octopuses[(r - 1) * C + c]);
  if (r < R - 1) neighbors.push(octopuses[(r + 1) * C + c]);
  if (c > 0) neighbors.push(octopuses[r * C + c - 1]);
  if (c < C - 1) neighbors.push(octopuses[r * C + c + 1]);
  if (r > 0 && c > 0) neighbors.push(octopuses[(r - 1) * C + c - 1]);
  if (r > 0 && c < C - 1) neighbors.push(octopuses[(r - 1) * C + c + 1]);
  if (r < R - 1 && c > 0) neighbors.push(octopuses[(r + 1) * C + c - 1]);
  if (r < R - 1 && c < C - 1) neighbors.push(octopuses[(r + 1) * C + c + 1]);
  return neighbors;
};

const nextStep = (octopuses) => {
  const nextOctopuses = octopuses.map((octopus) => ({
    ...octopus,
    energy: octopus.energy + 1,
  }));

  const queue = nextOctopuses.filter((octopus) => octopus.energy > 9);
  const toBeFlash = new Set();
  while (queue.length) {
    const flash = queue.shift();
    toBeFlash.add(flash);

    const neighbors = get8Neighbors(nextOctopuses)(flash);
    for (const neighbor of neighbors) {
      neighbor.energy += 1;
      if (neighbor.energy > 9 && !toBeFlash.has(neighbor) && !queue.includes(neighbor)) {
        queue.push(neighbor);
      }
    }
  }
  for (const flash of toBeFlash) {
    flash.energy = 0;
  }
  return {
    flashCount: toBeFlash.size,
    nextOctopuses,
  };
};

const answer1 =
  Array.from({ length: 100 }).reduce((prev) => {
    const { flashCount, nextOctopuses } = nextStep(prev.octopuses);
    return { flashSum: prev.flashSum + flashCount, octopuses: nextOctopuses };
  }, { flashSum: 0, octopuses }).flashSum;
console.log('answer1', answer1);

const answer2 = ((initOctopuses) => {
  let flashCount = 0;
  let octopuses = initOctopuses;
  let counter = 0;
  do {
    counter += 1;
    const result = nextStep(octopuses);
    flashCount = result.flashCount;
    octopuses = result.nextOctopuses;
  } while (flashCount !== octopuses.length);
  return counter;
})(octopuses);
console.log('answer2', answer2);
