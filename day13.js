const inputList = document.body.textContent.split(/\s/).filter(Boolean);
const timestamp = Number(inputList[0]);
const busServices = inputList[1].split(',').map((e) => Number(e));

busServices
  .filter(Boolean)
  .map((busId) => [busId, busId - timestamp % busId])
  .reduce((a, b) => a[1] < b[1] ? a : b)
  .reduce((a, b) => a * b); // answer 1


// ⚠️ You can't get right answer by Number(float64) in part 2

const mod = (a, b) => (((a) % b) + b) % b; // always return positive
const busServicesWithDelay = busServices.map((e, i) => e ? [BigInt(e), BigInt(mod(e - i, e))] : e).filter(Boolean);
const ChineseRemainder = (list) => {
  const M = list.map((item) => item[0]).reduce((acc, val) => acc * val);
  const T = (a, b) => {
    let i = 0n;
    do {
      i += 1n;
    } while (a * i % b !== 1n);
    return i;
  };
  const N = list
    .map(([q, r]) => {
      const m = M / q;
      const t = T(m, q);
      return m * t * r;
    })
    .reduce((a, b) => a + b);
  return { M, N };
};

(({ M, N }) => (- N / M) * M + N)(ChineseRemainder(busServicesWithDelay)); // answer 2
