const inputText = (this.window ? document.body.textContent : require('fs').readFileSync('day23.txt', 'utf8'))
  .split('\n').filter(Boolean)[0];

const sequence = inputText.split('').map(Number);
const seq = (length, mapFn = (e) => e) => Array.from({ length }, (e, i) => i).map(mapFn);
const mutRotate = (mut) => {
  mut.push(mut.shift());
  return mut;
};
const move = (sequence, count) => {
  const mutSequence = [...sequence];
  const findDist = (target) => {
    if (mutSequence.includes(target)) {
      return target;
    }
    const lesser = mutSequence.filter((e) => e < target);
    return lesser.length > 0 ? Math.max(...lesser) : Math.max(...mutSequence);
  };
  /* eslint-disable-next-line no-unused-vars */
  for (const _ of seq(count)) {
    const pickup = mutSequence.splice(1, 3);
    const current = mutSequence[0];
    const dist = findDist(current - 1);
    mutSequence.splice(mutSequence.indexOf(dist) + 1, 0, ...pickup);
    mutRotate(mutSequence);
  }
  return mutSequence;
};

const part1 = move(sequence, 100);
while (part1[0] !== 1) {
  mutRotate(part1);
}
part1.slice(1).join(''); //answer 1
