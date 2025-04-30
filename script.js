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

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.style.display = 'none';
  });
  document.getElementById(screenId).style.display = 'block';
}

function setFirstPlayer(symbol) {
  humanPlayer = symbol;
  aiPlayer = symbol === 'X' ? 'O' : 'X';
  currentPlayer = 'X';
  showScreen('difficulty-select');
}

function setDifficulty(level) {
  difficulty = level;
  showScreen('game-screen');
  startNewGame();
}

function startNewGame() {
  board.fill(null);
  gameOver = false;
  currentPlayer = 'X';
  const status = document.getElementById("status");
  status.textContent = '';
  status.className = '';
  document.querySelector('button[onclick="giveUp()"]').textContent = 'Give Up';
  renderBoard();
  if (humanPlayer === 'O') {
    setTimeout(aiMove, 500);
  }
}

function restartGame() {
  startNewGame();
}

function giveUp() {
  if (gameOver) {
    showScreen('player-select');
    board.fill(null);
    gameOver = false;
    currentPlayer = 'X';
    const status = document.getElementById("status");
    status.textContent = '';
    status.className = '';
    return;
  }
  
  gameOver = true;
  const status = document.getElementById("status");
  status.textContent = `${aiPlayer} wins! (You gave up)`;
  status.className = aiPlayer.toLowerCase();
  setTimeout(() => {
    showScreen('player-select');
    board.fill(null);
    gameOver = false;
    currentPlayer = 'X';
    status.textContent = '';
    status.className = '';
  }, 2500);
}

function renderBoard() {
  const boardEl = document.getElementById("board");
  boardEl.innerHTML = '';
  board.forEach((val, i) => {
    const cell = document.createElement('div');
    cell.className = 'cell';
    if (val) {
      cell.textContent = val;
      cell.classList.add(val.toLowerCase());
    }
    cell.onclick = () => handleMove(i);
    boardEl.appendChild(cell);
  });
}

function handleMove(index) {
  if (gameOver || board[index] || currentPlayer !== humanPlayer) return;
  
  makeMove(index, humanPlayer);
  
  if (checkWin(humanPlayer)) {
    endGame(humanPlayer);
    return;
  }
  if (isDraw()) {
    endGame(null);
    return;
  }
  
  currentPlayer = aiPlayer;
  setTimeout(aiMove, 500);
}

function makeMove(index, player) {
  board[index] = player;
  renderBoard();
}

function aiMove() {
  if (gameOver) return;
  
  const move = bestMove();
  makeMove(move, aiPlayer);
  
  if (checkWin(aiPlayer)) {
    endGame(aiPlayer);
    return;
  }
  if (isDraw()) {
    endGame(null);
    return;
  }
  
  currentPlayer = humanPlayer;
}

function bestMove() {
  const available = board.map((val, i) => val === null ? i : null).filter(v => v !== null);
  
  // Completely random move
  if (difficulty === 'easy') {
    return available[Math.floor(Math.random() * available.length)];
  }
  
  // 50% chance of best move, 50% chance of random move
  if (difficulty === 'medium' && Math.random() < 0.5) {
    return available[Math.floor(Math.random() * available.length)];
  }
  
  // Always best move
  return minimax(board.slice(), aiPlayer, 0).index;
}

function minimax(newBoard, player, depth) {
  const availSpots = newBoard.map((val, i) => val === null ? i : null).filter(v => v !== null);
  
  if (checkWin(humanPlayer, newBoard)) return { score: -10 + depth };
  if (checkWin(aiPlayer, newBoard)) return { score: 10 - depth };
  if (availSpots.length === 0) return { score: 0 };
  
  const moves = [];
  
  for (let i of availSpots) {
    const move = { index: i };
    newBoard[i] = player;
    
    if (player === aiPlayer) {
      move.score = minimax(newBoard, humanPlayer, depth + 1).score;
    } else {
      move.score = minimax(newBoard, aiPlayer, depth + 1).score;
    }
    
    newBoard[i] = null;
    moves.push(move);
  }
  
  return player === aiPlayer
    ? moves.reduce((best, move) => move.score > best.score ? move : best)
    : moves.reduce((best, move) => move.score < best.score ? move : best);
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
  const status = document.getElementById("status");
  if (winner) {
    status.textContent = `${winner} wins!`;
    status.className = winner.toLowerCase();
  } else {
    status.textContent = "It's a draw!";
    status.className = '';
  }
  document.querySelector('button[onclick="giveUp()"]').textContent = 'Restart';
}

showScreen('player-select');
//TODO: Fix give up button to redirect to beginning when already in a lost/won