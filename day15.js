const inputList = '9,19,1,6,0,5,4'.split(',').map(Number);

const seq = (length, mapFn = (e, i) => i) => Array.from({ length }, mapFn);

seq(2020).reduce((list, idx) => {
  if (list[idx] === undefined) {
    const prev = list[idx - 1];
    const found = list.map((e, i) => prev === e ? i : -1).filter((e) => e >= 0);
    if (found.length < 2) {
      list.push(0);
    } else {
      const [preLastIdx, lastIdx] = found.slice(-2);
      list.push(lastIdx - preLastIdx);
    }
  }
  return list;
}, inputList).slice(-1)[0]; // answer 1

console.time('part2');
seq(30000000).reduce((state, idx) => {
  let val;
  if (inputList[idx] !== undefined) {
    val = inputList[idx];
  } else if (!state.cache.get(state.prev) || state.cache.get(state.prev).length < 2) {
    val = 0;
  } else {
    const [last2, last1] = state.cache.get(state.prev);
    val = last1 - last2;
  }

  state.cache.set(val, (state.cache.get(val) ?? []).concat([idx]).slice(-2));
  state.prev = val;
  return state;
}, { cache: new Map, prev: null }).prev; // answer 2
console.timeEnd('part2');

// time cost ~ 22s on nodejs
// time cost ~ 33s on firefox cold start at about:blank with warning 3 times script too slow
