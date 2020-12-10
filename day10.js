const inputList = document.body.textContent.split(/\s/).filter(Boolean).map(Number);

const sorted = inputList.sort((a, b) => a - b);

[0, ...sorted]
  .map((e, i, a) => i > 0 ? e - a[i - 1] : 3)
  .reduce((acc, val) => {
    acc[val] = (acc[val] ?? 0) + 1;
    return acc;
  }, [])
  .reduce((m, n) => m * n, 1); // answer 1

sorted.reduce((lookup, value) => {
  lookup[value] = Array.from({ length: 3 }, (e, i) => lookup[value - i - 1])
    .filter(Boolean)
    .reduce((a, b) => a + b, 0);
  return lookup;
}, [1]).pop(); // answer 2
