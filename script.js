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
    return [...board];
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

    //check for winner and return the winning symbol
    for (const combination of winningCombinations) {
      const [a, b, c] = combination;

      if (board[a] === board[b] && board[b] === board[c] && board[c] !== "") {
        return { winningCombo: [a, b, c], winningSymbol: board[a] };
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

  function isBoardEmpty() {
    return board.every((square) => square === "");
  }

  return {
    fillSquare,
    logBoard,
    isMoveValid,
    checkForDraw,
    checkForWinner,
    resetBoard,
    isBoardEmpty,
  };
}

function gameController() {
  let board = gameBoard();
  let turnCount = 0;
  let gameOver = false;
  let winner = false;

  let player1 = {
    name: "×",
    token: "×",
  };

  let player2 = {
    name: "○",
    token: "○",
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
    player1.name = "×";
    player2.name = "○";
  }

  function play(square) {
    //input validation
    if (!board.isMoveValid(square)) {
      console.log("Invalid move");
      return;
    }

    if (gameOver) {
      console.log(winner ? `${winner} wins` : "Draw");
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
    winner = board.checkForWinner().winningSymbol;
    if (winner) {
      gameOver = true;
    } else if (board.checkForDraw()) {
      gameOver = true;
    }
  }

  function printBoard() {
    return board.logBoard();
  }

  function isGameOver() {
    if (gameOver) {
      if (winner) {
        return winner === player1.token
          ? `${player1.name} wins`
          : `${player2.name} wins`;
      } else if (board.checkForDraw()) {
        return "Draw";
      }
    }
  }

  function havePlayerNamesBeenSupplied() {
    return player1.name !== "×" && player2.name !== "○";
  }

  return {
    play,
    newGame,
    printBoard,
    supplyPlayerName,
    isGameOver,
    havePlayerNamesBeenSupplied,
    isBoardEmpty: board.isBoardEmpty,
    checkForWinner: board.checkForWinner,
  };
}

(function displayController() {
  const game = gameController();
  const squares = document.querySelectorAll(".square");
  const infoCard = document.querySelector(".info-card");
  const bothPlayerFields = document.querySelectorAll("span");
  const playerOneField = document.querySelector("#player-one");
  const playerTwoField = document.querySelector("#player-two");
  const startResetBtn = document.querySelector("#startBtn");
  const startInstructionText = document.querySelector(".game-instructions");

  function updateUIBoard() {
    const boardState = game.printBoard();
    for (let i = 0; i < boardState.length; i++) {
      squares[i].textContent = boardState[i];
    }
  }

  function removeInstructionText() {
    startInstructionText.textContent = "";
  }

  function addInstructionText() {
    startInstructionText.textContent =
      "or, click any square in the board to begin without player names";
  }

  function updateInfoCard(message) {
    infoCard.textContent = message;
  }

  function highlightWinningSquares() {
    const winningIndices = game.checkForWinner().winningCombo;

    winningIndices.forEach((winningIndex) => {
      squares[winningIndex].classList.add("winning-square");
    });
  }

  function resetHighlightedSquares() {
    const boardState = game.printBoard();
    for (let i = 0; i < boardState.length; i++) {
      squares[i].classList.remove("winning-square");
    }
  }

  function displayGameResult() {
    const gameResult = game.isGameOver();

    if (gameResult) {
      updateInfoCard(gameResult);
      highlightWinningSquares();
    }
  }

  function disablePlayerFields() {
    bothPlayerFields.forEach((field) => {
      field.style.opacity = "0";
    });
    playerOneField.disabled = true;
    playerTwoField.disabled = true;
    playerOneField.value = "";
    playerTwoField.value = "";
  }

  function enablePlayerFields() {
    bothPlayerFields.forEach((field) => {
      field.style.opacity = "1";
    });
    playerOneField.disabled = false;
    playerTwoField.disabled = false;
  }

  function arePlayerFieldsFilled() {
    return playerOneField.value && playerTwoField.value;
  }

  function collectPlayerNames() {
    if (playerOneField.value !== "" && playerTwoField.value !== "") {
      game.supplyPlayerName(playerOneField.value, playerTwoField.value);
    }
  }

  function resetGame() {
    game.newGame();
    updateUIBoard();
    enablePlayerFields();
    addInstructionText();
    startResetBtn.textContent = "Start Game";
    updateInfoCard("");
    resetHighlightedSquares();
  }

  startResetBtn.addEventListener("click", () => {
    const canStartNewGameWithPlayerNames =
      game.havePlayerNamesBeenSupplied() === false &&
      game.isBoardEmpty() &&
      arePlayerFieldsFilled();

    if (canStartNewGameWithPlayerNames) {
      collectPlayerNames();
      disablePlayerFields();
      removeInstructionText();
      startResetBtn.textContent = "Reset Game";
    } else {
      resetGame();
    }
  });

  squares.forEach((square, index) => {
    square.addEventListener("click", () => {
      if (game.havePlayerNamesBeenSupplied() === false) {
        disablePlayerFields();
        removeInstructionText();
        startResetBtn.textContent = "Reset Game";
      }
      game.play(index);
      updateUIBoard();
      displayGameResult();
    });
  });

})();
