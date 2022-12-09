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

const simpleDeepClone = (o) => JSON.parse(JSON.stringify(o));


/** @param {string} text */
const splitLines = (text, separator = '\n') => text.split(separator)
  .map((line) => line.trim())
  .filter(Boolean);

const steps = splitLines(getProblemText())
  .map((line) => {
    const [dir, numStr] = line.split(' ');
    return { dir, n: Number(numStr) };
  });

const point = (x, y) => ({ x, y });

const initState = { H: point(0, 0), T: point(0, 0), footprints: [point(0, 0)] };


const isTNeedMove = (g, t) => {
  return Math.abs(g.x - t.x) > 1 || Math.abs(g.y - t.y) > 1;
};

const moveOnce = (g, t) => {
  const Δx = Math.sign(g.x - t.x);
  const Δy = Math.sign(g.y - t.y);
  return point(t.x + Δx, t.y + Δy);
};

const getGoalAfterStep = (H, step) => {
  switch (step.dir) {
    case 'U': return point(H.x, H.y + step.n);
    case 'D': return point(H.x, H.y - step.n);
    case 'R': return point(H.x + step.n, H.y);
    case 'L': return point(H.x - step.n, H.y);
    default: throw new Error('Unknown direction of step');
  }
};

const executeStep = (state, step) => {
  const g = getGoalAfterStep(state.H, step);
  const footprints = [];
  let t = state.T;
  while (isTNeedMove(g, t)) {
    const τ = moveOnce(g, t);
    footprints.push(τ);
    t = τ;
  }

  return {
    H: g, T: t, footprints: state.footprints.concat(footprints),
  };
};

const dedupeFootprint = (footprints) => {
  return Array.from(
    new Set(
      footprints.map((fp) => String([fp.x, fp.y])),
    ),
  );
};

const answer1 = dedupeFootprint(steps.reduce(
  executeStep,
  simpleDeepClone(initState),
).footprints).length;

console.log('answer1', answer1);

const isTheSamePoint = (p, q) => p.x === q.x && p.y === q.y;

const generateFootprintsOfAllKnots = (numOfKnots) => range(numOfKnots).reduce((footprintsOfKnots, nthTail) => {

  // generate H footprints
  if (nthTail === 0) {
    const footprintsAfterSteps = steps.reduce((state, step) => {
      const g = getGoalAfterStep(state.H, step);
      const footprints = [];
      let h = state.H;
      while (!isTheSamePoint(g, h)){
        const η = moveOnce(g, h);
        footprints.push(η);
        h = η;
      }

      return {
        H: g, footprints: state.footprints.concat(footprints),
      };
    }, { H: point(0, 0), footprints: [point(0, 0)] }).footprints;

    return footprintsOfKnots.concat([footprintsAfterSteps]);
  }

  const lastKnotFootprints = footprintsOfKnots.at(-1);

  const footprintsAfterSteps = lastKnotFootprints.reduce((state, g) => {
    const footprints = [];
    if (isTNeedMove(g, state.T)) {
      const τ = moveOnce(g, state.T);
      footprints.push(τ);
      return { T: τ, footprints: state.footprints.concat(footprints) };
    }
    else {
      return state;
    }
  }, { T: point(0, 0), footprints: [point(0, 0)] }).footprints;

  return footprintsOfKnots.concat([footprintsAfterSteps]);
}, []);

const footprintsOfAllKnots = generateFootprintsOfAllKnots(10);

console.log('answer2', dedupeFootprint(footprintsOfAllKnots.at(-1)).length);

console.log('answer1 by method2', dedupeFootprint(generateFootprintsOfAllKnots(2).at(-1)).length);
