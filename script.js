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
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                coordinates.push([i, j]);
            }
        }
        return coordinates;
    }

    // reset board function
    const resetBoard = () => {
        board.forEach(row => row.fill(""));
    }
    
    return { board, getBoard, updateBoard, getCoordinates, resetBoard };
}) ();

// Factory Function for Players
function createPlayer (name, token) {
    return { name, token };
}

// Game Controller
function GameController (gameboard) {
    // Update DOM
    const updateCellContent = (target, isUpdated, token) => {
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
        const missingNames = getMissingNames();
        alertMissingName(missingNames);
        if (gameStatus !== "active" || missingNames.length > 0) {
            return;
        }
        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);
        // Update gameboard on backend
        const isUpdated = gameboard.updateBoard(row, col, currentPlayer.token);
        // Update Cell Value on frontend
        updateCellContent(e.target, isUpdated, currentPlayer.token);
        // Check Winner
        const winner = checkWinner(getBoard, winningConditions, currentPlayer);
        // Check Tie
        const isTie = checkTie(getBoard);
        // Change Game Status if needed
        gameStatus = updateGameStatus(winner, isTie);
        // Announce the result if needed
        announceResult(gameStatus, winner);
        // Switch Player if needed
        if (gameStatus === GameStatus.active && isUpdated) {
            currentPlayer = switchTurn(currentPlayer);
        }
    }

    // Generate cells in gameboard
    const generateCells = () => {
        const boardElement = document.querySelector(".gameboard");

        // Clear board before the generation
        while (boardElement.firstChild) {
            boardElement.removeChild(boardElement.firstChild);
        }

        // Add cells
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

    // initialize Start Btn
    const initializeStartBtn = () => {
        const startBtn = document.querySelector(".start-btn");
        startBtn.addEventListener("click", (e) => {
            const mainContent = document.querySelector(".main-content");
            const lastRow = document.querySelector(".last-row");
            mainContent.classList.add("visible");
            lastRow.classList.add("visible");
            e.target.remove();
        })
    }

    // Create Player Display helper function
    const createDisplayElements = (name, token) => {
        const labelElement = document.createElement("p");
        const nameElement = document.createElement("p");
        labelElement.textContent = `Player ${token}:`;
        nameElement.classList.add("bold");
        nameElement.textContent = name;
        return [ labelElement, nameElement ];
    }

    // Display Player Names Function
    const initializePlayerNames = () => {
        const infoContainers = document.querySelectorAll(".info-container");
        infoContainers.forEach(infoContainer => {
            const inputSection = infoContainer.querySelector(".input-section");
            const token = infoContainer.dataset.token;

            inputSection.addEventListener("submit", (e) => {
                e.preventDefault();
                const playerName = inputSection.querySelector(".name-field").value.trim();
                if (playerName) {
                    inputSection.classList.add("hidden");
                    const outputSection = infoContainer.querySelector(".output-section");
                    const [ labelElement, nameElement ] = createDisplayElements(playerName, token);
                    outputSection.append(labelElement, nameElement);
                    inputSection.setAttribute("data-submitted", "true");
                    // update the player's name based on the input
                    const matchPlayer = Players.find(player => player.token === token);
                    matchPlayer.name = playerName;
                }
            })
        })  
    }

    // Check whether both names are inputted before start
    const getMissingNames = () => {
        const inputSections = document.querySelectorAll(".input-section");
        return [...inputSections].filter(inputSection => inputSection.dataset.submitted !== "true");
        
    }

    // Alert for inputting name
    const alertMissingName = (missingNames) => {
        missingNames.forEach(inputSection => {
            if (!inputSection.querySelector(".alert")) {
                const missingNameAlert = document.createElement("p");
                const token = inputSection.parentElement.dataset.token;
                missingNameAlert.classList.add("alert");
                missingNameAlert.textContent = `Please enter Player ${token}'s name`;    
                inputSection.append(missingNameAlert);
            }
        })
    }

    // Announce game result
    const announceResult = (status, winner) => {
        const result = document.querySelector(".result");
        if (status === GameStatus.end) {
            result.textContent = `${winner.name} won!`;
        } else if (status === GameStatus.tie) {
            result.textContent = "The game is tied."
        }
    }

    // Reset status and turn helper function
    const resetStatusAndTurn = () => {
        gameStatus = GameStatus.active;
        currentPlayer = Players[0];
    }

    // Reset result element
    const resetResult = () => {
        const result = document.querySelector(".result");
        result.textContent = "";
    }

    // Set up  reset btn
    const initializeRestartBtn = () => {
        const restartBtn = document.querySelector(".restart-btn");
        restartBtn.addEventListener("click", () => {
            // reset the board on back end
            gameboard.resetBoard();
            // reset the board on front end
            generateCells();
            // reset status
            resetStatusAndTurn();
            // reset 
            resetResult();
        });
    }

    // get board variable
    const getBoard = gameboard.getBoard();

    // Create 2 Players
    const Players = [createPlayer("", "X"), createPlayer("", "O")];

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

    initializeStartBtn();
    initializePlayerNames();
    generateCells();
    initializeRestartBtn();
};

GameController(Gameboard);
