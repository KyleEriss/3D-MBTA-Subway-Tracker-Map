import { Loader } from "@googlemaps/js-api-loader";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
  resetMarkersMethod,
  updateMarkersMethod,
  addMarkerMethod,
  removeMarkerMethod,
} from "./EventsService";
import { loadScene } from "./LoadScene";

let vehicleMarkersArray = [];
let data;
const loadingElement = document.getElementById("loading");

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const BASE_URL = process.env.BASE_URL;
const MAP_ID = process.env.MAP_ID;

const apiOptions = {
  apiKey: API_KEY,
  version: "beta",
};

const mapOptions = {
  tilt: 100,
  heading: 0,
  zoom: 18,
  center: { lat: 42.36085, lng: -71.058571 },
  mapId: MAP_ID,
};

let loader = new GLTFLoader();

let renderer;

const animationDuration = 2000;

async function initMap() {
  loadingElement.removeAttribute("hidden");
  let vehicleEventData = new EventSource(`${BASE_URL}/subway`);

  const resetPromise = new Promise(async (resolve) => {
    vehicleEventData.addEventListener("reset", async (event) => {
      data = JSON.parse(event.data);
      vehicleMarkersArray = await resetMarkersMethod(data);
      resolve();
    });
  });

  await Promise.all([resetPromise]);

  loadingElement.style.display = "none";

  setTimeout(async () => {
    vehicleEventData.addEventListener("update", async (event) => {
      let updatedVehicle = JSON.parse(event.data);
      vehicleMarkersArray = await updateMarkersMethod(
        [updatedVehicle],
        vehicleMarkersArray
      );
    });
  }, 2000);

  vehicleEventData.addEventListener("add", async (event) => {
    let addedVehicle = JSON.parse(event.data);
    vehicleMarkersArray = await addMarkerMethod(
      [addedVehicle],
      vehicleMarkersArray
    );
  });

  vehicleEventData.addEventListener("remove", async (event) => {
    let removedVehicle = JSON.parse(event.data);
    vehicleMarkersArray = await removeMarkerMethod(
      [removedVehicle],
      vehicleMarkersArray
    );
  });

  const mapDiv = document.getElementById("map");
  const apiLoader = new Loader(apiOptions);
  await apiLoader.load();
  return new google.maps.Map(mapDiv, mapOptions);
}

async function initWebGLOverlayView(map) {
  const webGLOverlayView = new google.maps.WebGLOverlayView();

  webGLOverlayView.onAdd = () => {
    // load the model
    try {
      for (let i = 0; i < vehicleMarkersArray.length; i++) {
        loadScene(vehicleMarkersArray[i]);
      }
    } catch (error) {
      console.log(`onAdd loadScene error: ${error}`);
    }
  };

  webGLOverlayView.onContextRestored = ({ gl }) => {
    renderer = new THREE.WebGLRenderer({
      canvas: gl.canvas,
      context: gl,
      ...gl.getContextAttributes(),
    });
    renderer.autoClear = false;

    // wait to move the camera until the 3D model loads
    loader.manager.onLoad = () => {
      renderer.setAnimationLoop(() => {
        map.moveCamera({
          tilt: mapOptions.tilt,
          heading: mapOptions.heading,
          zoom: mapOptions.zoom,
        });

        // rotate the map 360 degrees
        if (mapOptions.tilt < 67.5) {
          mapOptions.tilt += 0.7;
        } else if (mapOptions.heading <= 360) {
          mapOptions.heading += 0.5;
          mapOptions.zoom -= 0.0035;
        } else {
          renderer.setAnimationLoop(null);
        }
      });
    };
  };

  webGLOverlayView.onDraw = ({ gl, transformer }) => {
    let latLngAltitudeLiteral = {};

    for (let i = 0; i < vehicleMarkersArray.length; i++) {
      let marker = vehicleMarkersArray[i];
      function animate() {
        if (!marker.startTime) {
          marker.startTime = performance.now();
        }

        let currentTime = performance.now();
        let elapsedTime = currentTime - marker.startTime;
        let t = Math.min(elapsedTime / animationDuration, 1);

        let oldMatrix = marker.oldMatrix;
        let newMatrix = marker.newMatrix;
        let currentBearing = marker.oldCompassBearing;
        let targetBearing = marker.compassBearing;

        const interpolatedBearing =
          currentBearing * (1 - t) + targetBearing * t;

        marker.scene.rotation.z = (interpolatedBearing * Math.PI) / 180;

        let interpolatedMatrix = new THREE.Matrix4();
        for (let i = 0; i < 16; i++) {
          let oldValue = oldMatrix.elements[i];
          let newValue = newMatrix.elements[i];
          interpolatedMatrix.elements[i] = oldValue * (1 - t) + newValue * t;
        }

        marker.camera.projectionMatrix.copy(interpolatedMatrix);
        marker.camera.updateMatrixWorld(true);

        if (t < 1) {
          requestAnimationFrame(animate);
        } else {
          marker.startTime = null;
          marker.oldMatrix = null;
          marker.newMatrix = null;
          marker.oldCompassBearing = null;
          return;
        }
      }

      if (vehicleMarkersArray[i].oldMatrix) {
        latLngAltitudeLiteral = {
          lat: vehicleMarkersArray[i].lat,
          lng: vehicleMarkersArray[i].lng,
          altitude: 90,
        };

        let matrix = transformer.fromLatLngAltitude(latLngAltitudeLiteral);
        vehicleMarkersArray[i].newMatrix = new THREE.Matrix4().fromArray(
          matrix
        );

        animate();
      }

      if (!vehicleMarkersArray[i].oldMatrix) {
        latLngAltitudeLiteral = {
          lat: vehicleMarkersArray[i].lat,
          lng: vehicleMarkersArray[i].lng,
          altitude: 90,
        };

        const matrix = transformer.fromLatLngAltitude(latLngAltitudeLiteral);
        vehicleMarkersArray[i].camera.projectionMatrix =
          new THREE.Matrix4().fromArray(matrix);
      }
      renderer.render(
        vehicleMarkersArray[i].scene,
        vehicleMarkersArray[i].camera
      );
    }

    webGLOverlayView.requestRedraw();

    // always reset the GL state
    renderer.resetState();
  };
  webGLOverlayView.setMap(map);
}

(async () => {
  const map = await initMap();
  initWebGLOverlayView(map);
})();
