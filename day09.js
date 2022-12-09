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

/**
 * @template T
 * @type {(compare: (a:T, b:T) => boolean) => (arr: T[]) => T[]}
 */
const dedupe = (compare) => (arr) => {
  return arr.filter((item, index) => {
    return arr.findIndex((other) => compare(item, other)) === index;
  });
};

const simpleDeepClone = (o) => JSON.parse(JSON.stringify(o));

/** @param {string} text */
const splitLines = (text, separator = '\n') => text.split(separator)
  .map((line) => line.trim())
  .filter(Boolean);


const motions = splitLines(getProblemText())
  .map((line) => {
    const [dir, numStr] = line.split(' ');
    return { dir, n: Number(numStr) };
  });

const point = (x, y) => ({ x, y });

const initState = { H: point(0, 0), T: point(0, 0), footprints: [point(0, 0)] };

const shouldTNeedMove = (g, t) => {
  return Math.abs(g.x - t.x) > 1 || Math.abs(g.y - t.y) > 1;
};

const moveStep = (g, t) => {
  const Δx = Math.sign(g.x - t.x);
  const Δy = Math.sign(g.y - t.y);
  return point(t.x + Δx, t.y + Δy);
};

const getGoalAfterMotion = (H, motion) => {
  switch (motion.dir) {
    case 'U': return point(H.x, H.y + motion.n);
    case 'D': return point(H.x, H.y - motion.n);
    case 'R': return point(H.x + motion.n, H.y);
    case 'L': return point(H.x - motion.n, H.y);
    default: throw new Error('Unknown direction of motion');
  }
};

const executeMotion = (state, motion) => {
  const g = getGoalAfterMotion(state.H, motion);
  const footprints = [];

  let t = state.T;
  while (shouldTNeedMove(g, t)) {
    const τ = moveStep(g, t);
    footprints.push(τ);
    t = τ;
  }

  return {
    H: g, T: t, footprints: state.footprints.concat(footprints),
  };
};

const isTheSamePoint = (p, q) => p.x === q.x && p.y === q.y;
const dedupeFootprints = dedupe(isTheSamePoint);

const answer1 = dedupeFootprints(motions.reduce(
  executeMotion,
  simpleDeepClone(initState),
).footprints).length;

console.log('answer1', answer1);


const generateFootprintsOfAllKnots = (numOfKnots) => range(numOfKnots).reduce((footprintsOfKnots, nthTail) => {

  // generate H footprints
  if (nthTail === 0) {
    const footprintsAfterSteps = motions.reduce((state, motion) => {
      const g = getGoalAfterMotion(state.H, motion);
      const footprints = [];

      let h = state.H;
      while (!isTheSamePoint(g, h)){
        const η = moveStep(g, h);
        footprints.push(η);
        h = η;
      }

      return {
        H: g, footprints: state.footprints.concat(footprints),
      };
    }, { H: point(0, 0), footprints: [point(0, 0)] }).footprints;

    return footprintsOfKnots.concat([footprintsAfterSteps]);
  }

  const footprintsAfterSteps = footprintsOfKnots.at(-1).reduce((state, g) => {
    const footprints = [];
    if (shouldTNeedMove(g, state.T)) {
      const τ = moveStep(g, state.T);
      footprints.push(τ);
      return { T: τ, footprints: state.footprints.concat(footprints) };
    }
    else {
      return state;
    }
  }, { T: point(0, 0), footprints: [point(0, 0)] }).footprints;

  return footprintsOfKnots.concat([footprintsAfterSteps]);
}, []);

console.log('answer2', dedupeFootprints(generateFootprintsOfAllKnots(10).at(-1)).length);

console.log('answer1 by method2', dedupeFootprints(generateFootprintsOfAllKnots(2).at(-1)).length);
