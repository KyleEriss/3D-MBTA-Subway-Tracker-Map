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

async function initMap() {
  let vehicleEventData = await new EventSource(`${BASE_URL}/subway`);

  await vehicleEventData.addEventListener("reset", async (event) => {
    data = JSON.parse(event.data);
    vehicleMarkersArray = await resetMarkersMethod(data);
  });

  setTimeout(async () => {
    console.log("timeout complete");

    vehicleEventData.addEventListener("update", async (event) => {
      let updatedVehicle = JSON.parse(event.data);
      vehicleMarkersArray = await updateMarkersMethod(
        [updatedVehicle],
        vehicleMarkersArray
      );
    });

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
  }, 2000);

  const mapDiv = document.getElementById("map");
  const apiLoader = new Loader(apiOptions);
  await apiLoader.load();
  return new google.maps.Map(mapDiv, mapOptions);
}

async function initWebGLOverlayView(map) {
  let renderer;

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
          mapOptions.heading += 0.35;
          mapOptions.zoom -= 0.0015;
        } else {
          renderer.setAnimationLoop(null);
        }
      });
    };
  };

  webGLOverlayView.onDraw = ({ gl, transformer }) => {
    // update camera matrix to ensure the model is georeferenced correctly on the map
    let latLngAltitudeLiteral = {};

    for (let i = 0; i < vehicleMarkersArray.length; i++) {
      latLngAltitudeLiteral = {
        lat: vehicleMarkersArray[i].lat,
        lng: vehicleMarkersArray[i].lng,
        altitude: 90,
      };

      const matrix = transformer.fromLatLngAltitude(latLngAltitudeLiteral);
      vehicleMarkersArray[i].camera.projectionMatrix =
        new THREE.Matrix4().fromArray(matrix);
    }

    webGLOverlayView.requestRedraw();
    try {
      for (let i = 0; i < vehicleMarkersArray.length; i++) {
        renderer.render(
          vehicleMarkersArray[i].scene,
          vehicleMarkersArray[i].camera
        );
      }
    } catch (error) {
      console.log(`Renderer.render error: ${error}`);
    }

    // always reset the GL state
    renderer.resetState();
  };
  webGLOverlayView.setMap(map);
}

(async () => {
  const map = await initMap();
  setTimeout(() => {
    initWebGLOverlayView(map);
  }, 1000);
})();
