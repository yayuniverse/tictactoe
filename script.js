function gameBoard() {
  const board = ["", "", "", "", "", "", "", "", ""];
  //visual representation
  //[0, 1, 2]
  //[3, 4, 5]
  //[6, 7, 8]

  function fillSquare(i, value) {
    board[i] = value;
  }

  function logBoard() {
    console.log(board);
  }

  function isMoveValid(square) {
    return square >= 0 && square <= 8 && board[square] === "";
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

    //check for winner
    for (const combination of winningCombinations) {
      const [a, b, c] = combination;

      if (board[a] === board[b] && board[b] === board[c] && board[c] !== "") {
        return board[c];
      }
    }

    return false;
  }

  function checkForDraw() {
    return !board.includes("");
  }

  function resetBoard() {
    for (let i = 0; i <= board.length - 1; i++) {
      board[i] = "";
    }
  }

  return {
    fillSquare,
    logBoard,
    isMoveValid,
    checkForDraw,
    checkForWinner,
    resetBoard,
  };
}

function gameController() {
  let board = gameBoard();
  let turnCount = 0;
  let gameOver = false;
  let winner = false;

  let player1 = {
    name: "X",
    token: "X",
  };

  let player2 = {
    name: "O",
    token: "O",
  };

  function supplyPlayerName(playerOneName, playerTwoName) {
    player1.name = playerOneName;
    player2.name = playerTwoName;
  }

  function newGame() {
    board.resetBoard();
    turnCount = 0;
    gameOver = false;
    winner = false;
    player1.name = "X";
    player2.name = "O";
  }

  function play(square) {
    //input validation
    if (!board.isMoveValid(square)) {
      console.log("Invalid move");
      return;
    }

    if (gameOver) {
      console.log(winner ? "Winner found" : "Draw");
      return;
    }

    // add appropriate turn-based input
    if (turnCount % 2 === 0) {
      board.fillSquare(square, player1.token);
    } else {
      board.fillSquare(square, player2.token);
    }

    turnCount++;

    //win or draw check
    winner = board.checkForWinner();
    if (winner) {
      console.log(
        winner === player1.token
          ? `${player1.name} wins`
          : `${player2.name} wins`
      );
      gameOver = true;
    } else if (board.checkForDraw()) {
      console.log(`Draw`);
      gameOver = true;
    }
  }

  function printBoard() {
    board.logBoard();
  }

  return { play, newGame, printBoard, supplyPlayerName };
}

const game = gameController();
