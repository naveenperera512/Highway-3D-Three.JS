
import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as dat from 'dat.gui'
import gsap from 'gsap'
import { LinearFilter, Mesh } from 'three'


const gui = new dat.GUI()

const canvas = document.querySelector('canvas.webgl')


const scene = new THREE.Scene()

const gltfLoader = new GLTFLoader()

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

let car = null

gltfLoader.load(
    '/models/road/scene.gltf',
    (gltf) =>
    {
        gltf.scene.scale.set(0.20, 0.10, 0.55)
        const mesh = new THREE.Mesh( geometry, material );
        gltf.scene.position.z = -10
        gltf.scene.receiveShadow = true
        gltf.scene.traverse( function( node ) {
            if ( node.isMesh ) { node.receiveShadow = true; }
        } );
        scene.add(gltf.scene)
    }
)


gltfLoader.load(
    'models/vehicle/scene.gltf',
    (gltf) =>
    {
        car = gltf
        gltf.scene.scale.set(0.5, 0.5, 0.5)
        const mesh = new THREE.Mesh( geometry, material );
        gltf.scene.position.x = 1.3
        gltf.scene.position.z = 7.5
        gltf.scene.castShadow = true
        gltf.scene.traverse( function( node ) {
            if ( node.isMesh ) { node.castShadow = true; }
        } );
        scene.add(gltf.scene)
    }
)


gltfLoader.load(
    'models/mountain/scene.gltf',
    (gltf) =>
    {
        gltf.scene.scale.set(90, 80, 70)
        const mesh = new THREE.Mesh( geometry, material );
        gltf.scene.position.z = -15
        gltf.scene.position.y = -3
        gltf.scene.rotation.y = Math.PI * 0.75
        gltf.scene.receiveShadow = false
        scene.add(gltf.scene)
    }
)

// gltfLoader.load(
//     'models/mountain2/scene.gltf',
//     (gltf) =>
//     {
//         gltf.scene.scale.set(90, 75, 60)
//         const mesh = new THREE.Mesh( geometry, material );
//         gltf.scene.position.z = -15
//         gltf.scene.position.x = 11
//         gltf.scene.position.y = -3
//         gltf.scene.rotation.y = 1.6
//         gltf.scene.receiveShadow = false
//         scene.add(gltf.scene)
//     }
// )

// gltfLoader.load(
//     'models/mountain3/scene.gltf',
//     (gltf) =>
//     {
//         gltf.scene.scale.set(90, 70, 60)
//         const mesh = new THREE.Mesh( geometry, material );
//         gltf.scene.position.z = -10
//         gltf.scene.position.x = -11
//         gltf.scene.position.y = -3
//         gltf.scene.rotation.y = -1.6
//         scene.add(gltf.scene)
//     }
// )

const geometry = new THREE.CircleGeometry (1, 32 );
const material = new THREE.MeshBasicMaterial( { color: '#FB8F03' } )
const mesh = new THREE.Mesh( geometry, material );
mesh.position.y = 10
mesh.position.z = -35
scene.add( mesh );

// const ambientLight = new THREE.AmbientLight(0xffffff, 3.5)
// scene.add(ambientLight)

const directionalLight = new THREE.PointLight(0xffffff, 7.5)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 60
directionalLight.shadow.camera.left = -10
directionalLight.shadow.camera.top = 10
directionalLight.shadow.camera.right = 10
directionalLight.shadow.camera.bottom = -10
directionalLight.position.set(0, 10, -35)
scene.add(directionalLight)


const camera = new THREE.PerspectiveCamera(90, sizes.width / sizes.height, 0.1)
camera.position.set(0, 1, 10)
scene.add(camera)


const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 1, 0)
controls.enableDamping = true



const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    if (car) {
        car.scene.position.z -= 0.2;
        if (car.scene.position.z < -25){
            car.scene.position.z = 7.5
            car.scene.position.x = Math.round(Math.random() * 5) - 2
        }
    }

    controls.update()
    
    renderer.render(scene, camera)
    
    window.requestAnimationFrame(tick)
}

tick()
