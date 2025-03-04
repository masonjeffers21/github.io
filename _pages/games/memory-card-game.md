---
layout: page
title: Memory Card Game
permalink: /games/memory-card-game/
nav: false
parent: Games
nav_order: 1
---

<div class="breadcrumb">
    <a href="/games/">Games</a> > Memory Card Game
</div>

<div class="game-container">
    <div class="game-header">
        <h2>Memory Card Game</h2>
        <div class="game-stats">
            <span>Moves: <span id="moves">0</span></span>
            <span>Time: <span id="time">0:00</span></span>
        </div>
    </div>
    <div class="game-controls">
        <button id="resetGame">Reset</button>
        <a href="/games/memory-leaderboard/" class="leaderboard-btn">View Leaderboard</a>
    </div>
    <div id="gameBoard" class="game-board"></div>
</div>

<style>
.breadcrumb {
    margin-bottom: 20px;
    color: #666;
}

.breadcrumb a {
    color: #2196F3;
    text-decoration: none;
}

.breadcrumb a:hover {
    text-decoration: underline;
}

.game-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
}

.game-header {
    margin-bottom: 20px;
}

.game-stats {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin: 10px 0;
}

.game-controls {
    margin-bottom: 20px;
}

.game-controls button, .leaderboard-btn {
    margin: 0 10px;
    padding: 8px 16px;
    font-size: 16px;
    cursor: pointer;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    text-decoration: none;
    display: inline-block;
}

.game-controls button:hover, .leaderboard-btn:hover {
    background-color: #0056b3;
}

.game-board {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin: 0 auto;
    max-width: 600px;
}

.card {
    aspect-ratio: 1;
    background-color: #2196F3;
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2em;
    color: white;
    transition: transform 0.3s;
}

.card:hover {
    transform: scale(1.05);
}

.card.flipped {
    background-color: white;
    color: #2196F3;
    transform: rotateY(180deg);
}

.card.matched {
    background-color: #4CAF50;
    color: white;
}

#nameModal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
}

.modal-content {
    position: relative;
    background-color: white;
    margin: 15% auto;
    padding: 20px;
    width: 80%;
    max-width: 500px;
    border-radius: 8px;
    text-align: center;
}

.modal-content h3 {
    margin-top: 0;
    color: #2196F3;
}

.modal-content input {
    width: 80%;
    padding: 8px;
    margin: 10px 0;
    border: 2px solid #2196F3;
    border-radius: 4px;
    font-size: 16px;
}

.modal-content button {
    padding: 8px 16px;
    font-size: 16px;
    cursor: pointer;
    background-color: #2196F3;
    color: white;
    border: none;
    border-radius: 4px;
    margin-top: 10px;
}

.modal-content button:hover {
    background-color: #1976D2;
}
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const gameBoard = document.getElementById('gameBoard');
    const movesDisplay = document.getElementById('moves');
    const timeDisplay = document.getElementById('time');
    const resetButton = document.getElementById('resetGame');
    
    let cards = [];
    let moves = 0;
    let timeElapsed = 0;
    let timer = null;
    let flippedCards = [];
    let matchedPairs = 0;
    let gameStarted = false;
    
    const emojis = ['🎮', '🎲', '🎯', '🎨', '🎭', '🎪', '🎟️', '🎠'];
    const totalPairs = emojis.length;
    
    // Create name input modal
    const modal = document.createElement('div');
    modal.id = 'nameModal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>New High Score!</h3>
            <p>Enter your name to save your score:</p>
            <input type="text" id="playerName" maxlength="20" placeholder="Your name">
            <button id="saveScore">Save Score</button>
        </div>
    `;
    document.body.appendChild(modal);
    
    function createBoard() {
        gameBoard.innerHTML = '';
        cards = [];
        moves = 0;
        timeElapsed = 0;
        matchedPairs = 0;
        flippedCards = [];
        gameStarted = false;
        movesDisplay.textContent = '0';
        timeDisplay.textContent = '0:00';
        
        // Create pairs of cards
        const cardValues = [...emojis, ...emojis];
        // Shuffle cards
        for (let i = cardValues.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cardValues[i], cardValues[j]] = [cardValues[j], cardValues[i]];
        }
        
        // Create card elements
        cardValues.forEach((value, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.value = value;
            card.dataset.index = index;
            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
            cards.push(card);
        });
    }
    
    function flipCard() {
        if (flippedCards.length === 2 || this.classList.contains('flipped') || 
            this.classList.contains('matched')) return;
        
        // Start the game on first card flip
        if (!gameStarted) {
            gameStarted = true;
            startTimer();
        }
        
        this.classList.add('flipped');
        this.textContent = this.dataset.value;
        flippedCards.push(this);
        
        if (flippedCards.length === 2) {
            moves++;
            movesDisplay.textContent = moves;
            checkMatch();
        }
    }
    
    function checkMatch() {
        const [card1, card2] = flippedCards;
        const match = card1.dataset.value === card2.dataset.value;
        
        if (match) {
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++;
            
            if (matchedPairs === totalPairs) {
                clearInterval(timer);
                setTimeout(() => {
                    checkHighScore();
                }, 500);
            }
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                card1.textContent = '';
                card2.textContent = '';
            }, 1000);
        }
        
        flippedCards = [];
    }
    
    function startTimer() {
        if (timer) clearInterval(timer);
        timer = setInterval(() => {
            timeElapsed++;
            const minutes = Math.floor(timeElapsed / 60);
            const seconds = timeElapsed % 60;
            timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }
    
    function checkHighScore() {
        const highScores = JSON.parse(localStorage.getItem('memoryHighScores') || '[]');
        const currentScore = {
            moves: moves,
            time: timeElapsed,
            date: new Date().toISOString()
        };
        
        // Check if this is a high score (top 10)
        if (highScores.length < 10 || 
            moves < highScores[highScores.length - 1].moves || 
            (moves === highScores[highScores.length - 1].moves && 
             timeElapsed < highScores[highScores.length - 1].time)) {
            showNameModal(currentScore);
        }
    }
    
    function showNameModal(score) {
        modal.style.display = 'block';
        const saveButton = document.getElementById('saveScore');
        const nameInput = document.getElementById('playerName');
        
        saveButton.onclick = () => {
            const playerName = nameInput.value.trim();
            if (playerName) {
                saveHighScore(playerName, score);
                modal.style.display = 'none';
                nameInput.value = '';
            }
        };
    }
    
    function saveHighScore(playerName, score) {
        const highScores = JSON.parse(localStorage.getItem('memoryHighScores') || '[]');
        highScores.push({
            name: playerName,
            ...score
        });
        
        // Sort by moves (primary) and time (secondary)
        highScores.sort((a, b) => {
            if (a.moves !== b.moves) return a.moves - b.moves;
            return a.time - b.time;
        });
        
        // Keep only top 10 scores
        highScores.splice(10);
        
        localStorage.setItem('memoryHighScores', JSON.stringify(highScores));
    }
    
    resetButton.addEventListener('click', () => {
        clearInterval(timer);
        createBoard();
    });
    
    // Initial draw
    createBoard();
});
</script> 