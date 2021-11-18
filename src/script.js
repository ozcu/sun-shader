import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import Stats from 'three/examples/jsm/libs/stats.module.js'
import sunVertexShader from './shaders/sunPerlin/vertex.glsl'
import sunFragmentShader from './shaders/sunPerlin/fragment.glsl'
import sunVertexTexture from './shaders/sunTexture/vertex.glsl'
import sunFragmentTexture from './shaders/sunTexture/fragment.glsl'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0.0,0.0,0.0)

//Stats
const stats = Stats()
document.body.appendChild(stats.dom)


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


// Geometries
const geometry = new THREE.SphereGeometry(5.0,32,32) //sunTexture
const perlinGeo = new THREE.SphereGeometry(5.0,32,32) //sunPerlin

// Material Texture CubeRender Output
const materialSun = new THREE.ShaderMaterial({
    vertexShader: sunVertexTexture,
    fragmentShader: sunFragmentTexture,
    side:THREE.DoubleSide,
    uniforms:{
        uTime:{value:0},
        uPerlin:{value:null}
    }
})

// Mesh
const texturedSun = new THREE.Mesh(geometry, materialSun)
scene.add(texturedSun)

//Initialize new scene for rendered target
const scene2 = new THREE.Scene()

// Material Perlin Noise Calculation with fBM
const materialPerlin = new THREE.ShaderMaterial({
    vertexShader: sunVertexShader,
    fragmentShader: sunFragmentShader,
    side:THREE.DoubleSide,
    uniforms:{
        uTime:{value:0}
    }
})

const perlinSun = new THREE.Mesh(perlinGeo,materialPerlin)
scene2.add(perlinSun)



//CubeCamera

const cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 256, {
    format: THREE.RGBFormat,
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter,
    encoding: THREE.sRGBEncoding // temporary -- to prevent the material's shader from recompiling every frame
} )
const cubeCamera = new THREE.CubeCamera( 0.1, 100, cubeRenderTarget );


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
    cubeCamera.update( renderer, scene2 ) //Cube Camera renders the scene2 where perlin computation is and registers the texture
	texturedSun.material.uniforms.uPerlin.value = cubeRenderTarget.texture //Assigns target texture to value
    

    //Animate Perlin Noise
    perlinSun.material.uniforms.uTime.value = elapsedTime
    texturedSun.material.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call animateScene again on the next frame
    window.requestAnimationFrame(animateScene)
}

animateScene()