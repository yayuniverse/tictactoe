function gameBoard() {
  let board = ["", "", "", "", "", "", "", "", ""];
  //visual representation
  //[0, 1, 2]
  //[3, 4, 5]
  //[6, 7, 8]

  let turnCount = 0;

  function playSquare(i) {
    turnCount++;

    // check that input is valid
    if (i < 1 || i > 9) return;

    // add appropriate turn-based input
    if (turnCount % 2 !== 0) {
      board[i - 1] = "X";
    } else if (turnCount % 2 === 0) {
      board[i - 1] = "O";
    }

    checkForWinner();
  }

  function checkForWinner() {
    const winningCombinations = [
      [0, 1, 2], // top row
      [3, 4, 5], // middle row
      [6, 7, 8], // bottom row
      [0, 3, 6], // left column
      [1, 4, 7], // middle column
      [2, 5, 8], // right column
      [0, 4, 8], // diagonal top-left to bottom-right
      [2, 4, 6], // diagonal top-right to bottom-left
    ];

    for (const combination of winningCombinations) {
      const [a, b, c] = combination;

      if (board[a] === board[b] && board[b] === board[c] && board[c] !== "") {
        console.log(`${board[c]} wins`);
        return;
      }
    }
    
    if (!board.includes("")) {
      console.log("Draw");
    }
  }

  function displayBoard() {
    console.log(board);
  }
  
  return { playSquare, displayBoard };
}

let game = gameBoard();
