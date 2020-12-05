const inputList = document.body.textContent.split(/\s/).filter(Boolean).map(Number);

const sum = (...arr) => arr.flat(Infinity).reduce((prev, curr) => prev + curr);

sum(...inputList.map((n) => Math.floor(n / 3) - 2)); // answer 1

const fuel = (n) => {
  const f = Math.floor(n / 3) - 2;
  return f < 0 ? 0 : f + fuel(f);
};

sum(...inputList.map(fuel)); // answer 2
