const fs = require('fs');
const inputState = fs.readFileSync('day17.txt', 'utf8')
  .split('\n').filter(Boolean)
  .map((row) => row.split('').filter(Boolean));

const seq = (length, mapFn = (e, i) => i) => Array.from({ length }, mapFn);
const emptySlice = (dim) => seq(dim, () => seq(dim, () => '.'));
const paddingSlice = (slice) => {
  const dim = slice.length;
  const target = emptySlice(dim + 2);
  for (const x of seq(dim + 1).map((i) => i - 1)) {
    for (const y of seq(dim + 1).map((i) => i - 1)) {
      if (slice[x]?.[y]) {
        target[x + 1][y + 1] = slice[x][y];
      }
    }
  }
  return target;
};
const cubeNeighbors = (cube, x, y, z) => {
  const neighbors = [];
  for (const i of [-1, 0, 1]) {
    for (const j of [-1, 0, 1]) {
      for (const k of [-1, 0, 1]) {
        if ((i || j || k) && cube[x + i]?.[y + j]?.[z + k]) {
          neighbors.push(cube[x + i][y + j][z + k]);
        }
      }
    }
  }
  return neighbors;
};

const countStateActive = (state) => state.flat(Infinity).filter((grid) => grid === '#').length;

const cycle = (state, times) => {
  if (!times) { return state; }
  const dim = state[0].length;
  const paddingState = [emptySlice(dim), ...state, emptySlice(dim)].map((slice) => paddingSlice(slice));
  const nextState = seq(paddingState.length, () => emptySlice(dim + 2));

  for (const z of seq(paddingState.length)) {
    const slice = paddingState[z];
    for (const y of seq(slice.length)) {
      for (const x of seq(slice.length)) {
        const neighbors = cubeNeighbors(paddingState, z, y, x);
        const activeCount = countStateActive(neighbors);
        if (paddingState[z][y][x] === '#' && ![2, 3].includes(activeCount)) {
          nextState[z][y][x] = '.';
        } else if (paddingState[z][y][x] === '.' && activeCount === 3) {
          nextState[z][y][x] = '#';
        } else {
          nextState[z][y][x] = paddingState[z][y][x];
        }
      }
    }
  }

  return cycle(nextState, times - 1);
};

const visualizeState = (state) => {
  let z = 0;
  for (const slice of state) {
    const sliceVis = slice.map((row) => row.join('')).join('\n');
    console.log('z =', z);
    console.log(sliceVis);
    console.log();
    console.log();
    z++;
  }
};

countStateActive(cycle([inputState], 6)); // answer 1
