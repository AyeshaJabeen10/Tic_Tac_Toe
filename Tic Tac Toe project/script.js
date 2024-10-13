// script.js

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode'); // 'single' or 'multi'
    const gameTitle = document.getElementById('game-title');
    const statusDiv = document.getElementById('status');
    const cells = document.querySelectorAll('.cell');
    const restartBtn = document.getElementById('restart-btn');

    let board = Array(9).fill(0);
    let currentPlayer = 'X'; // 'X' always starts
    let gameOver = false;

    if (mode === 'single') {
        gameTitle.textContent = 'Single Player: You (X) vs Computer (O)';
    } else if (mode === 'multi') {
        gameTitle.textContent = 'Multiplayer: Player X vs Player O';
    } else {
        // Default to single player if mode not specified
        gameTitle.textContent = 'Single Player: You (X) vs Computer (O)';
    }

    updateStatus();

    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            if (gameOver) return;
            const index = parseInt(cell.getAttribute('data-index'));

            if (board[index] !== 0) {
                alert('Invalid Move!');
                return;
            }

            makeMove(index, currentPlayer);
            if (checkWin(board)) {
                endGame(currentPlayer);
                return;
            } else if (isBoardFull(board)) {
                endGame(null);
                return;
            }

            // Switch Player
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            updateStatus();

            // If Single Player and it's Computer's turn
            if (mode === 'single' && currentPlayer === 'O' && !gameOver) {
                // Computer makes a move after a short delay
                setTimeout(() => {
                    const bestMove = getBestMove(board, 'O');
                    makeMove(bestMove, 'O');
                    if (checkWin(board)) {
                        endGame('O');
                        return;
                    } else if (isBoardFull(board)) {
                        endGame(null);
                        return;
                    }
                    currentPlayer = 'X';
                    updateStatus();
                }, 500);
            }
        });
    });

    restartBtn.addEventListener('click', resetGame);

    function makeMove(index, player) {
        board[index] = player === 'X' ? -1 : 1;
        cells[index].textContent = player;
    }

    function updateStatus() {
        if (gameOver) return;
        if (mode === 'single') {
            if (currentPlayer === 'X') {
                statusDiv.textContent = "Your Turn (X)";
            } else {
                statusDiv.textContent = "Computer's Turn (O)";
            }
        } else {
            statusDiv.textContent = `Player ${currentPlayer}'s Turn`;
        }
    }

    function endGame(winner) {
        gameOver = true;
        if (winner === 'X') {
            statusDiv.textContent = "Player X Wins!!! O Loses!";
        } else if (winner === 'O') {
            statusDiv.textContent = "Player O Wins!!! X Loses!";
        } else {
            statusDiv.textContent = "Draw!";
        }
    }

    function resetGame() {
        board = Array(9).fill(0);
        cells.forEach(cell => cell.textContent = '');
        currentPlayer = 'X';
        gameOver = false;
        updateStatus();

        // If Single Player and Computer starts
        if (mode === 'single' && currentPlayer === 'O') {
            setTimeout(() => {
                const bestMove = getBestMove(board, 'O');
                makeMove(bestMove, 'O');
                if (checkWin(board)) {
                    endGame('O');
                    return;
                } else if (isBoardFull(board)) {
                    endGame(null);
                    return;
                }
                currentPlayer = 'X';
                updateStatus();
            }, 500);
        }
    }

    // Game Logic Functions

    function analyzeboard(board) {
        const cb = [
            [0,1,2],[3,4,5],[6,7,8], // Rows
            [0,3,6],[1,4,7],[2,5,8], // Columns
            [0,4,8],[2,4,6]           // Diagonals
        ];
        for (let i = 0; i < cb.length; i++) {
            const [a, b, c] = cb[i];
            if (board[a] !== 0 && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        return 0;
    }

    function checkWin(board) {
        return analyzeboard(board) !== 0;
    }

    function isBoardFull(board) {
        return board.every(cell => cell !== 0);
    }

    function minmax(newBoard, player) {
        const winner = analyzeboard(newBoard);
        if (winner !== 0) {
            return winner * player;
        }
        let bestScore = -2;
        for (let i = 0; i < 9; i++) {
            if (newBoard[i] === 0) {
                newBoard[i] = player;
                let score = -minmax(newBoard, -player);
                newBoard[i] = 0;
                if (score > bestScore) {
                    bestScore = score;
                }
            }
        }
        if (bestScore === -2) {
            return 0;
        }
        return bestScore;
    }

    function getBestMove(board, player) {
        let bestScore = -2;
        let move = -1;
        for (let i = 0; i < 9; i++) {
            if (board[i] === 0) {
                board[i] = player === 'X' ? -1 : 1;
                let score = -minmax(board, player === 'X' ? 1 : -1);
                board[i] = 0;
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
        return move;
    }
});
