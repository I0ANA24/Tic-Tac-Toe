const gameBoard = (function () {
    let cells = [];

    const createCell = () => {
        let value = " ";

        const setValue = (newValue) => {
            value = newValue;
        };

        const getValue = () => {
            return value;
        };

        return { setValue, getValue };
    };

    const initBoard = () => {
        for(let i = 0; i < 9; i++)
            cells.push(createCell());
    };

    const setValueAt = (index, newValue) => {
        cells[index - 1].setValue(newValue);
    };

    const getValueAt = (index) => {
        return cells[index - 1].getValue();
    };

    const render = () => {
        console.log(
            `
                [${getValueAt(1)}][${getValueAt(2)}][${getValueAt(3)}]
                [${getValueAt(4)}][${getValueAt(5)}][${getValueAt(6)}]
                [${getValueAt(7)}][${getValueAt(8)}][${getValueAt(9)}]
            `
        );
    };

    initBoard();

    document.addEventListener("DOMContentLoaded", () => {
        const firstPlayerNickname = sessionStorage.getItem("firstPlayerNickname");
        const secondPlayerNickname = sessionStorage.getItem("secondPlayerNickname");

        if(firstPlayerNickname) {
            document.getElementById("p1").textContent = firstPlayerNickname;
        } else {
            document.getElementById("p1").textContent = "Nickname1";
        }

        if(secondPlayerNickname) {
            document.getElementById("p2").textContent = secondPlayerNickname;
        } else {
            document.getElementById("p2").textContent = "Nickname2";
        }
    });

    return { setValueAt, getValueAt, render};
})();

const gameHandler = (function () {
    const checkWin = (selection) => {

        const rowWin = (index, selection) => {
            for(let i = 3 * (index - 1) + 1; i <= 3 * index; i++)
                if(gameBoard.getValueAt(i) != selection)
                    return false;
            return true;
        };

        const columnWin = (index, selection) => {
            for(let i = index; i <= 6 + index; i += 3)
                if(gameBoard.getValueAt(i) !== selection)
                    return false;
            return true;
        };

        const diagonalWin = (index, selection) => {
            if(index === 1) {
                for(let i = 1; i <= 9; i += 4)
                    if(gameBoard.getValueAt(i) !== selection)
                        return false;
                return true;
            }

            for(let i = 3; i <= 7; i += 2)
                if(gameBoard.getValueAt(i) !== selection)
                    return false
            return true;
        };

        for(let i = 1; i <= 3; i++) {
            if(rowWin(i, selection) || columnWin(i, selection))
                return true;
            if(i <= 2 && diagonalWin(i, selection))
                return true;
        }

        return false;
    };

    const checkDraw = () => {
        const fullBoard = () => {
            for(let i = 1; i <= 9; i++)
                if(gameBoard.getValueAt(i) === " ")
                    return false;
            return true;
        };

        if(fullBoard() && !checkWin("X") && !checkWin("0"))
            return true;
        return false;
    };

    return { checkWin, checkDraw };
})();

const playerController = (function () {

    const createPlayer = (playerSelection, playerName) => {
        const getSelection = () => {
            return playerSelection;
        };
    
        const getName = () => {
            return playerName;
        };
        
        return { getSelection, getName };
    };

    const firstPlayer = createPlayer("X", "Ioana");
    const secondPlayer = createPlayer("0", "Matthew");
    let currentPlayer = firstPlayer;

    const firstPlayerScore = document.getElementById("p1-score");
    const drawsScore = document.getElementById("dr-score");
    const secondPlayerScore = document.getElementById("p2-score");
    let firstPlayerScoreValue = 0;
    let drawsScoreValue = 0;
    let secondPlayerScoreValue = 0;

    const play = (index, cell) => {
        if(currentPlayer.getSelection() === 'X')
            cell.textContent = currentPlayer.getSelection();
        else
            cell.textContent = 'O';
        if(cell.textContent === "X")
            cell.classList.add("letterX");
        else
            cell.classList.add("letterO");

        gameBoard.setValueAt(index, currentPlayer.getSelection());
        if(gameHandler.checkWin(currentPlayer.getSelection())) {
            console.log(`Congratulations! ${currentPlayer.getName()} won!`);
            if(currentPlayer.getSelection() === 'X') {
                firstPlayerScoreValue++;
                firstPlayerScore.textContent = firstPlayerScoreValue;
            } else {
                secondPlayerScoreValue++;
                secondPlayerScore.textContent = secondPlayerScoreValue;
            }

            newRound();
            
        } else if(gameHandler.checkDraw()) {
            console.log(`Is a draw!`);
            drawsScoreValue++;
            drawsScore.textContent = drawsScoreValue;

            newRound();
        } else {
            currentPlayer = currentPlayer === firstPlayer ? secondPlayer : firstPlayer;
        }

        gameBoard.render();
    };

    const newRound = () => {
        currentPlayer = firstPlayer;

        const board = document.querySelector(".tic-tac-toe-board");
        const DOMcells = document.querySelectorAll(".tic-tac-toe-cell");
    
        const modalX = document.getElementById("modalX");
        const modalO = document.getElementById("modalO");
    
        for(let i = 1; i <= 9; i++)
            gameBoard.setValueAt(i, " ");
        DOMcells.forEach(cell => {
            if(cell.querySelector("p")) {
                const paragraph = cell.querySelector("p");
                cell.removeChild(paragraph);
            }
        });

        if(!modalO.classList.contains("aqua-color")) {
            modalX.classList.toggle("aqua-color");
            modalO.classList.toggle("aqua-color");
            console.log("intra");
        }
    };

    const restart = () => {
        currentPlayer = firstPlayer;

        firstPlayerScore.textContent = 0;
        drawsScore.textContent = 0;
        secondPlayerScore.textContent = 0;
        firstPlayerScoreValue = 0;
        drawsScoreValue = 0;
        secondPlayerScoreValue = 0;
    };

    return { play, restart };
})();

const PLAY = (function () {
    const board = document.querySelector(".tic-tac-toe-board");
    const boardChildren = Array.from(board.children);
    const DOMcells = document.querySelectorAll(".tic-tac-toe-cell");

    const modalX = document.getElementById("modalX");
    const modalO = document.getElementById("modalO");

    DOMcells.forEach(cell => {
        cell.addEventListener("click", () => {
            if(!cell.querySelector("p")) {
                const newParagraph = document.createElement("p");
                newParagraph.classList.add("cell-letter");
                cell.appendChild(newParagraph);

                const index = boardChildren.indexOf(cell);
                playerController.play(index + 1, newParagraph);
                modalX.classList.toggle("aqua-color");
                modalO.classList.toggle("aqua-color");
            }
        });
    });

    const restartButton = document.getElementById("restart");
    restartButton.addEventListener("click", () => {
        for(let i = 1; i <= 9; i++)
            gameBoard.setValueAt(i, " ");
        DOMcells.forEach(cell => {
            if(cell.querySelector("p")) {
                const paragraph = cell.querySelector("p");
                cell.removeChild(paragraph);
            }
        });
        playerController.restart();

        if(modalO.classList.contains("aqua-color")) {
            modalX.classList.toggle("aqua-color");
            modalO.classList.toggle("aqua-color");
        }
    });
})();