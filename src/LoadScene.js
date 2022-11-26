import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

let loader = new GLTFLoader();

let source;

const sourceRed = "red.gltf";
const sourceGreen = "green.gltf";
const sourceBlue = "blue.gltf";
const sourceOrange = "orange.gltf";
const sourcePurple = "purple.gltf";

export async function loadScene(vehicle) {
  try {
    if (vehicle.isRed) {
      source = sourceRed;
    }

    if (vehicle.isGreen) {
      source = sourceGreen;
    }
    if (vehicle.isBlue) {
      source = sourceBlue;
    }

    if (vehicle.isOrange) {
      source = sourceOrange;
    }

    if (vehicle.isPurple) {
      source = sourcePurple;
    }

    await loader.load(source, (gltf) => {
      gltf.scene.scale.set(25, 25, 25);
      gltf.scene.rotation.x = (180 * Math.PI) / 180; // rotations are in radians
      gltf.scene.rotation.z = (vehicle.compassBearing * Math.PI) / 180;
      vehicle.scene.add(gltf.scene);
    });
  } catch (error) {
    console.log(`loadScene error: ${error}`);
  }
}
