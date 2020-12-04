const inputChunks = document.body.textContent.split('\n\n').filter(Boolean);
const getFields = (chunk) => chunk.match(/(byr|iyr|eyr|hgt|hcl|ecl|pid)(?=:)/g);

inputChunks.filter((chunk) => getFields(chunk).length === 7).length; // answer 1

const parseFields = (chunk) => chunk.match(/(byr|iyr|eyr|hgt|hcl|ecl|pid):\s*(\S+)/g).map((field) => field.split(':', 2));
const between = (v, lb, hb) => lb <= v && v <= hb;
const RULE = {
  byr: (v) => /^\d{4}$/.test(v) && between(parseInt(v), 1920, 2002),
  iyr: (v) => /^\d{4}$/.test(v) && between(parseInt(v), 2010, 2020),
  eyr: (v) => /^\d{4}$/.test(v) && between(parseInt(v), 2020, 2030),
  hgt: (v) => /^\d+(cm|in)$/.test(v) &&
 (v.includes('cm') && between(parseInt(v), 150, 193)) ||
 (v.includes('in') && between(parseInt(v), 59, 76)),
  hcl: (v) => /^#[0-9a-f]{6}$/.test(v),
  ecl: (v) => ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(v),
  pid: (v) => /^\d{9}$/.test(v),
};

inputChunks.filter((chunk) => getFields(chunk).length === 7)
  .map(parseFields).filter((fields) => fields.every(([k, v]) => RULE[k]?.(v))).length; // answer 2
