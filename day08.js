const inputLines = document.body.textContent.split('\n').filter(Boolean);

const instructions = inputLines.map((line) => {
  const [ins, arg] = line.split(' ');
  return [ins, parseInt(arg)];
});

const run = (instructions) => {
  const visited = new Set;
  let pc = 0, acc = 0;
  while (!visited.has(pc) && pc < instructions.length) {
    visited.add(pc);
    const [ins, arg] = instructions[pc];
    switch (ins) {
    case 'nop': pc += 1; break;
    case 'acc': acc += arg; pc += 1; break;
    case 'jmp': pc += arg; break;
    }
  }
  // [isTerminated, accumulator]
  return [pc >= instructions.length, acc];
};

run(instructions)[1]; // answer 1

instructions.map(([ins, arg], i, a) => {
  if (ins === 'acc') { return; }
  const copied = [...a];
  copied[i] = [ins === 'nop' ? 'jmp' : 'nop', arg];
  const [isTerminated, acc] = run(copied);
  if (!isTerminated) { return; }
  return acc;
}).filter(Boolean)[0]; // answer 2
