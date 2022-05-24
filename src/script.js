import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'


//Colors

var Colors = {
	red:0xf25346,
	white:0xd8d0d1,
	brown:0x59332e,
	pink:0xF5986E,
	brownDark:0x23190f,
	blue:0x68c3c0,
}

var fieldOfView, aspectRatio, nearPlane, farPlane, container;

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

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

scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);


/**
 * Camera
 */

aspectRatio = sizes.width / sizes.height;
fieldOfView = 60;
nearPlane = 1;
farPlane = 10000;
const camera = new THREE.PerspectiveCamera(
  fieldOfView,
  aspectRatio,
  nearPlane,
  farPlane
);

// Set the position of the camera
camera.position.x = 0;
camera.position.z = 200;
camera.position.y = 100;


// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Land
 */
function Land() {
  const geom = new THREE.CylinderGeometry(600,600,800,40,10)
  const mat = new THREE.MeshPhongMaterial({
    color:Colors.blue,
  	transparent:true,
  	opacity:.6,
  	shading:THREE.FlatShading,
  })
  const mesh = new THREE.Mesh(geom, mat)
  mesh.receiveShadow = true
  mesh.position.y = -600
  scene.add(mesh)
}
Land()

//Cloud

function Cloud() {
  const mesh = new THREE.Object3D();

  const geom = new THREE.BoxGeometry(20,20,20);

	const mat = new THREE.MeshPhongMaterial({
		color:Colors.white,
	});

	let nBlocs = 3 + Math.floor(Math.random() * 3);
	for (let i = 0; i < nBlocs; i++ ){

		let m = new THREE.Mesh(geom, mat);

		m.position.x = i * 15;
		m.position.y = Math.random() * 10;
		m.position.z = Math.random() * 10;
		m.rotation.z = Math.random() * Math.PI * 2;
		m.rotation.y = Math.random() * Math.PI * 2;

		let s = .1 + Math.random() * .9;
		m.scale.set(s, s, s);

		m.castShadow = true;
		m.receiveShadow = true;

		mesh.add(m);
	}
}

//Sky

function Sky() {
  const mesh = new THREE.Object3D();
  const nClouds = 20
  let stepAngle = Math.PI*2 / this.nClouds

  for(let i = 0; i < this.nClouds; i ++) {
    let c = new Cloud()
    let a = stepAngle * i;
		let h = 750 + Math.random() * 200;

		c.mesh.position.y = Math.sin(a)*h;
		c.mesh.position.x = Math.cos(a)*h;

		c.mesh.rotation.z = a + Math.PI/2;
		c.mesh.position.z = -400-Math.random()*400;

		var s = 1+Math.random()*2;
		c.mesh.scale.set(s,s,s);
		this.mesh.add(c.mesh);
  }
  mesh.position.y = -600
  scene.add(mesh)
}

//Lights

const hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9)

const shadowLight = new THREE.DirectionalLight(0xffffff, .9);
shadowLight.position.set(150, 350, 350);
shadowLight.castShadow = true;
shadowLight.shadow.camera.left = -400;
shadowLight.shadow.camera.right = 400;
shadowLight.shadow.camera.top = 400;
shadowLight.shadow.camera.bottom = -400;
shadowLight.shadow.camera.near = 1;
shadowLight.shadow.camera.far = 1000;
shadowLight.shadow.mapSize.width = 2048;
shadowLight.shadow.mapSize.height = 2048;

scene.add(hemisphereLight);
scene.add(shadowLight);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true;

/**
 * Animate
 */
const clock = new THREE.Clock()
let lastElapsedTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastElapsedTime
    lastElapsedTime = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
