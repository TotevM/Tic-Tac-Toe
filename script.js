let board = Array(9).fill(null);
let currentPlayer = 'X';
let aiPlayer = 'O';
let humanPlayer = 'X';
let gameOver = false;
let difficulty = 'medium';

const winCombos = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function setFirstPlayer(symbol) {
  humanPlayer = symbol;
  aiPlayer = symbol === 'X' ? 'O' : 'X';
  currentPlayer = 'X';
  restartGame();
  if (humanPlayer === 'O') aiMove();
}

function restartGame() {
  board.fill(null);
  gameOver = false;
  currentPlayer = 'X';
  document.getElementById("status").textContent = '';
  renderBoard();
  if (humanPlayer === 'O') aiMove();
}

function giveUp() {
  if (!gameOver) {
    gameOver = true;
    document.getElementById("status").textContent = `${aiPlayer} wins! (You gave up)`;
  }
}

function setDifficulty(level) {
  difficulty = level;
  restartGame();
}

function renderBoard() {
  const boardEl = document.getElementById("board");
  boardEl.innerHTML = '';
  board.forEach((val, i) => {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.textContent = val || '';
    cell.onclick = () => handleMove(i);
    boardEl.appendChild(cell);
  });
}

function handleMove(index) {
  if (gameOver || board[index]) return;
  if (currentPlayer === humanPlayer) {
    board[index] = humanPlayer;
    if (checkWin(humanPlayer)) return endGame(humanPlayer);
    if (isDraw()) return endGame(null);
    currentPlayer = aiPlayer;
    setTimeout(aiMove, 300);
  }
}

function aiMove() {
  if (gameOver) return;
  const move = bestMove();
  board[move] = aiPlayer;
  if (checkWin(aiPlayer)) return endGame(aiPlayer);
  if (isDraw()) return endGame(null);
  currentPlayer = humanPlayer;
  renderBoard();
}

function bestMove() {
  const available = board.map((val, i) => val === null ? i : null).filter(v => v !== null);
  if (difficulty === 'easy') {
    return available[Math.floor(Math.random() * available.length)];
  }
  if (difficulty === 'medium' && Math.random() < 0.5) {
    return available[Math.floor(Math.random() * available.length)];
  }
  return minimax(board, aiPlayer).index;
}

function minimax(newBoard, player) {
  const availSpots = newBoard.map((val, i) => val === null ? i : null).filter(v => v !== null);
  if (checkWin(humanPlayer, newBoard)) return { score: -10 };
  if (checkWin(aiPlayer, newBoard)) return { score: 10 };
  if (availSpots.length === 0) return { score: 0 };

  const moves = [];
  for (let i of availSpots) {
    let move = { index: i };
    newBoard[i] = player;

    if (player === aiPlayer) {
      move.score = minimax(newBoard, humanPlayer).score;
    } else {
      move.score = minimax(newBoard, aiPlayer).score;
    }

    newBoard[i] = null;
    moves.push(move);
  }

  return (player === aiPlayer)
    ? moves.reduce((best, m) => m.score > best.score ? m : best)
    : moves.reduce((best, m) => m.score < best.score ? m : best);
}

function checkWin(player, customBoard = board) {
  return winCombos.some(combo =>
    combo.every(i => customBoard[i] === player)
  );
}

function isDraw() {
  return board.every(cell => cell !== null);
}

function endGame(winner) {
  gameOver = true;
  renderBoard();
  document.getElementById("status").textContent =
    winner ? `${winner} wins!` : "It's a draw!";
}

renderBoard();
