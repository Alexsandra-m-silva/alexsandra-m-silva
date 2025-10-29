import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Get the canvas element from the DOM
const canvas = document.querySelector('canvas');

// Renderer 
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Scene with a white background
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

// Camera
const camera = new THREE.PerspectiveCamera(
  60, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.set(0, 0, 20);

// OrbitControls for mouse interaction
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.zoomSpeed = 4.0;

/* camera position logging */
controls.addEventListener('change', () => {
  console.log('Camera position:', camera.position);
  console.log('Camera zoom:', camera.zoom);
});

// Ambient light
scene.add(new THREE.AmbientLight(0xffffff, 1));

// sphere  
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('/assets/imgs/Tennisball_texture.jpg');
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(3, 64, 64),
  new THREE.MeshBasicMaterial({ 
    color: 0x2822dd     
  })
);
sphere.position.set(0, -15, -42);
scene.add(sphere);

// earth texture
const sphere2 = new THREE.Mesh(
  new THREE.SphereGeometry(3, 64, 64),
  new THREE.MeshBasicMaterial({ 
    map: earthTexture,
    transparent: true,
    opacity: 5
  })
);
sphere2.position.set(0, -15, -42);
scene.add(sphere2);

// 3D Tennis racket model
let racket;
const gltfLoader = new GLTFLoader();
gltfLoader.load('/assets/imgs/tennis_racket_wilson_blade.glb', (gltf) => {
  racket = gltf.scene;
  racket.position.set(-20, -15, -45); // under the sphere
  racket.scale.set(5, 5, 5);
  racket.rotation.x =  Math.PI/2;
  racket.rotation.y = 3 * Math.PI/4;
  scene.add(racket);
});

// Scenario Cube
const cubeMaterials = [
  new THREE.MeshBasicMaterial({ color: 0xff0000 }), // right
  new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // left
  new THREE.MeshBasicMaterial({ color: 0x0000ff }), // top
  new THREE.MeshBasicMaterial({ color: 0xffff00 }), // bottom
  new THREE.MeshBasicMaterial({ color: 0xff3e00 }), // front
  new THREE.MeshBasicMaterial({ color: 0xff3e00 })  // back - orange
];
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(110, 110, 110),
  cubeMaterials
);
// Position at the left edge (x = -window.innerWidth/2)
cube.position.set(0, 0, -100); // Center of the scene
cube.rotation.set( 0, 0, Math.PI / 3); // Front face toward user
scene.add(cube);

// Camera positions array
const cameraPositions = [
  { x: 0, y: 0, z: 20 }, // tennis view 1
  { x: -149, y: 101, z: -58 }
];

let currentPositionIndex = 0;

// Create navigation buttons
function createNavigationButtons() {
  // Create navigation container
  const navContainer = document.createElement('div');
  navContainer.className = 'webxr-nav-container';

  // Position indicator
  const positionIndicator = document.createElement('div');
  positionIndicator.className = 'webxr-position-indicator';
  
  // Create position dots
  const dots = [];
  for (let i = 0; i < cameraPositions.length; i++) {
    const dot = document.createElement('div');
    dot.className = `webxr-position-dot ${i === currentPositionIndex ? 'active' : ''}`;
    dot.addEventListener('click', () => {
      currentPositionIndex = i;
      animateCameraTo(cameraPositions[currentPositionIndex]);
      updatePositionIndicator();
    });
    dots.push(dot);
    positionIndicator.appendChild(dot);
  }

  // Left arrow button
  const leftButton = document.createElement('button');
  leftButton.className = `webxr-nav-button ${currentPositionIndex > 0 ? '' : 'disabled'}`;
  leftButton.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="15,18 9,12 15,6"></polyline>
    </svg>
  `;
  
  // Right arrow button
  const rightButton = document.createElement('button');
  rightButton.className = `webxr-nav-button ${currentPositionIndex < cameraPositions.length - 1 ? '' : 'disabled'}`;
  rightButton.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="9,18 15,12 9,6"></polyline>
    </svg>
  `;

  // Add position label
  const positionLabel = document.createElement('div');
  positionLabel.className = 'webxr-position-label';
  positionLabel.textContent = `View ${currentPositionIndex + 1}`;

  // Update position indicator function
  function updatePositionIndicator() {
    dots.forEach((dot, index) => {
      dot.className = `webxr-position-dot ${index === currentPositionIndex ? 'active' : ''}`;
    });
    
    // Update button states
    leftButton.className = `webxr-nav-button ${currentPositionIndex > 0 ? '' : 'disabled'}`;
    rightButton.className = `webxr-nav-button ${currentPositionIndex < cameraPositions.length - 1 ? '' : 'disabled'}`;
  }

  // Assemble the navigation
  navContainer.appendChild(leftButton);
  navContainer.appendChild(positionLabel);
  navContainer.appendChild(positionIndicator);
  navContainer.appendChild(rightButton);

  // Add click event listeners
  leftButton.addEventListener('click', () => {
    if (currentPositionIndex > 0) {
      currentPositionIndex--;
      animateCameraTo(cameraPositions[currentPositionIndex]);
      updatePositionIndicator();
      positionLabel.textContent = `Tennis View ${currentPositionIndex + 1}`;
    }
  });

  rightButton.addEventListener('click', () => {
    if (currentPositionIndex < cameraPositions.length - 1) {
      currentPositionIndex++;
      animateCameraTo(cameraPositions[currentPositionIndex]);
      updatePositionIndicator();
      positionLabel.textContent = `View ${currentPositionIndex + 1}`;
    }
  });

  // Add container to the page
  document.body.appendChild(navContainer);
}

// Smooth camera animation function
function animateCameraTo(targetPosition) {
  const startPosition = {
    x: camera.position.x,
    y: camera.position.y,
    z: camera.position.z
  };
  
  const duration = 1000; // 1 second animation
  const startTime = Date.now();
  
  function updateCamera() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Smooth easing function
    const easeProgress = progress * progress * (3 - 2 * progress);
    
    camera.position.x = startPosition.x + (targetPosition.x - startPosition.x) * easeProgress;
    camera.position.y = startPosition.y + (targetPosition.y - startPosition.y) * easeProgress;
    camera.position.z = startPosition.z + (targetPosition.z - startPosition.z) * easeProgress;
    
    if (progress < 1) {
      requestAnimationFrame(updateCamera);
    }
  }
  
  updateCamera();
}

// Initialize navigation buttons
createNavigationButtons();

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();