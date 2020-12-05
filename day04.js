const inputRange = document.body.textContent.split('-').map(Number);

const [lb, hb] = inputRange;

Array.from({ length: hb - lb + 1 })
  .map((_, i) => i + lb)
  .filter((n) => /(\d)\1/.test(n) && [...String(n)].sort().join('') === String(n))
  .length; // answer 1

Array.from({ length: hb - lb + 1 })
  .map((_, i) => i + lb)
  .filter((n) => String(n).match(/(\d)\1+/g)?.some((s) => s.length === 2) && [...String(n)].sort().join('') === String(n))
  .length; // answer 2
