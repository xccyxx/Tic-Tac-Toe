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
function GameController () {
    // Switch current player function
    const switchTurn = (currentPlayer) => {
        return currentPlayer === Players[0] ? Players[1] : Players[0];
    }

    // Check Tie
    const checkTie = (gameboard) => {
        
    }

    // Create 2 Players
    const Players = [ createPlayer("John", "X"), createPlayer("Mary", "O")];

    // Set up currentPlayer variable for tracking
    let currentPlayer = Players[0];

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
        const [ row, col ] = prompt("Move: ").split(", ")
        // update board
        Gameboard.updateBoard(row, col, currentPlayer.token);
        console.log(Gameboard.getBoard());
        // Switch Player
        console.log(currentPlayer);
        currentPlayer = switchTurn(currentPlayer);
        console.log(currentPlayer);
    }

}

GameController ();