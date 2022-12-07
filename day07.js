#!/usr/bin/env node

const getProblemText = () => {
  if (globalThis.document) {
    return document.body.textContent;
  }
  const filename = process.argv[1].replace(/.*(day\d+)[.]js/, '$1.txt');
  return require('fs').readFileSync(filename, 'utf8');
};

/** @param {number[]} arr */
const sum = (arr) => Array.from(arr).reduce((a, b) => a + b, 0);

/** @param {number[]} arr */
const min = (arr) => Array.from(arr).reduce((a, b) => Math.min(a, b), Infinity);

/** @param {string} text */
const splitLines = (text, separator = '\n') => text.split(separator)
  .map((line) => line.trim())
  .filter(Boolean);

const commandsAndOutputs = splitLines(getProblemText());

const createDir = (name) => ({ name, parent: null, children: [], size: 0 });
const createFile = (name, size) => ({ name, size });

/**
 * $ mkdir -p \<dirname>
 * @param {Object} param
 * @param {string} param.cwd
 * @param {string} param.dirname
 */
const mkdir = ({ cwd, dirname }) => {
  const directory = createDir(dirname);
  directory.parent = cwd;
  cwd.children.push(directory);
};

/**
 * $ dd if=/dev/zero of=\<filename> bs=\<size_in_bytes> count=1
 * @param {Object} param
 * @param {string} param.cwd
 * @param {string} param.of
 * @param {number} param.bs
 */
const dd = ({ cwd, of, bs }) => {
  cwd.children.push(createFile(of, bs));

  // update size until root
  let cursor = cwd;
  do {
    cursor.size += bs;
    cursor = cursor.parent;
  } while (cursor !== null);
};

/**
 * $ stat -c %s \<filename>
 * @param {{size: number}} node
 */
const statSize = (node) => node.size;


const systemRoot = commandsAndOutputs.reduce((state, line) => {
  if (/\$ cd \S+/.test(line)) {
    const target = line.split(' ').pop();
    if (target === '/') {
      state.cwd = state.root;
    }
    else if (target === '..') {
      state.cwd = state.cwd.parent;
    }
    else {
      state.cwd = state.cwd.children.find((child) => child.name === target);
    }
  }
  else if (/\$ ls/.test(line)) {
    // do nothing
  }
  else if (/dir \w+/.test(line)) {
    const dirname = line.split(' ').pop();
    mkdir({ cwd: state.cwd, dirname });
  }
  else if (/\d+ \w+/.test(line)){
    const [sizeStr, filename] = line.split(' ');
    const fileSize = Number(sizeStr);
    dd({ cwd: state.cwd, of: filename, bs: fileSize });
  }

  return state;
}, { cwd: null, root: createDir('/') }).root;

const isDir = (node) => Object.hasOwn(node, 'children');
const isFile = (node) => !isDir(node);

const traverseBy = (node, predicate) => {
  if (!isDir(node)) {
    return predicate(node) ? [node] : [];
  }

  return node.children.flatMap((child) => traverseBy(child, predicate))
    .concat(predicate(node) ? [node] : []);
};

const answer1 = sum(
  traverseBy(systemRoot, (node) => {
    return isDir(node) && statSize(node) < 100_000;
  })
    .map(statSize),
);

console.log('answer1', answer1);

const totalFileSize = sum(traverseBy(systemRoot, isFile).map(statSize));
const threshold = totalFileSize - (70_000_000 - 30_000_000);
console.assert(threshold > 0);

const answer2 = min(
  traverseBy(systemRoot, (node) => {
    return isDir(node) && statSize(node) > threshold;
  })
    .map(statSize),
);

console.log('answer2', answer2);
