
import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

// Set up the scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement); 

// Define parameters and variables
const mass = 1; // Mass of the cube
const g = 9.8; // Acceleration due to gravity
const Cd = 0.2; // Drag coefficient
const A = 1; // Reference area of the parachute
const rho = 1.2; // Air density
const b0 = 1; // Parameter values specific to the model
const b1 = 1;
const h = 1;
const l = 1;

let velocity = new THREE.Vector3(0, 0, 0); // Initial velocity
let position = new THREE.Vector3(0, 0, 0); // Initial position

// Create a cube mesh
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
scene.add(cubeMesh);

// Define the main simulation loop
function animate() {
  requestAnimationFrame(animate);

  // Calculate forces
  let k;
  let Ae;
  if (t < t1) {
    k = 1.95 * b0;
    Ae = 0.35 * b1 * (l - h);
  } else if (t <= t2) {
    k = 1.95 * b0 + 0.35 * b1 * (t - t1) / (t2 - t1);
    Ae = 0.35 * b1 * h + 1.33 * Ae12(t);
  } else if (t <= t3) {
    k = 0.35 * b1 * h + 1.33 * Ae12(t);
    Ae = Ae23(t);
  } else {
    k = 0.35 * b1 * h + 1.33 * a1;
    Ae = a2;
  }

  const dragForce = new THREE.Vector3();
  dragForce.copy(velocity).normalize().multiplyScalar(-0.5 * rho * Cd * A * velocity.lengthSq() * k);

  const gravitationalForce = new THREE.Vector3(0, -mass * g, 0);

  // Calculate acceleration
  const acceleration = gravitationalForce.add(dragForce).divideScalar(mass);

  // Update velocity and position using Runge-Kutta method
  const dt = 0.01; // Time step size
  const k1 = acceleration.clone().multiplyScalar(dt);
  const k2 = acceleration.clone().add(k1.clone().multiplyScalar(0.5)).multiplyScalar(dt);
  const k3 = acceleration.clone().add(k2.clone().multiplyScalar(0.5)).multiplyScalar(dt);
  const k4 = acceleration.clone().add(k3).multiplyScalar(dt);

  velocity.add(k1.clone().add(k2.clone().multiplyScalar(2)).add(k3.clone().multiplyScalar(2)).add(k4).multiplyScalar(1 / 6));
  position.add(velocity.clone().multiplyScalar(dt));

  // Update the position of the cube mesh in the scene
  cubeMesh.position.copy(position);

  renderer.render(scene, camera);
}

// Call the animate function to start the simulation
