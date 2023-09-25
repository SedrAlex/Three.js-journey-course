import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load('../textures/door/color.jpg')
const doorALphaTexture = textureLoader.load('../textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('../textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('../textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('../textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('../textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('../textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('../textures/matcaps/8.png')
const gradientTexture = textureLoader.load('../textures/gradients/3.jpg')

gradientTexture.minFilter = THREE.NearestFilter
gradientTexture.magFilter = THREE.NearestFilter
gradientTexture.generateMipmaps = false

/**
 *
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
// const material = new THREE.MeshBasicMaterial()
// material.map = doorColorTexture
// // material.color = new THREE.Color(0xff00ff)
// material.opacity = 0.5;
// material.transparent = true
//material.wireframe = true
// material.alphaMap = doorALphaTexture
// material.side = THREE.DoubleSide


// const material = new THREE.MeshNormalMaterial()
// material.flatShading = true

// const material = new THREE.MeshMatcapMaterial ()
// material.matcap = matcapTexture

//const material = new THREE.MeshLambertMaterial() //Lights do not work on these type of material b

// const material = new THREE.MeshPhongMaterial()
// material.shininess = 100
// material.specular = new THREE.Color(0x1188ff)

// const material = new THREE.MeshToonMaterial()
//     material.gradientMap = gradientTexture

const material = new THREE.MeshStandardMaterial()
material.metalness = 0.45
material.roughness = 0.65

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x  =2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight)


const sphere = new THREE.Mesh(
     new THREE.SphereBufferGeometry(0.5, 16,16),
     material
)
sphere.position.x = -1.5
const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1,1),
        material
)
const torus = new THREE.Mesh(
    new THREE.TorusBufferGeometry(0.3, 0.2, 16, 32),
        material
)
torus.position.x = 1.5;
scene.add(plane, sphere, torus)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 1
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //Update objects
    sphere.rotation.y = 0.1 * elapsedTime;
    plane.rotation.y = 0.1 * elapsedTime;
    torus.rotation.y = 0.1 * elapsedTime;

    sphere.rotation.x = 0.15 * elapsedTime;
    plane.rotation.x = 0.15 * elapsedTime;
    torus.rotation.x = 0.15 * elapsedTime;
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()