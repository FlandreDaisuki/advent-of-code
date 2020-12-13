const inputList = document.body.textContent.split(/\s/).filter(Boolean);
const timestamp = Number(inputList[0]);
const busServices = inputList[1].split(',').map((e) => Number(e));

busServices
  .filter(Boolean)
  .map((busId) => [busId, busId - timestamp % busId])
  .reduce((a, b) => a[1] < b[1] ? a : b)
  .reduce((a, b) => a * b); // answer 1


// ⚠️ You can't get right answer by Number(float64) in part 2

// check each bus id is coprime to others by 👀
const busServicesWithDelay = busServices.map((e, i) => {
  if (e) {
    return [BigInt(e), BigInt(e - i)];
  }
}).filter(Boolean);

// Extended Euclidean Algorithm
// ax + by = gcd(a, b) = 1
// ax + by ≡ ax (mod b) ≡ 1 (mod b)
const egcd = (a, b) => {
  if (b === 0n) {
    return [a, 1n, 0n];
  }
  const [g, x, y] = egcd(b, a % b);
  return [g, y, x - (a / b) * y];
};

// ref: https://stackoverflow.com/a/9758173
const modinv = (a, m) => {
  const [g, x, y] = egcd(a, m);
  if (g !== 1n) {
    throw new Error(`No result of modinv(${[a, m]})`);
  }
  return x % m;
};

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
  const N = list
    .map(([m, a]) => {
      // x ≡ a (mod m)
      const w = M / m;
      const t = modinv(w, m);
      return w * t * a;
    })
    .reduce((a, b) => a + b);

  // x = N + kM, k∈ℤ
  return { M, N };
};

// ⌊(0 - N) / M⌋ × M + N
(({ M, N }) => (- N / M) * M + N)(ChineseRemainder(busServicesWithDelay)); // answer 2
