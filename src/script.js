import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { TransformControls } from "three/addons/controls/TransformControls.js";
import gsap from "gsap";

import holographicVertexShader from "./shaders/holographic/vertex.glsl";
import holographicFragmentShader from "./shaders/holographic/fragment.glsl";

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

////////////////////////////////////////////////////////////////////////////////
// Variables
let femur, part1, part2, parentPart;
let transformControls, transformControls1, transformControls2, orbitControls;
let needsRender = true;

const gltfLoader = new GLTFLoader(loadingManager);

// Debug
const gui = new GUI();

const params = {
  useShaderMaterial: false,
  showTransform1: false,
  showTransform2: false,
};

// Canvas
// const canvas = document.querySelector("canvas.webgl");
const canvas = document.getElementById("canvas");
const viewport = document.getElementById("viewport");

// Scene
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
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  viewportWidth: viewport.clientWidth,
  viewportHeight: viewport.clientHeight,
};

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

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer2.setPixelRatio(Math.min(window.devicePixelRatio, 1));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  25,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(1.5, 13, 31);
camera.rotation.set(-0.2, 0, 0);
scene.add(camera);

const camera2 = new THREE.PerspectiveCamera(
  25,
  sizes.viewportWidth / sizes.viewportHeight,
  0.01,
  1000
);
camera2.position.set(0, 2.2, 15.5);
scene.add(camera2);

const testgeometry = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
scene.add(testgeometry);
testgeometry.position.set(-2.5, 30.5, 0.5);

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
  antialias: true,
});
renderer.setClearColor(rendererParameters.clearColor);
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// canvas.appendChild(renderer.domElement);
document.body.appendChild(renderer.domElement);

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

// Controls
// orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enabled = true;
// orbitControls.enableDamping = true;

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
  vertexShader: holographicVertexShader,
  fragmentShader: holographicFragmentShader,
  uniforms: {
    uTime: new THREE.Uniform(0),
    uColor: new THREE.Uniform(new THREE.Color(materialParameters.color)),
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

// body
// gltfLoader.load("./models/body.glb", (gltf) => {
//   const body = gltf.scene;
//   // wireframe
//   body.traverse((child) => {
//     if (child.isMesh) {
//       // child.material = new THREE.MeshBasicMaterial({
//       //   color: 0xffffff,
//       //   wireframe: true,
//       // });
//       child.material = holoMaterial;
//     }
//   });

//   body.scale.set(0.03, 0.035, 0.03);
//   body.position.set(0.4, 5.9, 2);
//   scene.add(body);
// });

// Right femur
gltfLoader.load("./models/Right_femur2.gltf", (gltf) => {
  femur = gltf.scene;

  femur.traverse((child) => {
    if (child.isMesh && child.name === "Right_Femur") {
      child.material = basicMaterial;
    }
  });
  scene.add(femur);
  console.log(femur);
  femur.position.set(0, -7, 0);
  femur.scale.set(0.1, 0.1, 0.1);
  femur.rotation.set(0, Math.PI, 0);

  part1 = femur.children[0]; // First part
  part2 = femur.children[1]; // Second part
  parentPart = femur.children[9];

  // const parentObject = new THREE.Group();
  // parentObject.add(parentPart);
  // parentObject.add(part1);
  // scene.add(parentObject);

  // Create two TransformControls
  transformControls1 = new TransformControls(camera, renderer.domElement);
  transformControls1.attach(part1);
  transformControls1.visible = false; // Initially hidden
  scene.add(transformControls1);

  transformControls2 = new TransformControls(camera, renderer.domElement);
  transformControls2.attach(part2);
  transformControls2.visible = false; // Initially hidden
  scene.add(transformControls2);

  // Add event listeners to update controls
  transformControls1.addEventListener("change", () => (needsRender = true));
  transformControls2.addEventListener("change", () => (needsRender = true));

  transformControls1.addEventListener("dragging-changed", function (event) {
    orbitControls.enabled = !event.value;
  });

  transformControls2.addEventListener("dragging-changed", function (event) {
    orbitControls.enabled = !event.value;
  });
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

// function render() {
//   renderer.render(scene, camera);
// }

////////////////////////////////////////////////////////////////////////////////
//// GSAP
document.getElementById("value-2").addEventListener("click", () => {
  gsap.to(camera.position, { x: 0.3, y: 12, z: 14, duration: 2 });
  gsap.to(camera.rotation, { x: 0.5, y: 1.2, z: 0, duration: 2 });
});

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  // render();
  // renderer.render(scene, camera);
  const elapsedTime = clock.getElapsedTime();

  if (sceneReady) {
    document.querySelector(".main-container").style.visibility = "visible";
    sceneReady = false;
  }
  // Update material
  holoMaterial.uniforms.uTime.value = elapsedTime;

  // Update controls
  orbitControls.update();
  // Render
  // if (needsRender) {
  //   render();
  // }
  renderer.render(scene, camera);
  renderer2.render(scene, camera2);
  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

gui.add(camera.position, "x").min(-20).max(50).step(0.5).name("Dir X pos");
gui.add(camera.position, "y").min(-20).max(50).step(0.5).name("Dir Y pos");
gui.add(camera.position, "z").min(-20).max(50).step(0.5).name("Dir Z pos");
gui
  .add(camera.rotation, "x")
  .min(-Math.PI / 2)
  .max(Math.PI / 2)
  .step(0.02)
  .name("ROT X pos");
gui.add(camera.rotation, "y").step(0.1).name("Rot Y Cam3");
gui.add(camera.rotation, "z").step(0.1).name("Rot Z Cam3");
// gui.add(camera.position, "y").min(-20).max(20).step(0.1).name("elevation");

gui
  .add(testgeometry.position, "y")
  .min(-20)
  .max(50)
  .step(0.5)
  .name("Dir X pos");
