#!/usr/bin/env node

const getProblemText = () => {
  if (globalThis.document) {
    return document.body.textContent;
  }
  const filename = process.argv[1].replace(/.*(day\d+)[.]js/, '$1.txt');
  return require('fs').readFileSync(filename, 'utf8');
};

const instructions = getProblemText()
  .split('\n')
  .filter(Boolean)
  .map((line) => {
    const [, op, arg] = line.match(/^(\w+) (\d+)/);
    return [op, parseInt(arg, 10)];
  });

const goal = instructions.reduce(([x, y], [op, arg]) => {
  switch (op) {
  case 'forward':
    return [x + arg, y];
  case 'down':
    return [x, y + arg];
  case 'up':
    return [x, y - arg];
  default:
    throw new Error(`Unknown op: ${op}`);
  }
}, [0, 0]);

const answer1 = Math.abs(goal[0]) * Math.abs(goal[1]);
console.log('answer1', answer1);

const goal2 = instructions.reduce(([x, y, aim], [op, arg]) => {
  switch (op) {
  case 'forward':
    return [x + arg, y + arg * aim, aim];
  case 'down':
    return [x, y, aim + arg];
  case 'up':
    return [x, y, aim - arg];
  default:
    throw new Error(`Unknown op: ${op}`);
  }
}, [0, 0, 0]);

const answer2 = Math.abs(goal2[0]) * Math.abs(goal2[1]);
console.log('answer2', answer2);
