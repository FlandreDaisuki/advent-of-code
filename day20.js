const inputTiles = (this.window ? document.body.textContent : require('fs').readFileSync('day20.txt', 'utf8'))
  .split('\n\n').filter(Boolean);

const reverse = (s) => [...s].reverse();
const uniq = (a) => [...new Set(a)];
const seq = (length, mapFn = (e, i) => i) => Array.from({ length }, mapFn);
const imageRotate90 = (image) => {
  const L = image.length;
  return seq(L).map((i) => seq(L).map((j) => image[L - 1 - j][i]));
};
const imageFlip = (image) => image.map(reverse);
const imageErode = (image) => image.slice(1, -1).map((row) => row.slice(1, -1));

class Tile {
  constructor(id, image) {
    this.id = Number(id);
    this.image = image; // String[][]
    this.L = image.length;
  }
  get top() { return this.image[0].join(''); }
  get bottom() { return this.image[this.L - 1].join(''); }
  get left() { return this.image.map((row) => row[0]).flat(1).join(''); }
  get right() { return this.image.map((row) => row[this.L - 1]).flat(1).join(''); }
  get sides() {
    return [this.top, this.left, this.right, this.bottom].map((s) => [s, reverse(s).join('')]).flat(1);
  }
  static rotate90(tile) {
    return new Tile(
      tile.id,
      imageRotate90(tile.image),
    );
  }
  static flip(tile) { // horizontal flip
    return new Tile(
      tile.id,
      imageFlip(tile.image),
    );
  }
  static erosion(tile) {
    return new Tile(
      tile.id,
      imageErode(tile.image),
    );
  }
}

// <part-1>

const tiles = inputTiles.map((input) => {
  const [tid, ...image] = input.split('\n').filter(Boolean);
  return new Tile(tid.replace(/\D/g, ''), image.map((row) => row.split('')));
});

for (const tile of tiles) {
  const matched = [];
  for (const side of tile.sides) {
    const found = tiles.filter((it) => it !== tile && it.sides.includes(side))
      .map((it) => [it.id, it.sides.indexOf(side)]);
    matched.push(found);
  }
  tile.matched = matched;
  tile.neighbors = uniq(matched.flat(1).map((m) => m[0]));
}

const cornerTiles =  tiles.filter((tile) => tile.neighbors.length === 2);
cornerTiles
  .map((it) => it.id)
  .reduce((a, b) => a * b, 1); // answer 1

// </part-1>

const tileMap = tiles.reduce(((map, tile) => {
  map[tile.id] = tile;
  return map;
}), {});
const pSize = Math.sqrt(tiles.length);
const puzzle = seq(pSize, () => seq(pSize, () => 'X'));

const isPlaceable = (t) => t === 'X';
const hasTile = (t) => !isPlaceable(t);

const right = (i, j) => j + 1 < pSize && puzzle[i][j + 1];
const left = (i, j) => j > 0  && puzzle[i][j - 1];
const top = (i, j) => i > 0 && puzzle[i - 1][j];
const bottom = (i, j) => i + 1 < pSize && puzzle[i + 1][j];
const getPuzzleNeighbors = (i, j) => [
  right(i, j),
  left(i, j),
  top(i, j),
  bottom(i, j),
].filter(Boolean);

const intersectAll = (all) => {
  if (!all.length) {
    return [];
  }
  return all.reduce((a, b) => a.filter((e) => b.includes(e)), all[0]);
};

// init first 2 tiles
const placedTileIdSet = new Set();
puzzle[0][0] = cornerTiles[0];
puzzle[0][1] = tileMap[puzzle[0][0].neighbors[0]];
placedTileIdSet.add(puzzle[0][0].id);
placedTileIdSet.add(puzzle[0][1].id);

// place tiles into puzzle
for (const i of seq(pSize)) {
  for (const j of seq(pSize)) {
    const puzzleNeighbors = getPuzzleNeighbors(i, j);
    if (isPlaceable(puzzle[i][j]) && puzzleNeighbors.some(hasTile)) {
      const neighborTiles = puzzleNeighbors.filter(hasTile);
      const possibleTiles = intersectAll(neighborTiles.map((tile) => tile.neighbors))
        .filter((id) => !placedTileIdSet.has(id)) // filter placed
        .map((id) => tileMap[id])
        .filter((tile) => tile.neighbors.length === puzzleNeighbors.length); // filter corner/side/inner tiles

      if (possibleTiles.length === 1) {
        puzzle[i][j] = possibleTiles[0];
        placedTileIdSet.add(puzzle[i][j].id);
      }
    }
  }
}

// original + rotate 3 times + flipped + rotate 3 times after flipped
const transformToMatch = (tile, neighbors) => {

  const isMatchNeighbors = (currentTile) => {
    let allMatched = true;
    for (const [dir, neighbor] of Object.entries(neighbors)) {
      if (neighbor) {
        allMatched = allMatched && neighbor.sides.includes(currentTile[dir]);
      }
    }
    return allMatched;
  };

  return [
    tile,
    Tile.rotate90(tile),
    Tile.rotate90(Tile.rotate90(tile)),
    Tile.rotate90(Tile.rotate90(Tile.rotate90(tile))),
    Tile.flip(tile),
    Tile.rotate90(Tile.flip(tile)),
    Tile.rotate90(Tile.rotate90(Tile.flip(tile))),
    Tile.rotate90(Tile.rotate90(Tile.rotate90(Tile.flip(tile)))),
  ].filter(isMatchNeighbors)[0];
};

// transform puzzle to correct rotation
for (const i of seq(pSize)) {
  for (const j of seq(pSize)) {
    const neighbors = {
      right: right(i, j),
      left: left(i, j),
      top: top(i, j),
      bottom: bottom(i, j),
    };
    const transformed = transformToMatch(puzzle[i][j], neighbors);
    puzzle[i][j] = transformed;
  }
}

const patchUp = (puzzle) => {
  const puzzleImages = puzzle.map((row) => row.map((tile) => tile.image));
  const eroded = puzzleImages.map((row) => row.map(imageErode));
  const pSize = eroded.length;
  const iSize = eroded[0][0].length;

  return eroded
    .map((row) => {
      return seq(iSize).map((i) => {
        return seq(pSize).map((j) => row[j][i]).flat(1);
      });
    }).flat(1);
};

// erode borders & patch up
const nauticalImage = patchUp(puzzle);

const seaMonster = `
                  #
#    ##    ##    ###
 #  #  #  #  #  #
`.split('\n').filter(Boolean);
const seaMonsterPoints = seaMonster
  .map((row, i) => [...row].map((dot, j) => dot === '#' && [i, j]).filter(Boolean))
  .flat();

const hasSeaMonster = (image, i, j) => seaMonsterPoints.map(([x, y]) => image[x + i]?.[y + j]).every((p) => p === '#');

let mutNauticalImage = JSON.parse(JSON.stringify(nauticalImage));

/* eslint-disable-next-line no-unused-vars */
for (const _ of seq(2)) {
  /* eslint-disable-next-line no-unused-vars */
  for (const _ of seq(4)) {
    const nL = mutNauticalImage.length;
    for (const i of seq(nL)) {
      for (const j of seq(nL)) {
        if (hasSeaMonster(mutNauticalImage, i, j)) {
          seaMonsterPoints.forEach(([x, y]) => mutNauticalImage[x + i][y + j] = 'O');
        }
      }
    }
    mutNauticalImage = imageRotate90(mutNauticalImage);
  }
  mutNauticalImage = imageFlip(mutNauticalImage);
}

mutNauticalImage.flat(2).filter((x) => x === '#').length; // answer 2
