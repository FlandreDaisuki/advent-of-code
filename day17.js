#!/usr/bin/env node

const getProblemText = () => {
  if (globalThis.document) {
    return document.body.textContent;
  }
  const filename = process.argv[1].replace(/.*(day\d+)[.]js/, '$1.txt');
  return require('fs').readFileSync(filename, 'utf8');
};

const range = (start, end) => Array.from({ length: end - start }, (_, i) => start + i);
const range0 = (end) => range(0, end);

const [tx0, tx1, ty0, ty1] = getProblemText()
  .match(/target area: x=([-\d]+)..([-\d]+), y=([-\d]+)..([-\d]+)/)
  .slice(1)
  .map(Number);

const [xl, xr] = [Math.min(tx0, tx1), Math.max(tx0, tx1)];
const [yb, yt] = [Math.min(ty0, ty1), Math.max(ty0, ty1)];

const lastStepY = Math.abs(yb) - 1;
const answer1 = (1 + lastStepY) * lastStepY / 2;
console.log('answer1', answer1);

const inTargetX = (x) => x >= xl && x <= xr;
const inTargetY = (y) => y >= yb && y <= yt;
const inTargetArea = (x, y) => inTargetX(x) && inTargetY(y);
const outForeverArea = (x, y) => (x < xr && y < yb) || x > xr;

const goods = [];
for (const x of range0(xr + 1)) {
  const maxX = (x + 1) * x / 2;
  if (maxX < xl) { continue; }

  for (const y of range(yb, -yb + 1)) {
    let [dx, dy] = [x, y];
    const t = { x: 0, y: 0 };

    while (!outForeverArea(t.x, t.y)) {
      if (inTargetArea(t.x, t.y)) {
        goods.push(`${x},${y}`);
        break;
      }
      t.x += dx;
      t.y += dy;
      dx = Math.max(dx - 1, 0);
      dy -= 1;
    }
  }
}
const answer2 = goods.length;
console.log('answer2', answer2);
