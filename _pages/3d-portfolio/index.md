---
layout: page
title: 3D Portfolio
permalink: /3d-portfolio/
description: An interactive 3D showcase of my projects
---

<canvas id="webgl"></canvas>
<div id="loading-overlay">
    <div class="spinner"></div>
    <div class="loading-text">Loading Environment...</div>
</div>
<div id="project-info" class="hidden">
    <h2 id="project-title"></h2>
    <p id="project-description"></p>
    <a id="project-link" href="#" class="button">View Details</a>
</div>

<script type="module">
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.152.2/examples/jsm/controls/OrbitControls.js';

// Scene setup
const canvas = document.querySelector('#webgl');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);
const sizes = { width: window.innerWidth, height: window.innerHeight };

// Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 2, 8);
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({ 
    canvas, 
    antialias: true,
    powerPreference: "high-performance"
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 3;
controls.maxDistance = 15;
controls.maxPolarAngle = Math.PI / 2;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 7);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
scene.add(dirLight);

// Project definitions
const projects = [
    {
        name: 'Robot Arm',
        description: 'A 6-axis robot arm acquired from P&G, restored and programmed for custom applications.',
        position: [-4, 0, 0],
        link: '/projects/robot-arm'
    },
    {
        name: 'Homelab',
        description: 'Custom home server setup with Proxmox VE, running various services and automations.',
        position: [0, 0, 0],
        link: '/projects/homelab'
    },
    {
        name: 'Games',
        description: 'Collection of interactive web-based games including Pong and Memory Card Game.',
        position: [4, 0, 0],
        link: '/games'
    }
];

// Create robot arm model
function createRobotArm() {
    const group = new THREE.Group();
    
    // Base
    const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.6, 0.8, 0.4, 32),
        new THREE.MeshStandardMaterial({ color: 0x666666, metalness: 0.7, roughness: 0.3 })
    );
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);

    // Main arm
    const mainArm = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 2, 0.4),
        new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.5, roughness: 0.5 })
    );
    mainArm.position.y = 1.2;
    mainArm.castShadow = true;
    mainArm.receiveShadow = true;
    group.add(mainArm);

    // Secondary arm
    const secondaryArm = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 1.5, 0.3),
        new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.5, roughness: 0.5 })
    );
    secondaryArm.position.y = 2.5;
    secondaryArm.rotation.z = Math.PI / 6;
    secondaryArm.castShadow = true;
    secondaryArm.receiveShadow = true;
    group.add(secondaryArm);

    // End effector
    const endEffector = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 0.2, 0.6),
        new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.2 })
    );
    endEffector.position.set(0.4, 3.2, 0);
    endEffector.castShadow = true;
    endEffector.receiveShadow = true;
    group.add(endEffector);

    return group;
}

// Create server rack model
function createServerRack() {
    const group = new THREE.Group();

    // Rack frame
    const frame = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 3, 0.8),
        new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.7, roughness: 0.3 })
    );
    frame.castShadow = true;
    frame.receiveShadow = true;
    group.add(frame);

    // Servers
    for (let i = 0; i < 5; i++) {
        const server = new THREE.Mesh(
            new THREE.BoxGeometry(1.4, 0.4, 0.7),
            new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.2 })
        );
        server.position.y = -1.2 + (i * 0.5);
        server.castShadow = true;
        server.receiveShadow = true;
        group.add(server);

        // Server LED
        const led = new THREE.Mesh(
            new THREE.CircleGeometry(0.03, 16),
            new THREE.MeshStandardMaterial({ 
                color: 0x00ff00, 
                emissive: 0x00ff00,
                emissiveIntensity: 2
            })
        );
        led.position.set(0.6, -1.2 + (i * 0.5), 0.36);
        group.add(led);
    }

    return group;
}

// Create arcade cabinet model
function createArcadeCabinet() {
    const group = new THREE.Group();

    // Main cabinet
    const cabinet = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 3, 1.2),
        new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.5, roughness: 0.8 })
    );
    cabinet.castShadow = true;
    cabinet.receiveShadow = true;
    group.add(cabinet);

    // Screen
    const screen = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, 1.2, 0.1),
        new THREE.MeshStandardMaterial({ 
            color: 0x222222, 
            emissive: 0x222222,
            emissiveIntensity: 0.5
        })
    );
    screen.position.set(0, 0.5, 0.6);
    screen.castShadow = true;
    group.add(screen);

    // Control panel
    const controlPanel = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, 0.6, 0.8),
        new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.6, roughness: 0.4 })
    );
    controlPanel.position.set(0, -0.8, 0.4);
    controlPanel.rotation.x = -Math.PI / 6;
    controlPanel.castShadow = true;
    controlPanel.receiveShadow = true;
    group.add(controlPanel);

    return group;
}

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ 
        color: 0x333333,
        roughness: 0.8,
        metalness: 0.2
    })
);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Add models
const robotArm = createRobotArm();
robotArm.position.set(...projects[0].position);
robotArm.name = projects[0].name;
scene.add(robotArm);

const serverRack = createServerRack();
serverRack.position.set(...projects[1].position);
serverRack.name = projects[1].name;
scene.add(serverRack);

const arcadeCabinet = createArcadeCabinet();
arcadeCabinet.position.set(...projects[2].position);
arcadeCabinet.name = projects[2].name;
scene.add(arcadeCabinet);

// Hide loading screen
document.getElementById('loading-overlay').style.display = 'none';

// Interaction
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onPointerMove(event) {
    pointer.x = (event.clientX / sizes.width) * 2 - 1;
    pointer.y = -(event.clientY / sizes.height) * 2 + 1;
}

function onPointerDown(event) {
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        let object = intersects[0].object;
        while (object.parent && !projects.find(p => p.name === object.name)) {
            object = object.parent;
        }

        const project = projects.find(p => p.name === object.name);
        if (project) {
            document.getElementById('project-title').textContent = project.name;
            document.getElementById('project-description').textContent = project.description;
            document.getElementById('project-link').href = project.link;
            document.getElementById('project-info').classList.remove('hidden');
        }
    }
}

// Animation
const clock = new THREE.Clock();

function animate() {
    const delta = clock.getDelta();
    controls.update();

    // Rotate models
    scene.traverse((child) => {
        if (projects.find(p => p.name === child.name)) {
            child.rotation.y += delta * 0.2;
        }
    });

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

// Event listeners
window.addEventListener('pointermove', onPointerMove);
window.addEventListener('pointerdown', onPointerDown);
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
});

// Start animation
animate();
</script>

<style>
#webgl {
    position: fixed;
    top: 0;
    left: 0;
    outline: none;
    z-index: 1;
}

#loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.spinner {
    width: 50px;
    height: 50px;
    border: 5px solid #f3f3f3;
    border-top: 5px solid #2196F3;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
}

.loading-text {
    color: white;
    font-size: 1.2em;
}

#project-info {
    position: fixed;
    bottom: 30px;
    left: 30px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 20px;
    border-radius: 10px;
    max-width: 400px;
    backdrop-filter: blur(10px);
    transform: translateY(0);
    transition: transform 0.3s ease-out;
    z-index: 100;
}

#project-info.hidden {
    transform: translateY(calc(100% + 30px));
}

.button {
    display: inline-block;
    padding: 10px 20px;
    background: #2196F3;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    margin-top: 15px;
    transition: background-color 0.3s;
}

.button:hover {
    background: #1976D2;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style> 