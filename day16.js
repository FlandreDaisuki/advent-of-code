const [fieldsInput, selfTicketInput, nearbyTicketInput] = document.body.textContent.split('\n\n').filter(Boolean);

const fields = fieldsInput.split('\n').filter(Boolean).map((row) => row.match(/(.*): (.*) or (.*)/).slice(1));
const self = selfTicketInput.split('\n').filter(Boolean).pop().split(',').map(Number);
const nearby = nearbyTicketInput.split('\n').filter(Boolean).slice(1).map((row) => row.split(',').map(Number));

const seq = (length, mapFn = (e, i) => i) => Array.from({ length }, mapFn);
const inRange = (str) => {
  const [a, b] = str.split('-');
  return (n) => a <= n && n <= b;
};
const isValid = (n) => fields.map((field) => [inRange(field[1]), inRange(field[2])]).flat(1).some((fn) => fn(n));

const invalids = nearby.flat(1).filter((n) => !isValid(n));
invalids.reduce((a, b) => a + b, 0); // answer 1

const transposed = (validTickets) => validTickets.reduce((acc, row) => {
  row.forEach((e, c) => {
    acc[c].push(e);
  });
  return acc;
}, seq(fields.length, () => []));

const columnPossibles = transposed(nearby.filter((ticket) => ticket.every((n) => !invalids.includes(n))))
  .map((column) => {
    return fields.map(([fieldName, range1, range2]) => {
      return column.every((n) => inRange(range1)(n) || inRange(range2)(n)) && fieldName;
    }).filter(Boolean);
  });

const columnNames = ((possibles) => {
  const names = [];
  while (possibles.length) {
    const [correctIndex, correct] = possibles.find((possible) => possible[1].length === 1);
    const correctName = correct[0];
    names[correctIndex] = correctName;
    possibles = possibles.map(([index, possible]) => {
      return correctIndex !== index ? [index, possible.filter((name) => !names.includes(name))] : null;
    }).filter(Boolean);
  }
  return names;
})(Object.entries(columnPossibles));

columnNames
  .map((name, i) => name.includes('departure') ? self[i] : 1)
  .reduce((a, b) => a * b, 1); // answer 2
