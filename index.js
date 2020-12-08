const Player = (name, symbol) => {
    return { name, symbol }
}

const game = (() => {
    
    const players = []
    let gameboard = new Array(9);
    let turn = 1;

    const getPlayers = () => players;

    const addPlayer = (player) => {
        if (players.length >= 2) { return }
        players.push(player);
    }

    const getBoard = () => gameboard;

    const getTurn = () => turn;

    const takeTurn = () => { turn = countFilledSquares(gameboard) + 1; };

    const fillPosition = (symbol, position) => {
        if (gameboard[position] === undefined) {
            gameboard[position] = symbol;
        }
        else {
            alert("That square is occupied. Please choose an empty square");
        }
    }

    const resetBoard = () => {
        gameboard = new Array(9);
    }

    const resetTurnCount = () => { turn = 1 }

    return { 
        getPlayers,
        addPlayer,
        getBoard, 
        getTurn,
        takeTurn,
        fillPosition,
        resetBoard,
        resetTurnCount
    }

})();

function countFilledSquares(gameboard) {
    count = 0;
    gameboard.forEach((square) => { if (square) { count++; } });
    return count;
}

function playerFormHandler() {
    let currentPlayers = game.getPlayers();

    createPlayer();

    if (currentPlayers.length === 1) {
        document.querySelector('#name-input').value = ""
        document.querySelector('#name-input').setAttribute('placeholder', 'Player 2');
    }
    else {
        document.querySelector('#player-creation').remove();
        document.querySelector('.title').remove();
        displayPlayers();
        displayBoard();
    }
}

function createPlayer () {
    let name = document.querySelector('#name-input').value;

    if (name === "" ) { name = renameIfPlayerUnnamed(); }

    game.addPlayer(Player(name, determineSymbol()));
}


function renameIfPlayerUnnamed() {
    const numberOfCurrentPlayers = game.getPlayers().length;

    if (numberOfCurrentPlayers === 0) { return "Player 1"}
    return "Player 2"
}

function determineSymbol() {
    const numberOfCurrentPlayers = game.getPlayers().length;
    
    if (numberOfCurrentPlayers === 0) {return "X"}
    return "O";
}

function displayPlayers() {
    const [ player1, player2 ] = game.getPlayers();
    const playerHeader = document.createElement('div');
    playerHeader.classList.add('player-header');

    const player1Display = createPlayerHeader(player1);
    const player2Display = createPlayerHeader(player2);

    playerHeader.appendChild(player1Display);
    playerHeader.appendChild(player2Display);

    document.querySelector('body').prepend(playerHeader);
}


function createPlayerHeader(player) {
    const playerDisplay = document.createElement('div');
    const playerInfo = document.createElement('span');

    playerDisplay.classList.add('player-container');
    
    playerInfo.innerText = `${player.name}: ${player.symbol}'s`;

    playerDisplay.appendChild(playerInfo);

    return playerDisplay;
}

function displayBoard() {
    if (!document.querySelector('#board-container')) {
        document.querySelector('body').append(createBoard());
    }

    addClickHandlersToSquares();
}

function createBoard() {
    let boardContainer = document.createElement("div");
    boardContainer.setAttribute('id','board-container');
    return createSquares(boardContainer);
}

function createSquares(boardContainer) {
    for(i = 0; i < 9; i++) {
        let square = document.createElement("div");
        square.setAttribute('id',`sq-${i}`);
        square.classList.add('square');
        boardContainer.appendChild(square);
    }

    return boardContainer;
}

function addClickHandlersToSquares() {
    const squaresNodeList = document.querySelectorAll('.square');
    const squaresArray = [...squaresNodeList];

    squaresArray.forEach((square) => square.addEventListener("click", updateGameboard));
    squaresArray.forEach((square) => square.addEventListener("click", fillSquare));
    squaresArray.forEach((square) => square.addEventListener("click", declareWinner));
    squaresArray.forEach((square) => square.addEventListener("click", game.takeTurn));
}

function updateGameboard(e) {
    let squareID = e.target.id;
    let index = parseInt(squareID.slice(-1));
    let currentPlayer = getCurrentPlayer();

    game.fillPosition(currentPlayer.symbol, index);
}

function fillSquare() {
    const gameboard = game.getBoard();
    const squaresNodeList = document.querySelectorAll('.square');
    const squaresArray = [...squaresNodeList];

    for (let i = 0; i < squaresArray.length; i++) {
        if (gameboard[i] && squaresArray[i].innerText === "") {
            const symbolContainer = document.createElement('span');
            symbolContainer.classList.add('symbol');
            symbolContainer.innerText = gameboard[i];
            squaresArray[i].appendChild(symbolContainer);
        }
    }
}

function getCurrentPlayer() {
    const turn = game.getTurn();
    const players = game.getPlayers();

    if (turn % 2 === 0) {return players[1]}
    return players[0];
}

function declareWinner() {

    const winningSymbol = checkForWinner();
    const players = game.getPlayers();

    let winningPlayer;

    players.forEach( player => {
        if (player.symbol === winningSymbol) {
            winningPlayer = player.name;
        }
    });

    if (winningPlayer !== undefined) { 
        winnerBanner(winningPlayer);
        removeClickHandlersFromSquares();
        endGame();
    }
    
    if (checkForTie(winningPlayer)) {
        getTieBanner();
        endGame();
    }
}

function checkForWinner() {
    const gameboard = game.getBoard();
    const winningCombinations = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ];
    let winningSymbol = null;

    for(let combination = 0; combination < winningCombinations.length; combination++) {
        const firstSquareToCheck = winningCombinations[combination][0];
        const secondSquareToCheck = winningCombinations[combination][1];
        const thirdSquareToCheck = winningCombinations[combination][2];

        if (gameboard[firstSquareToCheck] && 
            gameboard[firstSquareToCheck] === gameboard[secondSquareToCheck] && 
            gameboard[secondSquareToCheck] === gameboard[thirdSquareToCheck]) { 
            
            winningSymbol = gameboard[firstSquareToCheck];
            break;
        }
    }

    return winningSymbol;
}

function winnerBanner(winningPlayer) {
    const body = document.getElementsByTagName('body')[0];
    const winnerBanner = document.createElement('h1');
    winnerBanner.setAttribute('id', 'banner');
    winnerBanner.innerText = `${winningPlayer} wins!`;
    body.append(winnerBanner);
}

function removeClickHandlersFromSquares() {
    const squaresNodeList = document.querySelectorAll('.square');
    const squaresArray = [...squaresNodeList];

    squaresArray.forEach( square => {
        square.replaceWith(square.cloneNode(true));
    });
}

function endGame() {
    removePointer();
    addResetButton();
}

function checkForTie(winningPlayer) {
    const gameboard = game.getBoard();
    let numberOfSquaresFilled = countFilledSquares(gameboard);

    if (winningPlayer === undefined && numberOfSquaresFilled === 9) {
        return true;
    }
    return false;
}

function getTieBanner() {
    const body = document.getElementsByTagName('body')[0];
    const tieBanner = document.createElement('h1');
    tieBanner.setAttribute('id','banner');
    tieBanner.innerText = `It's a Tie!`;
    body.append(tieBanner);
}

function removePointer() {
    const boardContainer = document.getElementById('board-container');
    boardContainer.style.cursor = "auto";
}

function addResetButton() {
    const resetButtonContainer = document.createElement('div');
    const resetButton = document.createElement('button');

    resetButtonContainer.setAttribute('class','button-container');
    resetButton.setAttribute('type','button');
    resetButton.setAttribute('class','reset');
    resetButton.innerText = "Reset";

    resetButtonContainer.appendChild(resetButton);
    document.getElementsByTagName('body')[0].appendChild(resetButtonContainer);

    resetButton.addEventListener("click", resetGame);
}

function resetGame() {
    game.resetBoard();
    game.resetTurnCount();
    
    document.getElementById('board-container').remove();
    document.getElementById('banner').remove();
    document.getElementsByTagName('button')[0].remove();

    displayBoard();

}

(function () {
    const createPlayerButton = document.querySelector('.player-submit');
    createPlayerButton.addEventListener('click', playerFormHandler);
})();