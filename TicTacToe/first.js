document.addEventListener('DOMContentLoaded', () => {
    // --- Core Architecture References ---
    const cells = document.querySelectorAll('.cell');
    const boardElement = document.getElementById('board');
    const winningMessage = document.getElementById('winningMessage');
    const restartButton = document.getElementById('restartButton');
    const turnIndicator = document.getElementById('turnIndicator');
    const mascotImg = document.getElementById('mascot');

    // --- State Management ---
    // Represents cells 0 through 8 internally
    let board = ["", "", "", "", "", "", "", "", ""];
    let currentPlayer = "X";
    let isGameActive = true;

    // --- Win Matrix Mapping ---
    const WINNING_COMBINATIONS = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Standard Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Standard Columns
        [0, 4, 8], [2, 4, 6]             // Classic Diagonals
    ];

    // --- UI Synchronizer ---
    function updateTurnIndicator() {
        if (!isGameActive) return;
        
        // Dynamically inject styled spans to keep the Neon Aesthetic during text shift
        if (currentPlayer === "X") {
            turnIndicator.innerHTML = `Player <span class="neon-x">X</span>'s Turn`;
        } else {
            turnIndicator.innerHTML = `Player <span class="neon-o">O</span>'s Turn`;
        }
    }

    // --- Board Controller Logic ---
    function handleCellClick(e) {
        const cell = e.target;
        const index = cell.getAttribute('data-index');

        // Validation filter: Is cell full? Has game ended?
        if (board[index] !== "" || !isGameActive) {
            // Provide satisfying error feedback
            cell.classList.add('shake-error');
            setTimeout(() => cell.classList.remove('shake-error'), 300);
            return;
        }

        // Commit move to invisible Backend array
        board[index] = currentPlayer;

        // Propagate state to visible DOM elements
        cell.innerText = currentPlayer;
        cell.classList.add('taken'); // Disable hover effects on spent cells
        
        if (currentPlayer === "X") {
            cell.classList.add('x-mark');
        } else {
            cell.classList.add('o-mark');
        }

        // Proceed to next sequence checking loop
        evaluateBoardState();
    }

    // --- Rules Engine ---
    function evaluateBoardState() {
        let isRoundWon = false;
        let winningCellVector = []; // To highlight exactly which cells won

        // Matrix scan
        for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
            const [a, b, c] = WINNING_COMBINATIONS[i];
            
            // Check if A exists, and if A=B and A=C
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                isRoundWon = true;
                winningCellVector = [a, b, c];
                break;
            }
        }

        if (isRoundWon) {
            triggerEndGame(false, winningCellVector);
            return;
        }

        // Deep array search, if no empty string floats, board is exhausted
        const isDraw = !board.includes("");
        if (isDraw) {
            triggerEndGame(true);
            return;
        }

        // Mutate Active Player and loop back
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        updateTurnIndicator();
    }

    // --- Climax Handlers ---
    function triggerEndGame(isDraw, winningCellVector = []) {
        // Freeze board state
        isGameActive = false;
        boardElement.classList.add('game-over'); // Instantly dims all inactive cells

        if (isDraw) {
            winningMessage.innerText = "Mutual Destruction! 🤝";
            winningMessage.style.color = "#fbbf24"; // Tie is orange
            turnIndicator.innerHTML = "Game Concluded!";
            
            // Dispatch logic to animated Mascot
            mascotImg.classList.add('sad');
            mascotImg.src = "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Pleading%20Face.png";
            
        } else {
            // Flash the specific winning axis through CSS injection
            winningCellVector.forEach(index => {
                cells[index].classList.add('win');
            });
            
            // Format winner message
            if (currentPlayer === "X") {
                winningMessage.innerHTML = `<span class="neon-x">X</span> Commands the Grid!`;
            } else {
                winningMessage.innerHTML = `<span class="neon-o">O</span> Owns the Sector!`;
            }
            winningMessage.style.color = "#22c55e"; // Reset to green
            turnIndicator.innerHTML = "We have a Champion!";
            
            // Spark Joy in the Mascot character
            mascotImg.classList.add('happy');
            mascotImg.src = "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Star-Struck.png";

            // Utilize external engine for massive particle emission
            launchConfetti(currentPlayer === "X" ? ['#f43f5e', '#ffffff'] : ['#0ea5e9', '#ffffff']);
        }
    }

    // --- Factory Reset ---
    function restartGame() {
        // Clean memory
        board = ["", "", "", "", "", "", "", "", ""];
        currentPlayer = "X";
        isGameActive = true;
        
        // Clean text nodes
        winningMessage.innerText = "";
        boardElement.classList.remove('game-over');
        
        // Return Mascot to Neutral Floating State
        mascotImg.classList.remove('happy', 'sad');
        mascotImg.src = "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Alien%20Monster.png";

        // Clean DOM classes natively
        cells.forEach(cell => {
            cell.innerText = "";
            cell.classList.remove('taken', 'x-mark', 'o-mark', 'win', 'shake-error');
        });

        updateTurnIndicator();
    }

    // --- Particle FX ---
    function launchConfetti(colors) {
        // Safe check if library connected
        if (typeof confetti !== 'undefined') {
            confetti({
                particleCount: 200,
                spread: 120,
                origin: { y: 0.5 },
                colors: colors,
                zIndex: 1000
            });
        }
    }

    // --- Execution Bindings ---
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    restartButton.addEventListener('click', restartGame);

    // Boot Up Configuration
    updateTurnIndicator();
});
