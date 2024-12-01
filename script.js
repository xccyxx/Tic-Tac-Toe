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

    // function for generating a list of all coordinates of the board
    const getCoordinates = () => {
        const coordinates = [];
        for (i = 0; i < board.length; i++) {
            for (j = 0; j < board[i].length; j++) {
                coordinates.push([i, j]);
            }
        }
        return coordinates;
    }
    
    return { board, getBoard, updateBoard, getCoordinates };
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
        if (hasWinner) {
            return GameStatus.end;
        } else if (isTie) {
            return GameStatus.tie;
        } else {
            return GameStatus.active;
        }
    }

    // Set up buttons event listener
    const handleClick = (e) => {
        if (gameStatus !== "active") {
            return;
        }
        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);
        // Update gameboard on backend
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

    // Create Player Display helper function
    const createPlayerDisplay = (token, name) => {
        const playerLabelElement = document.createElement("p");
        const playerNameElement = document.createElement("p");
        playerLabelElement.textContent = `Player ${token}:`;
        playerNameElement.textContent = name;
        return [ playerLabelElement, playerNameElement ];
    }

    // Display Player Names Function
    const handleNameInput = () => {
        const infoContainers = document.querySelectorAll(".info-container");
        infoContainers.forEach(infoContainer => {
            const inputSection = infoContainer.querySelector(".input-section");
            inputSection.addEventListener("submit", (e) => {
                e.preventDefault();
                const playerName = inputSection.querySelector(".name-field").value.trim();
                if (playerName) {
                    inputSection.classList.add("hidden");
                    const outputSection = infoContainer.querySelector(".output-section");
                    const token = inputSection.dataset.token.toUpperCase();
                    const [ playerLabelElement, playerNameElement ] = createPlayerDisplay(token, playerName);
                    outputSection.append(playerLabelElement, playerNameElement);
                }
            })
        })  
    }

    // get board variable
    const getBoard = gameboard.getBoard();

    // Create 2 Players
    const Players = [ createPlayer("John", "X"), createPlayer("Mary", "O")];

    // Set up currentPlayer variable for tracking
    let currentPlayer = Players[0];

    // Winning conditions
    const winningConditions = [
        // Horizontal
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        // Vertical
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        // Diagonals
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

    // Generate cells in gameboard
    const generateCells = () => {
        const boardElement = document.querySelector(".gameboard");
        const coordinates = gameboard.getCoordinates();
        coordinates.forEach(([row, col])=> {
            const cell = document.createElement("button");
            cell.setAttribute("data-row", row);
            cell.setAttribute("data-col", col);
            cell.classList.add("cell");
            cell.textContent = "";
            cell.addEventListener("click", (e) => {
                handleClick(e);
            })
            boardElement.append(cell);
        })
    }
    generateCells();
    handleNameInput();


};

GameController(Gameboard);
