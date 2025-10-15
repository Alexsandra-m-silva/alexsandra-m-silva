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
const earthTexture = textureLoader.load('/assets/imgs/Earth_map.png');
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

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();