function gameBoard() {
    let board = ['', '', '', '', '', '', '', '', '']
    let turnCount = 0;

    function playSquare(i) {
        turnCount++

        // check that input is valid
        if (i < 1 || i > 9) return

        // add appropriate turn-based input
        if (turnCount % 2 !== 0) {
            board[i-1] = "X"
        } else if (turnCount % 2 === 0) {
            board[i-1] = "O"
        }
    }

    function displayBoard() {
        console.log(board)
    }

    return {playSquare, displayBoard}
}

let game = gameBoard()
