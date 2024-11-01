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
    render();

    return { setValueAt, getValueAt, render };
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

    const play = (index) => {
        if(gameBoard.getValueAt(index) !== " ") {
            console.log("That cell is already occupied! Please select another one.");
            return;
        }

        gameBoard.setValueAt(index, currentPlayer.getSelection());
        if(gameHandler.checkWin(currentPlayer.getSelection())) {
            console.log(`Congratulations! ${currentPlayer.getName()} won!`);
        } else if(gameHandler.checkDraw()) {
            console.log(`Is a draw!`)
        } else {
            currentPlayer = currentPlayer === firstPlayer ? secondPlayer : firstPlayer;
        }

        gameBoard.render();
    };

    return { play };
})();

playerController.play(5);
playerController.play(3);
playerController.play(7);
playerController.play(9);
playerController.play(6);
playerController.play(1);
playerController.play(8);
playerController.play(2);
playerController.play(4);