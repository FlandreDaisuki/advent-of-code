const [cardPublicKey, doorPublicKey] = (this.window ? document.body.textContent : require('fs').readFileSync('day25.txt', 'utf8'))
  .split('\n').filter(Boolean).map(Number);

const transformDown = (subject, loop) => {
  let cipher = 1;
  while (loop) {
    cipher = cipher * subject % 20201227;
    loop -= 1;
  }
  return cipher;
};

const transformUp = (target, subject) => {
  let cipher = 1;
  let loop = 0;
  while (target !== cipher) {
    cipher = cipher * subject % 20201227;
    loop += 1;
  }
  return loop;
};

transformDown(cardPublicKey, transformUp(doorPublicKey, 7)); // answer 1
transformDown(doorPublicKey, transformUp(cardPublicKey, 7)); // answer 1
