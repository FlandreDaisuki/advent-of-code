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

const forestInput = getProblemText()
  .split('\n')
  .filter(Boolean);

const isLeaf = (node) => !Array.isArray(node);
const isRegularPair = (node) => !isLeaf(node) &&
  Number.isFinite(node[0]?.v) &&
  Number.isFinite(node[1]?.v);
const toTree = (line) => JSON.parse(line.replace(/\d+/g, '{"v":$&}'));
const toString = (root) => JSON.stringify(root).replace(/{"v":(\d+)}/g, '$1');
const clone = (tree) => toTree(toString(tree));

const forest = forestInput.map(toTree);

const findExplodable = (root, depth = 0) => {
  const flatten = root.flat(depth);
  if (flatten.every(isLeaf)) { return null; }
  if (depth < 3) { return findExplodable(root, 3); }

  const foundIndex = flatten.findIndex(isRegularPair);
  if (foundIndex === -1) {
    return findExplodable(root, depth + 1);
  }

  return {
    pair: flatten[foundIndex],
    depth,
  };
};

const findSplittable = (root) => {
  const flatten = root.flat(Infinity);
  const found = flatten.find((leaf) => leaf.v > 9);
  if (!found) { return null; }

  let depth = 0;
  while (!root.flat(depth).includes(found)) {
    depth++;
  }
  return { leaf: found, depth };
};

const explode = (root, explodable) => {
  if (!explodable) { return root; }

  const { pair, depth } = explodable;
  const pairParent = root.flat(depth - 1).find((node) => !isLeaf(node) && node.includes(pair));
  console.assert(pairParent);
  const flatten = root.flat(depth);
  const indexOfPair = flatten.indexOf(pair);
  const leftSibling = flatten.slice(0, indexOfPair).flat(Infinity).slice(-1)[0];
  const rightSibling = flatten.slice(indexOfPair + 1).flat(Infinity)[0];

  if (leftSibling) {
    console.assert(isLeaf(leftSibling));
    leftSibling.v += pair[0].v;
  }
  if (rightSibling) {
    console.assert(isLeaf(rightSibling));
    rightSibling.v += pair[1].v;
  }

  pairParent.splice(pairParent.indexOf(pair), 1, { v: 0 });
  return root;
};

const split = (root, splittable) => {
  if (!splittable) { return root; }

  const { leaf, depth } = splittable;
  const leafParent = root.flat(depth - 1).find((node) => !isLeaf(node) && node.includes(leaf));
  console.assert(leafParent);

  const newLeaf = [{ v: Math.floor(leaf.v / 2) }, { v: Math.ceil(leaf.v / 2) }];
  leafParent.splice(leafParent.indexOf(leaf), 1, newLeaf);

  return root;
};

const addition = (tree1, tree2) => {
  let tree = [clone(tree1), clone(tree2)];

  let explodable = findExplodable(tree);
  let splittable = findSplittable(tree);
  while (explodable || splittable) {
    if (explodable) {
      tree = explode(tree, explodable);
    } else if (splittable) {
      tree = split(tree, splittable);
    }
    explodable = findExplodable(tree);
    splittable = findSplittable(tree);
  }
  return tree;
};

const magnitude = (tree) => {
  if (isLeaf(tree)) { return tree.v; }
  return 3 * magnitude(tree[0]) + 2 * magnitude(tree[1]);
};

const answer1 = magnitude(forest.reduce((tree1, tree2) => addition(tree1, tree2)));
console.log('answer1', answer1);

const answer2 = Math.max(
  ...range0(forest.length).flatMap((i) =>
    range(i + 1, forest.length).map((j) =>
      Math.max(
        magnitude(addition(forest[i], forest[j])),
        magnitude(addition(forest[j], forest[i])),
      ),
    ),
  ),
);
console.log('answer2', answer2);
