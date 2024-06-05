import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { TransformControls } from "three/addons/controls/TransformControls.js";
import gsap from "gsap";
import TWEEN from "@tweenjs/tween.js";
import holographicFragmentShader from "./shaders/holographic/fragment.glsl";
import holographicVertexShader from "./shaders/holographic/vertex.glsl";

import labelFragmentShader from "./shaders/labels/fragment.glsl";
import labelVertexShader from "./shaders/labels/vertex.glsl";

import lineFragmentShader from "./shaders/lineSegments/fragment.glsl";
import lineVertexShader from "./shaders/lineSegments/vertex.glsl";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { DotScreenShader } from "three/examples/jsm/shaders/DotScreenShader.js";

import { LuminosityShader } from "three/addons/shaders/LuminosityShader.js";
import { SobelOperatorShader } from "three/addons/shaders/SobelOperatorShader.js";

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
const checkboxes = document.querySelectorAll(".radio-input-wrapper .check-box");

////////////////////////////////////////////////////////////////////////////////
// Variables
let femur, part1, part2, parentPart;
let transformControls, transformControls1, transformControls2;
let needsRender = true;
let enableAdding = false;
let currentIndex;
let currentCheckbox = false;
const spheres = [];
let isFirstClick = true;
let firstChecked = Array.from({ length: 10 }, (value, index) => false);
let CheckedState = firstChecked;
let labelAdded = firstChecked;

let isChecked = false;
let addedSpheres = [];
let checkboxStates = {};
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
  autoPlace: true,
    width: 430,
});
const guiContainer = gui.domElement;
guiContainer.style.position = "absolute";
guiContainer.style.top = "0";
guiContainer.style.right = "120px";
guiContainer.style.zIndex = "100";
// gui title
gui.title("Knee Alignment Tool (V0.0.2)");
// gui.controllers.disabled = true;
 gui.close();
// hide gui
// gui.toggleHide();
// add hello label on gui

// add upload option on lil gui

const params = {
  useShaderMaterial: false,
  showTransform1: false,
  showTransform2: false,
  
  loadFile: function () {
    console.log("Upload Femur GLTF MODEL");
    },

    moreSettings: function () {
        console.log("Upload Femur GLTF MODEL");
    },
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
// const camera = new THREE.PerspectiveCamera(
//   60,
//   sizes.width / sizes.height,
//   0.1,
//   1000.0
// );
var camera = new THREE.OrthographicCamera(
  sizes.width / -30,
  sizes.width / 30,
  sizes.height / 30,
  sizes.height / -30,
  0.01,
  1000
);

// camera.position.set(1.5, 13, 21);
camera.position.set(0.8, 1.8, 12.5);
// camera.rotation.set(-0.2, 0, 0);
scene.add(camera);

const camera2 = new THREE.PerspectiveCamera(
  25,
  sizes.viewportWidth / sizes.viewportHeight,
  0.01,
  1000
);

camera2.position.set(-2.8, 0.8, 95.5);

scene.add(camera2);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(2, 2, 2);
scene.add(directionalLight);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight2.position.set(-2, -2, -2);
scene.add(directionalLight2);

/**
 * Renderer
 */
const rendererParameters = {};
rendererParameters.Background_Color = "#13141b";

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setClearColor(rendererParameters.clearColor);
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// canvas.appendChild(renderer.domElement);
// document.body.appendChild(renderer.domElement);

gui.addColor(rendererParameters, "Background_Color").onChange(() => {
  renderer.setClearColor(rendererParameters.Background_Color);
});

const renderer2 = new THREE.WebGLRenderer({
  antialias: false,
});
// renderer2.setClearColor(0x000000);
renderer2.setClearColor(rendererParameters.clearColor);
renderer2.setSize(sizes.viewportWidth, sizes.viewportHeight);

renderer2.setPixelRatio(Math.min(window.devicePixelRatio, 1));
viewport.appendChild(renderer2.domElement);

/////////////////////////////////////////////////////////////////////////
///// POST PROCESSING EFFECTS

// const renderPass = new RenderPass(scene, camera);
const renderPass2 = new RenderPass(scene, camera2);

// const renderTarget = new THREE.WebGLRenderTarget(width, height, {
//     minFilter: THREE.LinearFilter,
//     magFilter: THREE.LinearFilter,
//     format: THREE.RGBAFormat,
// });

const renderTarget2 = new THREE.WebGLRenderTarget(
  viewport.clientWidth,
  viewport.clientHeight,
  {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
  }
);

// const composer = new EffectComposer(renderer, renderTarget);
// composer.setPixelRatio(Math.min(window.devicePixelRatio, 1));

const composer2 = new EffectComposer(renderer2, renderTarget2);
composer2.setPixelRatio(Math.min(window.devicePixelRatio, 1));

composer2.addPass(renderPass2);

let effectSobel;
effectSobel = new ShaderPass(SobelOperatorShader);
effectSobel.uniforms["resolution"].value.x =
  window.innerWidth * window.devicePixelRatio;
effectSobel.uniforms["resolution"].value.y =
  window.innerHeight * window.devicePixelRatio;
composer2.addPass(effectSobel);

// const dotEffect = new ShaderPass(DotScreenShader);
// dotEffect.uniforms["scale"].value = 5;

composer2.addPass(effectSobel);

////////////////////////////////////////////////////////////////////////////////
//// SIZES

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
const orbitControls = new OrbitControls(camera, canvas);
orbitControls.enableDamping = true;
transformControls = new TransformControls(camera, canvas);
transformControls.setSize(0.8);
// transformControls.attach(pivot);
scene.add(transformControls);

// GIZMO
// grid helper
const gridHelper = new THREE.GridHelper(500, 100, 0xffffff, 0x262836);
gridHelper.position.y = -45;

scene.add(gridHelper);

// const viewhelper = new ViewHelper(camera, canvas);
// scene.add(viewhelper);
/**
 * Material
 */
const materialParameters = {};
materialParameters.Bone_Color = "#70c1ff";

gui.addColor(materialParameters, "Bone_Color").onChange(() => {
  holoMaterial.uniforms.uColor.value.set(materialParameters.Bone_Color);
  basicMaterial.color.set(materialParameters.Bone_Color);
});

const holoMaterial = new THREE.ShaderMaterial({
  fragmentShader: holographicFragmentShader,
  vertexShader: holographicVertexShader,
  uniforms: {
    uTime: { value: 0 },
    uColor: new THREE.Uniform(new THREE.Color(materialParameters.color)),
  },
  transparent: true,
  side: THREE.DoubleSide,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});

const labelMaterial = new THREE.ShaderMaterial({
  fragmentShader: labelFragmentShader,
  vertexShader: labelVertexShader,
  uniforms: {
    uTime: { value: 0 },
  },
  transparent: true,
  side: THREE.DoubleSide,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});

const basicMaterial = new THREE.MeshLambertMaterial({
  color: materialParameters.Bone_Color,
});

// gui
//   .add(params, "useShaderMaterial")
//   .name("Holographic View")
//   .onChange((value) => {
//     if (femur) {
//       femur.traverse((child) => {
//         if (child.isMesh && child.name === "Right_Femur") {
//           child.material = value ? holoMaterial : basicMaterial;
//         }
//       });
//     }
//   });

////////////////////////////////////////////////////////////////////////////////

// const testgeometry = new THREE.Mesh(
//   new THREE.BoxGeometry(1, 1, 1),
//   holoMaterial
// );
// scene.add(testgeometry);
// testgeometry.position.set(0, 1.3, 10);

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
      child.wireframe = true;
    }
  });

  console.log(femur);
  femur.position.set(0, -46, -8);
  femur.scale.set(0.05, 0.05, 0.05);
  scene.add(femur);
  // femur.rotation.set(0, Math.PI, 0);

  // const box = new THREE.Box3().setFromObject(femur);
  // center = box.getCenter(new THREE.Vector3());

  // previousPosition.position.copy(femur.position);
  // parentObject.add(femur);
});

////////////////////////////////////////////////////////////////////////////////
//// LANDMARKS
let sphereSize = 0.5;
let labels = [10];
labels[2] = 2;
console.log(labels);
const labelGeometry = new THREE.SphereGeometry(sphereSize, 32, 32);

// Handle slider input
const sliderrange = document.getElementById("myRange");
const slider = document.getElementById("slid");

const sphere = new THREE.Mesh(labelGeometry, labelMaterial);
for (let i = 0; i < 10; i++) {
  const sphere = new THREE.Mesh(labelGeometry, labelMaterial);
  // sphere.position.x = i - 4.5; // Position spheres in a line for visibility
  sliderrange.addEventListener("input", (event) => {
    const scale = 0.07 * event.target.value;
    sphere.scale.set(scale, scale, scale);
  });
  spheres.push(sphere);
  // scene.add(sphere);
}

// on button with class name add a sphere
// const butn = document.querySelector(".reset__btn");
// butn.addEventListener("click", () => {
//   if (spheres.length > 0) {
//     scene.remove(sphere);
//   }
// });

// let sizee = sphere.scale.set(sphereSize, sphereSize, sphereSize);
// gui.add(sphere, "scale.set").min(-2).max(5).step(0.1).name("Dir X pos");

// Event listener for creating spheres on click
//////////////////////////////////////////////////////////////////////////////////////////
//// MOUSE EVENTS

const checkbox = document.querySelectorAll(".radio-input-wrapper .check-box");
checkbox.forEach((box, index) => {
  box.addEventListener("click", () => {
    if (CheckedState[index] === false) {
      currentCheckbox = true;
      currentIndex = index;
      CheckedState[index] = true;
      firstChecked[index] = true;
      console.log(labelAdded[index]);
    } else {
      currentCheckbox = false;
      currentIndex = index;
      CheckedState[index] = false;
    }
  });
});

function addSphere(position) {
  let tempsphere = new THREE.Object3D();
  tempsphere = spheres[currentIndex];

  tempsphere.position.copy(position);
  // sphere.scale.set(sizee, sizee, sizee);
  scene.add(tempsphere);
  labelAdded[currentIndex] = true;
  // spheres.push(sphere);
  slider.style.visibility = "visible";
  return tempsphere;
}

// check first checked array for change in state to true
// if true, add sphere to scene
// if false, remove sphere from scene
// check when first checked state changes to true, whenever it changes to true, add sphere to scene
// whenever it changes to false, remove sphere from scene

if (firstChecked.includes(true)) {
  // scene.add(sphere);
  console.log("sphere added");
} else {
  // scene.remove(sphere);
  console.log("sphere removed");
}

window.addEventListener("click", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  // Check if click is on an existing object

  if (currentCheckbox === true) {
    const intersects = raycaster.intersectObjects(spheres);
    if (intersects.length > 0) {
      const sphere = intersects[0].object;
      transformControls.attach(sphere);
      orbitControls.enabled = false;
    } else {
      const intersectsGround = raycaster.intersectObject(femur);
      if (intersectsGround.length > 0 && firstChecked[currentIndex] == true) {
        const sphere = addSphere(intersectsGround[0].point);
        transformControls.attach(sphere);
        orbitControls.enabled = false;
      } else {
        transformControls.detach();
        orbitControls.enabled = true;
      }
    }
  } else {
    const intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length === 0) {
      transformControls.detach();
      orbitControls.enabled = true;
    }
  }
});

// // Disable transform controls when clicking elsewhere
// window.addEventListener("mousedown", (event) => {
//   if (event.target.tagName !== "CANVAS") return;

//   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

//   raycaster.setFromCamera(mouse, camera);

//   const intersects = raycaster.intersectObjects(femur, true);
//   if (intersects.length === 0) {
//     transformControls.detach();
//     orbitControls.enabled = true;
//   }
// });

//////////////////////////////////////////////////////////////////////////////////////////
//// LINE DRAWING
const uniforms = {
  spherePosition1: { value: spheres[0].position }, // Set to sphere1's position
  spherePosition2: { value: spheres[1].position }, // Set to sphere2's position
  u_time: { value: 0.0 },
};

const LineshaderMaterial = new THREE.ShaderMaterial({
  uniforms: uniforms,
  vertexShader: lineVertexShader,
  fragmentShader: lineFragmentShader,
  transparent: true,
});



const testSphere = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), holoMaterial);
testSphere.position.set(1, 1, 1);
scene.add(testSphere);

const testSphere2 = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), holoMaterial);
testSphere2.position.set(-1, -1, -1);
scene.add(testSphere2);



const testmaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
const points = [];
points.push(testSphere.position); // Start point of the first line
points.push(testSphere2.position); // End point of the first line
// Add more points if you have multiple line segments

const testgeometry = new THREE.BufferGeometry().setFromPoints(points);
const line = new THREE.LineSegments(testgeometry, testmaterial);
scene.add(line);



/// CREATING LINE SEGMENTS FUNCTION
function createAxes() {
  // Create a geometry that represents the line
  const lineGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array([
    0,
    0,
    0, // Start at sphere 1
    1,
    0,
    0, // End at sphere 2
  ]);
  lineGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  // Create the line and add it to the scene
  const line = new THREE.Line(lineGeometry, LineshaderMaterial);
  scene.add(line);
}

document.getElementById("updateButton").addEventListener("click", function () {
  createAxes();
});



// WARNING FOR COMPLETING ALL LANDMARKS
// document.getElementById("updateButton").addEventListener("click", function () {
//   // Get all checkbox elements within the wrapper
//   var checkboxes = document.querySelectorAll(
//     '#checkbox-list .label input[type="checkbox"]'
//   );
//   var allChecked = true;

//   // Check if all checkboxes are checked
//   for (var i = 0; i < checkboxes.length; i++) {
//     if (!checkboxes[i].checked) {
//       allChecked = false;
//       break;
//     }
//   }

//   // If not all checkboxes are checked, display a warning
//   if (!allChecked) {
//     alert("Warning: Please complete all landmarks before updating.");
//   } else {
//     createAxes();
//   }
// });

//const raycaster2 = new THREE.Raycaster();
//  const lineGeometry = new THREE.BufferGeometry();
//  const positions = new Float32Array([
//    0,
//    0,
//    0, // Start at sphere 1
//    1,
//    0,
//    0, // End at sphere 2
//  ]);
//  lineGeometry.setAttribute(
//    "position",
//    new THREE.BufferAttribute(positions, 3)
//  );

//  // Create the line and add it to the scene
//  const line = new THREE.Line(lineGeometry, LineshaderMaterial);
//  scene.add(line);

//const tooltip = document.createElement('div');
//tooltip.style.position = 'absolute';
//tooltip.style.backgroundColor = 'rgba(0,0,0,0.7)';
//tooltip.style.color = 'white';
//tooltip.style.padding = '5px';
//tooltip.style.borderRadius = '5px';
//tooltip.style.display = 'none';
//document.body.appendChild(tooltip);



// Event listener for mouse movement
//document.addEventListener('mousemove', onMouseMove, false);

//function onMouseMove(event) {
   

//    cursor.x = (event.clientX / window.innerWidth) * 2 - 1;
//    cursor.y = - (event.clientY / window.innerHeight) * 2 + 1;

//    // Update raycaster
//    raycaster2.setFromCamera(cursor, camera);

//    // Calculate intersections
//    const intersects = raycaster2.intersectObject(line);
//    -
//    if (intersects.length > 0) {
//        // If hovering over the line, show tooltip
//        tooltip.style.display = 'block';
//        tooltip.style.left = event.clientX + 'px';
//        tooltip.style.top = event.clientY + 'px';
//        tooltip.textContent = 'This is a line segment';
//    } else {
//        // If not hovering, hide tooltip
//        tooltip.style.display = 'none';
//    }
//}

// Event listener for mouse click to add sphere at click
let checkboxIndex;

////////////////////////////////////////////////////////////////////////////////
//// CAMERA ANIMATION

//// camera animation function
function animateCamera(position, rotation) {
  new TWEEN.Tween(camera2.position)
    .to(position, 1800)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .start()
    .onComplete(function () {
      TWEEN.remove(this);
    });
  new TWEEN.Tween(camera2.rotation)
    .to(rotation, 1800)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .start()
    .onComplete(function () {
      TWEEN.remove(this);
    });
}
const zoomIn = document.getElementById("zoom-in");
const zoomOut = document.getElementById("zoom-out");
const xRay = document.getElementById("x-ray");
const checkboxHighlight = document.getElementById("checkboxA");
xRay.addEventListener("click", () => {
  if (femur) {
    femur.traverse((child) => {
      if (child.isMesh && child.name === "Right_Femur") {
        if (child.material === holoMaterial) {
            child.material = basicMaterial;
            checkboxHighlight.checked = false;
        } else {
            child.material = holoMaterial;
            checkboxHighlight.checked = true;
        }
      }
    });
    }
    
});

zoomIn.addEventListener("click", () => {
  animateCamera({ x: 2.8, y: -6, z: 30.7 }, { y: 0.2 });
});

zoomOut.addEventListener("click", () => {
  animateCamera({ x: -2.8, y: 0.1, z: 65.5 }, { y: 0.0 });
});

// -2.8, 0.8, 65.5

//////////////////////////////////////////////////////////////////////////////////////////
//// AXES ////  https://codepen.io/ClockBlock/pen/LYvqNQz

// const dropdown = document.querySelector(".dropdown");
// const select = dropdown.querySelector(".select");
// const caret = dropdown.querySelector(".caret");
// const menu = dropdown.querySelector(".menu");
// const options = dropdown.querySelectorAll(".menu li");
// const selected = dropdown.querySelector(".selected");
// select.addEventListener("click", () => {
//   select.classList.toggle("select-clicked");
//   caret.classList.toggle("caret-rotate");
//   menu.classList.toggle("menu-open");
// });
// options.forEach((option) => {
//   option.addEventListener("click", () => {
//     selected.innerText = option.innerText;
//     select.classList.remove("select-clicked");
//     caret.classList.remove("caret-rotate");
//     menu.classList.remove("menu-open");
//     options.forEach((option) => {
//       option.classList.remove("active");
//     });
//     option.classList.add("active");
//     if (option.innerText === "Front-View") {
//       animateCamera({ x: -2.8, y: 0.8, z: 65.5 }, { y: 0 });
//     } else if (option.innerText === "Side-View") {
//       animateCamera({ x: 65.5, y: 0.8, z: -3 }, { y: Math.PI / 2 });
//     } else if (option.innerText === "Top-View") {
//       animateCamera({ x: -3, y: -60, z: 0.8 }, { x: Math.PI / 2 });
//     }
//   });
// });

////////////////////////////////////////////////////////////////////////////////
//// GSAP
// document.getElementById("value-3").addEventListener("click", () => {
//   gsap.to(camera.position, { x: 0.3, y: 12, z: 14, duration: 2 });
//   gsap.to(camera.rotation, { x: 0.5, y: 1.2, z: 0, duration: 2 });
// });




////////////////////////////////////////////////////////////////////////////////
//// 2D Canvas




/**
 * Animate
 */
const clock = new THREE.Clock();
const viewHelper = new ViewHelper(camera, canvas, orbitControls);

function animate() {
  TWEEN.update();

  renderer.setViewport(0, 0, canvas?.offsetWidth, canvas?.offsetHeight);
  renderer.render(scene, camera);
  renderer.autoClear = false;
  viewHelper.render(renderer);
  renderer.autoClear = true;

  renderer2.render(scene, camera2);

  const elapsedTime = clock.getElapsedTime();

  if (sceneReady) {
    document.querySelector(".main-container").style.visibility = "visible";
    sceneReady = false;
  }

  uniforms.u_time.value += 0.01; // Increment time
  if (uniforms.u_time.value > 1.0) {
    uniforms.u_time.value = 1.0; // Clamp the time value
  }

  // Update material
  holoMaterial.uniforms.uTime.value = elapsedTime;

  // Update controls
  orbitControls.update();

  composer2.render();
    requestAnimationFrame(animate);




}

animate();

// Prevent OrbitControls from interfering with TransformControls
transformControls.addEventListener("dragging-changed", function (event) {
  orbitControls.enabled = !event.value;
});

// gui.add(camera.position, "x").min(-20).max(50).step(0.5).name("Dir X pos");
// gui.add(camera2.position, "y").min(-100).max(50).step(1).name("Dir Y pos");
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
gui.add(params, "loadFile").name("Upload Femur GLTF Model");
gui.add(params, "moreSettings").name("More settings");
