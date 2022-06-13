import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import vertexShader from './shaders/vertex.glsl'
// import fragmentShader from './shaders/fragment.glsl'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// //Colors

let Colors = {
	red:0x000080,
	white:0x999999,
	brown:0x59332e,
	pink:0xF5986E,
	brownDark:0x000000,
	blue:0x008000,
}

let fieldOfView, aspectRatio, nearPlane, farPlane, container, renderer;

let mousePos = {x:0, y:0}

function handleMouseMove(event) {

	let tx = -1 + (event.clientX / sizes.width)*2;

	let ty = 1 - (event.clientY / sizes.height)*2;
	mousePos = {x:tx, y:ty};

}
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')


document.addEventListener("keydown", onDocumentKeyDowne, false);

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color( 0x190E3C );
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

scene.fog = new THREE.Fog(0xf7d9aa, 10, 2000);


/**
 * Camera
 */

aspectRatio = sizes.width / sizes.height;
fieldOfView = 50;
nearPlane = 50;
farPlane = 10000;
const camera = new THREE.PerspectiveCamera(
  fieldOfView,
  aspectRatio,
  nearPlane,
  farPlane
);

// Set the position of the camera
camera.position.x = -350;
camera.position.z = 400;
camera.position.y = 250;


// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


//Roads
const geometry = new THREE.CylinderGeometry( 1200, 1200, 440, 64 );
const material = new THREE.MeshStandardMaterial( {color: 0x15270B} );
const cylinder = new THREE.Mesh( geometry, material );
cylinder.position.y = -1203
cylinder.rotation.x = Math.PI / 2
scene.add( cylinder );

//Car
let car
const loader = new GLTFLoader()
loader.load('police.gltf', (gltfCar) => {
	gltfCar.scene.scale.set(18,18,18)
 	gltfCar.scene.rotation.y = -1.58
	gltfCar.scene.position.y = 16
 	//gltfCar.scene.center()
 	scene.add(gltfCar.scene)
	car = gltfCar.scene
	console.log(car)
})


//Wheels
const geometryWheelOne = new THREE.CylinderGeometry( 7, 7, 4, 8 );
const materialWheelOne = new THREE.MeshStandardMaterial( {color: 0x1a1a1a} );
const wheelOne = new THREE.Mesh( geometryWheelOne, materialWheelOne );
wheelOne.rotation.x = Math.PI / 2
wheelOne.position.z = 15
wheelOne.position.x = -27
wheelOne.position.y = 4
scene.add(wheelOne)

const geometryWheelTwo = new THREE.CylinderGeometry( 7, 7, 4, 8 );
const materialWheelTwo = new THREE.MeshStandardMaterial( {color: 0x1a1a1a} );
const wheelTwo = new THREE.Mesh( geometryWheelTwo, materialWheelTwo );
wheelTwo.rotation.x = Math.PI / 2
wheelTwo.position.z = -15
wheelTwo.position.x = -27
wheelTwo.position.y = 4
scene.add(wheelTwo)

const geometryWheelThree = new THREE.CylinderGeometry( 7, 7, 4, 8 );
const materialWheelThree = new THREE.MeshStandardMaterial( {color: 0x1a1a1a} );
const wheelThree = new THREE.Mesh( geometryWheelThree, materialWheelThree );
wheelThree.rotation.x = Math.PI / 2
wheelThree.position.z = 15
wheelThree.position.x = 17
wheelThree.position.y = 4
scene.add(wheelThree)

const geometryWheelFour = new THREE.CylinderGeometry( 7, 7, 4, 8 );
const materialWheelFour = new THREE.MeshStandardMaterial( {color: 0x1a1a1a} );
const wheelFour = new THREE.Mesh( geometryWheelFour, materialWheelFour );
wheelFour.rotation.x = Math.PI / 2
wheelFour.position.z = -15
wheelFour.position.x = 17
wheelFour.position.y = 4
scene.add(wheelFour)

//Cloud
let Cloud = function(){
  this.mesh = new THREE.Object3D();
  this.mesh.name = "cloud";
  var geom = new THREE.BoxGeometry(30,30,30);
  var mat = new THREE.MeshPhongMaterial({
    color:Colors.white,

  });

  //*
  var nBlocs = 3+Math.floor(Math.random()*3);
  for (var i=0; i<nBlocs; i++){
    var m = new THREE.Mesh(geom.clone(), mat);
    m.position.x = i*20;
    m.position.y = Math.random()*10;
    m.position.z = Math.random()*10;
    m.rotation.z = Math.random()*Math.PI*2;
    m.rotation.y = Math.random()*Math.PI*2;
    var s = .1 + Math.random()*0.8;
    m.scale.set(s,s,s);
    this.mesh.add(m);
    m.castShadow = true;
    //m.receiveShadow = true;
  }
  //*/
}

Cloud.prototype.rotate = function(){
  var l = this.mesh.children.length;
  for(var i=0; i<l; i++){
    var m = this.mesh.children[i];
    m.rotation.z+= Math.random()*.005*(i+1);
    m.rotation.y+= Math.random()*.002*(i+1);
  }
}



let Sky = function(){
  this.mesh = new THREE.Object3D();
  this.nClouds = 60;
  this.clouds = [];
  var stepAngle = Math.PI*2 / this.nClouds;
  for(var i=0; i<this.nClouds; i++){
    var c = new Cloud();
    this.clouds.push(c);
    var a = stepAngle*i;
    let h = 550 + Math.random()*900
    c.mesh.position.y = Math.sin(a)*h;
    c.mesh.position.x = Math.cos(a)*h;
    c.mesh.position.z = -100-Math.random()*500;
    c.mesh.rotation.z = a + Math.PI/2;
    var s = 1+Math.random()*2;
    c.mesh.scale.set(s,s,s);
    this.mesh.add(c.mesh);
  }
}

Sky.prototype.moveClouds = function(){
  for(var i=0; i<this.nClouds; i++){
    var c = this.clouds[i];
    c.rotate();
  }
  this.mesh.rotation.z += game.speed*deltaTime;

}

let sky

function createSky(){
  sky = new Sky();
  sky.mesh.position.y = -700
  sky.mesh.rotateY(-0.6)
  scene.add(sky.mesh);
}
createSky()

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
renderer = new THREE.WebGLRenderer({
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

function onDocumentKeyDowne(e) {
	if (e.keyCode === 37) {
		car.position.z -= 5
		wheelOne.position.z -= 5
		wheelTwo.position.z -= 5
		wheelThree.position.z -= 5
		wheelFour.position.z -= 5
	} else if(e.keyCode === 39) {
		car.position.z += 5
		wheelOne.position.z += 5
		wheelTwo.position.z += 5
		wheelThree.position.z += 5
		wheelFour.position.z += 5
	}
}

const tick = () => {

  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - lastElapsedTime
  lastElapsedTime = elapsedTime

	sky.mesh.rotation.z -= .001;
	cylinder.rotation.y -= 0.008

	//car.rotation.y = Math.sin(90 * Math.PI / 180);
	wheelOne.rotation.y += 0.1
	wheelTwo.rotation.y += 0.1
	wheelThree.rotation.y += 0.1
	wheelFour.rotation.y += 0.1

    // Render
  renderer.render(scene, camera)

    // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
