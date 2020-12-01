const inputList = document.body.textContent.split(/\s/).filter(Boolean).map(Number);
const findSumOfTwo = (list, target) => list.filter((e) => list.includes(target - e));
const multiplyAll = (...arr) => arr.flat(Infinity).reduce((prev, curr) => prev * curr);

multiplyAll(findSumOfTwo(inputList, 2020)); // answer
