"use strict";

(() => {
  // References
  const grid = document.querySelectorAll("[data-cell]");
  const restartButton = document.getElementById("restartButton");
  const undoButton = document.getElementById("undoButton");
  const statusText = document.getElementById("status");

  // Constants and Game State
  const X_CLASS = "X";
  const O_CLASS = "O";
  let currentPlayer = X_CLASS;
  let board = Array(9).fill(null); // 3x3 grid representation
  let moveHistory = []; // Keep track of moves for undo
  let isGameOver = false;

  // Winning combinations (rows, columns, diagonals)
  const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  // Initialize Game
  startGame();

  // Game Start
  function startGame() {
    grid.forEach((cell, index) => {
      cell.textContent = "";
      cell.classList.remove(X_CLASS, O_CLASS);
      cell.addEventListener("click", () => handleCellClick(index), { once: true });
    });

    board.fill(null);
    moveHistory = [];
    isGameOver = false;
    currentPlayer = X_CLASS;
    statusText.textContent = `Player ${currentPlayer}'s turn`;
  }

  // Handle cell click
  function handleCellClick(index) {
    if (isGameOver || board[index]) return;

    board[index] = currentPlayer;
    moveHistory.push(index);

    const cell = grid[index];
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer);

    if (checkWin(currentPlayer)) {
      statusText.textContent = `Player ${currentPlayer} wins!`;
      isGameOver = true;
      return;
    } else if (board.every(cell => cell !== null)) {
      statusText.textContent = "It's a draw!";
      isGameOver = true;
      return;
    }

    // Switch turns
    currentPlayer = currentPlayer === X_CLASS ? O_CLASS : X_CLASS;
    statusText.textContent = `Player ${currentPlayer}'s turn`;
  }

  // Check for a win
  function checkWin(player) {
    return WINNING_COMBINATIONS.some(combination => {
      return combination.every(index => board[index] === player);
    });
  }

  // Restart game
  restartButton.addEventListener("click", startGame);

  // Undo last move
  undoButton.addEventListener("click", () => {
    if (moveHistory.length > 0 && !isGameOver) {
      const lastMove = moveHistory.pop();
      board[lastMove] = null;

      const cell = grid[lastMove];
      cell.textContent = "";
      cell.classList.remove(X_CLASS, O_CLASS);
      cell.addEventListener("click", () => handleCellClick(lastMove), { once: true });

      // Switch back turn to the previous player
      currentPlayer = currentPlayer === X_CLASS ? O_CLASS : X_CLASS;
      statusText.textContent = `Player ${currentPlayer}'s turn`;
    }
  });
})();
