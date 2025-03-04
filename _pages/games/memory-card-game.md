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
        <button id="startGame">Start Game</button>
        <button id="resetGame">Reset</button>
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

.game-controls button {
    margin: 0 10px;
    padding: 8px 16px;
    font-size: 16px;
    cursor: pointer;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
}

.game-controls button:hover {
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
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const gameBoard = document.getElementById('gameBoard');
    const movesDisplay = document.getElementById('moves');
    const timeDisplay = document.getElementById('time');
    const startButton = document.getElementById('startGame');
    const resetButton = document.getElementById('resetGame');
    
    let cards = [];
    let moves = 0;
    let timeElapsed = 0;
    let timer = null;
    let flippedCards = [];
    let matchedPairs = 0;
    
    const emojis = ['🎮', '🎲', '🎯', '🎨', '🎭', '🎪', '🎟️', '🎠'];
    const totalPairs = emojis.length;
    
    function createBoard() {
        gameBoard.innerHTML = '';
        cards = [];
        moves = 0;
        timeElapsed = 0;
        matchedPairs = 0;
        flippedCards = [];
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
                    alert(`Congratulations! You won in ${moves} moves and ${timeElapsed} seconds!`);
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
    
    startButton.addEventListener('click', () => {
        createBoard();
        startTimer();
    });
    
    resetButton.addEventListener('click', () => {
        clearInterval(timer);
        createBoard();
    });
});
</script> 