const inputTwoPaths = document.body.textContent.split('\n').filter(Boolean).map((seq) => seq.split(','));

const steps = function*(point, dir, length) {
  const axis = 'LR'.includes(dir) ? 0 : 1;
  const sign = 'UR'.includes(dir) ? 1 : -1;

  /* eslint-disable-next-line no-unused-vars */
  for (const _ of Array.from({ length })) {
    point[axis] += sign;
    yield String(point);
  }
};

const track = (path) => {
  const p = [0, 0];
  const fp = [];

  for (const vec of path) {
    for (const step of steps(p, vec[0], parseInt(vec.slice(1)))) {
      fp.push(step);
    }
  }

  return fp;
};

const intersect = (t1, t2) => {
  const s1 = new Set(t1), s2 = new Set(t2);
  return [...s1].filter((e) => s2.has(e));
};
const sum = (arr) => arr.reduce((a, b) => a + b);
const min = (arr) => Math.min(...arr);
const p2xy = (p) => p.split(',').map(Number);
const footprints = inputTwoPaths.map(track);
const intersects = intersect(...footprints);

min(intersects.map((p) => p2xy(p).map(Math.abs)).map(sum)); // answer 1

min(intersects.map((p) => footprints.map((fp) => fp.indexOf(p))).map(sum)); // answer 2
