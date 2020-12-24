const inputText = (this.window ? document.body.textContent : require('fs').readFileSync('day24.txt', 'utf8'))
  .split('\n').filter(Boolean);

//           v
//       *       *
//   *               *
//   *               *
//   *       o       u
//   *               *
//   *               *
//       *       *
//           *

// e (+2u, 0) ne (+u, +v) se (+u, -v)
// w (-2u, 0) nw (-u, +v) sw (-u, -v)

const DIRECTION_MAP = {
  e: [2, 0],
  ne: [1, 1],
  se: [1, -1],
  w: [-2, 0],
  nw: [-1, 1],
  sw: [-1, -1],
};

const flipCounter = inputText.map((route) => {
  const directions = route.match(/[ns]?[ew]/g);
  const coordinate = directions
    .map((dir) => DIRECTION_MAP[dir])
    .reduce((pos, vec) => [pos[0] + vec[0], pos[1] + vec[1]], [0, 0]);
  return coordinate;
}).reduce((count, coordinate) => {
  const k = String(coordinate);
  count[k] = (count[k] ?? 0) + 1;
  return count;
}, {});

Object.values(flipCounter).filter((count) => count & 1).length; // answer 1

const seq = (length, mapFn = (e) => e) => Array.from({ length }, (e, i) => i).map(mapFn);
const neighborOf = (coordinate) => {
  const p = coordinate.split(',').map(Number);
  return Object.values(DIRECTION_MAP).map((dir) => String([p[0] + dir[0], p[1] + dir[1]]));
};
const flip = (blackTiles, times) => {
  let mutBlackTiles = [...blackTiles];
  /* eslint-disable-next-line no-unused-vars */
  for (const _ of seq(times)) {
    const nextBlackTiles = [];
    const nextEffectTiles = new Set(mutBlackTiles.map(neighborOf).flat(1).concat(mutBlackTiles));
    for (const tile of nextEffectTiles) {
      const isBlack = mutBlackTiles.includes(tile);
      const nearBlackCount = neighborOf(tile).filter((coordinate) => mutBlackTiles.includes(coordinate)).length;
      const rule1 = isBlack && [1, 2].includes(nearBlackCount);
      const rule2 = !isBlack && nearBlackCount === 2;
      if (rule1 || rule2) {
        nextBlackTiles.push(tile);
      }
    }
    mutBlackTiles = nextBlackTiles;
  }
  return mutBlackTiles;
};

const blackTiles = Object.entries(flipCounter)
  .map(([coordinateString, count]) => (count & 1) && coordinateString)
  .filter(Boolean);

flip(blackTiles, 100).length; // answer 2
