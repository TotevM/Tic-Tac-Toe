let board = Array(9).fill(null);
let currentPlayer = 'X';
let aiPlayer = 'O';
let humanPlayer = 'X';
let gameOver = false;
let difficulty = 'medium';

const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach((screen) => {
        screen.style.display = 'none';
    });
    const targetScreen = document.getElementById(screenId);
    targetScreen.style.display = 'block';
    // Trigger reflow to enable animation
    void targetScreen.offsetWidth;
    targetScreen.style.transform = 'translateY(0)';
    targetScreen.style.opacity = '1';
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
    const status = document.getElementById('status');
    status.textContent = '';
    status.className = '';
    document.querySelector('button[onclick="giveUp()"]').textContent =
        'Give Up';
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
        const status = document.getElementById('status');
        status.textContent = '';
        status.className = '';
        return;
    }

    // Disable the give up button
    const giveUpButton = document.querySelector('button[onclick="giveUp()"]');
    giveUpButton.disabled = true;
    giveUpButton.style.opacity = '0.5';
    giveUpButton.style.cursor = 'not-allowed';

    gameOver = true;
    const status = document.getElementById('status');

    // Show winning state
    status.textContent = `${aiPlayer} wins!`;
    status.className = aiPlayer.toLowerCase();

    // Highlight all cells as winning combination
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell) => {
        cell.classList.add('winner');
    });

    // Show status with animation
    setTimeout(() => {
        status.classList.add('show');
    }, 100);

    // Wait longer before resetting to show the winning state
    setTimeout(() => {
        showScreen('player-select');
        board.fill(null);
        gameOver = false;
        currentPlayer = 'X';
        status.textContent = '';
        status.className = '';
        // Re-enable the button when returning to player select
        giveUpButton.disabled = false;
        giveUpButton.style.opacity = '1';
        giveUpButton.style.cursor = 'pointer';
    }, 3000); // Increased from 2500 to 3000 to show winning state longer
}

function renderBoard() {
    const boardEl = document.getElementById('board');
    const oldBoard = Array.from(boardEl.children).map((cell) => cell.className);
    boardEl.innerHTML = '';
    board.forEach((val, i) => {
        const cell = document.createElement('div');
        cell.className = 'cell';
        if (val) {
            cell.classList.add(val.toLowerCase());
            // Only add animation class if this is a new move
            if (!oldBoard[i] || !oldBoard[i].includes(val.toLowerCase())) {
                cell.classList.add('animate');
            }
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
    const available = board
        .map((val, i) => (val === null ? i : null))
        .filter((v) => v !== null);

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
    const availSpots = newBoard
        .map((val, i) => (val === null ? i : null))
        .filter((v) => v !== null);

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
        ? moves.reduce((best, move) => (move.score > best.score ? move : best))
        : moves.reduce((best, move) => (move.score < best.score ? move : best));
}

function checkWin(player, customBoard = board) {
    return winCombos.some((combo) =>
        combo.every((i) => customBoard[i] === player)
    );
}

function isDraw() {
    return board.every((cell) => cell !== null);
}

function endGame(winner) {
    gameOver = true;
    renderBoard();
    const status = document.getElementById('status');
    if (winner) {
        status.textContent = `${winner} wins!`;
        status.className = winner.toLowerCase();
        // Highlight winning combination
        const winningCombo = winCombos.find((combo) =>
            combo.every((i) => board[i] === winner)
        );
        if (winningCombo) {
            winningCombo.forEach((index) => {
                const cell = document.querySelector(
                    `.cell:nth-child(${index + 1})`
                );
                cell.classList.add('winner');
            });
        }
    } else {
        status.textContent = "It's a draw!";
        status.className = '';
    }
    // Show status with animation
    setTimeout(() => {
        status.classList.add('show');
    }, 100);
    document.querySelector('button[onclick="giveUp()"]').textContent =
        'Restart';
}

// Initialize the game
showScreen('player-select');
