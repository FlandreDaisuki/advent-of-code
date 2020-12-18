const inputLines = (this.window ? document.body.textContent : require('fs').readFileSync('day18.txt', 'utf8'))
  .split('\n').filter(Boolean);

function consume(stack) {
  if (stack.length < 3) {
    return false;
  }

  const last3 = stack.slice(-3);
  if (last3.length === 3 && last3.every(Boolean)) {
    const [a, op, b] = last3;
    if ('+*'.includes(op) && /\d/.test(a) && /\d/.test(b)) {
      const r = eval(a + op + b);
      stack.splice(-3, 3);
      stack.push(r);
      return true;
    }
  }

  const last = stack.slice(-1)[0];
  if (last === ')') {
    const i = stack.lastIndexOf('(');
    if (i < 0) { throw new Error('parenthesis are not matched'); }
    const subExpr = stack.splice(i, Infinity).slice(1, -1);
    stack.push(calcPreorder(subExpr)); // mutual recursion
    return true;
  }

  return false;
}

function calcPreorder(expr) {
  if (expr.length === 1) {
    return expr[0];
  }
  const stack = [];
  for (const char of expr) {
    stack.push(Number(char) ? Number(char) : char);
    while (consume(stack)); // mutual recursion
  }
  return stack[0];
}

inputLines.map((expr) => calcPreorder(expr.replace(/\s/g, ''))).reduce((a, b) => a + b, 0); //answer 1

const calcNoParenthesis = (expr) => {
  const i = expr.indexOf('+');
  if (i < 0) {
    return eval(expr.join(''));
  } else {
    const sum2 = eval(expr.slice(i - 1, i + 2).join(''));
    expr.splice(i - 1, 3, sum2);
    return calcNoParenthesis(expr);
  }
};

const calcAddBeforeMultiply = (expr) => {
  if (expr.length === 1) {
    return expr[0];
  }
  const stack = [];
  for (const char of expr) {
    stack.push(Number(char) ? Number(char) : char);
    if (char === ')') {
      const i = stack.lastIndexOf('(');
      const subExpr = stack.splice(i, Infinity).slice(1, -1);
      stack.push(calcNoParenthesis(subExpr));
    }
  }

  return stack.includes('(') ? calcAddBeforeMultiply(stack) : calcNoParenthesis(stack);
};

inputLines.map((expr) => calcAddBeforeMultiply(expr.replace(/\s/g, ''))).reduce((a, b) => a + b, 0); // answer 2
