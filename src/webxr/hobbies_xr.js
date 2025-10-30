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
scene.background = new THREE.Color(0x000000);

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

// Ambient light (reduced intensity to prevent washing out textures)
scene.add(new THREE.AmbientLight(0xffffff, 0.7));

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
// Load kite texture for the blue face (top face)
const kiteTextureLoader = new THREE.TextureLoader();
const kiteTexture = kiteTextureLoader.load('/assets/imgs/kite.png');

// Configure texture to prevent washing out
kiteTexture.colorSpace = THREE.SRGBColorSpace;

const cubeMaterials = [
  new THREE.MeshBasicMaterial({ color: 0xff0000 }), // right - red
  new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // left - green
  new THREE.MeshBasicMaterial({ 
    map: kiteTexture,
    toneMapped: false // Prevent tone mapping from washing out the texture
  }), // top - kite texture
  new THREE.MeshBasicMaterial({ color: 0xffff00 }), // bottom - yellow
  new THREE.MeshBasicMaterial({ color: 0xff3e00 }), // front - orange
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

// Colored spheres for kite surf view (view 2)
function createKiteSurfSpheres() {
  const spheres = [];
  const colors = [
    0xff0000, // red
    0x00ff00, // green
    0x0000ff, // blue
    0xffff00, // yellow
    0xff00ff, // magenta
    0x00ffff, // cyan
    0xff8000, // orange
    0x8000ff, // purple
    0x00ff80, // lime
    0x80ff00, // chartreuse
    0xff0080, // rose
    0x0080ff, // azure
    0x808080, // gray
    0x800000, // maroon
    0x008000, // dark green
    0x000080, // navy
    0x800080, // dark purple
    0x008080, // teal
    0x404040, // dark gray
    0xc0c0c0  // light gray
  ];

  // Define sphere positions in a pattern similar to the attached image
  // Starting from center and expanding to the right
  const spherePositions = [
    // Center cluster (face-like pattern)
    { x: -140, y: 110, z: -50 }, // center-left eye area
    { x: -135, y: 115, z: -52 }, // left eye
    { x: -132, y: 108, z: -48 }, // right eye area
    { x: -138, y: 105, z: -45 }, // nose area
    { x: -140, y: 100, z: -47 }, // mouth area
    { x: -142, y: 102, z: -50 }, // left cheek
    { x: -130, y: 103, z: -49 }, // right cheek
    
    // Expanding pattern to the right
    { x: -125, y: 112, z: -46 }, 
    { x: -120, y: 108, z: -44 },
    { x: -115, y: 105, z: -42 },
    { x: -110, y: 110, z: -40 },
    { x: -105, y: 107, z: -38 },
    { x: -100, y: 104, z: -36 },
    
    // Scattered dots extending further right
    { x: -95, y: 115, z: -34 },
    { x: -90, y: 101, z: -32 },
    { x: -85, y: 108, z: -30 },
    { x: -80, y: 112, z: -28 },
    { x: -75, y: 106, z: -26 },
    { x: -70, y: 109, z: -24 },
    { x: -65, y: 103, z: -22 }
  ];

  // Create spheres with different colors
  spherePositions.forEach((position, index) => {
    const sphereGeometry = new THREE.SphereGeometry(5, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({ 
      color: colors[index % colors.length],
      transparent: true,
      opacity: 0.8
    });
    
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(position.x, position.y, position.z);
    
    // Add some random rotation for visual interest
    sphere.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );
    
    spheres.push(sphere);
    scene.add(sphere);
  });

  return spheres;
}

// Function to create lines from spheres to blue cube face center
function createSpheresToCubeLines(spheres) {
  const lines = [];
  
  // Calculate the center of the blue (top) face of the cube
  // The cube is at (0, 0, -100) with rotation (0, 0, Math.PI/3)
  // Blue face is the top face, so we need to find its center after rotation
  const cubeCenter = new THREE.Vector3(0, 0, -100);
  const cubeFaceOffset = new THREE.Vector3(0, 55, 0); // Half of cube height (110/2)
  
  // Apply the cube's rotation to the face offset
  const cubeRotation = new THREE.Euler(0, 0, Math.PI / 3);
  cubeFaceOffset.applyEuler(cubeRotation);
  
  // Calculate the actual center of the blue face
  const blueFaceCenter = cubeCenter.clone().add(cubeFaceOffset);
  
  // Select only 4 spheres - 2 from left side and 2 from right side
  const selectedSphereIndices = [
    1,  // Left side sphere (left eye area)
    5,  // Left side sphere (left cheek)
    16, // Right side sphere 
    19  // Right side sphere (rightmost)
  ];
  
  // Create lines only for selected spheres
  selectedSphereIndices.forEach((sphereIndex) => {
    if (sphereIndex < spheres.length) {
      const sphere = spheres[sphereIndex];
      const spherePosition = sphere.position.clone();
      
      // Create line geometry
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        spherePosition,
        blueFaceCenter
      ]);
      
      // Create line material with a subtle color
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x808080, // Gray color
        transparent: true,
        opacity: 0.6,
        linewidth: 1
      });
      
      // Create the line
      const line = new THREE.Line(lineGeometry, lineMaterial);
      lines.push(line);
      scene.add(line);
    }
  });
  
  return lines;
}

// Create the kite surf spheres
const kiteSurfSpheres = createKiteSurfSpheres();

// Create lines from spheres to blue cube face
const sphereLines = createSpheresToCubeLines(kiteSurfSpheres);

// Camera positions array
const cameraPositions = [
  { x: 0, y: 0, z: 20 }, // tennis view 1
  { x: -223, y: 123, z: -127 }, // kite surf view 2
  { x: -2, y: -20, z: -231 }  // meditation view 3
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