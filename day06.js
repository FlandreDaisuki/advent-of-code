const inputChunks = document.body.textContent.split('\n\n').filter(Boolean);
const sum = (arr) => arr.reduce((prev, curr) => prev + curr);

sum(inputChunks.map((group) => new Set(group.replace(/\n/g, '')).size)); // answer 1

const groups = inputChunks.map((group) => group.trim().split('\n'));
const intersect = (a1, a2) => {
  const s1 = new Set(a1), s2 = new Set(a2);
  return [...s1].filter((e) => s2.has(e));
};
const intersectAll = (arr) => arr.reduce(intersect);

sum(groups.map((group) => intersectAll(group).length)); // answer 2
