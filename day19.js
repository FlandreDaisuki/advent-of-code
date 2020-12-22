const [rulesInput, messagesInput] = (this.window ? document.body.textContent : require('fs').readFileSync('day19.txt', 'utf8'))
  .split('\n\n').filter(Boolean);

const trim = (s) => String(s).trim();
const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));

const rulesToRegex = Object.fromEntries(
  rulesInput.split('\n').filter(Boolean)
    .map((line) => {
      const [ruleIdx, ruleBody] = line.split(':').map(trim);
      if (ruleBody.includes('"')) {
        return [ruleIdx, ruleBody[1]];
      } else {
        return [ruleIdx, ruleBody.replace(/\s*(\d+)\s*/g, '($1)')];
      }
    }),
);

const simply = (str) => {
  const replaced = str
    .replace(/\(([ab]+)\)\(([ab]+)\)/g, '($1$2)')
    .replace(/\(\(([^)]+)\)\)/g, '($1)');
  return str === replaced ? str : simply(replaced);
};

const regexRule = Object.keys(rulesToRegex).reduce((mut, ruleIdx) => {
  const entries = Object.entries(mut);
  for (const [index, entry] of entries) {
    const replaced = entry.replace(new RegExp(`\\(${ruleIdx}\\)`, 'g'), `(${mut[ruleIdx]})`);
    mut[index] = simply(replaced);
  }
  return mut;
}, deepCopy(rulesToRegex));

const messages = messagesInput.split('\n').filter(Boolean);

messages.filter((msg) => (new RegExp(`^${regexRule[0]}$`).test(msg))).length; // answer 1

// rule0
// => (rule8)(rule11)
// => (rule42)+(rule42){k}(rule31){k}, k >= 1
// => (rule42){j}(rule31){k}, j > k >= 1

const rule42 = regexRule[42];
const rule31 = regexRule[31];
messages.filter((msg) => {
  let mut = msg;
  let replaced = mut;
  let count42 = -1, count31 = -1;
  do {
    mut = replaced;
    replaced = mut.replace(new RegExp(`^(${rule42})`), '');
    count42 += 1;
  } while (mut !== replaced);
  do {
    mut = replaced;
    replaced = mut.replace(new RegExp(`(${rule31})$`), '');
    count31 += 1;
  } while (mut !== replaced);

  return !mut && count42 && count31 && count42 > count31;
}).length; // answer 2
