'use strict';
const diceGame = require('./diceGame.js');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.question(`Enter the number of players.`, players => {
  console.log(`${players} players`);
  rl.question(`Enter the total points to accumulate.`, winningPoints => {
    console.log(`${winningPoints} points to accumulate`);
    diceGame.diceGameBegin(players, winningPoints, readline)
    .then(res => {
      console.log("Game Over!!!");
      rl.close();
    });
  });
});
