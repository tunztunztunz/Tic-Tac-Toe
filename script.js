const Player = (name) => {
    let playerName = name;
    let score = 0;
    let moves = new Array(0);

    let getName = () => {
        return playerName;
    }

    let getScore = () => {
        return score;
    }

    let addScore = () => {
        score += 1;
    }

    let setName = (newName) => {
        playerName = newName;
    }

    let resetRound = () => {
        moves.length = 0;
    }

    let resetGame = () => {
        resetRound();
        score = 0;
    }

    return {
        getName,
        getScore,
        addScore,
        setName,
        moves,
        resetRound,
        resetGame
    };
};

const gameBoard = (() => {
    let moves = Array.from(Array(9).keys());
    let cells = document.querySelectorAll('.cell');
    let displayPlayer1Score = document.querySelector('.player1-score');
    let displayPlayer2Score = document.querySelector('.player2-score');
    let displayPlayer1Name = document.querySelector('.player1-name-board');
    let displayPlayer2Name = document.querySelector('.player2-name-board');
    let settingsButton = document.querySelector('.settings');
    let cancelButton = document.querySelector('.cancel-button');
    let settingsForm = document.querySelector('form');
    let warningText = document.querySelector('.warning');
    let settingsBackground = document.querySelector('.settings-background');
    let announcement = document.querySelector('.announcement');
    let announcementContent = document.querySelector('.announcement-content');
    let settingsDisplay = document.querySelector('.display-game-settings');

    let updateNames = () => {
        displayPlayer1Name.textContent = player1.getName() + ':';
        displayPlayer2Name.textContent = player2.getName() + ':';
    }

    let togglePlayerColor = (player) => {
        if (player === player1) {
            displayPlayer1Name.classList.remove('player-color')
            displayPlayer2Name.classList.toggle('player-color');
        } else {
            displayPlayer2Name.classList.remove('player-color')
            displayPlayer1Name.classList.toggle('player-color');
        }


    }

    let updateScores = () => {
        displayPlayer1Score.textContent = player1.getScore();
        displayPlayer2Score.textContent = player2.getScore();
    }

    let renderBoard = () => {
        for (var index in moves) {
            cells[index].textContent = moves[index];
        }
    }

    let checkIfPlayed = (cell) => {
        return cell.textContent !== 'X' && cell.textContent !== 'O' ? true : false;
    }

    let storeMove = (cell, player) => {
        for (var index in moves) {
            moves[index] = cells[index].textContent;
            if (cells[index] === cell) {
                player.moves.push(index);
            }
        }
    }

    let markBoard = (cell, player) => {
        if (checkIfPlayed(cell, player)) {
            player === player1 ? moveValue = 'X' : moveValue = 'O';
            cell.textContent = moveValue;
            storeMove(cell, player);
            renderBoard();
            if (gameFlow.checkWinner(player)) {
                gameFlow.foundWinner(player);
                return
            }
            gameFlow.tieCheck();
            gameFlow.changePlayerTurn();
            togglePlayerColor(player);
        }
    }

    let reset = () => {
        moves = Array(9).fill('');
        renderBoard();
    }

    let makeAnnouncement = (string) => {
        toggleAnnouncement();
        announcementContent.textContent = string;
    }

    let toggleSettings = () => {
        settingsBackground.classList.toggle('hide');
        settingsForm.classList.toggle('hide');
        warningText.textContent = '';
    }

    let toggleAnnouncement = () => {
        settingsBackground.classList.toggle('hide');
        announcement.classList.toggle('hide');
    }

    let displayWinCondition = (winCondition) => {
        settingsDisplay.textContent = winCondition;
    }

    let initListeners = () => {
        settingsButton.addEventListener('click', () => toggleSettings());
        cancelButton.addEventListener('click', () => toggleSettings());
        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const playerOneName = document.getElementById('player1-name').value;
            const playerTwoName = document.getElementById('player2-name').value;
            const numberOfRounds = document.getElementById('round-setting').value;

            if (playerOneName === '' || playerTwoName === '' || numberOfRounds <= 0) {
                warningText.textContent = 'Please finish filling out the form';
            } else {
                gameFlow.setNewGame(playerOneName, playerTwoName, numberOfRounds);
                toggleSettings();
                settingsForm.reset();
            }
        })

        announcement.addEventListener('click', () => {
            toggleAnnouncement();
            gameFlow.newRound();
        })

        cells.forEach(cell => {
            cell.addEventListener('click', (e) => {
                if (gameFlow.checkForRoundOver() === true) {
                    return
                } else {
                    markBoard(e.target, gameFlow.playerTurn());
                }
            });
        })
    }

    return {
        updateNames,
        updateScores,
        reset,
        initListeners,
        makeAnnouncement,
        displayWinCondition,
        togglePlayerColor
    };
})();

const gameFlow = (() => {
    let turn = 0;
    let newGamebutton = document.querySelector('.new-game');
    let isRoundOver = false;
    let isGameOver = false;
    let winCondition = 3;

    let getWinCondition = () => winCondition;

    let playerTurn = () => {
        if (player1.isTurn === true) {
            return player1;
        } else return player2
    };

    let changePlayerTurn = () => {
        player1.isTurn = !player1.isTurn;
        turn += 1;
    };

    let winningCombos = [
        ['0', '1', '2'],
        ['3', '4', '5'],
        ['6', '7', '8'],
        ['0', '4', '8'],
        ['2', '4', '6'],
        ['0', '3', '6'],
        ['1', '4', '7'],
        ['2', '5', '8']
    ];

    const checkWinner = (player) =>
        winningCombos.some((winVal) =>
            winVal.every((winPos) => player.moves.includes(winPos)),
        );

    let foundWinner = (player) => {
        player.addScore();
        gameBoard.updateScores();
        roundOverToggle();
        if (checkForGameWinner(player)) {
            gameBoard.makeAnnouncement(`${player.getName()} has won the game!`)
        } else {
            gameBoard.makeAnnouncement(`${player.getName()} has won the round!`);
        }
    }

    let tieCheck = () => {
        turn === 8 ? isTie() : false;
    }

    let isTie = () => {
        roundOverToggle();
        gameBoard.makeAnnouncement(`${player1.getName()} and ${player2.getName()} have tied!`);
    }

    let checkForRoundOver = () => {
        return isRoundOver;
    };

    let roundOverToggle = () => {
        isRoundOver = !isRoundOver;
        return isRoundOver;
    }

    let resetPlayers = (isNewGame) => {
        if (isNewGame) {
            player1.resetGame();
            player2.resetGame();
        } else {
            player1.resetRound();
            player2.resetRound();
        }
    }

    let resetGameBoard = () => {
        turn = 0;
        gameBoard.reset();
    }

    let newRound = () => {
        if (isGameOver === true || isRoundOver === false) return;
        else {
            resetGameBoard();
            resetPlayers();
            isRoundOver = false;
        }
    }

    let newGame = () => {
        resetPlayers(true);
        resetGameBoard();
        gameBoard.updateScores();
        isRoundOver = false;
        isGameOver = false;
        gameBoard.makeAnnouncement(`${player1.getName()} VS ${player2.getName()}`);
        gameBoard.displayWinCondition(winCondition);
    }

    let checkForGameWinner = (player) => {
        if (scorecheck(player)) {
            isGameOver = true;
            return true
        }
    }

    let scorecheck = (player) => {
        if (player.getScore() === getWinCondition()) {
            return true;
        } else {
            return false;
        }
    }

    let setNewGame = (playerOneName, playerTwoName, numberOfRounds) => {
        player1.setName(playerOneName);
        player2.setName(playerTwoName);
        winCondition = Number(numberOfRounds);
        newGame();
        gameBoard.updateNames();
    }

    let initButtons = () => {
        newGamebutton.addEventListener('click', newGame);
    }

    return {
        changePlayerTurn,
        playerTurn,
        checkWinner,
        checkForRoundOver,
        roundOverToggle,
        newRound,
        initButtons,
        checkForGameWinner,
        foundWinner,
        setNewGame,
        isGameOver,
        tieCheck
    }
})();

const player1 = Player('Jeff');
const player2 = Player('Andre');
player1.isTurn = true;
gameBoard.togglePlayerColor('player1');
gameBoard.updateNames()
gameBoard.updateScores()
gameBoard.initListeners();
gameFlow.initButtons();