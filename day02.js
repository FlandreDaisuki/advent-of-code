const inputLines = document.body.textContent.split('\n').filter(Boolean);
const parsedLines = inputLines
  .map((line) => line.match(/(\d+)-(\d+)\s+(\w):\s+(\S+)/).slice(1))
  .map(([ln, rn, ch, pwd]) => ([Number(ln), Number(rn), ch, pwd]));

// leftNum, rightNum, char, password
parsedLines.filter(([ln, rn, ch, pwd]) => {
  const count = pwd.match(new RegExp(ch, 'g'))?.length ?? 0;
  return ln <= count && count <= rn;
}).length; // answer 1

parsedLines.filter(([ln, rn, ch, pwd]) => {
  return (pwd[ln - 1] === ch) ^ (pwd[rn - 1] === ch);
}).length; // answer 2
