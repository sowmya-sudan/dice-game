'use strict';

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

let N = 0, M = 0;
let currTurnPlayer = 0;

let nplayersArray = [];
let shuffledPlayersArray = [];

function createNPlayers () {
  for(let i=0; i<N;i++){
    let newPlayer = {
      player : i+1,
      pointsScored : 0,
      rank : 0,
      playOrder : i+1,
      rolled1 : 0,
      skipTurn : false
    }
    nplayersArray.push(newPlayer);
  }
}

function findIndex(pointsScored, tempArr){
  tempArr.forEach((val,ind) => {
    console.log(val, pointsScored);
    if(val.pointsScored === pointsScored) {
      console.log("true");
      return ind;
    }
  })
}

const printRank = () => {
  const tempArr = [].concat(shuffledPlayersArray);
  tempArr.sort((a,b) => b.pointsScored-a.pointsScored);
  tempArr.forEach((temp,i) => {
    temp.rank = tempArr.findIndex(t=> t.pointsScored === temp.pointsScored) + 1;
  });
  console.log(tempArr);
}

function assignOrder () {
  shuffledPlayersArray = nplayersArray
  .map(value => ({ value, sort: Math.random() }))
  .sort((a, b) => a.sort - b.sort)
  .map(({ value }) => value).map((val,i) => 
    {
      let newVal = val;
      newVal.playOrder = i+1;
      return newVal;
    }
  );

  console.log(shuffledPlayersArray);
}

const checkGameOver = () => {
  let flag = true;
  shuffledPlayersArray.forEach(player => {
    if(player.pointsScored < M) {
      flag = false;
    }
  });
  console.log("returning "+flag);
  return flag;
}

function startGame(){
  return new Promise((resolve, reject) => {
    if(currTurnPlayer < N) {
      if(!shuffledPlayersArray[currTurnPlayer].skipTurn){
        if(shuffledPlayersArray[currTurnPlayer].pointsScored >= M) {
          currTurnPlayer = currTurnPlayer + 1;
          startGame().then(res => {
            resolve(true);
          });
        } else {
          getPlayerPoints(shuffledPlayersArray[currTurnPlayer].player, currTurnPlayer)
          .then(pointsScoreByPlayer => {
            shuffledPlayersArray[currTurnPlayer].pointsScored = 
              shuffledPlayersArray[currTurnPlayer].pointsScored + pointsScoreByPlayer;
            if(pointsScoreByPlayer === 6) { 
              currTurnPlayer = currTurnPlayer;
            } else {
              if (pointsScoreByPlayer === 1) {
                shuffledPlayersArray[currTurnPlayer].rolled1 ++;
                if(shuffledPlayersArray[currTurnPlayer].rolled1 === 2) {
                  shuffledPlayersArray[currTurnPlayer].skipTurn = true;
                }
              }
              currTurnPlayer = currTurnPlayer + 1;
            }
            printRank();
            if(!checkGameOver()) {
              startGame().then(res => {
                resolve(true);
              });
            } else {
              resolve(true);
            };
          });
        }
      } else {
        shuffledPlayersArray[currTurnPlayer].skipTurn = false;
        console.log(`player ${player} turn skipped as penalty`);
        currTurnPlayer = currTurnPlayer + 1;
        startGame().then(res => {
          resolve(true);
        });
      }
    } else {
      currTurnPlayer = currTurnPlayer - N;
      startGame().then(res => {
        resolve(true);
      });
    }
    if(checkGameOver()) resolve(true);
  });
}

function getPlayerPoints(player, i) {
  return new Promise((resolve, reject) => {
    console.log(`player ${player} it's your turn (press ‘r’ to roll the dice)`);
    readline.emitKeypressEvents(process.stdin); 
    process.stdin.setRawMode(true);
    process.stdin.on('keypress', function (ch, key) {
      if (key && key.name === 'r') {
        console.log(key.name);
        console.log('dice rolled');
        let points = randomIntFromInterval(1,6);
        console.log(`${points} points score`);
        resolve(points);
      }
    });
  })
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

rl.question(`Enter the number of players.`, players => {
  console.log(`${players} players`);
  N = players;
  createNPlayers();
  rl.question(`Enter the total points to accumulate.`, winningPoints => {
    console.log(`${winningPoints} points to accumulate`);
    M = winningPoints;
    assignOrder();
    startGame().then(res => {
      console.log("Game Over!!!");
      rl.close();
    });
  });
});
