---
layout: page
title: Pong
permalink: /games/pong/
nav: false
parent: Games
nav_order: 2
---

<div class="breadcrumb">
    <a href="/games/">Games</a> > Pong
</div>

<div class="game-container">
    <div class="game-header">
        <h2>Pong</h2>
        <div class="game-stats">
            <span>Score: <span id="score">0 - 0</span></span>
        </div>
    </div>
    <div class="game-mode-selector">
        <div id="difficultySelector" class="difficulty-selector">
            <button class="difficulty-btn active" data-difficulty="easy">Easy</button>
            <button class="difficulty-btn" data-difficulty="medium">Medium</button>
            <button class="difficulty-btn" data-difficulty="hard">Hard</button>
        </div>
    </div>
    <div class="game-controls">
        <button id="startGame">Start Game</button>
        <button id="resetGame">Reset</button>
    </div>
    <div class="game-instructions">
        <p>Move your paddle by moving your cursor/mouse up and down</p>
        <p>Try to beat the computer!</p>
    </div>
    <canvas id="pongCanvas" width="800" height="400"></canvas>
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
    font-size: 1.2em;
    font-weight: bold;
}

.game-mode-selector {
    margin-bottom: 20px;
}

.difficulty-selector {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin: 10px 0;
}

.difficulty-btn {
    padding: 8px 16px;
    font-size: 16px;
    cursor: pointer;
    background-color: #f8f9fa;
    color: #2196F3;
    border: 2px solid #2196F3;
    border-radius: 4px;
    transition: all 0.2s;
}

.difficulty-btn:hover {
    background-color: #e3f2fd;
}

.difficulty-btn.active {
    background-color: #2196F3;
    color: white;
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

.game-instructions {
    margin-bottom: 20px;
    padding: 10px;
    background-color: #f8f9fa;
    border-radius: 4px;
}

.game-instructions p {
    margin: 5px 0;
    color: #666;
}

#pongCanvas {
    background-color: #000;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    cursor: none;
}

@media (max-width: 800px) {
    #pongCanvas {
        width: 100%;
        height: auto;
    }
}
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('pongCanvas');
    const ctx = canvas.getContext('2d');
    const startButton = document.getElementById('startGame');
    const resetButton = document.getElementById('resetGame');
    const scoreDisplay = document.getElementById('score');
    const difficultyBtns = document.querySelectorAll('.difficulty-btn');
    
    // Game objects
    const ball = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 10,
        dx: 5,
        dy: 5,
        color: '#fff'
    };
    
    const paddleHeight = 100;
    const paddleWidth = 10;
    
    const player = {
        x: 0,
        y: canvas.height / 2 - paddleHeight / 2,
        width: paddleWidth,
        height: paddleHeight,
        color: '#fff',
        score: 0
    };
    
    const computer = {
        x: canvas.width - paddleWidth,
        y: canvas.height / 2 - paddleHeight / 2,
        width: paddleWidth,
        height: paddleHeight,
        color: '#fff',
        score: 0
    };
    
    // Game state
    let gameLoop = null;
    let difficulty = 'easy';
    let mouseY = canvas.height / 2;
    
    // Game settings
    const settings = {
        easy: {
            ballSpeed: 4,
            computerSpeed: 3,
            computerAccuracy: 0.7
        },
        medium: {
            ballSpeed: 6,
            computerSpeed: 5,
            computerAccuracy: 0.85
        },
        hard: {
            ballSpeed: 8,
            computerSpeed: 8,
            computerAccuracy: 0.95
        }
    };
    
    // Event listeners for difficulty selection
    difficultyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            difficultyBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            difficulty = btn.dataset.difficulty;
        });
    });
    
    // Mouse/touch event listeners
    function handlePointerMove(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleY = canvas.height / rect.height;
        
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        mouseY = (clientY - rect.top) * scaleY;
        
        // Keep paddle within canvas bounds
        mouseY = Math.max(paddleHeight/2, Math.min(canvas.height - paddleHeight/2, mouseY));
    }
    
    canvas.addEventListener('mousemove', handlePointerMove);
    canvas.addEventListener('touchmove', handlePointerMove, { passive: false });
    canvas.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
    
    // Simple AI that follows the ball
    function updateComputer() {
        const currentSettings = settings[difficulty];
        
        // Calculate target position (center of paddle)
        const targetY = ball.y - (computer.height / 2);
        
        // Add some randomness to make it less perfect
        const randomOffset = (Math.random() - 0.5) * (1 - currentSettings.computerAccuracy) * 50;
        const finalTarget = targetY + randomOffset;
        
        // Move towards the target
        const distance = finalTarget - computer.y;
        const moveAmount = currentSettings.computerSpeed * Math.sign(distance);
        
        // Apply movement
        computer.y += moveAmount;
        
        // Keep paddle within bounds
        if (computer.y < 0) computer.y = 0;
        if (computer.y + computer.height > canvas.height) {
            computer.y = canvas.height - computer.height;
        }
    }
    
    function updateBall() {
        const currentSettings = settings[difficulty];
        
        // Update ball position
        ball.x += ball.dx;
        ball.y += ball.dy;
        
        // Ball collision with top and bottom
        if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
            ball.dy = -ball.dy;
        }
        
        // Ball collision with paddles
        if (ball.x - ball.radius < player.x + player.width &&
            ball.y > player.y &&
            ball.y < player.y + player.height) {
            ball.dx = Math.abs(ball.dx);
            // Add some randomness to the ball's vertical direction
            ball.dy += (Math.random() - 0.5) * 2;
        }
        
        if (ball.x + ball.radius > computer.x &&
            ball.y > computer.y &&
            ball.y < computer.y + computer.height) {
            ball.dx = -Math.abs(ball.dx);
            // Add some randomness to the ball's vertical direction
            ball.dy += (Math.random() - 0.5) * 2;
        }
        
        // Score points
        if (ball.x < 0) {
            computer.score++;
            resetBall();
        } else if (ball.x > canvas.width) {
            player.score++;
            resetBall();
        }
        
        // Update score display
        scoreDisplay.textContent = `${player.score} - ${computer.score}`;
    }
    
    function resetBall() {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        const currentSettings = settings[difficulty];
        ball.dx = (Math.random() > 0.5 ? 1 : -1) * currentSettings.ballSpeed;
        ball.dy = (Math.random() * 2 - 1) * currentSettings.ballSpeed;
    }
    
    function draw() {
        // Clear canvas
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw center line
        ctx.setLineDash([5, 15]);
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.strokeStyle = '#fff';
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw ball
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
        ctx.closePath();
        
        // Draw paddles
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);
        
        ctx.fillStyle = computer.color;
        ctx.fillRect(computer.x, computer.y, computer.width, computer.height);
    }
    
    function gameUpdate() {
        // Update player paddle position
        player.y = mouseY - paddleHeight/2;
        
        // Update computer paddle
        updateComputer();
        
        // Update ball
        updateBall();
        
        // Draw everything
        draw();
    }
    
    function startGame() {
        if (gameLoop) return;
        gameLoop = setInterval(gameUpdate, 1000 / 60);
    }
    
    function resetGame() {
        if (gameLoop) {
            clearInterval(gameLoop);
            gameLoop = null;
        }
        
        // Reset scores
        player.score = 0;
        computer.score = 0;
        scoreDisplay.textContent = '0 - 0';
        
        // Reset ball
        resetBall();
        
        // Reset paddles
        player.y = canvas.height / 2 - paddleHeight / 2;
        computer.y = canvas.height / 2 - paddleHeight / 2;
    }
    
    // Event listeners for buttons
    startButton.addEventListener('click', startGame);
    resetButton.addEventListener('click', resetGame);
    
    // Initial draw
    draw();
});
</script> 