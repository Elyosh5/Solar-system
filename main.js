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

const renderer = new THREE.WebGL1Renderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
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
camera.position.set(-90, 140, 140);
orbit.update();

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const textureLoader = new THREE.TextureLoader();

const sunGeo = new THREE.SphereGeometry(30, 25, 20);
const sunMat = new THREE.MeshBasicMaterial({
  map: textureLoader.load(sunTexture),
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

const pointLight = new THREE.PointLight(0xffffff, 2, 800);
scene.add(pointLight);

function createPlanet(size, texture, position, ring) {
  const geometry = new THREE.SphereGeometry(size, 25, 20);
  const material = new THREE.MeshStandardMaterial({
    map: textureLoader.load(texture),
  });
  const planet = new THREE.Mesh(geometry, material);

  const planetObj = new THREE.Object3D();
  planetObj.add(planet);
  scene.add(planetObj);
  planet.position.x = position;
  if (ring) {
    const RingGeo = new THREE.RingGeometry(
      ring.innerRadius,
      ring.outerRadius,
      30
    );
    const RingMat = new THREE.MeshStandardMaterial({
      map: textureLoader.load(ring.texture),
      side: THREE.DoubleSide,
    });
    const Ring = new THREE.Mesh(RingGeo, RingMat);
    planetObj.add(Ring);

    Ring.position.x = position;
    Ring.rotation.x = -0.5 * Math.PI;
  }
  return { planet, planetObj };
}

const mercury = createPlanet(1, mercuryTexture, 50);

const venus = createPlanet(2, venusTexture, 80);

const earth = createPlanet(3.6, earthTexture, 110);
const mars = createPlanet(2.5, marsTexture, 130);
const jupiter = createPlanet(14, jupiterTexture, 230);
const saturn = createPlanet(13, saturnTexture, 400, {
  innerRadius: 10,
  outerRadius: 20,
  texture: saturnRingTexture,
});
const uranus = createPlanet(6.5, uranusTexture, 500, {
  innerRadius: 10,
  outerRadius: 10,
  texture: uranusRingTexture,
});
const neptune = createPlanet(7, neptuneTexture, 580);
const pluto = createPlanet(0.7, plutoTexture, 660);

function animate() {
  sun.rotateY(0.001);
  mercury.planet.rotateY(0.001);
  mercury.planetObj.rotateY(0.001 * 2);
  venus.planet.rotateY(0.001);
  venus.planetObj.rotateY(0.00035 * 2);
  earth.planet.rotateY(0.001);
  earth.planetObj.rotateY(0.0003 * 2);
  mars.planet.rotateY(0.001);
  mars.planetObj.rotateY(0.00024 * 2);
  jupiter.planet.rotateY(0.001);
  jupiter.planetObj.rotateY(0.00013 * 2);
  saturn.planet.rotateY(0.001);
  saturn.planetObj.rotateY(0.00009 * 2);
  uranus.planet.rotateY(0.001);
  uranus.planetObj.rotateY(0.00005 * 2);
  neptune.planet.rotateY(0.001);
  neptune.planetObj.rotateY(0.00004 * 2);
  pluto.planet.rotateY(0.001);
  pluto.planetObj.rotateY(0.00003 * 2);
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
