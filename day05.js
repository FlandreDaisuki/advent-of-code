const inputSequence = document.body.textContent.split(/,/).filter(Boolean).map(Number);

const sum2 = (a, b) => a + b;
const mul2 = (a, b) => a * b;
const nz = (a) => a !== 0;
const z = (a) => !nz(a);
const le = (a, b) => a < b;
const eq = (a, b) => a === b;
const parse = (op) => {
  // ABCDE

  const DE = op % 100; // raw op
  const C = Math.floor(op / 100) % 10;
  const B = Math.floor(op / 1000) % 10;
  const A = Math.floor(op / 10000) % 10;

  if ([1, 2, 7, 8].includes(DE)) {
    return [DE, C, B, A];
  }

  if ([3, 4].includes(DE)) {
    return [DE, C];
  }

  if ([5, 6].includes(DE)) {
    return [DE, C, B];
  }

  if (DE === 99) {
    return [DE];
  }
};

const run = (sequence, input) => {
  const seq = [...sequence];
  let output = null;
  const mode = (m) => (pc) => m === 0 ? seq[seq[pc]] : seq[pc];
  const exec = (instruction) => {
    const [op, ...modes] = instruction;

    if ([1, 2].includes(op)) {
      const fn = op === 1 ? sum2 : mul2;
      const [m1, m2, m3] = modes;
      console.assert(m3 === 0);
      seq[seq[pc + 3]] = fn(mode(m1)(pc + 1), mode(m2)(pc + 2));
      return pc + instruction.length;
    }

    if ([3, 4].includes(op)) {
      if (op === 3) {
        seq[seq[pc + 1]] = input;
      } else {
        output = seq[seq[pc + 1]];
      }
      return pc + instruction.length;
    }

    if ([5, 6].includes(op)) {
      const fn = op === 5 ? nz : z;
      const [m1, m2] = modes;

      if (fn(mode(m1)(pc + 1))) {
        return mode(m2)(pc + 2);
      }

      return pc + instruction.length;
    }

    if ([7, 8].includes(op)) {
      const fn = op === 7 ? le : eq;
      const [m1, m2, m3] = modes;
      console.assert(m3 === 0);
      seq[seq[pc + 3]] = fn(mode(m1)(pc + 1), mode(m2)(pc + 2)) ? 1 : 0;
      return pc + instruction.length;
    }

    if (op === 99) {
      return Infinity;
    }

    throw new Error(`Unknown operator: ${op}`);
  };

  let pc = 0;
  while (pc < sequence.length) {
    pc = exec(parse(seq[pc]));
  }
  return output;
};

run(inputSequence, 1); // answer 1
run(inputSequence, 5); // answer 2
