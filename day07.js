const inputLines = document.body.textContent.split('\n').filter(Boolean);

const bags = inputLines.map((line) => {
  const [bag, ...specs] = line.split(/(contain|,)/).filter((s) => s.includes('bag')).map((s) => s.replace(/bag.*/, '').trim());
  const canContains = specs.map((sp) => sp.split(/(?<=\d+)\s+/)).map(([count, name]) => [name, Number(count)]);
  return [bag, canContains.some((c) => !c[1]) ? [] : canContains];
});

const reverseBags = bags.reduce((prev, curr) => {
  const [bag, beContained] = curr;
  for (const [name, _] of beContained) {
    if (!prev[name]) {
      prev[name] = [];
    }
    prev[name].push(bag);
  }
  return prev;
}, {});

const track = (targets, set = new Set) => {
  if (!targets.length) { return set.size; }
  const next = [];
  for (const tar of targets) {
    const containers = reverseBags[tar];
    if (containers) {
      for (const con of containers) {
        if (!set.has(con)) {
          next.push(con);
          set.add(con);
        }
      }
    }
  }
  return track(next, set);
};

track(['shiny gold']); // answer 1

const counterBags = ((bags) => {
  const mutableBags = [...bags];
  const map = new Map();
  bags.filter((bag) => !bag[1].length).forEach((smallestBag) => {
    map.set(smallestBag[0], 1);
    const i = mutableBags.findIndex((b) => b[0] === smallestBag[0]);
    mutableBags.splice(i, 1);
  });

  while (mutableBags.length) {
    for (const mb of mutableBags) {
      const [name, canContains] = mb;
      for (const [i, con] of Object.entries(canContains)) {
        if (Array.isArray(con) && map.has(con[0])) {
          canContains[i] = map.get(con[0]) * con[1];
        }
      }
      if (canContains.every((n) => typeof n === 'number')) {
        map.set(name, canContains.reduce((a, b) => a + b) + 1);
        const i = mutableBags.findIndex((b) => b[0] === name);
        mutableBags.splice(i, 1);
      }
    }
  }
  return map;
})(bags);

counterBags.get('shiny gold') - 1; // answer 2
