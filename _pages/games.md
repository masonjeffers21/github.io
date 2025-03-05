---
layout: page
title: Games
permalink: /games/
nav: true
nav_order: 5
---

# Games Collection

Welcome to my games collection! Here you'll find various fun and interactive games that you can play directly in your browser.

## Available Games

<div class="games-grid">
    <div class="game-card">
        <h3><a href="/games/memory-card-game/">Memory Card Game</a></h3>
        <p>Test your memory with this classic card matching game. Match pairs of cards while trying to use the fewest moves and time possible.</p>
    </div>
    
    <div class="game-card">
        <h3><a href="/games/pong/">Pong</a></h3>
        <p>Classic two-player Pong game. Challenge a friend to a game of table tennis using your keyboard controls!</p>
    </div>
    
    <div class="game-card">
        <h3><a href="/games/planet-genesis/">Planet Genesis</a></h3>
        <p>Create and terraform your own planet from scratch. Adjust atmospheric conditions, sculpt terrain, and watch your world evolve!</p>
    </div>
    
    <div class="game-card">
        <h3><a href="/games/road-racer/">Road Racer</a></h3>
        <p>Race around a track in this driving simulator. Use the WASD keys to control your car and complete laps as quickly as possible!</p>
    </div>
</div>

More games coming soon!

<style>
.games-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 20px;
}

.game-card {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: transform 0.2s;
}

.game-card:hover {
    transform: translateY(-2px);
}

.game-card h3 {
    margin-top: 0;
    color: #2196F3;
}

.game-card h3 a {
    color: inherit;
    text-decoration: none;
}

.game-card h3 a:hover {
    text-decoration: underline;
}

.game-card p {
    margin-bottom: 0;
    color: #666;
}
</style> 