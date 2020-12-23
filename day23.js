const inputText = (this.window ? document.body.textContent : require('fs').readFileSync('day23.txt', 'utf8'))
  .split('\n').filter(Boolean)[0];

const sequence = inputText.split('').map(Number);
const seq = (length, mapFn = (e) => e) => Array.from({ length }, (e, i) => i).map(mapFn);
const mutRotate = (mut) => {
  mut.push(mut.shift());
  return mut;
};
const findDist = (target, sequence) => {
  if (sequence.includes(target)) {
    return target;
  }
  const lesser = sequence.filter((e) => e < target);
  return lesser.length > 0 ? lesser.reduce((a, b) => Math.max(a, b)) : sequence.reduce((a, b) => Math.max(a, b));
};
const rotateUntil = (label, sequence) => {
  const i = sequence.indexOf(label);
  return sequence.slice(i).concat(sequence.slice(0, i));
};
const move = (sequence, count) => {
  const mutSequence = [...sequence];
  /* eslint-disable-next-line no-unused-vars */
  for (const _ of seq(count)) {
    const pickup = mutSequence.splice(1, 3);
    const current = mutSequence[0];
    const dist = findDist(current - 1, mutSequence);
    mutSequence.splice(mutSequence.indexOf(dist) + 1, 0, ...pickup);
    mutRotate(mutSequence);
  }
  return mutSequence;
};

rotateUntil(1, move(sequence, 100)).slice(1).join(''); //answer 1

const bigSequence = sequence.concat(seq(1000000 - sequence.length, (i) => i + 1 + sequence.length));
rotateUntil(1, move(bigSequence, 10000000)).slice(1, 3).reduce((a, b) => a * b); // maybe answer 2 ???????????????
