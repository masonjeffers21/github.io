---
layout: page
title: Planet Genesis
permalink: /games/planet-genesis/
nav: false
parent: Games
nav_order: 3
---

<div class="breadcrumb">
    <a href="/games/">Games</a> > Planet Genesis
</div>

<div class="game-container">
    <div class="game-header">
        <h2>Planet Genesis: A Terraforming Simulator</h2>
        <div class="game-description">
            <p>Create and terraform your own planet from scratch. Adjust atmospheric conditions, sculpt terrain, and watch your world evolve!</p>
        </div>
    </div>
    
    <div class="game-layout">
        <div class="game-canvas-container">
            <canvas id="planetCanvas"></canvas>
            <div class="loading-overlay">
                <div class="loading-spinner"></div>
                <p>Loading Planet Genesis...</p>
            </div>
        </div>
        
        <div class="game-controls">
            <div class="control-section">
                <h3>Planetary Formation</h3>
                <div class="slider-group">
                    <label>Core Density</label>
                    <input type="range" id="coreDensity" min="0" max="100" value="50">
                    <span class="value-display">50%</span>
                </div>
                <div class="slider-group">
                    <label>Gravity</label>
                    <input type="range" id="gravity" min="0" max="100" value="50">
                    <span class="value-display">50%</span>
                </div>
                <div class="slider-group">
                    <label>Initial Temperature</label>
                    <input type="range" id="temperature" min="0" max="100" value="50">
                    <span class="value-display">50%</span>
                </div>
            </div>
            
            <div class="control-section">
                <h3>Atmospheric Composition</h3>
                <div class="slider-group">
                    <label>Oxygen</label>
                    <input type="range" id="oxygen" min="0" max="100" value="20">
                    <span class="value-display">20%</span>
                </div>
                <div class="slider-group">
                    <label>Carbon Dioxide</label>
                    <input type="range" id="co2" min="0" max="100" value="0">
                    <span class="value-display">0%</span>
                </div>
                <div class="slider-group">
                    <label>Nitrogen</label>
                    <input type="range" id="nitrogen" min="0" max="100" value="80">
                    <span class="value-display">80%</span>
                </div>
            </div>
            
            <div class="control-section">
                <h3>Terrain Controls</h3>
                <div class="button-group">
                    <button id="raiseTerrain">Raise Terrain</button>
                    <button id="lowerTerrain">Lower Terrain</button>
                    <button id="smoothTerrain">Smooth</button>
                </div>
            </div>
            
            <div class="control-section">
                <h3>Planet Controls</h3>
                <div class="button-group">
                    <button id="resetPlanet">Reset Planet</button>
                </div>
            </div>
        </div>
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
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.game-header {
    margin-bottom: 30px;
    text-align: center;
}

.game-description {
    color: #666;
    max-width: 800px;
    margin: 0 auto;
}

.game-layout {
    display: flex;
    gap: 20px;
    margin-top: 20px;
}

.game-canvas-container {
    flex: 2;
    position: relative;
    background: #000;
    border-radius: 8px;
    overflow: hidden;
    aspect-ratio: 16/9;
}

#planetCanvas {
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

.game-controls {
    flex: 1;
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    max-width: 300px;
}

.control-section {
    margin-bottom: 25px;
}

.control-section h3 {
    margin: 0 0 15px 0;
    color: #2196F3;
    font-size: 1.1em;
}

.slider-group {
    margin-bottom: 15px;
}

.slider-group label {
    display: block;
    margin-bottom: 5px;
    color: #666;
}

.slider-group input[type="range"] {
    width: 100%;
    margin: 5px 0;
}

.value-display {
    display: inline-block;
    min-width: 45px;
    text-align: right;
    color: #666;
}

.button-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.button-group button {
    padding: 8px 16px;
    background: #2196F3;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.2s;
}

.button-group button:hover {
    background: #1976D2;
}

@media (max-width: 768px) {
    .game-layout {
        flex-direction: column;
    }
    
    .game-controls {
        max-width: none;
    }
}
</style>

<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('planetCanvas'),
        antialias: true
    });
    
    // Set renderer size
    function updateRendererSize() {
        const container = renderer.domElement.parentElement;
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }
    
    updateRendererSize();
    window.addEventListener('resize', updateRendererSize);
    
    // Create a basic sphere for the planet
    const geometry = new THREE.SphereGeometry(5, 32, 32);
    
    // Create a shader material for the planet
    const planetMaterial = new THREE.ShaderMaterial({
        uniforms: {
            atmosphereColor: { value: new THREE.Color(0x0077ff) },
            temperature: { value: 0.5 },
            oxygen: { value: 0.2 },
            co2: { value: 0.0 },
            nitrogen: { value: 0.8 }
        },
        vertexShader: `
            varying vec3 vPosition;
            void main() {
                vPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 atmosphereColor;
            uniform float temperature;
            uniform float oxygen;
            uniform float co2;
            uniform float nitrogen;
            varying vec3 vPosition;
            
            void main() {
                float totalAtmosphere = oxygen + co2 + nitrogen;
                float earthness = (oxygen / totalAtmosphere) * temperature;
                vec3 earthColor = vec3(0.0, 1.0, 0.0); // Green color for Earth-like conditions
                vec3 finalColor = mix(vec3(1.0, 0.5, 0.0), earthColor, earthness);
                gl_FragColor = vec4(finalColor, 1.0);
            }
        `
    });
    const planet = new THREE.Mesh(geometry, planetMaterial);
    scene.add(planet);
    
    // Position camera
    camera.position.z = 15;
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        planet.rotation.y += 0.01;
        renderer.render(scene, camera);
    }
    
    // Start animation
    animate();
    
    // Remove loading overlay
    const loadingOverlay = document.querySelector('.loading-overlay');
    loadingOverlay.style.display = 'none';
    
    // Event listeners for controls
    const sliders = document.querySelectorAll('input[type="range"]');
    
    // Update planet properties based on slider values
    function updatePlanetProperties() {
        const temperature = document.getElementById('temperature').value; // Temperature in Kelvin
        let oxygen = document.getElementById('oxygen').value / 100;
        let co2 = document.getElementById('co2').value / 100;
        let nitrogen = document.getElementById('nitrogen').value / 100;

        // Normalize atmospheric composition
        const totalAtmosphere = oxygen + co2 + nitrogen;
        if (totalAtmosphere > 1) {
            oxygen /= totalAtmosphere;
            co2 /= totalAtmosphere;
            nitrogen /= totalAtmosphere;

            // Update slider values to reflect normalization
            document.getElementById('oxygen').value = oxygen * 100;
            document.getElementById('co2').value = co2 * 100;
            document.getElementById('nitrogen').value = nitrogen * 100;

            // Update slider display
            document.getElementById('oxygen').nextElementSibling.textContent = (oxygen * 100).toFixed(1) + '%';
            document.getElementById('co2').nextElementSibling.textContent = (co2 * 100).toFixed(1) + '%';
            document.getElementById('nitrogen').nextElementSibling.textContent = (nitrogen * 100).toFixed(1) + '%';
        }

        planetMaterial.uniforms.temperature.value = (temperature - 0) / (5778 - 0); // Normalize for shader
        planetMaterial.uniforms.oxygen.value = oxygen;
        planetMaterial.uniforms.co2.value = co2;
        planetMaterial.uniforms.nitrogen.value = nitrogen;

        // Update atmosphere color based on composition
        const atmosphereColor = new THREE.Color();
        const earthness = (oxygen / (oxygen + co2 + nitrogen)) * ((temperature - 0) / (5778 - 0));
        atmosphereColor.setHSL(0.1 + earthness * 0.5, Math.min(0.8, (oxygen + co2 + nitrogen) / 100), 0.5);
        planetMaterial.uniforms.atmosphereColor.value = atmosphereColor;
    }

    sliders.forEach(slider => {
        const valueDisplay = slider.nextElementSibling;
        slider.addEventListener('input', () => {
            if (slider.id === 'temperature') {
                valueDisplay.textContent = slider.value + ' K';
            } else {
                valueDisplay.textContent = slider.value + '%';
            }
            updatePlanetProperties();
        });
    });
    
    // Set initial values for sliders
    document.getElementById('temperature').min = 0; // Absolute zero
    document.getElementById('temperature').max = 5778; // Surface temperature of the sun
    document.getElementById('temperature').value = 288; // Approximate Earth average temperature in Kelvin
    document.getElementById('temperature').nextElementSibling.textContent = '288 K';
    
    // Button event listeners
    document.getElementById('raiseTerrain').addEventListener('click', () => {
        // Logic to raise terrain
    });
    
    document.getElementById('lowerTerrain').addEventListener('click', () => {
        // Logic to lower terrain
    });
    
    document.getElementById('smoothTerrain').addEventListener('click', () => {
        // Logic to smooth terrain
    });
    
    document.getElementById('resetPlanet').addEventListener('click', () => {
        // Logic to reset planet
    });
});
</script> 