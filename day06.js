const inputLines = document.body.textContent.split('\n').filter(Boolean);

const sum = (arr) => arr.reduce((a, b) => a + b);

class Node {
  constructor() {
    this.parent = null;
  }
  append(node) {
    node.parent = this;
  }
  get degree() {
    return this.parent ? this.parent.degree + 1 : 0;
  }
}

const galaxy = inputLines.reduce((map, line) => {
  const [planet, moon] = line.split(')');
  const queryOrCreate = (name) => {
    if (!map.has(name)) {
      map.set(name, new Node);
    }
    return map.get(name);
  };
  queryOrCreate(planet).append(queryOrCreate(moon));
  return map;
}, new Map());

sum([...galaxy.values()].map((planet) => planet.degree)); // answer 1

const backTrace = (name) => {
  const track = [];
  let planet = galaxy.get(name);
  do {
    track.push(planet);
    planet = planet.parent;
  } while (planet);
  return track;
};

const you = backTrace('YOU');
const san = backTrace('SAN');
const same = san.filter((planet) => you.includes(planet));

you.length + san.length - 2 * same.length - 2; // answer 2
