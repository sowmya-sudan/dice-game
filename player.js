const readline = require('readline');

function Player(
  player,
  pointsScored,
  rank,
  playOrder,
  rolled1,
  skipTurn 
  ) {
  this.player = player;
  this.pointsScored = pointsScored;
  this.rank = rank;
  this.playOrder = playOrder;
  this.rolled1 = rolled1;
  this.skipTurn = skipTurn;

  this.rollDice = (player) => {
    return new Promise((resolve, reject) => {
      console.log(`player ${player} it's your turn (press ‘r’ to roll the dice)`);
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
      });
      readline.emitKeypressEvents(process.stdin);
      process.stdin.setRawMode(true);
      process.stdin.on('keypress', function (ch, key) {
        console.log(ch, key);
        if (key && key.name === 'r') {
          let points = randomIntFromInterval(1,6);
          resolve(points);
        }
      });
    })
  }
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

module.exports = {
  Player: Player
}