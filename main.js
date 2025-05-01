import * as THREE from "three";

import starsTexture from "./src/img/stars.jpg";
import sunTexture from "./src/img/sun.jpg";
import mercuryTexture from "./src/img/mercury.jpg";
import venusTexture from "./src/img/venus.jpg";
import earthTexture from "./src/img/earth.jpg";
import marsTexture from "./src/img/mars.jpg";
import jupiterTexture from "./src/img/jupiter.jpg";
import saturnTexture from "./src/img/saturn.jpg";
import saturnRingTexture from "./src/img/saturn ring.png";
import uranusTexture from "./src/img/uranus.jpg";
import uranusRingTexture from "./src/img/uranus ring.png";
import neptuneTexture from "./src/img/neptune.jpg";
import plutoTexture from "./src/img/pluto.jpg";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FirstPersonControls } from "three/addons/controls/FirstPersonControls.js";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  20000
);

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
]);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(-190, 100, 10);
orbit.update();
const clock = new THREE.Clock();

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const textureLoader = new THREE.TextureLoader();

const sunGeo = new THREE.SphereGeometry(30, 25, 20);
const sunMat = new THREE.MeshBasicMaterial({
  map: textureLoader.load(sunTexture),
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

const pointLight = new THREE.PointLight(0xffffff, 2, 2500);
scene.add(pointLight);

document.addEventListener("keydown", function (event) {
  switch (event.keyCode) {
    case 87: // W
      camera.position.z -= 0.1;
      break;
    case 65: // A
      camera.position.x -= 0.1;
      break;
    case 83: // S
      camera.position.z += 0.1;
      break;
    case 68: // D
      camera.position.x += 0.1;
      break;
  }
});

function createPlanet(size, texture, position, ring) {
  const geometry = new THREE.SphereGeometry(size, 25, 20);
  const material = new THREE.MeshStandardMaterial({
    map: textureLoader.load(texture),
  });
  const planet = new THREE.Mesh(geometry, material);
  planet.position.x = position;

  const planetObj = new THREE.Object3D();
  planetObj.add(planet);
  scene.add(planetObj);

  if (ring) {
    const RingGeo = new THREE.RingGeometry(
      ring.innerRadius,
      ring.outerRadius,
      30
    );
    const RingMat = new THREE.MeshStandardMaterial({
      map: textureLoader.load(ring.texture),
      side: THREE.DoubleSide,
      transparent: true,
    });
    const ringMesh = new THREE.Mesh(RingGeo, RingMat);

    ringMesh.rotation.x = -0.5 * Math.PI;
    planet.add(ringMesh);

    ringMesh.position.set(0, 0, 0);
  }

  return { planet, planetObj };
}

function createOrbit(radius) {
  const curve = new THREE.EllipseCurve(
    0,
    0, // ax, aY
    radius,
    radius, // xRadius, yRadius
    0,
    2 * Math.PI, // startAngle, endAngle
    false, // clockwise
    0 // rotation
  );

  const points = curve.getPoints(64);
  const geometry = new THREE.BufferGeometry().setFromPoints(
    points.map((p) => new THREE.Vector3(p.x, 0, p.y))
  );

  const material = new THREE.LineBasicMaterial({ color: 0x151515 });
  const orbit = new THREE.LineLoop(geometry, material);
  scene.add(orbit);
}

const mercury = createPlanet(1, mercuryTexture, 50);
createOrbit(50);

const venus = createPlanet(2, venusTexture, 80);
createOrbit(70); // Venus

const earth = createPlanet(3.6, earthTexture, 110);
createOrbit(100); // Earth
const mars = createPlanet(2.5, marsTexture, 130);
createOrbit(150); // Mars
const jupiter = createPlanet(14, jupiterTexture, 230);
createOrbit(520); // Jupiter

const saturn = createPlanet(13, saturnTexture, 400, {
  innerRadius: 10,
  outerRadius: 20,
  texture: saturnRingTexture,
});
createOrbit(960); // Saturn

const uranus = createPlanet(6.5, uranusTexture, 500, {
  innerRadius: 10,
  outerRadius: 10,
  texture: uranusRingTexture,
});
createOrbit(1900); // Uranus

const neptune = createPlanet(7, neptuneTexture, 580);
createOrbit(3000); // Neptune

const pluto = createPlanet(7, plutoTexture, 660);
createOrbit(3200); // Pluto

let isStarted = false;

function start() {
  isStarted = true;
}
function stop() {
  isStarted = false;
}

let spedUpClicked = 2;

function handleSpeedUpClick() {
  spedUpClicked *= 2;
}

function handleSlowDownClick() {
  spedUpClicked /= 2;
}
let playMusic = true;

function animate() {
  // Rest of your existing animation code...
  if (isStarted) {
    sun.rotateY(0.0005 * spedUpClicked);
    // ... (keep all your existing planet animations)
  }

  renderer.render(scene, camera);
  if (playMusic) {
    document.querySelector("audio").play();
  }

  if (isStarted) {
    sun.rotateY(0.0005 * spedUpClicked);

    // ☿ Mercury
    mercury.planet.rotateY(0.004 * spedUpClicked);
    mercury.planetObj.rotateY(0.04 * spedUpClicked);

    // ♀ Venus
    venus.planet.rotateY(0.0001 * spedUpClicked);
    venus.planetObj.rotateY(0.015 * spedUpClicked);

    // 🌍 Earth
    earth.planet.rotateY(0.1 * spedUpClicked);
    earth.planetObj.rotateY(0.01 * spedUpClicked);

    // ♂ Mars
    mars.planet.rotateY(0.08 * spedUpClicked);
    mars.planetObj.rotateY(0.005 * spedUpClicked);

    // ♃ Jupiter
    jupiter.planet.rotateY(0.2 * spedUpClicked);
    jupiter.planetObj.rotateY(0.002 * spedUpClicked);

    // ♄ Saturn
    saturn.planet.rotateY(0.01 * spedUpClicked);
    saturn.planetObj.rotateY(0.001 * spedUpClicked);

    // ♅ Uranus
    uranus.planet.rotateY(0.03 * spedUpClicked);
    uranus.planetObj.rotateY(0.0004 * spedUpClicked);

    // ♆ Neptune
    neptune.planet.rotateY(0.03 * spedUpClicked);
    neptune.planetObj.rotateY(0.0002 * spedUpClicked);

    // ♇ Pluto (optional, dwarf)
    pluto.planet.rotateY(0.005 * spedUpClicked);
    pluto.planetObj.rotateY(0.0001 * spedUpClicked);
  }

  venus.planetObj.position.set(0, 0, 0);
  venus.planet.position.set(70, 0, 0);

  earth.planetObj.position.set(0, 0, 0);
  earth.planet.position.set(100, 0, 0);

  mars.planetObj.position.set(0, 0, 0);
  mars.planet.position.set(150, 0, 0);

  jupiter.planetObj.position.set(0, 0, 0);
  jupiter.planet.position.set(520, 0, 0);

  saturn.planetObj.position.set(0, 0, 0);
  saturn.planet.position.set(960, 0, 0);

  uranus.planetObj.position.set(0, 0, 0);
  uranus.planet.position.set(1900, 0, 0);

  neptune.planetObj.position.set(0, 0, 0);
  neptune.planet.position.set(3000, 0, 0);

  pluto.planetObj.position.set(0, 0, 0);
  pluto.planet.position.set(3200, 0, 0);
  renderer.render(scene, camera);
  if (playMusic) {
    document.querySelector("audio").play();
  }
}
renderer.setAnimationLoop(animate);

document.querySelector("#start").addEventListener("click", start);
document.querySelector("#stop").addEventListener("click", stop);
document
  .querySelector("#speedUp")
  .addEventListener("click", handleSpeedUpClick);
document
  .querySelector("#slowDown")
  .addEventListener("click", handleSlowDownClick);

document.querySelector("#musicPlayer").addEventListener("click", () => {
  playMusic = false;
});
