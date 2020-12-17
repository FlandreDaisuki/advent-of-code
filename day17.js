const inputState = document.body.textContent
  .split('\n').filter(Boolean)
  .map((row) => row.split('').filter(Boolean));

const seq = (length, mapFn = (e, i) => i) => Array.from({ length }, mapFn);
const equal = (a) => (b) => a === b;
const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));
const Tensor = {
  shapes: (tensor) => {
    let mutable = [[...tensor]];
    const shape = [];
    while (Array.isArray(mutable[0])) {
      const dim = mutable[0].length;
      if (mutable.some((row) => row.length !== dim)) {
        throw new Error('Tensor is not dimension aligned.');
      }
      shape.push(dim);
      mutable = mutable.flat(1);
    }
    return shape;
  },
  empty: (shape) => shape.reduceRight((acc, dim) => {
    if (!acc.length) {
      return seq(dim, () => '.');
    } else {
      return seq(dim, () => deepCopy(acc));
    }
  }, []),
  pad: (tensor) => {
    const shape = Tensor.shapes(tensor);
    if (shape.length === 1) {
      return ['.', ...tensor, '.'];
    }
    const padded = tensor.map(Tensor.pad);
    const empty = Tensor.empty(Tensor.shapes(padded[0]));
    return [empty, ...padded, empty];
  },
  count: (tensor, fn) => tensor.flat(Infinity).filter(fn).length,
  set: (tensor, point, value) => point.reduce((t, p) => {
    if (Array.isArray(t[p])) {
      return t[p];
    } else {
      t[p] = value;
    }
  }, tensor),
  get: (tensor, point) => point.reduce((t, p) => t?.[p], tensor),
  *shapeIter(shape) {
    if (shape.length === 1) {
      for (const i of seq(shape)) {
        yield [i];
      }
    }
    const [axis, ...rest] = shape;
    for (const i of seq(axis)) {
      for (const j of Tensor.shapeIter(rest)) {
        yield [i, j].flat(Infinity);
      }
    }
  },
  view: (tensor) => {
    const shape = Tensor.shapes(tensor);
    if (shape.length === 1) {
      console.log(tensor.join(''));
    } else if (shape.length === 2) {
      console.log(tensor.map((row) => row.join('')).join('\n'));
    } else {
      const hyperShape = shape.slice(0, -2);
      for (const point of Tensor.shapeIter(hyperShape)) {
        console.log(`( ${point.join(', ')} )`);
        console.log(Tensor.get(tensor, point).map((row) => row.join('')).join('\n'));
      }
    }
  },
};

function *cubeNeighborGenerator(point) {
  for (const offsetPlusOne of Tensor.shapeIter(seq(point.length, () => 3))) {
    const offset = offsetPlusOne.map((i) => i - 1);
    if (offset.some(Boolean)) {
      yield point.map((e, i) => e + offset[i]);
    }
  }
}

const cycle = (tensor, times) => {
  if (!times) { return tensor; }
  const padded = Tensor.pad(tensor);
  const paddedShape = Tensor.shapes(padded);
  const next = Tensor.empty(paddedShape);

  const getPadded = (point) => Tensor.get(padded, point);
  const setNext = (point, value) => Tensor.set(next, point, value);

  for (const point of Tensor.shapeIter(paddedShape)) {
    const neighborCoordinates = [...cubeNeighborGenerator(point)];
    const neighbors = neighborCoordinates.map(getPadded);
    const activeCount = Tensor.count(neighbors, equal('#'));
    const current = getPadded(point);

    if (current === '#' && ![2, 3].includes(activeCount)) {
      setNext(point, '.');
    } else if (current === '.' && activeCount === 3) {
      setNext(point, '#');
    } else {
      setNext(point, current);
    }
  }

  return cycle(next, times - 1);
};
console.time('part 1');
Tensor.count(cycle([inputState], 6), equal('#')); // answer 1
// time cost ~ 0.95s on nodejs
// time cost ~ 1.7s on firefox
console.timeEnd('part 1');

console.time('part 2');
Tensor.count(cycle([[inputState]], 6), equal('#')); // answer 2
// time cost ~ 36s on nodejs
// time cost ~ 59.5s on firefox cold start at about:blank with warning 5 times script too slow
console.timeEnd('part 2');
