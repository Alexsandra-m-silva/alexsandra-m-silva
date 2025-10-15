import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

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

// Ambient light
scene.add(new THREE.AmbientLight(0xffffff, 1));

// Orange sphere in the center
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(5, 64, 64),
  new THREE.MeshBasicMaterial({ color: 0xff3e00 })
);
sphere.position.set(0, 0, 5);
scene.add(sphere);

// Black vertical lines (thin boxes)
const lineCount = 40;
const lineWidth = 0.15;
const lineHeight = window.innerHeight;
const spacing = 0.5;
const startX = -((lineCount / 2) * spacing);
const startX_back = -2 * ((lineCount / 2) * spacing);

// front lines
for (let i = 0; i < lineCount; i++) {
  // Only draw lines on the right half of the sphere
  if (i >= lineCount / 2) {
    const line = new THREE.Mesh(
      new THREE.BoxGeometry(lineWidth, lineHeight, 0.1),
      new THREE.MeshBasicMaterial({ color: 0x000000 })
    );
    line.position.x = startX + i * spacing;
    line.position.z = 10; // Slightly in front of the sphere
    scene.add(line);
  }
}

// back lines
for (let i = 0; i < lineCount; i++) {
  // Only draw lines on the right half of the sphere
  if (i >= lineCount / 2) {
    const line = new THREE.Mesh(
      new THREE.BoxGeometry(lineWidth, lineHeight, 0.1),
      new THREE.MeshBasicMaterial({ color: 0x000000 })
    );
    line.position.x = startX_back + i * spacing;
    line.position.z = 0; 
    scene.add(line);
  }
}

// Cube
const cubeGeometry = new THREE.BoxGeometry(150, 10, 10);
const cubeMaterials = [
  new THREE.MeshBasicMaterial({ color: 0x000000 }), //  black
  new THREE.MeshBasicMaterial({ color: 0x000000 }), //  black
  new THREE.MeshBasicMaterial({ color: 0x2822dd }), //  primary blue
  new THREE.MeshBasicMaterial({ color: 0xff0000 }), //  red
  new THREE.MeshBasicMaterial({ color: 0x08979B }), //  blue
  new THREE.MeshBasicMaterial({ color: 0xfaba35 })  //  yellow
];
const cube = new THREE.Mesh(cubeGeometry, cubeMaterials);
cube.position.set(-(150/2)-15, 4, 0); 
scene.add(cube);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();