import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'
//Colors

let Colors = {
	red:0xff5341,
	white:0xd8d0d1,
	brown:0x59332e,
	pink:0xF5986E,
	brownDark:0x23190f,
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
 let Sea = function(){

 	var geom = new  THREE.SphereBufferGeometry( 500, 128, 128 );

 	geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));

 	var mat = new THREE.ShaderMaterial({
		vertexShader: vertexShader,
		fragmentShader: fragmentShader,
		uniforms: {
        uTime: { value: 0 }
    }
	})

	// const mat = new THREE.MeshPhongMaterial({
	// 	color:Colors.blue,
	// 	transparent:true,
	// 	opacity:.6,
	// 	shading:THREE.FlatShading,
	// });

 	this.mesh = new THREE.Mesh(geom, mat);

 	this.mesh.receiveShadow = true;
 }

let sea;

function createSea(){
 	sea = new Sea();

 	sea.mesh.position.y = -600;

 	scene.add(sea.mesh);
}
createSea()

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
  for (var i=0; i<nBlocs; i++ ){
    var m = new THREE.Mesh(geom.clone(), mat);
    m.position.x = i*20;
    m.position.y = Math.random()*10;
    m.position.z = Math.random()*10;
    m.rotation.z = Math.random()*Math.PI*2;
    m.rotation.y = Math.random()*Math.PI*2;
    var s = .1 + Math.random()*.9;
    m.scale.set(s,s,s);
    this.mesh.add(m);
    m.castShadow = true;
    m.receiveShadow = true;

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
  this.nClouds = 40;
  this.clouds = [];
  var stepAngle = Math.PI*2 / this.nClouds;
  for(var i=0; i<this.nClouds; i++){
    var c = new Cloud();
    this.clouds.push(c);
    var a = stepAngle*i;
    let h = 750 + Math.random()*200
    c.mesh.position.y = Math.sin(a)*h;
    c.mesh.position.x = Math.cos(a)*h;
    c.mesh.position.z = -300-Math.random()*500;
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
  scene.add(sky.mesh);
}
createSky()

//airplane
 const meshAirplane = new THREE.Object3D();

	// Create the cabin
	const geomCockpit = new THREE.BoxGeometry(60,40,40,1,1,1);
	const matCockpit = new THREE.MeshPhongMaterial({color:Colors.red});
	const cockpit = new THREE.Mesh(geomCockpit, matCockpit);
	cockpit.castShadow = true;
	cockpit.receiveShadow = true;
	meshAirplane.add(cockpit);

	// Create the engine
	const geomEngine = new THREE.BoxGeometry(20,40,40,1,1,1);
	const matEngine = new THREE.MeshPhongMaterial({color:Colors.white, shading:THREE.FlatShading});
	const engine = new THREE.Mesh(geomEngine, matEngine);
	engine.position.x = 40;
	engine.castShadow = true;
	engine.receiveShadow = true;
	meshAirplane.add(engine);

	// Create the tail
	const geomTailPlane = new THREE.BoxGeometry(15,20,5,1,1,1);
	const matTailPlane = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
	const tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
	tailPlane.position.set(-35,25,0);
	tailPlane.castShadow = true;
	tailPlane.receiveShadow = true;
	meshAirplane.add(tailPlane);

	// Create the wing
	const geomSideWing = new THREE.BoxGeometry(30,8,130,1,1,1);
	const matSideWing = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
	const sideWing = new THREE.Mesh(geomSideWing, matSideWing);
	sideWing.castShadow = true;
	sideWing.receiveShadow = true;
	meshAirplane.add(sideWing);

	// propeller
	const geomPropeller = new THREE.BoxGeometry(20,10,10,1,1,1);
	const matPropeller = new THREE.MeshPhongMaterial({color:Colors.brown, shading:THREE.FlatShading});
	const propeller = new THREE.Mesh(geomPropeller, matPropeller);
	propeller.castShadow = true;
	propeller.receiveShadow = true;

	// blades
	const geomBlade = new THREE.BoxGeometry(1,80,15,1,1,1);
	const matBlade = new THREE.MeshPhongMaterial({color:Colors.brownDark, shading:THREE.FlatShading});

	const blade = new THREE.Mesh(geomBlade, matBlade);
	blade.position.set(8,0,0);
	blade.castShadow = true;
	blade.receiveShadow = true;
	propeller.add(blade);
	propeller.position.set(50,0,0);
	meshAirplane.add(propeller);
	scene.add(cockpit, engine, tailPlane, sideWing, propeller)

	

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
	meshAirplane.position.y = targetY;
	meshAirplane.position.x = targetX;
	propeller.rotation.x += 0.3;
}

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastElapsedTime
    lastElapsedTime = elapsedTime
	sea.mesh.rotation.z += 0.005;
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