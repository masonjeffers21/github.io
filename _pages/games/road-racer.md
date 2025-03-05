---
layout: page
title: Road Racer 3D
permalink: /games/road-racer/
nav: false
parent: Games
nav_order: 4
---

<div class="breadcrumb">
    <a href="/games/">Games</a> > Road Racer 3D
</div>

<div class="game-container">
    <div class="game-header">
        <h2>Road Racer 3D</h2>
        <div class="game-stats">
            <span>Lap: <span id="lap">0</span></span>
            <span>Speed: <span id="speed">0</span> km/h</span>
            <span>Time: <span id="time">0:00</span></span>
        </div>
    </div>
    
    <div class="game-canvas-container">
        <canvas id="gameCanvas"></canvas>
        <div class="loading-overlay">
            <div class="loading-spinner"></div>
            <p>Loading Road Racer 3D...</p>
        </div>
        <div class="game-instructions">
            <p>Use W, A, S, D keys to drive the car around the track.</p>
            <p>W = Accelerate, S = Brake/Reverse, A = Turn Left, D = Turn Right</p>
        </div>
    </div>
    
    <div class="game-controls">
        <button id="restartGame">Restart Game</button>
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

.game-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
}

.game-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.game-stats {
    display: flex;
    gap: 20px;
    font-size: 18px;
}

.game-canvas-container {
    position: relative;
    background: #333;
    border-radius: 8px;
    overflow: hidden;
    aspect-ratio: 16/9;
    margin-bottom: 20px;
}

#gameCanvas {
    width: 100%;
    height: 100%;
}

.loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    z-index: 100;
}

.loading-spinner {
    width: 50px;
    height: 50px;
    border: 5px solid #f3f3f3;
    border-top: 5px solid #2196F3;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.game-instructions {
    margin-top: 10px;
    text-align: center;
    color: #ffffff;
    background: rgba(0, 0, 0, 0.5);
    padding: 10px;
    border-radius: 5px;
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    z-index: 10;
}

.game-controls {
    display: flex;
    justify-content: center;
}

.game-controls button {
    padding: 10px 20px;
    background: #2196F3;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
}

.game-controls button:hover {
    background: #1976D2;
}
</style>

<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Canvas setup
    const canvas = document.getElementById('gameCanvas');
    const loadingOverlay = document.querySelector('.loading-overlay');
    
    // Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    
    // Set renderer size
    function updateRendererSize() {
        const container = canvas.parentElement;
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }
    
    updateRendererSize();
    window.addEventListener('resize', updateRendererSize);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Game variables
    let lapCount = 0;
    let startTime = 0;
    let gameTime = 0;
    let gameStarted = false;
    let gameOver = false;
    let lastTimestamp = 0;
    let checkpointsPassed = 0;
    
    // Track parameters
    const trackWidth = 15;
    const trackLength = 100;
    const trackHeight = 0.1;
    const trackRadius = 30;
    const wallHeight = 2.5;
    
    // Create oval track
    const trackGroup = new THREE.Group();
    scene.add(trackGroup);
    
    function createOvalTrack() {
        // Create ground
        const groundGeometry = new THREE.PlaneGeometry(300, 300);
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x228B22,
            roughness: 0.8,
            metalness: 0.2
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.1;
        ground.receiveShadow = true;
        trackGroup.add(ground);
        
        // Create oval track
        const trackMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x333333,
            roughness: 0.9,
            metalness: 0.1
        });
        
        // Create straights
        const straightGeometry = new THREE.BoxGeometry(trackWidth, trackHeight, trackLength);
        
        const straight1 = new THREE.Mesh(straightGeometry, trackMaterial);
        straight1.position.set(trackRadius, 0, 0);
        straight1.receiveShadow = true;
        trackGroup.add(straight1);
        
        const straight2 = new THREE.Mesh(straightGeometry, trackMaterial);
        straight2.position.set(-trackRadius, 0, 0);
        straight2.receiveShadow = true;
        trackGroup.add(straight2);
        
        // Create curves (semicircles)
        const curveSegments = 20;
        
        // Top curve
        for (let i = 0; i < curveSegments; i++) {
            const angle = Math.PI * i / (curveSegments - 1);
            const x = Math.cos(angle) * trackRadius;
            const z = Math.sin(angle) * trackRadius + trackLength / 2;
            
            const segmentGeometry = new THREE.BoxGeometry(trackWidth, trackHeight, trackLength / curveSegments + 1);
            const segment = new THREE.Mesh(segmentGeometry, trackMaterial);
            segment.position.set(x, 0, z);
            segment.rotation.y = angle + Math.PI / 2;
            segment.receiveShadow = true;
            trackGroup.add(segment);
        }
        
        // Bottom curve
        for (let i = 0; i < curveSegments; i++) {
            const angle = Math.PI * i / (curveSegments - 1) + Math.PI;
            const x = Math.cos(angle) * trackRadius;
            const z = Math.sin(angle) * trackRadius - trackLength / 2;
            
            const segmentGeometry = new THREE.BoxGeometry(trackWidth, trackHeight, trackLength / curveSegments + 1);
            const segment = new THREE.Mesh(segmentGeometry, trackMaterial);
            segment.position.set(x, 0, z);
            segment.rotation.y = angle + Math.PI / 2;
            segment.receiveShadow = true;
            trackGroup.add(segment);
        }
        
        // Create walls
        const wallMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x888888,
            roughness: 0.7,
            metalness: 0.3
        });
        
        // Create walls for straight sections
        createStraightWalls(trackRadius, 0, 0, trackLength, trackWidth, wallHeight, wallMaterial);
        createStraightWalls(-trackRadius, 0, 0, trackLength, trackWidth, wallHeight, wallMaterial);
        
        // Create walls for curved sections
        createCurvedWalls(trackRadius, trackLength/2, 0, Math.PI, 0, curveSegments, trackWidth, wallHeight, wallMaterial);
        createCurvedWalls(trackRadius, -trackLength/2, Math.PI, Math.PI*2, 0, curveSegments, trackWidth, wallHeight, wallMaterial);
        
        // Create checkpoint markers
        const checkpointGeometry = new THREE.BoxGeometry(trackWidth, 0.2, 1);
        const checkpointMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        
        // Start/finish line
        const startLine = new THREE.Mesh(checkpointGeometry, new THREE.MeshStandardMaterial({ color: 0xffffff }));
        startLine.position.set(trackRadius, 0.1, 0);
        trackGroup.add(startLine);
        
        // Checkpoint 1 (top)
        const checkpoint1 = new THREE.Mesh(checkpointGeometry, checkpointMaterial);
        checkpoint1.position.set(0, 0.1, trackRadius + trackLength / 2);
        checkpoint1.rotation.y = Math.PI / 2;
        trackGroup.add(checkpoint1);
        
        // Checkpoint 2 (left)
        const checkpoint2 = new THREE.Mesh(checkpointGeometry, checkpointMaterial);
        checkpoint2.position.set(-trackRadius, 0.1, 0);
        trackGroup.add(checkpoint2);
        
        // Checkpoint 3 (bottom)
        const checkpoint3 = new THREE.Mesh(checkpointGeometry, checkpointMaterial);
        checkpoint3.position.set(0, 0.1, -trackRadius - trackLength / 2);
        checkpoint3.rotation.y = Math.PI / 2;
        trackGroup.add(checkpoint3);
    }
    
    // Helper function to create walls for straight sections
    function createStraightWalls(x, y, z, length, width, height, material) {
        // Create outer wall
        const outerWallGeometry = new THREE.BoxGeometry(1, height, length);
        const outerWall = new THREE.Mesh(outerWallGeometry, material);
        outerWall.position.set(x + width/2, height/2, z);
        outerWall.castShadow = true;
        outerWall.receiveShadow = true;
        trackGroup.add(outerWall);
        
        // Create inner wall
        const innerWallGeometry = new THREE.BoxGeometry(1, height, length);
        const innerWall = new THREE.Mesh(innerWallGeometry, material);
        innerWall.position.set(x - width/2, height/2, z);
        innerWall.castShadow = true;
        innerWall.receiveShadow = true;
        trackGroup.add(innerWall);
    }
    
    // Helper function to create walls for curved sections
    function createCurvedWalls(radius, zOffset, startAngle, endAngle, yOffset, segments, width, height, material) {
        const angleStep = (endAngle - startAngle) / segments;
        
        // Create outer curved wall
        for (let i = 0; i <= segments; i++) {
            const angle = startAngle + i * angleStep;
            const x = Math.cos(angle) * (radius + width/2);
            const z = Math.sin(angle) * (radius + width/2) + zOffset;
            
            const wallGeometry = new THREE.BoxGeometry(1, height, radius * angleStep * 1.2);
            const wall = new THREE.Mesh(wallGeometry, material);
            wall.position.set(x, height/2 + yOffset, z);
            wall.rotation.y = angle + Math.PI / 2;
            wall.castShadow = true;
            wall.receiveShadow = true;
            trackGroup.add(wall);
        }
        
        // Create inner curved wall
        for (let i = 0; i <= segments; i++) {
            const angle = startAngle + i * angleStep;
            const x = Math.cos(angle) * (radius - width/2);
            const z = Math.sin(angle) * (radius - width/2) + zOffset;
            
            const wallGeometry = new THREE.BoxGeometry(1, height, radius * angleStep * 0.8);
            const wall = new THREE.Mesh(wallGeometry, material);
            wall.position.set(x, height/2 + yOffset, z);
            wall.rotation.y = angle + Math.PI / 2;
            wall.castShadow = true;
            wall.receiveShadow = true;
            trackGroup.add(wall);
        }
    }
    
    // Create car
    let car;
    let carBody;
    
    function createCar() {
        car = new THREE.Group();
        
        // Car body
        const bodyGeometry = new THREE.BoxGeometry(2, 1, 4);
        const bodyMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xff0000,
            roughness: 0.5,
            metalness: 0.7
        });
        carBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
        carBody.position.y = 0.5;
        carBody.castShadow = true;
        car.add(carBody);
        
        // Windshield
        const windshieldGeometry = new THREE.BoxGeometry(1.8, 0.5, 1.5);
        const windshieldMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x99ccff,
            transparent: true,
            opacity: 0.7
        });
        const windshield = new THREE.Mesh(windshieldGeometry, windshieldMaterial);
        windshield.position.set(0, 1.0, 0.5);
        windshield.castShadow = true;
        car.add(windshield);
        
        // Wheels
        const wheelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.4, 16);
        const wheelMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x111111,
            roughness: 0.9,
            metalness: 0.1
        });
        
        // Front left wheel
        const wheelFL = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheelFL.position.set(-1.1, 0.5, 1.2);
        wheelFL.rotation.z = Math.PI / 2;
        wheelFL.castShadow = true;
        car.add(wheelFL);
        
        // Front right wheel
        const wheelFR = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheelFR.position.set(1.1, 0.5, 1.2);
        wheelFR.rotation.z = Math.PI / 2;
        wheelFR.castShadow = true;
        car.add(wheelFR);
        
        // Rear left wheel
        const wheelRL = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheelRL.position.set(-1.1, 0.5, -1.2);
        wheelRL.rotation.z = Math.PI / 2;
        wheelRL.castShadow = true;
        car.add(wheelRL);
        
        // Rear right wheel
        const wheelRR = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheelRR.position.set(1.1, 0.5, -1.2);
        wheelRR.rotation.z = Math.PI / 2;
        wheelRR.castShadow = true;
        car.add(wheelRR);
        
        // Position the car at the start of the track
        car.position.set(trackRadius, 0, 0);
        car.rotation.y = Math.PI / 2;
        
        scene.add(car);
        
        // Set up camera - aerial third-person view
        camera.position.set(0, 15, -10); // Position it above and behind the car
        scene.add(camera); // Add to scene instead of car
    }
    
    // Physics
    const carPhysics = {
        position: new THREE.Vector3(trackRadius, 0, 0),
        velocity: new THREE.Vector3(0, 0, 0),
        rotation: Math.PI / 2,
        rotationVelocity: 0,
        
        speed: 0,
        maxSpeed: 50,
        maxReverseSpeed: -20,
        acceleration: 40,
        deceleration: 30,
        brakeForce: 80,
        turnSpeed: 2.5,
        drag: 0.98,
        turnDrag: 0.95,
        grip: 0.95
    };
    
    // Checkpoint tracking
    const checkpoints = [
        new THREE.Vector3(trackRadius, 0, 0),         // Start/finish
        new THREE.Vector3(0, 0, trackRadius),         // Top
        new THREE.Vector3(-trackRadius, 0, 0),        // Left
        new THREE.Vector3(0, 0, -trackRadius)         // Bottom
    ];
    let nextCheckpoint = 1;
    
    // Input handling
    const keys = {
        w: false,
        a: false,
        s: false,
        d: false
    };
    
    window.addEventListener('keydown', function(e) {
        if (e.key.toLowerCase() === 'w') keys.w = true;
        if (e.key.toLowerCase() === 'a') keys.a = true;
        if (e.key.toLowerCase() === 's') keys.s = true;
        if (e.key.toLowerCase() === 'd') keys.d = true;
    });
    
    window.addEventListener('keyup', function(e) {
        if (e.key.toLowerCase() === 'w') keys.w = false;
        if (e.key.toLowerCase() === 'a') keys.a = false;
        if (e.key.toLowerCase() === 's') keys.s = false;
        if (e.key.toLowerCase() === 'd') keys.d = false;
    });
    
    // Update physics
    function updatePhysics(deltaTime) {
        // Acceleration/deceleration
        if (keys.w) {
            carPhysics.speed += carPhysics.acceleration * deltaTime;
        } else if (keys.s) {
            if (carPhysics.speed > 0) {
                carPhysics.speed -= carPhysics.brakeForce * deltaTime;
            } else {
                carPhysics.speed -= carPhysics.acceleration * deltaTime;
            }
        } else {
            if (Math.abs(carPhysics.speed) < 0.1) {
                carPhysics.speed = 0;
            } else if (carPhysics.speed > 0) {
                carPhysics.speed -= carPhysics.deceleration * deltaTime;
            } else {
                carPhysics.speed += carPhysics.deceleration * deltaTime;
            }
        }
        
        // Clamp speed
        if (carPhysics.speed > carPhysics.maxSpeed) {
            carPhysics.speed = carPhysics.maxSpeed;
        }
        if (carPhysics.speed < carPhysics.maxReverseSpeed) {
            carPhysics.speed = carPhysics.maxReverseSpeed;
        }
        
        // Turning
        if (Math.abs(carPhysics.speed) > 0.5) {
            const direction = carPhysics.speed > 0 ? 1 : -1;
            const turnFactor = Math.min(1.0, Math.abs(carPhysics.speed) / 20);
            
            if (keys.a) {
                carPhysics.rotationVelocity += carPhysics.turnSpeed * turnFactor * direction * deltaTime;
            }
            if (keys.d) {
                carPhysics.rotationVelocity -= carPhysics.turnSpeed * turnFactor * direction * deltaTime;
            }
        }
        
        // Apply drag and update rotation
        carPhysics.rotationVelocity *= carPhysics.turnDrag;
        carPhysics.rotation += carPhysics.rotationVelocity * deltaTime;
        
        // Update position based on rotation (FIXED DIRECTION)
        const forwardX = Math.cos(carPhysics.rotation);
        const forwardZ = Math.sin(carPhysics.rotation);
        
        carPhysics.velocity.x = forwardX * carPhysics.speed;
        carPhysics.velocity.z = forwardZ * carPhysics.speed;
        
        const nextPosition = carPhysics.position.clone().add(carPhysics.velocity.clone().multiplyScalar(deltaTime));
        
        // Simple collision detection with walls
        const trackBoundaryOuter = trackRadius + trackWidth/2 - 1;
        const trackBoundaryInner = trackRadius - trackWidth/2 + 1;
        
        // Check if the next position is inside the track
        let isInsideTrack = false;
        
        // Check straight sections
        if (Math.abs(nextPosition.x) <= trackBoundaryOuter && Math.abs(nextPosition.z) <= trackLength/2) {
            // Check if we're in the horizontal straight sections
            if (Math.abs(nextPosition.x) >= trackBoundaryInner) {
                isInsideTrack = true;
            }
        }
        
        // Check curved sections
        if (!isInsideTrack) {
            // Top curve
            const topCurveCenter = new THREE.Vector3(0, 0, trackLength/2);
            const distanceToTop = new THREE.Vector2(nextPosition.x, nextPosition.z - trackLength/2).length();
            
            // Bottom curve
            const bottomCurveCenter = new THREE.Vector3(0, 0, -trackLength/2);
            const distanceToBottom = new THREE.Vector2(nextPosition.x, nextPosition.z + trackLength/2).length();
            
            if ((distanceToTop <= trackBoundaryOuter && distanceToTop >= trackBoundaryInner) ||
                (distanceToBottom <= trackBoundaryOuter && distanceToBottom >= trackBoundaryInner)) {
                isInsideTrack = true;
            }
        }
        
        // If inside track, update position, otherwise bounce slightly
        if (isInsideTrack) {
            carPhysics.position.copy(nextPosition);
        } else {
            // Bounce effect
            carPhysics.speed *= -0.3; // Reverse direction at reduced speed
        }
        
        // Update car position and rotation
        car.position.copy(carPhysics.position);
        car.rotation.y = carPhysics.rotation;
        
        // Update camera position to follow car (third-person aerial view)
        const cameraOffset = new THREE.Vector3(
            -Math.sin(carPhysics.rotation) * 10,
            15,
            -Math.cos(carPhysics.rotation) * 10
        );
        camera.position.copy(carPhysics.position.clone().add(cameraOffset));
        camera.lookAt(carPhysics.position);
        
        // Simulate basic suspension
        const time = performance.now() * 0.001;
        if (Math.abs(carPhysics.speed) > 1) {
            const bounceAmount = Math.abs(carPhysics.speed) * 0.0003;
            car.position.y = Math.sin(time * 10) * bounceAmount + bounceAmount;
            car.rotation.z = Math.sin(time * 15) * 0.01 * Math.abs(carPhysics.rotationVelocity);
            car.rotation.x = Math.sin(time * 10) * 0.01 * Math.abs(carPhysics.speed) / 10;
        } else {
            car.position.y = 0;
            car.rotation.z = 0;
            car.rotation.x = 0;
        }
        
        // Update HUD
        document.getElementById('speed').textContent = Math.abs(Math.round(carPhysics.speed * 3.6)); // Convert to km/h
        
        // Check for checkpoints and lap completion
        checkCheckpoints();
    }
    
    function checkCheckpoints() {
        const distanceToCheckpoint = carPhysics.position.distanceTo(checkpoints[nextCheckpoint]);
        
        if (distanceToCheckpoint < 10) {
            nextCheckpoint = (nextCheckpoint + 1) % checkpoints.length;
            
            if (nextCheckpoint === 0) {
                // Completed a lap
                lapCount++;
                document.getElementById('lap').textContent = lapCount;
            }
        }
    }
    
    // Format time as MM:SS.ms
    function formatTime(timeInSeconds) {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Game loop
    function gameLoop(timestamp) {
        if (!lastTimestamp) lastTimestamp = timestamp;
        const deltaTime = (timestamp - lastTimestamp) / 1000; // Convert to seconds
        lastTimestamp = timestamp;
        
        if (gameStarted && !gameOver) {
            // Update game time
            gameTime = (timestamp - startTime) / 1000;
            document.getElementById('time').textContent = formatTime(gameTime);
            
            // Update physics
            updatePhysics(deltaTime);
        }
        
        // Render scene
        renderer.render(scene, camera);
        
        // Continue game loop
        requestAnimationFrame(gameLoop);
    }
    
    // Start game
    function startGame() {
        // Create the game elements
        createOvalTrack();
        createCar();
        
        // Initialize game state
        lapCount = 0;
        gameTime = 0;
        startTime = performance.now();
        document.getElementById('lap').textContent = lapCount;
        document.getElementById('speed').textContent = '0';
        document.getElementById('time').textContent = '0:00';
        
        carPhysics.position.set(trackRadius, 0, 0);
        carPhysics.velocity.set(0, 0, 0);
        carPhysics.rotation = Math.PI / 2;
        carPhysics.rotationVelocity = 0;
        carPhysics.speed = 0;
        
        nextCheckpoint = 1;
        
        gameStarted = true;
        gameOver = false;
        
        // Start the game loop
        lastTimestamp = 0;
        requestAnimationFrame(gameLoop);
        
        // Hide loading overlay
        loadingOverlay.style.display = 'none';
    }
    
    // Restart game button
    document.getElementById('restartGame').addEventListener('click', function() {
        // Clear the scene
        while (scene.children.length > 0) {
            scene.remove(scene.children[0]);
        }
        
        // Restart
        startGame();
    });
    
    // Start the game when everything is loaded
    startGame();
});
</script> 