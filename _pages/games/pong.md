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
        speed: 5,
        dx: 5,
        dy: 5,
        color: '#fff'
    };
    
    const paddleHeight = 100;
    const paddleWidth = 10;
    const paddleSpeed = 8;
    
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
    
    // AI settings for different difficulties
    const aiSettings = {
        easy: { 
            reactionTime: 0.2,
            accuracy: 0.8,
            predictionFactor: 0.3
        },
        medium: { 
            reactionTime: 0.15,
            accuracy: 0.9,
            predictionFactor: 0.5
        },
        hard: { 
            reactionTime: 0.1,
            accuracy: 0.95,
            predictionFactor: 0.7
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
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        // Handle both mouse and touch events
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        mouseY = (clientY - rect.top) * scaleY;
        
        // Keep paddle within canvas bounds
        mouseY = Math.max(paddleHeight/2, Math.min(canvas.height - paddleHeight/2, mouseY));
    }
    
    canvas.addEventListener('mousemove', handlePointerMove);
    canvas.addEventListener('touchmove', handlePointerMove, { passive: false });
    
    // Prevent scrolling on touch devices
    canvas.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
    
    // AI function with improved prediction
    function updateAI() {
        const settings = aiSettings[difficulty];
        
        // Predict where the ball will be
        let predictedY = ball.y;
        if (ball.dx > 0) { // Only predict when ball is moving towards computer
            const timeToReach = (canvas.width - ball.x) / ball.dx;
            predictedY = ball.y + (ball.dy * timeToReach);
            
            // Add some randomness based on difficulty
            const randomFactor = (1 - settings.accuracy) * 100;
            predictedY += (Math.random() - 0.5) * randomFactor;
            
            // Bounce prediction
            while (predictedY < 0 || predictedY > canvas.height) {
                if (predictedY < 0) predictedY = -predictedY;
                if (predictedY > canvas.height) predictedY = 2 * canvas.height - predictedY;
            }
        }
        
        // Move towards predicted position with delay
        const targetY = predictedY - (computer.height / 2);
        const currentY = computer.y;
        const distance = targetY - currentY;
        
        if (Math.abs(distance) > 5) {
            const moveAmount = paddleSpeed * settings.reactionTime;
            if (distance > 0) {
                computer.y = Math.min(computer.y + moveAmount, canvas.height - computer.height);
            } else {
                computer.y = Math.max(computer.y - moveAmount, 0);
            }
        }
    }
    
    // Game functions
    function drawBall() {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
        ctx.closePath();
    }
    
    function drawPaddle(paddle) {
        ctx.fillStyle = paddle.color;
        ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    }
    
    function updatePaddles() {
        // Player movement (cursor/mouse)
        player.y = mouseY - paddleHeight/2;
        
        // Computer movement (AI)
        updateAI();
    }
    
    function updateBall() {
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
            ball.dx = -ball.dx;
            // Add some randomness to the ball's vertical direction
            ball.dy += (Math.random() - 0.5) * 2;
        }
        
        if (ball.x + ball.radius > computer.x &&
            ball.y > computer.y &&
            ball.y < computer.y + computer.height) {
            ball.dx = -ball.dx;
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
        ball.dx = -ball.dx;
        ball.dy = Math.random() * 10 - 5;
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
        
        // Draw game objects
        drawBall();
        drawPaddle(player);
        drawPaddle(computer);
    }
    
    function gameUpdate() {
        updatePaddles();
        updateBall();
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