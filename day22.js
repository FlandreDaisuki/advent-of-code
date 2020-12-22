const inputPlayers = (this.window ? document.body.textContent : require('fs').readFileSync('day22.txt', 'utf8'))
  .split('\n\n').filter(Boolean);

const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));
const players = inputPlayers.map((str) => str.split('\n').filter(Boolean).slice(1).map(Number));

const mutPlayers = deepCopy(players);
while (mutPlayers.every((cards) => cards.length)) {
  const [p1, p2] = mutPlayers;
  const [winner, loser] = p1[0] > p2[0] ? [p1, p2] : [p2, p1];
  winner.push(winner.shift(), loser.shift());
}

mutPlayers.flat(1)
  .map((e, i, a) => e * (a.length - i))
  .reduce((a, b) => a + b, 0); // answer 1

const play = (players) => {
  const mutPlayers = deepCopy(players);
  const visited = new Set;
  while (mutPlayers.every((cards) => cards.length)) {
    const [p1, p2] = mutPlayers;
    if (visited.has(String(p1))) {
      return [0, p1];
    }
    visited.add(String(p1));
    let winner = null;
    if (p1.length > p1[0] && p2.length > p2[0]) {
      winner = mutPlayers[play([p1.slice(1, p1[0] + 1), p2.slice(1, p2[0] + 1)])[0]];
    } else {
      winner = p1[0] > p2[0] ? p1 : p2;
    }
    const loser = p1 === winner ? p2 : p1;
    winner.push(winner.shift(), loser.shift());
  }

  if (!mutPlayers[0].length) {
    return [1, mutPlayers[1]];
  }
  if (!mutPlayers[1].length) {
    return [0, mutPlayers[0]];
  }
};

play(players)[1].flat(1)
  .map((e, i, a) => e * (a.length - i))
  .reduce((a, b) => a + b, 0); // answer 2
