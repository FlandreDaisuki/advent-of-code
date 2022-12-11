#!/usr/bin/env node

const getProblemText = () => {
  if (globalThis.document) {
    return document.body.textContent;
  }
  const filename = process.argv[1].replace(/.*(day\d+)[.]js/, '$1.txt');
  return require('fs').readFileSync(filename, 'utf8');
};

/** @param {string} text */
const splitLines = (text, separator = '\n') => text.split(separator)
  .map((line) => line.trim())
  .filter(Boolean);

/** @param {number} length */
const range = (length) => Array.from({ length }, (_, i) => i);

/** @param {number[]} arr */
const multiply = (arr) => Array.from(arr).reduce((a, b) => a * b, 1);

/** @type {<T>(o: T) => T} */
const simpleDeepClone = (o) => JSON.parse(JSON.stringify(o));

const gcd = (a, b) => (b === 0) ? a : gcd(b, a % b);

const lcm = (a, b) => (a * b) / gcd(a, b);

// helper function to calculate the greatest common divisor (GCD) of two numbers


const monkeyDescriptions = splitLines(getProblemText(), '\n\n').map((monkeyDescription) => {
  const descriptions = splitLines(monkeyDescription);
  const monkey = {
    index: 0,
    holdItems: [],
    operation: '',
    divisor: 1,
    throwWhenPass: -1,
    throwWhenFail: -1,
    inspectTimes: 0,
  };
  for (const desc of descriptions) {
    if (/^Monkey (\d):$/.test(desc)) {
      monkey.index = Number(desc.replace(/^Monkey (\d):$/, '$1'));
    }
    else if (/^Starting items: /.test(desc)) {
      monkey.holdItems = desc.replace(/^Starting items: /, '').split(',').map(Number);
    }
    else if (/^Operation: new = /.test(desc)) {
      const expression = desc.replace(/^Operation: new = /, '');
      console.assert(expression.includes('old'));

      // eslint-disable-next-line no-unused-vars
      monkey.operation = expression;
    }
    else if (/^Test: divisible by (\d+)$/.test(desc)) {
      const divisible = Number(desc.replace(/^Test: divisible by (\d+)$/, '$1'));
      monkey.divisor = divisible;
    }
    else if (/^If true: throw to monkey (\d+)$/.test(desc)) {
      monkey.throwWhenPass = Number(desc.replace(/^If true: throw to monkey (\d+)$/, '$1'));
    }
    else if (/^If false: throw to monkey (\d+)$/.test(desc)) {
      monkey.throwWhenFail = Number(desc.replace(/^If false: throw to monkey (\d+)$/, '$1'));
    }
    else {
      throw new Error('ParseError');
    }
  }

  return monkey;
});

/**
 * @param {typeof monkeyDescriptions} descriptions
 * @returns {(typeof monkeyDescriptions) & {
 * test: (lv: number) => boolean;
 * operate: (lv: number) => number;
 * inspect: () => void;
 * }[]} monkeys
 */
const initMonkeysFromDescriptions = (descriptions) => {
  const monkeys = descriptions.map(simpleDeepClone);
  return monkeys.map((m) => {
    m.test = (lv) => (lv % m.divisor) === 0;
    m.operate = (lv) => eval(m.operation.replace(/old/g, lv));
    return m;
  });
};

const monkeysAfter20Rounds = range(20)
  .reduce((monkeys) => {
    for (const monkey of monkeys) {
      while (monkey.holdItems.length) {
        monkey.inspectTimes += 1;
        const item = monkey.holdItems.shift();
        const worryLevel = Math.floor(monkey.operate(item) / 3);
        if (monkey.test(worryLevel)) {
          monkeys[monkey.throwWhenPass].holdItems.push(worryLevel);
        }
        else {
          monkeys[monkey.throwWhenFail].holdItems.push(worryLevel);
        }
      }
    }

    return monkeys;
  }, initMonkeysFromDescriptions(monkeyDescriptions));

const answer1 = multiply(monkeysAfter20Rounds
  .map((m) => m.inspectTimes)
  .sort((a, b) => a - b)
  .slice(-2));

console.log('answer1', answer1);


/**
 * @param {typeof monkeyDescriptions} descriptions
 * @returns {(typeof monkeyDescriptions) & {
 * test: (lv: number) => boolean;
 * operate: (lv: number) => number;
 * inspect: () => void;
 * }[]} monkeys
 */
const initMonkeysFromDescriptionsPart2 = (descriptions) => {
  const monkeys = descriptions.map(simpleDeepClone);
  // Because of all monkey test by division, and only care about remainders
  // And, all divisors are prime
  // So, We can reduce the worry level to the remainder of lcm of all monkeys
  const lcmOfDivisors = monkeys.map((m) => m.divisor).reduce(lcm);
  return monkeys.map((m) => {
    m.test = (lv) => (lv % m.divisor) === 0;
    m.operate = (lv) => eval(m.operation.replace(/old/g, lv)) % lcmOfDivisors;
    return m;
  });
};

const monkeysAfter10000Rounds = range(10000)
  .reduce((monkeys) => {
    for (const monkey of monkeys) {
      while (monkey.holdItems.length) {
        monkey.inspectTimes += 1;
        const item = monkey.holdItems.shift();
        const worryLevel = monkey.operate(item);
        if (monkey.test(worryLevel)) {
          monkeys[monkey.throwWhenPass].holdItems.push(worryLevel);
        }
        else {
          monkeys[monkey.throwWhenFail].holdItems.push(worryLevel);
        }
      }
    }

    return monkeys;
  }, initMonkeysFromDescriptionsPart2(monkeyDescriptions));

const answer2 = multiply(monkeysAfter10000Rounds
  .map((m) => m.inspectTimes)
  .sort((a, b) => a - b)
  .slice(-2));

console.log('answer2', answer2);
