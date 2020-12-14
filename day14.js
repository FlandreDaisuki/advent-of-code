const inputList = document.body.textContent.split(/\n/).filter(Boolean);

const seq = (length, mapFn = (e, i) => i) => Array.from({ length }, mapFn);
const intToBitArray = (int, length = 36) => [...int.toString(2).padStart(length, 0)];
const bitArrayToInt = (bin) => parseInt(bin.join(''), 2);

const run1 = (init) => inputList.reduce((state, instruction) => {
  if (instruction.startsWith('mask')) {
    state.mask = instruction.replace(/mask = /, '');
  } else {
    const [addr, value] = instruction.match(/mem\[(\d+)\] = (\d+)/)?.slice(1).map(Number);
    const after = [...state.mask].reduce((acc, bit, idx) => {
      if ('01'.includes(bit)) {
        acc[idx] = bit;
      }
      return acc;
    }, intToBitArray(value));
    state.memory[addr] = bitArrayToInt(after);
  }
  return state;
}, init);

Object.values(run1({ mask: '', memory: {} }).memory).reduce((a, b) => a + b); // answer 1

const run2 = (init) => inputList.reduce((state, instruction) => {
  if (instruction.startsWith('mask')) {
    state.mask = instruction.replace(/mask = /, '');
  } else {
    const [addr, value] = instruction.match(/mem\[(\d+)\] = (\d+)/)?.slice(1).map(Number);
    const floatingAddr = [...state.mask].reduce((acc, bit, idx) => {
      if ('1X'.includes(bit)) {
        acc[idx] = bit;
      }
      return acc;
    }, intToBitArray(addr));
    const floatingIndexes = floatingAddr.map((bit, idx) => bit === 'X' ? idx : null).filter((x) => x !== null);
    const floatingCount = floatingIndexes.length;
    seq(1 << floatingCount)
      .map((counter) => {
        const bits = intToBitArray(counter, floatingCount);
        const copied = [...floatingAddr];
        floatingIndexes.forEach((fi, bi) => copied[fi] = bits[bi]);
        return bitArrayToInt(copied);
      })
      .forEach((addr) => {
        state.memory[addr] = value;
      });
  }
  return state;
}, init);

Object.values(run2({ mask: '', memory: {} }).memory).reduce((a, b) => a + b); // answer 2
