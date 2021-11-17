import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import Stats from 'three/examples/jsm/libs/stats.module.js'
import sunVertexShader from './shaders/sun/vertex.glsl'
import sunFragmentShader from './shaders/sun/fragment.glsl'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0.5,0.5,0.5)

//Stats
const stats = Stats()
document.body.appendChild(stats.dom)

// Geometry
const geometry = new THREE.SphereGeometry(5,32,32)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Material
const material = new THREE.ShaderMaterial({
    vertexShader: sunVertexShader,
    fragmentShader: sunFragmentShader,
    uniforms:{
        uTime:{value:0}
    }
})

// Mesh
const sun = new THREE.Mesh(geometry, material)
scene.add(sun)


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
camera.position.set(10, 5, 1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

//CubeCamera
/* let cubeCamera = null
const addTexture = ()=>{
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 256, {
        format: THREE.RGBFormat,
        generateMipmaps: true,
        minFilter: THREE.LinearMipmapLinearFilter,
        encoding: THREE.sRGBEncoding // temporary -- to prevent the material's shader from recompiling every frame
    } )
    cubeCamera = new THREE.CubeCamera( 0.1, 100, cubeRenderTarget );
}


addTexture() */


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

const animateScene = () =>
{

    const elapsedTime = clock.getElapsedTime()
    //Stats
    stats.update()

    //Render Sphere for Sun
    //cubeCamera.update( renderer, scene );
	//material.envMap = cubeRenderTarget1.texture;

    //animate Water
    sun.material.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call animateScene again on the next frame
    window.requestAnimationFrame(animateScene)
}

animateScene()