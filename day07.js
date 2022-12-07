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

/** @param {string} text */
const splitLines = (text, separator = '\n') => text.split(separator)
  .map((line) => line.trim())
  .filter(Boolean);

const commandsAndOutputs = splitLines(getProblemText());

const createDir = (name) => ({ name, parent: null, children: [], size: 0 });
const createFile = (name, size) => ({ name, size });
const root = createDir('/');
let cwd = root;

const mkdir = (cwd, dirname) => {
  const directory = createDir(dirname);
  cwd.children.push(directory);
  directory.parent = cwd;
};

for (const line of commandsAndOutputs) {
  if (line.startsWith('$ cd')) {
    const target = line.split(' ').pop();
    if (target === '..') {
      cwd = cwd.parent;
    }
    else if (target === '/') {
      cwd = root;
    }
    else {
      cwd = cwd.children.find((child) => child.name === target);
    }
  }
  else if (line.startsWith('dir')){
    const dirname = line.replace(/^dir\s*/, '');
    mkdir(cwd, dirname);
  }
  else if (/^\d+ \w+/.test(line)){
    const [sizeStr, filename] = line.split(' ');
    const fileSize = Number(sizeStr);
    cwd.children.push(createFile(filename, fileSize ));

    let cursor = cwd;
    do {
      cursor.size += fileSize;
      cursor = cursor.parent;
    } while (cursor !== null);
  }
  else if (line === '$ ls') {
    // just ignore
  }
}

const isDir = (node) => Object.hasOwn(node, 'children');
const traverse = (node, cb) => {
  if (!isDir(node)) {
    cb({ type: 'file', node });
  }
  else {
    for (const child of node.children) {
      traverse(child, cb);
    }
    cb({ type: 'dir', node });
  }
};

const lessThan100KDirs = [];
traverse(root, ({ type, node }) => {
  if (type === 'dir' && node.size < 100_000) {
    lessThan100KDirs.push(node);
  }
});

const answer1 = sum(lessThan100KDirs.map((node) => node.size));

console.log('answer1', answer1);

let totalFileSize = 0;
traverse(root, ({ type, node }) => {
  if (type === 'file' ) {
    totalFileSize += node.size;
  }
});

const DELETE_THRESHOLD = totalFileSize - 40_000_000;
console.assert(DELETE_THRESHOLD > 0);

const greaterThanThresholdDirs = [];
traverse(root, ({ type, node }) => {
  if (type === 'dir' && node.size > DELETE_THRESHOLD) {
    greaterThanThresholdDirs.push(node);
  }
});

const answer2 = Math.min(...greaterThanThresholdDirs.map((node) => node.size));

console.log('answer2', answer2);
