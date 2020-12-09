const inputList = document.body.textContent.split(/\s/).filter(Boolean).map(Number);
const preamble = inputList.slice(0, 25);
const sum = (arr) => arr.reduce((a, b) => a + b, 0);
const findSumOfTwo = (list, target) => list.filter((e) => list.includes(target - e));

const validSet = inputList.slice(25).reduce((acc, val) => {
  if (findSumOfTwo([...acc], val).length) {
    acc.add(val);
  }
  return acc;
}, new Set(preamble));

const ans1 = inputList.slice(25).filter((n) => !validSet.has(n))[0]; // answer 1
const weakness = inputList.map((n, i, a) => {
  let offset = i, winSum = 0;
  do {
    offset += 1;
    winSum = sum(a.slice(i, offset));
  } while (offset <= a.length && winSum < ans1);
  return winSum === ans1 ? a.slice(i, offset) : null;
}).filter(Boolean)[0];

Math.max(...weakness) + Math.min(...weakness); // answer 2
