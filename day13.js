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

// check each bus id is coprime to others by 👀
const busServicesWithDelay = busServices.map((e, i) => {
  if (e) {
    return [BigInt(e), BigInt(mod(e - i, e))];
  }
}).filter(Boolean);

// Chinese Remainder Theorem
// Assume m[1], m[2], ..., m[i] are coprime to each other and have solution
//
// (S) : { x ≡ a[1] (mod m[1])
//       { x ≡ a[2] (mod m[2])
//       {   ⋮
//       { x ≡ a[i] (mod m[i])
// M = m[1] × m[2] × ... × m[i], ∀i∈ℤ+
// w[i] := M / m[i]
// t[i] := t[i] × w[i] ≡ 1 (mod m[i]), ∀i∈ℤ+
// x = a[1] × t[1] × w[1] + a[2] × t[2] × w[2] + … + a[i] × t[i] × w[i] + kM
//   = N + kM, k∈ℤ

const ChineseRemainder = (list) => {
  const M = list.map((item) => item[0]).reduce((acc, val) => acc * val);
  const T = (a, b) => {
    // t * a ≡ 1 (mod b)
    let t = 0n;
    do {
      t += 1n;
    } while (a * t % b !== 1n);
    return t;
  };
  const N = list
    .map(([m, a]) => {
      // x ≡ a (mod m)
      const w = M / m;
      const t = T(w, m);
      return w * t * a;
    })
    .reduce((a, b) => a + b);

  // x = N + kM, k∈ℤ
  return { M, N };
};

// ⌊(0 - N) / M⌋ × M + N
(({ M, N }) => (- N / M) * M + N)(ChineseRemainder(busServicesWithDelay)); // answer 2
