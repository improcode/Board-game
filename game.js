(function() {
    let gameIsRun = false;
    let gameState;
    let round;
    let average;

    document.querySelector('.start-button').addEventListener('click', startGame, true);

    function startGame() {
        removeLogsFromPastGame()
        console.log('NEW GAME. After each move you can see gameState in console. Enjoy!')
        document.querySelector('.start-button').disabled = true;
        const diceButton = document.querySelector('.dice-roll-button');
        diceButton.disabled = false;
        diceButton.addEventListener('click', move, true);
        gameState = [{
            rollDice: 0,
            playerPosition: 1
        }];
        round = 0;
        gameIsRun = true;
        renderGameboard();
    }

    function move() {
        round++;
        gameState[round] = {};
        gameState[round].rollDice = rollingDice();
        console.log(gameState);
        gameState[round].playerPosition = gameState[round - 1].playerPosition + gameState[round].rollDice;
        SmallBreakAfterDiceRolling()
        renderGameLog(standardLogMaker(gameState[round].rollDice, gameState[round - 1].playerPosition, gameState[round].playerPosition));
        specialSquaresCheck();
        renderGameboard();
    }

    function specialSquaresCheck() {
        if (gameState[round].playerPosition == 20) {
            cameToFinish()
        } else if (gameState[round].playerPosition >= 20) {
            cameToFurtherThanFinish();

        } else if (gameState[round].playerPosition == 12) {
            cameTo12()
        } else if (gameState[round].playerPosition == 19) {
            cameTo19();
        }
        // If you want another special square just make again 'else if' and dedicated function.
    }

    function rollingDice() {
        return Math.floor(Math.random() * 6) + 1;
    }

    function SmallBreakAfterDiceRolling() {
        if (gameState[round].playerPosition != 12 && gameState[round].playerPosition != 20) {
            document.querySelector('.dice-roll-button').disabled = true;
            setTimeout(() => { document.querySelector('.dice-roll-button').disabled = false; }, 300);
        }
    }

    function getAverage() {
        let sum = 0;
        for (let i = 1; i <= gameState.length - 1; i++) {
            sum += gameState[i].rollDice;
        }
        let avg = sum / (gameState.length - 1);
        return Math.round(avg * 100) / 100
    }

    function cameTo12() {
        document.querySelector('.dice-roll-button').disabled = true;
        document.querySelector('.start-button').disabled = false;
        renderGameboard();
        let numberOfRounds = gameState.length - 1;
        average = getAverage();
        setTimeout(function() { alert('YOU LOSE! Number of rounds: ' + numberOfRounds + '. The average number of spots: ' + average) }, 500);
        gameIsRun = false;
        renderGameLog('GAME OVER :(', 'gameover-log');
    }

    function cameTo19() {
        setTimeout(() => { alert('ROAD WORKS - go back to square 11'); gameState[round].playerPosition = 11; renderGameboard(); }, 700);
        renderGameLog('Oops.. go back to square 11', 'warning-log');
    }

    function cameToFinish() {
        document.querySelector('.dice-roll-button').disabled = true;
        document.querySelector('.start-button').disabled = false;
        renderGameboard();
        let numberOfRounds = gameState.length - 1;
        average = getAverage();
        setTimeout(function() { alert('YOU WIN! Number of rounds: ' + numberOfRounds + '. The average number of spots: ' + average) }, 500);
        gameIsRun = false;
        renderGameLog('You are the winner!', 'success-log');
    }

    function cameToFurtherThanFinish() {
        let tooFarGo = gameState[round].playerPosition - 20;
        gameState[round].playerPosition = 20 - tooFarGo;
        renderGameLog('The end of the board. Move to ' + gameState[round].playerPosition + '. ' , 'warning-log');
        if (gameState[round].playerPosition == 19) {
            cameTo19();
        }
    }

    function renderGameboard() {
        if (!gameIsRun) { return };
        document.querySelectorAll('.field').forEach((element) => { element.classList.remove('player-field') });
        document.getElementById(gameState[round].playerPosition).classList.add('player-field');
    }

    function renderGameLog(log, additionalClass = 'nostyle') {
        let listOfEvents = document.querySelector('.events-list');
        let newLog = document.createElement('li');
        newLog.innerHTML = log;
        newLog.classList.add(additionalClass);
        listOfEvents.appendChild(newLog);
    }

    function standardLogMaker(dice, from, to) {
        return 'You rolled a ' + dice + '. Move from ' + from + ' to ' + to + '.'
    }

    function removeLogsFromPastGame() {
        document.querySelector('.events-list').innerHTML ='';
    }
})()