const player = require('./player.js');
let Player = player.Player;

function startGame(readline, diceGame){
  return new Promise((resolve, reject) => {
    let currPlayer = diceGame.getCurrentPlayer();
    if(!currPlayer.skipTurn){
      if(currPlayer.pointsScored >= diceGame.pointsToAccumulate) {
        diceGame.setCurrentPlayer(currPlayer.playOrder);
        startGame(readline, diceGame).then(res => {
          resolve(true);
        });
      } else {
        currPlayer.rollDice(currPlayer.player)
        .then(pointsScoreByPlayer => {
          console.log(`dice rolled ${pointsScoreByPlayer}`);
          currPlayer.pointsScored = 
            currPlayer.pointsScored + pointsScoreByPlayer;
          if(pointsScoreByPlayer === 6) { 
            diceGame.updatePlayerData(currPlayer);
            diceGame.setCurrentPlayer(currPlayer.playOrder-1);
          } else {
            if (pointsScoreByPlayer === 1) {
              currPlayer.rolled1 ++;
              if(currPlayer.rolled1 === 2) {
                currPlayer.skipTurn = true;
              }
            }
            diceGame.updatePlayerData(currPlayer);
            diceGame.setCurrentPlayer(currPlayer.playOrder);
          }
          
          diceGame.printRank();
          if(!diceGame.checkGameOver()) {
            startGame(readline, diceGame).then(res => {
              resolve(true);
            });
          } else {
            resolve(true);
          };
        });
      }
    } else {
      currPlayer.skipTurn = false;
      diceGame.updatePlayerData(currPlayer);
      console.log(`player ${player} turn skipped as penalty`);
      diceGame.setCurrentPlayer(currPlayer.playOrder);
      startGame(readline, diceGame).then(res => {
        resolve(true);
      });
    }
    
    if(diceGame.checkGameOver()) resolve(true);
  });
}

function DiceGame(totalPlayers, pointsToAccumulate) {
  this.totalPlayers = totalPlayers;
  this.pointsToAccumulate = pointsToAccumulate;
  this.playersData = [];
  this.currentTurnPlayer = 0;

  this.setPlayers = (playersArray) => {
    this.playersData = playersArray;
  }

  this.assignOrder = (playersArray) => {
    this.playersData = playersArray
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value).map((val, i) => {
        let newVal = val;
        newVal.playOrder = i + 1;
        return newVal;
      });
    this.printPlayers();
  }

  this.setCurrentPlayer = (currPlayer) => {
    if(currPlayer >= this.totalPlayers){
      this.currentTurnPlayer = currPlayer - this.totalPlayers;
    } else {
      this.currentTurnPlayer = currPlayer;
    }
  }

  this.getCurrentPlayer = () => {
    return this.playersData[this.currentTurnPlayer];
  }

  this.updatePlayerData = (player) => {
    this.playersData = this.playersData.map((plyr) => {
      return plyr.player === player.player ? player : plyr
    })
  }

  this.checkGameOver = () => {
    let flag = true;
    this.playersData.forEach(player => {
      if(player.pointsScored < this.pointsToAccumulate) {
        flag = false;
      }
    });
    return flag;
  }

  this.printRank = () => {
    const tempArr = this.playersData;
    tempArr.sort((a,b) => b.pointsScored-a.pointsScored);
    tempArr.forEach((temp,i) => {
      temp.rank = tempArr.findIndex(t=> t.pointsScored === temp.pointsScored) + 1;
    });
    tempArr.sort((a,b) => a.playOrder - b.playOrder);
    tempArr.forEach(plyr => {
      console.log(`player ${plyr.player} is at Rank ${plyr.rank} with points ${plyr.pointsScored}`)
      // console.log("player....." +JSON.stringify(plyr));
    })
  }

  this.printPlayers = () => {
    console.log("The order of the players are");
    this.playersData.forEach(player => {
      console.log(`player ${player.player}`);
    })
  }
}

const diceGameBegin = (totalPlayers, pointsToAccumulate, readline) => {
  return new Promise((resolve, reject) => {
    let diceGame = new DiceGame(totalPlayers, pointsToAccumulate);

    let playersArray = [];
    for (let i = 0; i < diceGame.totalPlayers; i++) {
      let newPlayer = new Player(i+1, 0, 0, 1, 0, false);
      playersArray.push(newPlayer);
    }
    diceGame.setPlayers(playersArray);
    diceGame.assignOrder(playersArray);
    startGame(readline, diceGame).then(res => {
      resolve();
    })
  });
}


module.exports = {
  diceGameBegin: diceGameBegin
}