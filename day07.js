const inputLines = document.body.textContent.split('\n').filter(Boolean);

const mapping = inputLines.map((line) => {
  const [txtFront, txtBack] = line.split('contain');
  const bag = txtFront.replace('bags', '').trim();
  const others = txtBack.match(/(\d+) (\w+ \w+)(?= bags?)/g);

  return others?.map((other) => {
    const [n, color] = other.trim().match(/(\d+) (.*)/).slice(1);
    return [bag, color, Number(n)];
  }) ?? [[bag, null, 0]];

}).flat(1);

const bagsContain = (target, set = new Set) => {
  if (set.has(target)) { return set; }
  set.add(target);

  const founds = mapping.filter((m) => m[1] === target).map((m) => m[0]);
  if (!founds.length) { return set; }

  return founds.reduce((prev, curr) => bagsContain(curr, prev), set);
};

bagsContain('shiny gold').size - 1; // answer 1

const sum = (arr) => arr.reduce((a, b) => a + b);
const bagsContainWithCount = (target) => {
  if (!target) { return 0; }

  const total = mapping
    .filter((m) => m[0] === target)
    .map((m) => bagsContainWithCount(m[1]) * m[2]);
  return sum(total) + 1;
};

bagsContainWithCount('shiny gold') - 1; // answer 2
