const inputLines = document.body.textContent.split('\n').filter(Boolean);

const decode = (enc) => parseInt(enc.replace(/[LF]/g, 0).replace(/[^0]/g, 1), 2);

Math.max(...inputLines.map(decode)); // answer 1

const sorted = inputLines.map(decode).sort((a, b) => a - b);

sorted.filter((e, i, a) => i !== 0 && e - 1 !== a[i - 1])[0] - 1; // answer 2
