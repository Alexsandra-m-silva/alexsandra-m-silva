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
camera.position.set(-2, -20, -231);

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
const earthTexture = textureLoader.load('./assets/imgs/Tennisball_texture.jpg');
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
gltfLoader.load('./assets/imgs/tennis_racket_wilson_blade.glb', (gltf) => {
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
const kiteTexture = kiteTextureLoader.load('./assets/imgs/kite.png');

// Configure texture to prevent washing out
kiteTexture.colorSpace = THREE.SRGBColorSpace;

const cubeMaterials = [
  new THREE.MeshBasicMaterial({ color: 0xff0000 }), // right - red
  new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // left - green
  new THREE.MeshBasicMaterial({ 
    map: kiteTexture,
    toneMapped: false 
  }), // top - kite texture
  new THREE.MeshBasicMaterial({ color: 0xffff00 }), // bottom - yellow
  new THREE.MeshBasicMaterial({ color: 0xff3e00 }), // front - orange
  new THREE.MeshBasicMaterial({ color: 0x000000 })  // back - meditation face
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

// Create stargazing scene for meditation view (view 3)
function createStarGazingScene() {
  // Create twinkling stars field
  const starCount = 800;
  const starGeometry = new THREE.BufferGeometry();
  const starPositions = new Float32Array(starCount * 3);
  const starOpacities = new Float32Array(starCount);
  
  for (let i = 0; i < starCount; i++) {
    starPositions[i * 3] = (Math.random() - 0.5) * 400;
    starPositions[i * 3 + 1] = (Math.random() - 0.5) * 400;
    starPositions[i * 3 + 2] = (Math.random() - 0.5) * 400 - 150;
    starOpacities[i] = Math.random();
  }
  
  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  starGeometry.setAttribute('opacity', new THREE.BufferAttribute(starOpacities, 1));
  
  const starMaterial = new THREE.PointsMaterial({
    size: 2,
    sizeAttenuation: true,
    color: 0xffffff,
    transparent: true,
    opacity: 0.8,
    emissive: 0xffffff,
    emissiveIntensity: 0.5
  });
  
  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);
  
  return { stars, opacities: starOpacities, geometry: starGeometry };
}

// Create glowing particles representing data/code flow
function createDataFlowParticles() {
  const particleCount = 400;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 200;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 100 - 150;
    
    const hue = Math.random();
    const colors_hsl = new THREE.Color().setHSL(hue, 1, 0.5);
    colors[i * 3] = colors_hsl.r;
    colors[i * 3 + 1] = colors_hsl.g;
    colors[i * 3 + 2] = colors_hsl.b;
    
    sizes[i] = Math.random() * 1.5 + 0.5;
  }
  
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  
  const material = new THREE.PointsMaterial({
    size: 1,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    emissive: 0xffffff,
    emissiveIntensity: 0.3
  });
  
  const particles = new THREE.Points(geometry, material);
  scene.add(particles);
  
  return { particles, positions, colors, geometry, particleData: new Array(particleCount).fill(0).map(() => ({
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    vz: (Math.random() - 0.5) * 0.5
  })) };
}

// Create a glowing terminal/IDE visualization
function createFloatingTerminal() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 384;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#0d1117';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.strokeStyle = '#30363d';
  ctx.lineWidth = 3;
  ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);
  
  // Terminal header
  ctx.fillStyle = '#30363d';
  ctx.fillRect(5, 5, canvas.width - 10, 40);
  ctx.fillStyle = '#c9d1d9';
  ctx.font = 'bold 18px monospace';
  ctx.fillText('~/projects/ > ', 20, 30);
  
  // Terminal text
  const terminalLines = [
    '$ npm run dev',
    '> My name is Alexsandra...',
    '> I am currently pursuing a degree in Computer Science at the University of London...',
    '> While delivering amazing Microsoft Power Platform projects through Europe with Infoavan...',
    '> Compiling dreams into reality ✨',
    '> [████████████░░░░░░░░░░░░] 50%'
  ];
  
  ctx.fillStyle = '#58a6ff';
  ctx.font = '16px monospace';
  terminalLines.forEach((line, i) => {
    ctx.fillText(line, 20, 80 + i * 50);
  });
  
  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.MeshBasicMaterial({ 
    map: texture,
    emissive: 0x1f6feb,
    emissiveIntensity: 0.4
  });
  const geometry = new THREE.PlaneGeometry(160, 60);
  const mesh = new THREE.Mesh(geometry, material);
  
  mesh.position.set(0, -10, -160);
  mesh.rotation.x = 0;
  mesh.rotation.y = Math.PI;
  mesh.rotation.z = 0;
  mesh.userData.isStatic = true;
  
  scene.add(mesh);
  return mesh;
}

// Initialize stargazing scene elements
const starGazingScene = createStarGazingScene();
const dataFlow = createDataFlowParticles();
const terminal = createFloatingTerminal();

// Initialize navigation buttons
createNavigationButtons();

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  // Animate twinkling stars
  const starOpacities = starGazingScene.opacities;
  for (let i = 0; i < starOpacities.length; i++) {
    starOpacities[i] += (Math.random() - 0.5) * 0.05;
    starOpacities[i] = Math.max(0.2, Math.min(1, starOpacities[i]));
  }
  starGazingScene.geometry.attributes.opacity.needsUpdate = true;
  
  // Update star material opacity
  const time = Date.now() * 0.001;
  starGazingScene.stars.material.opacity = 0.6 + Math.sin(time * 2) * 0.2;
  
  // Animate data flow particles - moving with velocities
  const dataPositions = dataFlow.positions;
  const dataParticleData = dataFlow.particleData;
  
  for (let i = 0; i < dataParticleData.length; i++) {
    const particle = dataParticleData[i];
    dataPositions[i * 3] += particle.vx;
    dataPositions[i * 3 + 1] += particle.vy;
    dataPositions[i * 3 + 2] += particle.vz;
    
    // Bounce off boundaries
    if (Math.abs(dataPositions[i * 3]) > 150) particle.vx *= -1;
    if (Math.abs(dataPositions[i * 3 + 1]) > 150) particle.vy *= -1;
    if (Math.abs(dataPositions[i * 3 + 2]) > 100) particle.vz *= -1;
  }
  dataFlow.geometry.attributes.position.needsUpdate = true;
  
  // Terminal is static - no animation needed
  
  controls.update();
  renderer.render(scene, camera);
}
animate();