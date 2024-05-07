import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


/**
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

scene.add(object1, object2, object3)

/**
 * INFO: Raycaster
 */

const raycaster = new THREE.Raycaster()
// const rayOrigin = new THREE.Vector3(-3, 0, 0) //first object is at position x = -2
// const rayDirection = new THREE.Vector3(10, 0, 0) //needs to be a positive value. Direction needs to be normalised - vector3 length is 1.


// console.log(rayDirection.length())
// rayDirection.normalize() //set the Vector3 direction to 1
// console.log(rayDirection.length())

// raycaster.set(rayOrigin, rayDirection) //origin and direction - Vector3

// // Cast ray

// const intersect = raycaster.intersectObject(object2)
// console.log(intersect)

// const intersects = raycaster.intersectObjects([object1, object2, object3])
// console.log(intersects)


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

    // INFO: Use with the mouse

    // 1. we need the mouse coordinates, but not in pixels. Need a value that is -1 at the bottom and 1 at the top

    const mouse = new THREE.Vector2() //only x and y coordinates, Vector2 needed
    window.addEventListener('mousemove', (event) => {
        // console.log('mouse move')
        mouse.x = event.clientX / sizes.width * 2 - 1 //to get the value from -1 to 1
        mouse.y = - (event.clientY / sizes.height * 2 - 1) //to get the value from -1 to 1
        // console.log(mouse.x)
        // console.log(mouse.y)
        // 2. shoot the ray in the tick function because it fires more on the mouse move than the framerate
    })

    window.addEventListener('click', () => {
        // if(currentIntersect) {
        //     console.log('click anywhere')
        // }
        if(currentIntersect) {
        if (currentIntersect.object === object1) {
            console.log('click on object1')
        } else if (currentIntersect.object === object2) {
            console.log('click on object2')
        } else if (currentIntersect.object === object3) {
            console.log('click on object3')
        }
    }
    })

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
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
 * INFO: Model
 */

const gltfLoader = new GLTFLoader()

let model = null //create variable for use in the tick function

gltfLoader.load (
    './models/Duck/glTF-Binary/Duck.glb',
    (gltf) => {
        // console.log(gltf.scene)
        model = gltf.scene
        model.position.y = -3.5
        scene.add(model)
    }
)

/**
 * INFO: Lights for model
 */

// Ambient Light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.9)
scene.add(ambientLight)

// Directional Light
const directionalLight = new THREE.DirectionalLight('#ffffff', 1.5)
directionalLight.position.set(3, 3, 3)
scene.add(directionalLight)

/**
 * Animate
 */
const clock = new THREE.Clock()

let currentIntersect = null //create 'witness' variable containing the currently hovered object

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // INFO: Animate objects
    object1.position.y = Math.sin(elapsedTime * 0.5) * 1.5
    object2.position.y = Math.sin(elapsedTime * 0.6) * 1.5
    object3.position.y = Math.sin(elapsedTime * 0.7) * 1.5

    // // INFO: Cast a ray
    // const rayOrigin = new THREE.Vector3(-3, 0, 0)
    // const rayDirection = new THREE.Vector3(10, 0, 0)
    // // console.log(rayDirection.length())
    // rayDirection.normalize()
    // // console.log(rayDirection.length())
    // raycaster.set(rayOrigin, rayDirection)

    // const objectsToTest = [object1, object2, object3]
    // const intersects = raycaster.intersectObjects(objectsToTest)
    // // console.log(intersects)
    
    // // INFO: Change sphere color when intersects ray
    // // INFO: 2. Set object color red at start
    // for (const object of objectsToTest) {
    //     object.material.color.set('#ff0000')
    // }

    // // INFO: 1. Change sphere color at intersect
    // for (const intersect of intersects) {
    //     intersect.object.material.color.set('#0000ff') //use set to change color - all spheres in the same line at the start of the loop (at refresh), therefore all colors change
    // }

    // INFO: Method above simplified
    
    raycaster.setFromCamera(mouse, camera) //provide the mouse coordinates and the current camera
    
    const objectsToTest = [object1, object2, object3]
    const intersects = raycaster.intersectObjects(objectsToTest)
    // console.log(intersects)
    // 2.
    for (const object of objectsToTest) {
        object.material.color.set('#ff0000')
}

    // 1.
    for (const intersect of intersects) {
        intersect.object.material.color.set('#0000ff')
    }

    if(intersects.length) {
        // console.log('something hover')
        if(currentIntersect === null) {
            console.log('mouse enter')
        }
        currentIntersect = intersects [0]
    } else {
        if(currentIntersect) {
            console.log('mouse leave')
        }
        // console.log('nothing being hovered')
        currentIntersect = null
    }

    // INFO: Duck magnify at cursor intersect

    // test gltf scene that contains all meshes/objects=> use intersect object
    // works even if there are children inside

    if(model) { //create condition to solve the tick function executing before the model gets to load
    const intersectModel = raycaster.intersectObject(model) //(model, false) to test recursive = testing on children. testing recursively creates an array, because we can have multiple children/multiple collisions
    // console.log(intersectModel)
        // test length of array to increase scale
        if(intersectModel.length) {
            model.scale.set(1.2, 1.2, 1.2)
        } else {
            model.scale.set(1, 1, 1)

        }
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()