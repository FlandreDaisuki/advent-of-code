const inputLines = document.body.textContent.split('\n').filter(Boolean);

const slope = (right, down) => inputLines.filter((line, i) => {
  if (i % down) { return; }
  const row = i / down;
  const col = (row * right) % line.length;
  return line[col] === '#';
}).length;

slope(3, 1); // answer 1

slope(1, 1) * slope(3, 1) * slope(5, 1) * slope(7, 1) * slope(1, 2); // answer 2
