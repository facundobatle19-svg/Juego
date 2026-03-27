export function pickImpostor(players) {
    const index = Math.floor(Math.random() * players.length);
    return players[index];
  }