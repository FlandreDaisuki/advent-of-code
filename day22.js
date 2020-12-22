const inputPlayers = (this.window ? document.body.textContent : require('fs').readFileSync('day22.txt', 'utf8'))
  .split('\n\n').filter(Boolean);

const players = inputPlayers.map((str) => str.split('\n').filter(Boolean).slice(1).map(Number));

const mutPlayers = players.map((cards) => [...cards]); // copy
while (mutPlayers.every((cards) => cards.length)) {
  const [p1, p2] = mutPlayers;
  const [winner, loser] = p1[0] > p2[0] ? [p1, p2] : [p2, p1];
  winner.push(winner.shift(), loser.shift());
}

mutPlayers.flat(1)
  .map((e, i, a) => e * (a.length - i))
  .reduce((a, b) => a + b, 0); // answer 1
