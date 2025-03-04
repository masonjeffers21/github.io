---
layout: page
title: Memory Card Game Leaderboard
permalink: /games/memory-leaderboard/
nav: false
parent: Games
nav_order: 1
---

<div class="breadcrumb">
    <a href="/games/">Games</a> > <a href="/games/memory-card-game/">Memory Card Game</a> > Leaderboard
</div>

<div class="leaderboard-container">
    <h2>Memory Card Game Leaderboard</h2>
    <div class="leaderboard-info">
        <p>Top 10 players with the fewest moves and fastest times!</p>
    </div>
    <div class="leaderboard-table">
        <table>
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Player</th>
                    <th>Moves</th>
                    <th>Time</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody id="leaderboardBody">
                <!-- Scores will be populated by JavaScript -->
            </tbody>
        </table>
    </div>
    <div class="leaderboard-actions">
        <button id="clearScores" class="danger-btn">Clear All Scores</button>
        <a href="/games/memory-card-game/" class="play-btn">Play Game</a>
    </div>
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

.leaderboard-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
}

.leaderboard-info {
    margin-bottom: 30px;
    color: #666;
}

.leaderboard-table {
    margin-bottom: 30px;
    overflow-x: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    border-radius: 8px;
    overflow: hidden;
}

th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #eee;
}

th {
    background-color: #f8f9fa;
    font-weight: bold;
    color: #2196F3;
}

tr:nth-child(even) {
    background-color: #f8f9fa;
}

tr:hover {
    background-color: #e3f2fd;
}

.rank-1 {
    color: #FFD700;
    font-weight: bold;
}

.rank-2 {
    color: #C0C0C0;
    font-weight: bold;
}

.rank-3 {
    color: #CD7F32;
    font-weight: bold;
}

.leaderboard-actions {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 30px;
}

.leaderboard-actions button, .leaderboard-actions a {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    border: none;
    border-radius: 4px;
    text-decoration: none;
    transition: background-color 0.2s;
}

.danger-btn {
    background-color: #dc3545;
    color: white;
}

.danger-btn:hover {
    background-color: #c82333;
}

.play-btn {
    background-color: #2196F3;
    color: white;
}

.play-btn:hover {
    background-color: #1976D2;
}

@media (max-width: 600px) {
    th, td {
        padding: 8px;
        font-size: 14px;
    }
    
    .leaderboard-actions {
        flex-direction: column;
    }
    
    .leaderboard-actions button, .leaderboard-actions a {
        width: 100%;
    }
}
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const leaderboardBody = document.getElementById('leaderboardBody');
    const clearScoresBtn = document.getElementById('clearScores');
    
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
    
    function displayScores() {
        const highScores = JSON.parse(localStorage.getItem('memoryHighScores') || '[]');
        leaderboardBody.innerHTML = '';
        
        highScores.forEach((score, index) => {
            const row = document.createElement('tr');
            const rank = index + 1;
            
            row.innerHTML = `
                <td class="rank-${rank <= 3 ? rank : ''}">${rank}</td>
                <td>${score.name}</td>
                <td>${score.moves}</td>
                <td>${formatTime(score.time)}</td>
                <td>${formatDate(score.date)}</td>
            `;
            
            leaderboardBody.appendChild(row);
        });
        
        // Show message if no scores
        if (highScores.length === 0) {
            leaderboardBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 20px;">
                        No high scores yet. <a href="/games/memory-card-game/">Play the game</a> to set some!
                    </td>
                </tr>
            `;
        }
    }
    
    clearScoresBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all high scores? This cannot be undone.')) {
            localStorage.removeItem('memoryHighScores');
            displayScores();
        }
    });
    
    // Initial display
    displayScores();
});
</script> 