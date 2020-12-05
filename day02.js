const inputSequence = document.body.textContent.split(/,/).filter(Boolean).map(Number);

const run = (input, noun, verb) => {
  const seq = [...input];
  seq[1] = noun;
  seq[2] = verb;

  let pc = 0;
  while (pc < input.length) {
    const op = seq[pc];
    switch (op) {
    case 1:
      seq[seq[pc + 3]] = seq[seq[pc + 1]] + seq[seq[pc + 2]];
      pc += 4;
      break;
    case 2:
      seq[seq[pc + 3]] = seq[seq[pc + 1]] * seq[seq[pc + 2]];
      pc += 4;
      break;
    case 99:
      pc = Infinity;
      break;
    default:
      throw new Error(`Unknown operator: ${op}`);
    }
  }
  return seq;
};

run(inputSequence, 12, 2)[0]; // answer 1

Array(10000).fill().map((_, i) => i).filter((nv) => {
  const verb = nv % 100;
  const noun = (nv - verb) / 100;
  return run(inputSequence, noun, verb)[0] === 19690720;
})[0]; // answer 2
