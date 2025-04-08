---
layout: page
title: Games
permalink: /games/
nav: true
nav_order: 5
description: A collection of browser-based games
---

# Games Collection

Welcome to my games collection! Here you'll find a variety of interactive games I've developed. Feel free to try them out and let me know what you think!

## Available Games

<div class="games-grid">
    <a href="{{ '/games/pong/' | relative_url }}" class="game-card">
        <h3>Pong</h3>
        <p>A classic arcade game where you control a paddle to bounce a ball back and forth.</p>
    </a>
    <a href="{{ '/games/memory-card-game/' | relative_url }}" class="game-card">
        <h3>Memory Card Game</h3>
        <p>Test your memory by matching pairs of cards in this classic memory game.</p>
    </a>
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
    text-decoration: none;
    display: block;
    color: inherit;
}

.game-card:hover {
    transform: translateY(-2px);
    text-decoration: none;
}

.game-card h3 {
    margin-top: 0;
    color: #2196F3;
}

.game-card p {
    margin-bottom: 0;
    color: #666;
}
</style> 