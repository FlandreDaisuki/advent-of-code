#!/usr/bin/env node

const getProblemText = () => {
  if (globalThis.document) {
    return document.body.textContent;
  }
  const filename = process.argv[1].replace(/.*(day\d+)[.]js/, '$1.txt');
  return require('fs').readFileSync(filename, 'utf8');
};

const sum = (...args) => args.flat(Infinity).reduce((a, b) => a + b, 0);
const mul = (...args) => args.flat(Infinity).reduce((a, b) => a * b, 1);

const toCoord = (x, y) => String([x, y]);
const heightMap = getProblemText()
  .split('\n')
  .filter(Boolean)
  .map((row, r) =>
    row.match(/(\d)/g).map((value, c) => ({
      value: Number(value),
      coord: toCoord(r, c),
    })),
  );
const heightHashMap = Object.fromEntries(
  heightMap.flatMap((row) => row.map((cell) => [cell.coord, cell.value])),
);

const getNeighbors = (coord) => {
  const [x, y] = coord.split(',').map(Number);
  const neighbors = [];
  if (x > 0) neighbors.push(toCoord(x - 1, y));
  if (x + 1 < heightMap.length) neighbors.push(toCoord(x + 1, y));
  if (y > 0) neighbors.push(toCoord(x, y - 1));
  if (y + 1 < heightMap[0].length) neighbors.push(toCoord(x, y + 1));
  return neighbors;
};

const lowPoints = Object.keys(heightHashMap)
  .filter((coord) => {
    const v = heightHashMap[coord];
    return getNeighbors(coord).every((neighbor) => heightHashMap[neighbor] > v);
  })
  .map((coord) => heightHashMap[coord]);

const answer1 = sum(lowPoints, lowPoints.length);
console.log('answer1', answer1);


const visitedCoord = new Set();
const nonVisitedCoord = Object.keys(heightHashMap);
const visit = (coord) => {
  visitedCoord.add(coord);
  nonVisitedCoord.splice(nonVisitedCoord.indexOf(coord), 1);
};

const basinCollection = [];
while (nonVisitedCoord.length) {
  const coord = nonVisitedCoord.shift();

  visit(coord);
  if (heightHashMap[coord] === 9) { continue; }

  const basin = [coord];

  // BFS
  const queue = [...getNeighbors(coord).filter((c) => !visitedCoord.has(c))];
  while (queue.length) {
    const neighbor = queue.shift();
    if (visitedCoord.has(neighbor)) { continue; }

    visit(neighbor);
    if (heightHashMap[neighbor] === 9) { continue; }

    basin.push(neighbor);
    queue.push(...getNeighbors(neighbor).filter((c) => !visitedCoord.has(c)));
  }
  basinCollection.push(basin);
}

const largest3Basins = basinCollection.map((basin) => basin.length).sort((a, b) => a - b).slice(-3);
const answer2 = mul(largest3Basins);
console.log('answer2', answer2);
