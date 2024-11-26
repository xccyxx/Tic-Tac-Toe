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
    // Update DOM
    const updateCellTextContent = (target, isUpdated, token) => {
        if (isUpdated) {
            target.textContent = token;
            if (token === "X") {
                target.classList.add("token-x");
            }
            if (token === "O") {
                target.classList.add("token-o");
            }
            return true;
        } else {
            return false;
        }
    }

    // Switch current player function
    const switchTurn = (currentPlayer) => {
            return currentPlayer === Players[0] ? Players[1] : Players[0];
    }

    const checkWinner = (gameboard, winningConditions, currentPlayer) => {
        // check if any condition is met
        const winningCondition = winningConditions.some(condition => {
            return condition.every(([row, col]) => gameboard[row][col] === currentPlayer.token);
        })
        // return the player object if found
        return winningCondition ? currentPlayer : null;
    }

    // Check Tie
    const checkTie = (gameboard) => {
        // check if all cells are filled
        return gameboard.flat().every(cell => cell !== "");
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
    const getBoard = gameboard.getBoard();

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

    // Set up game status variable for tracking
    let gameStatus = GameStatus.active;

    // Set up buttons event listener
    const handleClick = (e) => {
        if (gameStatus !== "active") {
            return;
        }
        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);
        // Update gameboard on backend
        console.log(currentPlayer.token);
        const isUpdated = gameboard.updateBoard(row, col, currentPlayer.token);
        // Update Cell Value on frontend
        updateCellTextContent(e.target, isUpdated, currentPlayer.token);
        // Check Winner
        const winner = checkWinner(getBoard, winningConditions, currentPlayer);
        // Check Tie
        const isTie = checkTie(getBoard);
        // Change Game Status if needed
        gameStatus = updateGameStatus(winner, isTie);
        // Switch Player if needed
        if (gameStatus === GameStatus.active && isUpdated) {
            currentPlayer = switchTurn(currentPlayer);
        }
    }

    // Generate cells in gameboard
    const generateCells = () => {
        const boardElement = document.querySelector(".gameboard");
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const cell = document.createElement("button");
                cell.setAttribute("data-row", i);
                cell.setAttribute("data-col", j);
                cell.classList.add("cell");
                cell.textContent = "";
                cell.addEventListener("click", (e) => {
                    handleClick(e);
                })
                boardElement.append(cell);
            }
        }
    }
    generateCells();
};

GameController(Gameboard);
