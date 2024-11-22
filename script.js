// Gameboard
const Gameboard = (function () {
    const board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ];
    
    // function for getting board status
    const getBoard = () => board;
    // function for a player's move
    const updateBoard = (row, col, token) => {
        if (board[row][col] === "") {
            board[row][col] = token;
            return true;
        }
        return false;
    }
    
    return { board, getBoard, updateBoard };
}) ();

// Factory Function for Players
function createPlayer (name, token) {
    return { name, token };
}

// Game Controller
function GameController (gameboard) {
    // Switch current player function
    const switchTurn = (currentPlayer) => {
            return currentPlayer === Players[0] ? Players[1] : Players[0];
    }

    // Check Tie
    const checkTie = (gameboard) => {
        // check if all cells are filled
        return gameboard.flat().every(cell => cell !== "");
    }

    const checkWinner = (gameboard, winningConditions, currentPlayer) => {
        // check if any condition is met
        const winningCondition = winningConditions.some(condition => {
            return condition.every(([row, col]) => gameboard[row][col] === currentPlayer.token);
        })
        // return the player object if found
        return winningCondition ? currentPlayer : null;
    }

    const updateGameStatus = (hasWinner, isTie) => {
        console.log(hasWinner);
        if (hasWinner) {
            return GameStatus.end;
        } else if (isTie) {
            return GameStatus.tie;
        } else {
            return GameStatus.active;
        }
    }

    // get board variable
    const getBoard = Gameboard.getBoard;

    // Create 2 Players
    const Players = [ createPlayer("John", "X"), createPlayer("Mary", "O")];

    // Set up currentPlayer variable for tracking
    let currentPlayer = Players[0];

    // Winning conditions
    const winningConditions = [
        // horizontal
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        // vertical
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        // iagonals
        [[0, 0], [1, 1], [2, 2]],
        [[0, 2], [1, 1], [2, 0]]
    ]

    // Set up game status object for choices
    const GameStatus = {
        active: "active",
        end: "end",
        tie: "tie"
    };

    //Set up game status variable for tracking
    let gameStatus = GameStatus.active;

    // Keep the game going unless it has ended
    while (gameStatus === GameStatus.active) {
        // prompt for move
        const [ row, col ] = prompt("Move: ").split(", ");
        // update board
        Gameboard.updateBoard(row, col, currentPlayer.token);
        console.log(getBoard);
        // Check Winner
        const winner = checkWinner(getBoard, winningConditions, currentPlayer);
        // Check Tie
        const isTie = checkTie(getBoard);
        // Change Game Status if needed
        gameStatus = updateGameStatus(winner, isTie);
        // Switch Player
        console.log(currentPlayer);
        if (gameStatus === GameStatus.active) {
            currentPlayer = switchTurn(currentPlayer);
        }
        console.log(currentPlayer);
    }
    console.log(gameStatus);
} (Gameboard);
