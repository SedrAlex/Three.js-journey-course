import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import * as dat from 'dat.gui';
import { HemisphereLightHelper } from 'three';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
/**
 * Base
 */
// Debug
const gui = new dat.GUI()
console.log(gui)

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
// const ambientLight = new THREE.AmbientLight()
// ambientLight.color = new THREE.Color(0xffffff)
//ambientLight.color = new THREE.Color(0xffffff)
//ambientLight.intensity = 0.5
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)

scene.add(ambientLight)
// const pointLight = new THREE.PointLight(0xffffff, 0.5)
// pointLight.position.x = 2
// pointLight.position.y = 3
// pointLight.position.z = 4
// scene.add(pointLight)
const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3)
directionalLight.position.set(1, 0.25, 0)
//scene.add(directionalLight);

const hemishereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3)
scene.add(hemishereLight);

const pointLight = new THREE.PointLight(0xff900, 0.5, 3)
pointLight.position.set(1, -0.5, 1)
scene.add(pointLight)

const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 3, 1)
rectAreaLight.position.set(1, -0.5, 1)
rectAreaLight.lookAt(new THREE.Vector3())
scene.add(rectAreaLight)

const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 6, Math.PI * 0.1, 0.25, 1)
spotLight.position.set(0, 2, 3)
scene.add(spotLight)

spotLight.target.position.x = - 0.75
scene.add(spotLight.target)

//Helpers
// const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemishereLight, 0.2)
// scene.add(hemisphereLightHelper)

// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
// scene.add(directionalLightHelper)

// const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
// scene.add(pointLightHelper)

// const spotLightHelper = new THREE.SpotLightHelper(spotLight)
// scene.add(spotLightHelper)

// //We have to update it on the next frame
// window.requestAnimationFrame(() => 
// {
// spotLightHelper.update()
// })

// const rectAreaLightHelper = new THREE.RectAreaLightHelper(rectAreaLight)
// scene.add(rectAreaLightHelper)

// //We have to update it on the next frame
// window.requestAnimationFrame(() => 
// {
//   rectAreaLightHelper.position.copy(rectAreaLight.position)
//   rectAreaLightHelper.quaternion.copy(rectAreaLight.quaternion)
// rectAreaLightHelper.update()
// })


/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material)
sphere.position.x = -1.5

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material)

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material)
plane.rotation.x = -Math.PI * 0.5
plane.position.y = -0.65

scene.add(sphere, cube, torus, plane)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime
  cube.rotation.y = 0.1 * elapsedTime
  torus.rotation.y = 0.1 * elapsedTime

  sphere.rotation.x = 0.15 * elapsedTime
  cube.rotation.x = 0.15 * elapsedTime
  torus.rotation.x = 0.15 * elapsedTime

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
