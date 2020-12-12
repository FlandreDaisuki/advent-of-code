const inputList = document.body.textContent.split(/\s/).filter(Boolean);

const actions = inputList.map((action) => [action[0], Number(action.slice(1))]);

const DIRECTION = {
  E: [0, 1], W: [0, -1],
  N: [1, 1], S: [1, -1],
};

const ROTATION = {
  R: (curr, degree) => (curr + degree / 90) % 4,
  L: (curr, degree) => (curr + 4 - degree / 90) % 4,
};

const CLOCKWISE = ['E', 'S', 'W', 'N'];

actions
  .reduce((state, [act, val]) => {
    if (DIRECTION[act]) {
      const [i, s] = DIRECTION[act];
      state[i] += val * s;
    } else if (ROTATION[act]) {
      state[2] = ROTATION[act](state[2], val);
    } else { // F
      const [i, s] = DIRECTION[CLOCKWISE[state[2]]];
      state[i] += val * s;
    }
    return state;
  }, [0, 0, 0] /* x, y, d */)
  .slice(0, 2)
  .reduce((acc, val) => acc + Math.abs(val), 0); // answer 1

const clockwiseRotate = ([x, y], degree) => {
  switch ((degree + 360) % 360) {
  case 90: return [y, -x];
  case 180: return [-x, -y];
  case 270: return [-y, x];
  default: return [x, y];
  }
};

actions
  .reduce(([ship, wp], [act, val]) => {
    if (DIRECTION[act]) {
      const [i, s] = DIRECTION[act];
      wp[i] += val * s;
    } else if (ROTATION[act]) {
      const sign = act === 'R' ? 1 : -1;
      wp = clockwiseRotate(wp, sign * val);
    } else { // F
      ship = ship.map((p, i) => p + wp[i] * val);
    }
    return [ship, wp];
  }, [[0, 0], [10, 1]] /* ship (x, y), waypoint (x, y) */)
  .shift()
  .reduce((acc, val) => acc + Math.abs(val), 0); // answer 2
