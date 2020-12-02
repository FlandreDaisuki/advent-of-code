const inputList = document.body.textContent.split(/\s/).filter(Boolean).map(Number);

const findSumOfTwo = (list, target) => list.filter((e) => list.includes(target - e));
const multiplyAll = (...arr) => arr.flat(Infinity).reduce((prev, curr) => prev * curr);

multiplyAll(findSumOfTwo(inputList, 2020)); // answer 1

const leftSumOfThree = (list, target) => list.filter((e, i) => {
  const left2 = target - e;
  const cloned = Array.from(list);
  cloned.splice(i, 1);
  const found = findSumOfTwo(cloned, left2);
  return found.length;
});

multiplyAll(leftSumOfThree(inputList, 2020)); // answer 2
