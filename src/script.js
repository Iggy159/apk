import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'
//Colors

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
document.addEventListener('mousemove', handleMouseMove, false)


// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color( 0xb3e6ff );
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
nearPlane = 10;
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
const landGeometry = new THREE.PlaneGeometry( 200, 200, 1 );
const landMaterial = new THREE.MeshBasicMaterial( {color: 0x00ff00, side: THREE.DoubleSide} );

const landMesh = new THREE.Mesh(landGeometry, landMaterial);
landMesh.receiveShadow = true;
landMesh.rotateX (Math.PI / 2)
landMesh.position.y = 2;
scene.add(landMesh);

// //Cloud
//
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

//airplane
const AirPlane = function() {

	this.mesh = new THREE.Object3D();

	// Create the cabin
	var geomCockpit = new THREE.BoxGeometry(135,10,80,1,1,1);
	var matCockpit = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
	var cockpit = new THREE.Mesh(geomCockpit, matCockpit);
	cockpit.position.y = 5;
	cockpit.castShadow = true;
	cockpit.receiveShadow = true;
	this.mesh.add(cockpit);

	var geomCockpit = new THREE.BoxGeometry(60,1,80,1,1,1);
	var matCockpit = new THREE.MeshPhongMaterial({color:Colors.white, shading:THREE.FlatShading});
	var cockpit = new THREE.Mesh(geomCockpit, matCockpit);
	cockpit.position.y = 11;
	cockpit.position.x = 38;
	cockpit.castShadow = true;
	cockpit.receiveShadow = true;
	this.mesh.add(cockpit);

	// Create the cabin2
	var geomEngine = new THREE.BoxGeometry(75,35,80,1,1,1);
	var matEngine = new THREE.MeshPhongMaterial({color:Colors.white, shading:THREE.FlatShading});
	var engine = new THREE.Mesh(geomEngine, matEngine);
	engine.position.x = -30;
	engine.position.y = 26;
	engine.castShadow = true;
	engine.receiveShadow = true;
	this.mesh.add(engine);

	// Create the cabin3
	var geomEngine = new THREE.BoxGeometry(135,30,80,1,1,1);
	var matEngine = new THREE.MeshPhongMaterial({color:Colors.white, shading:THREE.FlatShading});
	var engine = new THREE.Mesh(geomEngine, matEngine);
	engine.position.y = -15;
	engine.castShadow = true;
	engine.receiveShadow = true;
	this.mesh.add(engine);


	const geometryWheel = new THREE.CylinderGeometry( 18, 18, 10, 30 );
	const materialWheel = new THREE.MeshPhongMaterial({color:Colors.brownDark, shading:THREE.FlatShading});

	const wheelOne = new THREE.Mesh(geometryWheel, materialWheel);
	wheelOne.position.y = -30;
	wheelOne.position.x = 39;
	wheelOne.position.z = 45;
	wheelOne.rotation.x = -1.6
	wheelOne.castShadow = true;
	wheelOne.receiveShadow = true;
	//this.mesh.add(this.wheelOne);

	const wheelTwo = new THREE.Mesh(geometryWheel, materialWheel);
	wheelTwo.position.y = -30;
	wheelTwo.position.x = -35;
	wheelTwo.position.z = 45;
	wheelTwo.rotation.x = -1.6
	wheelTwo.castShadow = true;
	wheelTwo.receiveShadow = true;
	//this.mesh.add(wheelTwo);

	const wheelThree = new THREE.Mesh(geometryWheel, materialWheel);
	wheelThree.position.y = -30;
	wheelThree.position.x = 39;
	wheelThree.position.z = -45;
	wheelThree.rotation.x = -1.6
	wheelThree.castShadow = true;
	wheelThree.receiveShadow = true;
	//this.mesh.add(wheelThree);

	const wheelFour = new THREE.Mesh(geometryWheel, materialWheel);
	wheelFour.position.y = -30;
	wheelFour.position.x = -35;
	wheelFour.position.z = -45;
	wheelFour.rotation.x = -1.6
	wheelFour.castShadow = true;
	wheelFour.receiveShadow = true;
	//this.mesh.add(wheelFour);

	this.wheels = new THREE.Mesh(geometryWheel, materialWheel)
	this.wheels.castShadow = true;
	this.wheels.receiveShadow = true;

	this.wheels.add(wheelOne, wheelTwo, wheelThree, wheelFour)
	this.mesh.add(this.wheels)

};

var airplane;

function createPlane(){
	airplane = new AirPlane();
	airplane.mesh.scale.set(.25,.25,.25);
	airplane.mesh.position.y = 15;
	airplane.mesh.rotateY(-0.6)
	scene.add(airplane.mesh);
}

createPlane()

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


function normalize(v,vmin,vmax,tmin, tmax){

	const nv = Math.max(Math.min(v,vmax), vmin);
	const dv = vmax-vmin;
	const pc = (nv-vmin)/dv;
	const dt = tmax-tmin;
	const tv = tmin + (pc*dt);
	return tv;

}

function updatePlane() {

	const targetX = normalize(mousePos.x, -1, 1, -100, 100);
	const targetY = normalize(mousePos.y, -1, 1, 25, 175);

	// update the airplane's position
	// meshAirplane.position.y = targetY;
	// meshAirplane.position.x = targetX;

	//airplane.mesh.wheelOne.rotation.y += 0.25;
}

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastElapsedTime
    lastElapsedTime = elapsedTime
	//land.mat.uniforms.uTime.value = elapsedTime;
	// land.geom.rotation += 1.5
	//land.mesh.rotation.y += 0.1
	sky.mesh.rotation.z += .001;

    // Update controls
    //controls.update()
	updatePlane()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
