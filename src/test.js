import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { TransformControls } from "three/addons/controls/TransformControls.js";
import gsap from "gsap";
// import { ViewHelper } from "three/addons/helpers/ViewHelper.js";
import holographicFragmentShader from "./shaders/holographic/fragment.glsl";
import holographicVertexShader from "./shaders/holographic/vertex.glsl";
// import { ViewportGizmo } from "three-viewport-gizmo";
import { ViewHelper } from "./components/ViewHelper.js";

/**
 * Base
 */
////////////////////////////////////////////////////////////////////////////////
// Loading manager

const loadingBarElement = document.querySelector(".loading");
const ballWireElement = document.querySelector(".ball-wire");

let sceneReady = false;

const loadingManager = new THREE.LoadingManager(
  // Loaded
  () => {
    // Wait a little
    window.setTimeout(() => {
      // Animate overlay
      gsap.to(overlayMaterial.uniforms.uAlpha, {
        duration: 3,
        value: 0,
        delay: 1,
      });
      // Update loadingBarElement
      // loadingBarElement.classList.add("ended");
      loadingBarElement.style.visibility = "hidden";

      // loadingBarElement.style.transform = "";
    }, 500);

    window.setTimeout(() => {
      sceneReady = true;
    }, 2000);
  },

  // Progress
  (itemUrl, itemsLoaded, itemsTotal) => {
    // Calculate the progress and update the loadingBarElement
    const progressRatio = itemsLoaded / itemsTotal;
    console.log(progressRatio);
    // updateWireHeight(progressRatio);
  }
);

const canvas = document.querySelector("canvas.webgl");
const viewport = document.getElementById("viewport");
const checkboxes = document.querySelector(".radio-input-wrapper .check-box");

////////////////////////////////////////////////////////////////////////////////
// Variables
let femur, part1, part2, parentPart;
let transformControls, transformControls1, transformControls2, orbitControls;
let needsRender = true;
let enableAdding = false;
const cursor = new THREE.Vector2();
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  viewportWidth: viewport.clientWidth,
  viewportHeight: viewport.clientHeight,
};

const gltfLoader = new GLTFLoader(loadingManager);

// Debug

const gui = new GUI({
  width: 400,
  position: "absolute",
  top: 10,
  left: 10,
  zIndex: 10,
});
// gui.controllers.disabled = true;
gui.close();
// hide gui
// gui.toggleHide();

const params = {
  useShaderMaterial: false,
  showTransform1: false,
  showTransform2: false,
};

// Canvas
// const canvas = document.querySelector("canvas.webgl");

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();

// Overlay
const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
const overlayMaterial = new THREE.ShaderMaterial({
  // wireframe: true,
  transparent: true,
  uniforms: {
    uAlpha: { value: 1 },
  },
  vertexShader: `
        varying vec2 vUv;
        void main()
        {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
        }
    `,
  fragmentShader: `
        varying vec2 vUv;
        uniform float uAlpha;

        void main()
        {
            vec2 center = vec2(0.5, 0.5);
            float radius = uAlpha; 

            // Distance from center
            float dist = distance(vUv, center);

            float alpha =  smoothstep(radius,1.0 -  radius , dist);


            // gl_FragColor = vec4(0.0, 0.0, 0.0, alpha);
            gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
        }
    `,
});
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);
scene.add(overlay);

////////////////////////////////////////////////////////////////////////////////

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  300
);
// camera.position.set(1.5, 13, 21);
camera.position.set(0.8, 2.8, 15.5);
// camera.rotation.set(-0.2, 0, 0);
scene.add(camera);

const camera2 = new THREE.PerspectiveCamera(
  25,
  sizes.viewportWidth / sizes.viewportHeight,
  0.01,
  1000
);
camera2.position.set(0.8, 2.8, 105.5);

scene.add(camera2);

// const testgeometry = new THREE.Mesh(
//   new THREE.BoxGeometry(1, 1, 1),
//   new THREE.MeshBasicMaterial({ color: 0xff0000 })
// );
// scene.add(testgeometry);
// testgeometry.position.set(0, -87, -10);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(2, 2, 2);
scene.add(directionalLight);

/**
 * Renderer
 */
const rendererParameters = {};
rendererParameters.clearColor = "#1d1f2a";

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setClearColor(rendererParameters.clearColor);
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
// canvas.appendChild(renderer.domElement);
// document.body.appendChild(renderer.domElement);

gui.addColor(rendererParameters, "clearColor").onChange(() => {
  renderer.setClearColor(rendererParameters.clearColor);
});

const renderer2 = new THREE.WebGLRenderer({
  antialias: false,
});
// renderer2.setClearColor(0x000000);
renderer2.setClearColor(rendererParameters.clearColor);
renderer2.setSize(sizes.viewportWidth, sizes.viewportHeight);

renderer2.setPixelRatio(Math.min(window.devicePixelRatio, 1));
viewport.appendChild(renderer2.domElement);

/**
 * Sizes
 */

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  camera2.aspect = sizes.viewportWidth / sizes.viewportHeight;
  camera2.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer2.setSize(sizes.viewportWidth, sizes.viewportHeight);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
  renderer2.setPixelRatio(Math.min(window.devicePixelRatio, 1));
});

// Pivot point for transform controls
const pivot = new THREE.Object3D();
scene.add(pivot);
const curr_transformPoint = new THREE.Object3D();
scene.add(curr_transformPoint);

const previousPosition = new THREE.Object3D();
scene.add(previousPosition);
// Set up controls
orbitControls = new OrbitControls(camera, canvas);
transformControls = new TransformControls(camera, canvas);
// transformControls.attach(pivot);
// scene.add(transformControls);

// GIZMO
// grid helper
const gridHelper = new THREE.GridHelper(500, 40);
gridHelper.position.y = -15;
scene.add(gridHelper);

// const viewhelper = new ViewHelper(camera, canvas);
// scene.add(viewhelper);
/**
 * Material
 */
const materialParameters = {};
materialParameters.color = "#70c1ff";

gui.addColor(materialParameters, "color").onChange(() => {
  holoMaterial.uniforms.uColor.value.set(materialParameters.color);
  basicMaterial.color.set(materialParameters.color);
});

const holoMaterial = new THREE.ShaderMaterial({
  fragmentShader: holographicFragmentShader,
  vertexShader: holographicVertexShader,
  uniforms: {
    uTime: new THREE.Uniform(0),
    uColor: new THREE.Uniform(new THREE.Color(materialParameters.color)),
    cameraPos: { value: camera.position },
  },
  transparent: true,
  side: THREE.DoubleSide,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});

const basicMaterial = new THREE.MeshLambertMaterial({
  color: materialParameters.color,
});

gui
  .add(params, "useShaderMaterial")
  .name("Holographic View")
  .onChange((value) => {
    if (femur) {
      femur.traverse((child) => {
        if (child.isMesh && child.name === "Right_Femur") {
          child.material = value ? holoMaterial : basicMaterial;
        }
      });
    }
  });

////////////////////////////////////////////////////////////////////////////////
//// Models
let center;
// Create a parent object
var parentObject = new THREE.Object3D();
scene.add(parentObject);

const pointMaterial = new THREE.MeshToonMaterial({ color: 0xff0000 });
// Right femur
gltfLoader.load("./models/exact.glb", (gltf) => {
  femur = gltf.scene;

  femur.traverse((child) => {
    if (child.isMesh && child.name === "Right_Femur") {
      child.material = basicMaterial;
    }
  });

  console.log(femur);
  femur.position.set(0, -46, -8);
  femur.scale.set(0.05, 0.05, 0.05);
  // femur.rotation.set(0, Math.PI, 0);

  const box = new THREE.Box3().setFromObject(femur);
  center = box.getCenter(new THREE.Vector3());

  previousPosition.position.copy(femur.position);
  parentObject.add(femur);
});

gui
  .add(params, "showTransform1")
  .name("Show Transform Part 1")
  .onChange((value) => {
    transformControls1.visible = value;
    needsRender = true;
  });

gui
  .add(params, "showTransform2")
  .name("Show Transform Part 2")
  .onChange((value) => {
    transformControls2.visible = value;
    needsRender = true;
  });

////////////////////////////// landmarks
// Event Listeners
// State Management
let sphere = null;
// const transformControls = new THREE.TransformControls(camera, renderer.domElement);

// Event Listeners
canvas.addEventListener("click", onClick, false);
checkboxes.addEventListener("change", onCheckboxChange, false);

function onCheckboxChange(event) {
  if (!checkboxes.checked && sphere) {
    scene.remove(sphere);
    scene.remove(transformControls);
    sphere = null;
  }
}

function onClick(event) {
  if (!checkboxes.checked) return;

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(femur, true);

  if (intersects.length > 0) {
    const point = intersects[0].point;

    if (!sphere) {
      addSphere(point);
    }
  }
}

function addSphere(position) {
  const geometry = new THREE.SphereGeometry(0.1, 32, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  sphere = new THREE.Mesh(geometry, material);
  sphere.position.copy(position);
  scene.add(sphere);

  // Add transform controls
  transformControls.attach(sphere);
  scene.add(transformControls);
  transformControls.setMode("translate");
}

////////////////////////////////////////////////////////////////////////////////
//// GSAP
document.getElementById("value-3").addEventListener("click", () => {
  gsap.to(camera.position, { x: 0.3, y: 12, z: 14, duration: 2 });
  gsap.to(camera.rotation, { x: 0.5, y: 1.2, z: 0, duration: 2 });
});

////////////////////////////////////////////////////////////////////////////////
//// Mouse events

/**
 * Animate
 */
const clock = new THREE.Clock();
const viewHelper = new ViewHelper(camera, canvas, orbitControls);
function animate() {
  requestAnimationFrame(animate);

  const elapsedTime = clock.getElapsedTime();

  if (sceneReady) {
    document.querySelector(".main-container").style.visibility = "visible";
    sceneReady = false;
  }
  // Update material
  holoMaterial.uniforms.uTime.value = elapsedTime;

  // Update controls
  renderer.setViewport(0, 0, canvas?.offsetWidth, canvas?.offsetHeight);
  renderer.render(scene, camera);
  renderer.autoClear = false;
  viewHelper.render(renderer);
  renderer.autoClear = true;

  renderer2.render(scene, camera2);
}

animate();

// gui.add(camera.position, "x").min(-20).max(50).step(0.5).name("Dir X pos");
gui.add(camera2.position, "y").min(-100).max(50).step(1).name("Dir Y pos");
// gui.add(camera.position, "z").min(-20).max(50).step(0.5).name("Dir Z pos");
// gui
//   .add(camera.rotation, "x")
//   .min(-Math.PI / 2)
//   .max(Math.PI / 2)
//   .step(0.02)
//   .name("ROT X pos");
// gui.add(camera.rotation, "y").step(0.1).name("Rot Y Cam3");
// gui.add(camera.rotation, "z").step(0.1).name("Rot Z Cam3");
// // gui.add(camera.position, "y").min(-20).max(20).step(0.1).name("elevation");

// gui
//   .add(testgeometry.position, "y")
//   .min(-20)
//   .max(50)
//   .step(0.5)
//   .name("Dir X pos");
