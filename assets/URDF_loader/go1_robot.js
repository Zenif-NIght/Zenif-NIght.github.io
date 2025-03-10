import * as THREE from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';
import { LoadingManager } from 'three';
import { URDFLoader } from './URDFLoader.js';

// console.log("works");



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(80, 1, 0.01, 1000);
// const camera = new THREE.OrthographicCamera();
camera.position.set(0.6, 0.3, 0);

const camLookat = new THREE.Vector3(0, 0, 0);
camera.lookAt(camLookat);
camera.up.set(0, 1, 0);

const container = document.querySelector("#go1_robot_id");

const renderer = new THREE.WebGLRenderer({ canvas: container, alpha: true, antialias: true });
// renderer.outputEncoding = sRGBEncoding;
// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearColor(0x000000, 0);
let width = container.clientWidth;
let height = container.clientHeight;
let height_s = width;
// if (width < height) {
//     height_s = height;
// }

if (window.innerWidth < 786) {
    height_s = 2*width;
    width = 1.4*width;
} 

// console.log(width, height);

// renderer.setSize(width, height, false);
renderer.setSize(width, height_s, false);

let aspect = width / height_s;
console.log(width, height);
console.log(aspect);
camera.aspect = aspect;

camera.updateProjectionMatrix();



// const controls = new OrbitControls(camera, renderer.domElement);


const directionalLight = new THREE.DirectionalLight(0x00FFFF, 0.5);
directionalLight.position.set(1, 1, -1); // x is right, y is up, z is towards the cam

const pointLight = new THREE.PointLight(0x00FF00);
pointLight.position.set(3, 3, -3);
const pointLight2 = new THREE.PointLight(0x00BFFF);
pointLight2.position.set(3, 3, 3);

scene.add(directionalLight);
scene.add(pointLight);
scene.add(pointLight2);


// const gridHelper = new THREE.GridHelper(100, 100);
// scene.add(gridHelper);

// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);


const DEG2RAD = Math.PI / 180;
const RAD2DEG = 1 / DEG2RAD;

// ...init three.js scene...

const manager = new LoadingManager();
const loader2 = new URDFLoader(manager);
// load(urdf, onComplete, onProgress, onError) {
const baseRot = [-Math.PI / 2, 0, Math.PI / 2]; // inverted mesh
loader2.packages = {
  packageName: '/assets/URDF_loader/go1'
};
let robot;
loader2.load(
  '/assets/URDF_loader/go1/urdf/go1.urdf',  
  // 'assets/URDF_loader/go1/urdf/go1_unitree_new.urdf',

  r => {
    console.dir("loaded go1_robot_id");
    // console.dir(robot);
    // The robot is loaded!
    r.rotation.set(baseRot[0], baseRot[1], baseRot[2]); //facing x axis

    let t = document.body.getBoundingClientRect().top;
    r.rotation.z = (t - 10) * -0.02
    r.position.set(0., 0.2, -0.0);
    console.dir(r);
    // r.children[0].geometry.translate(0, 0.25, 0);
    // r.joints["FR_calf_joint"].setJointValue(-1.5);
    console.dir(r.joints);
    // console.dir();
    scene.add(r);
    robot = r;
    robot.joints["FR_hip_joint"].setJointValue(-0.2);
    robot.joints["FL_hip_joint"].setJointValue(0.2);
    robot.joints["RR_hip_joint"].setJointValue(-0.2);
    robot.joints["RL_hip_joint"].setJointValue(0.2);

  }, undefined, error => {
    console.log("error loading go1_robot");
    console.log(error);
  }
);

function moveCamera(event) {
  // scroll-dependent animation
  const mouseX = event.clientX;
  const mouseY = event.clientY;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const normalizedMouseX = (mouseX / windowWidth) * 2 - 1;
  const normalizedMouseY = (mouseY / windowHeight) * 2 - 1;
  if (robot !== undefined) {
    robot.rotation.z = normalizedMouseX * Math.PI / 4;
    robot.rotation.y = normalizedMouseY * Math.PI / 4;
  }
  
}
document.body.onmousemove = moveCamera;

// console.log(camera.rotation);
function animate() {
  requestAnimationFrame(animate);
  // controls.update();
  renderer.render(scene, camera);
  const time = Date.now() / 100;

  // const offset = 1 * Math.PI / 3;
  const ratio1 = Math.max(0, Math.sin(time + 0));
  const ratio2 = Math.max(0, Math.sin(time + (Math.PI / 2)));
  const ratio3 = Math.max(0, Math.sin(time + (Math.PI)));
  const ratio4 = Math.max(0, Math.sin(time + (3 * Math.PI / 2)));
  // console.log(ratio);
  if (robot != undefined) {
    robot.joints["FR_thigh_joint"].setJointValue(THREE.MathUtils.lerp(1, 0.5, ratio1));
    robot.joints["FL_thigh_joint"].setJointValue(THREE.MathUtils.lerp(1, 0.5, ratio3));
    robot.joints["RR_thigh_joint"].setJointValue(THREE.MathUtils.lerp(1.2, 0.8, ratio3));
    robot.joints["RL_thigh_joint"].setJointValue(THREE.MathUtils.lerp(1.2, 0.8, ratio1));

    robot.joints["FR_calf_joint"].setJointValue(THREE.MathUtils.lerp(-2., -1.2, ratio1));
    robot.joints["FL_calf_joint"].setJointValue(THREE.MathUtils.lerp(-2., -1.2, ratio3));
    robot.joints["RR_calf_joint"].setJointValue(THREE.MathUtils.lerp(-2., -1.2, ratio3));
    robot.joints["RL_calf_joint"].setJointValue(THREE.MathUtils.lerp(-2., -1.2, ratio1));
    // robot.joints["FR_calf_joint"].setJointValue(THREE.MathUtils.lerp(-100, -30, ratio) * DEG2RAD);
  }



  // effect.render( scene, camera );

}
animate();