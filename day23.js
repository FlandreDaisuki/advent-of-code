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

const debug = (cup, count) => {
  const s = [];
  while (cup && count) {
    s.push(cup.label);
    cup = cup.next;
    count -= 1;
  }
  console.debug(String(s));
};

const CUP_TOTAL = 1000000;
const circleLinkList = seq(CUP_TOTAL + 1) // ignore [0]
  .map((label) => ({ label, next: null }))
  .map((cup, i, a) => {
    cup.next = a[i + 1] ?? a[1];
    return cup;
  });

sequence.forEach((label, i, a) => {
  const nextLabel = a[i + 1] ?? sequence.length + 1;
  if (!i) {
    circleLinkList[CUP_TOTAL].next = circleLinkList[label];
  }
  circleLinkList[label].next = circleLinkList[nextLabel];
});

debug(circleLinkList[CUP_TOTAL], 30);

const linkListMove = (ll, count) => {
  let currentCup = ll[CUP_TOTAL].next;

  /* eslint-disable-next-line no-unused-vars */
  for (const _ of seq(count)) {
    const pickupCups = [currentCup.next, currentCup.next.next, currentCup.next.next.next];
    currentCup.next = pickupCups[2].next;

    const pickupLabels = pickupCups.map((cup) => cup.label);
    let destLabel = currentCup.label - 1;
    while (destLabel < 1 || pickupLabels.includes(destLabel)) {
      destLabel = destLabel > 1 ? (destLabel - 1) : CUP_TOTAL;
    }

    const destCup = ll[destLabel] ?? ll[CUP_TOTAL];
    const destCupNext = destCup.next;
    destCup.next = pickupCups[0];
    pickupCups[2].next = destCupNext;

    currentCup = currentCup.next;
  }

  return ll;
};

linkListMove(circleLinkList, 10000000);

circleLinkList[1].next.label * circleLinkList[1].next.next.label; // answer 2
