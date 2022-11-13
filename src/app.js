import { Loader } from "@googlemaps/js-api-loader";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

let sceneRed = [];
let sceneGreen = [];
let sceneBlue = [];
let sceneOrange = [];
let scenePurple = [];

let redScenes = [];
let greenScenes = [];
let blueScenes = [];
let orangeScenes = [];
let purpleScenes = [];

const sourceRed = "red.gltf";
const sourceGreen = "green.gltf";
const sourceBlue = "blue.gltf";
const sourceOrange = "orange.gltf";
const sourcePurple = "purple.gltf";

let data;

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const MAP_ID = process.env.MAP_ID;


const apiOptions = {
  apiKey: API_KEY,
  version: "beta",
};

const mapOptions = {
  tilt: 0,
  heading: 0,
  zoom: 17,
  center: { lat: 42.36085, lng: -71.058571 },
  mapId: MAP_ID,
};

let mapCoordinatesRed = [];
let mapCoordinatesGreen = [];
let mapCoordinatesBlue = [];
let mapCoordinatesOrange = [];
let mapCoordinatesPurple = [];

let cameraRed = [];
let cameraGreen = [];
let cameraBlue = [];
let cameraOrange = [];
let cameraPurple = [];

let compassBearingRed = [];
let compassBearingGreen = [];
let compassBearingBlue = [];
let compassBearingOrange = [];
let compassBearingPurple = [];

let loader = new GLTFLoader();

function loadSceneOnAddedVehicle(compassBearing, scene, scenes, objectSource) {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.75); // soft white light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.25);
  directionalLight.position.set(0.5, -1, 0.5);

  try {
    let index = compassBearing.length;
    scene[index] = new THREE.Scene();
    scene[index].add(ambientLight);
    directionalLight.position.set(0.5, -1, 0.5);
    scene[index].add(directionalLight);

    loader.load(objectSource, (gltf) => {
      gltf.scene.scale.set(25, 25, 25);
      gltf.scene.rotation.x = (180 * Math.PI) / 180; // rotations are in radians
      gltf.scene.rotation.z = (compassBearing[index] * Math.PI) / 180;
      scene[index].add(gltf.scene);
      scenes.push(scene[index]);
    });
  } catch (error) {
    console.log(`loadSceneOnAddedVehicle error: ${error}`);
  }
}

async function resetMarkers(data) {
  try {
    data.map((coordinates, idx) => {
      if (
        coordinates.relationships?.route.data.id === "Red" ||
        coordinates.relationships?.route.data.id === "Shuttle-Generic-Red"
      ) {
        mapCoordinatesRed.push({
          id: coordinates.id,
          lat: coordinates.attributes.latitude,
          lng: coordinates.attributes.longitude,
        });

        compassBearingRed.push(coordinates.attributes.bearing);
      }

      if (
        coordinates.relationships?.route.data.id === "Green-B" ||
        coordinates.relationships?.route.data.id === "Green-C" ||
        coordinates.relationships?.route.data.id === "Green-D" ||
        coordinates.relationships?.route.data.id === "Green-E" ||
        coordinates.relationships?.route.data.id === "Shuttle-Generic-Green"
      ) {
        mapCoordinatesGreen.push({
          id: coordinates.id,
          lat: coordinates.attributes.latitude,
          lng: coordinates.attributes.longitude,
        });
        compassBearingGreen.push(coordinates.attributes.bearing);
      }

      if (
        coordinates.relationships?.route.data.id === "Blue" ||
        coordinates.relationships?.route.data.id === "Shuttle-Generic-Blue"
      ) {
        mapCoordinatesBlue.push({
          id: coordinates.id,
          lat: coordinates.attributes.latitude,
          lng: coordinates.attributes.longitude,
        });
        compassBearingBlue.push(coordinates.attributes.bearing);
      }

      if (
        coordinates.relationships?.route.data.id === "Orange" ||
        coordinates.relationships?.route.data.id === "Shuttle-Generic-Orange"
      ) {
        mapCoordinatesOrange.push({
          id: coordinates.id,
          lat: coordinates.attributes.latitude,
          lng: coordinates.attributes.longitude,
        });
        compassBearingOrange.push(coordinates.attributes.bearing);
      }

      if (coordinates.links?.self.includes("/vehicles/1")) {
        mapCoordinatesPurple.push({
          id: coordinates.id,
          lat: coordinates.attributes.latitude,
          lng: coordinates.attributes.longitude,
        });
        compassBearingPurple.push(coordinates.attributes.bearing);
      }
    });

    for (let i = 0; i < mapCoordinatesRed.length; i++) {
      cameraRed[i] = new THREE.PerspectiveCamera();
    }

    for (let i = 0; i < mapCoordinatesGreen.length; i++) {
      cameraGreen[i] = new THREE.PerspectiveCamera();
    }

    for (let i = 0; i < mapCoordinatesBlue.length; i++) {
      cameraBlue[i] = new THREE.PerspectiveCamera();
    }

    for (let i = 0; i < mapCoordinatesOrange.length; i++) {
      cameraOrange[i] = new THREE.PerspectiveCamera();
    }

    for (let i = 0; i < mapCoordinatesPurple.length; i++) {
      cameraPurple[i] = new THREE.PerspectiveCamera();
    }
  } catch (error) {
    console.log(`resetMarkers error: ${error}`);
  }
}

function updateMarkers(updatedVehicle) {
  try {
    const updatedVehicleId = updatedVehicle
      .map((vehicle) => vehicle.id)
      .join(",");

    const redIndex = mapCoordinatesRed.findIndex(
      (vehicle) => vehicle.id === updatedVehicleId
    );
    const greenIndex = mapCoordinatesGreen.findIndex(
      (vehicle) => vehicle.id === updatedVehicleId
    );
    const blueIndex = mapCoordinatesBlue.findIndex(
      (vehicle) => vehicle.id === updatedVehicleId
    );
    const orangeIndex = mapCoordinatesOrange.findIndex(
      (vehicle) => vehicle.id === updatedVehicleId
    );
    const purpleIndex = mapCoordinatesPurple.findIndex(
      (vehicle) => vehicle.id === updatedVehicleId
    );

    if (redIndex !== -1) {
      mapCoordinatesRed[redIndex].lat = updatedVehicle.map(
        (vehicle) => vehicle.attributes.latitude
      )[0];
      mapCoordinatesRed[redIndex].lng = updatedVehicle.map(
        (vehicle) => vehicle.attributes.longitude
      )[0];
      compassBearingRed[redIndex] = updatedVehicle.map(
        (vehicle) => vehicle.attributes.bearing
      )[0];
      redScenes[redIndex].rotation.z =
        (compassBearingRed[redIndex] * Math.PI) / 180;
    }

    if (greenIndex !== -1) {
      mapCoordinatesGreen[greenIndex].lat = updatedVehicle.map(
        (vehicle) => vehicle.attributes.latitude
      )[0];
      mapCoordinatesGreen[greenIndex].lng = updatedVehicle.map(
        (vehicle) => vehicle.attributes.longitude
      )[0];
      compassBearingGreen[greenIndex] = updatedVehicle.map(
        (vehicle) => vehicle.attributes.bearing
      )[0];
      greenScenes[greenIndex].rotation.z =
        (compassBearingGreen[greenIndex] * Math.PI) / 180;
    }

    if (blueIndex !== -1) {
      mapCoordinatesBlue[blueIndex].lat = updatedVehicle.map(
        (vehicle) => vehicle.attributes.latitude
      )[0];
      mapCoordinatesBlue[blueIndex].lng = updatedVehicle.map(
        (vehicle) => vehicle.attributes.longitude
      )[0];
      compassBearingBlue[blueIndex] = updatedVehicle.map(
        (vehicle) => vehicle.attributes.bearing
      )[0];
      blueScenes[blueIndex].rotation.z =
        (compassBearingBlue[blueIndex] * Math.PI) / 180;
    }

    if (orangeIndex !== -1) {
      mapCoordinatesOrange[orangeIndex].lat = updatedVehicle.map(
        (vehicle) => vehicle.attributes.latitude
      )[0];
      mapCoordinatesOrange[orangeIndex].lng = updatedVehicle.map(
        (vehicle) => vehicle.attributes.longitude
      )[0];
      compassBearingOrange[orangeIndex] = updatedVehicle.map(
        (vehicle) => vehicle.attributes.bearing
      )[0];
      orangeScenes[orangeIndex].rotation.z =
        (compassBearingOrange[orangeIndex] * Math.PI) / 180;
    }

    if (purpleIndex !== -1) {
      mapCoordinatesPurple[purpleIndex].lat = updatedVehicle.map(
        (vehicle) => vehicle.attributes.latitude
      )[0];
      mapCoordinatesPurple[purpleIndex].lng = updatedVehicle.map(
        (vehicle) => vehicle.attributes.longitude
      )[0];
      compassBearingPurple[purpleIndex] = updatedVehicle.map(
        (vehicle) => vehicle.attributes.bearing
      )[0];
      purpleScenes[purpleIndex].rotation.z =
        (compassBearingPurple[purpleIndex] * Math.PI) / 180;
    }
  } catch (error) {
    console.log(`updateMarkers error: ${error}`);
  }
}

async function addMarker(addedVehicle) {
  try {
    addedVehicle.map(async (coordinates) => {
      if (
        coordinates.relationships?.route.data.id === "Red" ||
        coordinates.relationships?.route.data.id === "Shuttle-Generic-Red"
      ) {
        await mapCoordinatesRed.push({
          id: coordinates.id,
          lat: coordinates.attributes.latitude,
          lng: coordinates.attributes.longitude,
        });
        await compassBearingRed.push(coordinates.attributes.bearing);
        await cameraRed.push(new THREE.PerspectiveCamera());
        await loadSceneOnAddedVehicle(
          compassBearingRed,
          sceneRed,
          redScenes,
          sourceRed
        );
      }

      if (
        coordinates.relationships?.route.data.id === "Green-B" ||
        coordinates.relationships?.route.data.id === "Green-C" ||
        coordinates.relationships?.route.data.id === "Green-D" ||
        coordinates.relationships?.route.data.id === "Green-E" ||
        coordinates.relationships?.route.data.id === "Shuttle-Generic-Green"
      ) {
        await mapCoordinatesGreen.push({
          id: coordinates.id,
          lat: coordinates.attributes.latitude,
          lng: coordinates.attributes.longitude,
        });
        await compassBearingGreen.push(coordinates.attributes.bearing);
        await cameraGreen.push(new THREE.PerspectiveCamera());
        await loadSceneOnAddedVehicle(
          compassBearingGreen,
          sceneGreen,
          greenScenes,
          sourceGreen
        );
      }

      if (
        coordinates.relationships?.route.data.id === "Blue" ||
        coordinates.relationships?.route.data.id === "Shuttle-Generic-Blue"
      ) {
        await mapCoordinatesBlue.push({
          id: coordinates.id,
          lat: coordinates.attributes.latitude,
          lng: coordinates.attributes.longitude,
        });
        await compassBearingBlue.push(coordinates.attributes.bearing);
        await cameraBlue.push(new THREE.PerspectiveCamera());
        await loadSceneOnAddedVehicle(
          compassBearingBlue,
          sceneBlue,
          blueScenes,
          sourceBlue
        );
      }

      if (
        coordinates.relationships?.route.data.id === "Orange" ||
        coordinates.relationships?.route.data.id === "Shuttle-Generic-Orange"
      ) {
        await mapCoordinatesOrange.push({
          id: coordinates.id,
          lat: coordinates.attributes.latitude,
          lng: coordinates.attributes.longitude,
        });
        await compassBearingOrange.push(coordinates.attributes.bearing);
        await cameraOrange.push(new THREE.PerspectiveCamera());
        await loadSceneOnAddedVehicle(
          compassBearingOrange,
          sceneOrange,
          orangeScenes,
          sourceOrange
        );
      }

      if (coordinates.links?.self.includes("/vehicles/1")) {
        await mapCoordinatesPurple.push({
          id: coordinates.id,
          lat: coordinates.attributes.latitude,
          lng: coordinates.attributes.longitude,
        });
        await compassBearingPurple.push(coordinates.attributes.bearing);
        await cameraPurple.push(new THREE.PerspectiveCamera());
        await loadSceneOnAddedVehicle(
          compassBearingPurple,
          scenePurple,
          purpleScenes,
          sourcePurple
        );
      }
    });
  } catch (error) {
    console.log(`addMarker error: ${error}`);
  }
}

async function removeMarker(removedVehicle) {
  try {
    const removedVehicleId = removedVehicle
      .map((vehicle) => vehicle.id)
      .join(",");

    const redIndex = await mapCoordinatesRed.findIndex(
      (vehicle) => vehicle.id === removedVehicleId
    );
    const greenIndex = await mapCoordinatesGreen.findIndex(
      (vehicle) => vehicle.id === removedVehicleId
    );
    const blueIndex = await mapCoordinatesBlue.findIndex(
      (vehicle) => vehicle.id === removedVehicleId
    );
    const orangeIndex = await mapCoordinatesOrange.findIndex(
      (vehicle) => vehicle.id === removedVehicleId
    );
    const purpleIndex = await mapCoordinatesPurple.findIndex(
      (vehicle) => vehicle.id === removedVehicleId
    );

    if (redIndex !== -1) {
      await mapCoordinatesRed.splice(redIndex, 1);
      await compassBearingRed.splice(redIndex, 1);
      await redScenes.splice(redIndex, 1);
      await cameraRed.pop();
    }

    if (greenIndex !== -1) {
      await mapCoordinatesGreen.splice(greenIndex, 1);
      await compassBearingGreen.splice(greenIndex, 1);
      await greenScenes.splice(greenIndex, 1);
      await cameraGreen.pop();
    }
    if (blueIndex !== -1) {
      await mapCoordinatesBlue.splice(blueIndex, 1);
      await compassBearingBlue.splice(blueIndex, 1);
      await blueScenes.splice(blueIndex, 1);
      await cameraBlue.pop();
    }
    if (orangeIndex !== -1) {
      await mapCoordinatesOrange.splice(orangeIndex, 1);
      await compassBearingOrange.splice(orangeIndex, 1);
      await orangeScenes.splice(orangeIndex, 1);
      await cameraOrange.pop();
    }
    if (purpleIndex !== -1) {
      await mapCoordinatesPurple.splice(purpleIndex, 1);
      await compassBearingPurple.splice(purpleIndex, 1);
      await purpleScenes.splice(purpleIndex, 1);
      await cameraPurple.pop();
    }
  } catch (error) {
    console.log(`removeMarker error: ${error}`);
  }
}

async function initMap() {
  let predictionsEventSource = new EventSource(
    `https://api-v3.mbta.com/vehicles?api_key=${process.env.MBTA_API_KEY}`
  );

  predictionsEventSource.addEventListener("reset", (event) => {
    data = JSON.parse(event.data);
    resetMarkers(data);
  });

  predictionsEventSource.addEventListener("update", (event) => {
    let updatedVehicle = JSON.parse(event.data);

    updateMarkers([updatedVehicle]);
  });

  predictionsEventSource.addEventListener("add", (event) => {
    let addedVehicle = JSON.parse(event.data);

    addMarker([addedVehicle]);
  });

  predictionsEventSource.addEventListener("remove", (event) => {
    let removedVehicle = JSON.parse(event.data);

    removeMarker([removedVehicle]);
  });

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
    let loader = new GLTFLoader();

    for (let i = 0; i < compassBearingRed.length; i++) {
      sceneRed[i] = new THREE.Scene();
      const ambientLightRed = new THREE.AmbientLight(0xffffff, 0.75); // soft white light
      sceneRed[i].add(ambientLightRed);
      const directionalLightRed = new THREE.DirectionalLight(0xffffff, 0.25);
      directionalLightRed.position.set(0.5, -1, 0.5);
      sceneRed[i].add(directionalLightRed);

      loader.load(sourceRed, (gltf) => {
        gltf.scene.scale.set(25, 25, 25);
        gltf.scene.rotation.x = (180 * Math.PI) / 180; // rotations are in radians
        gltf.scene.rotation.z = (compassBearingRed[i] * Math.PI) / 180;
        sceneRed[i].add(gltf.scene);
        redScenes.push(sceneRed[i]);
      });
    }

    for (let i = 0; i < compassBearingGreen.length; i++) {
      sceneGreen[i] = new THREE.Scene();
      const ambientLightGreen = new THREE.AmbientLight(0xffffff, 0.75); // soft white light
      sceneGreen[i].add(ambientLightGreen);
      const directionalLightGreen = new THREE.DirectionalLight(0xffffff, 0.25);
      directionalLightGreen.position.set(0.5, -1, 0.5);
      sceneGreen[i].add(directionalLightGreen);

      loader.load(sourceGreen, (gltf) => {
        gltf.scene.scale.set(25, 25, 25);
        gltf.scene.rotation.x = (180 * Math.PI) / 180; // rotations are in radians
        gltf.scene.rotation.z = (compassBearingGreen[i] * Math.PI) / 180;
        sceneGreen[i].add(gltf.scene);
        greenScenes.push(sceneGreen[i]);
      });
    }

    for (let i = 0; i < compassBearingBlue.length; i++) {
      sceneBlue[i] = new THREE.Scene();
      const ambientLightBlue = new THREE.AmbientLight(0xffffff, 0.75); // soft white light
      sceneBlue[i].add(ambientLightBlue);
      const directionalLightBlue = new THREE.DirectionalLight(0xffffff, 0.25);
      directionalLightBlue.position.set(0.5, -1, 0.5);
      sceneBlue[i].add(directionalLightBlue);

      loader.load(sourceBlue, (gltf) => {
        gltf.scene.scale.set(25, 25, 25);
        gltf.scene.rotation.x = (180 * Math.PI) / 180; // rotations are in radians
        gltf.scene.rotation.z = (compassBearingBlue[i] * Math.PI) / 180;
        sceneBlue[i].add(gltf.scene);
        blueScenes.push(sceneBlue[i]);
      });
    }

    for (let i = 0; i < compassBearingOrange.length; i++) {
      sceneOrange[i] = new THREE.Scene();
      const ambientLightOrange = new THREE.AmbientLight(0xffffff, 0.75); // soft white light
      sceneOrange[i].add(ambientLightOrange);
      const directionalLightOrange = new THREE.DirectionalLight(0xffffff, 0.25);
      directionalLightOrange.position.set(0.5, -1, 0.5);
      sceneOrange[i].add(directionalLightOrange);

      loader.load(sourceOrange, (gltf) => {
        gltf.scene.scale.set(25, 25, 25);
        gltf.scene.rotation.x = (180 * Math.PI) / 180; // rotations are in radians
        gltf.scene.rotation.z = (compassBearingOrange[i] * Math.PI) / 180;
        sceneOrange[i].add(gltf.scene);
        orangeScenes.push(sceneOrange[i]);
      });
    }

    for (let i = 0; i < compassBearingPurple.length; i++) {
      scenePurple[i] = new THREE.Scene();
      const ambientLightPurple = new THREE.AmbientLight(0xffffff, 0.75); // soft white light
      scenePurple[i].add(ambientLightPurple);
      const directionalLightPurple = new THREE.DirectionalLight(0xffffff, 0.25);
      directionalLightPurple.position.set(0.5, -1, 0.5);
      scenePurple[i].add(directionalLightPurple);

      loader.load(sourcePurple, (gltf) => {
        gltf.scene.scale.set(25, 25, 25);
        gltf.scene.rotation.x = (180 * Math.PI) / 180; // rotations are in radians
        gltf.scene.rotation.z = (compassBearingPurple[i] * Math.PI) / 180;
        scenePurple[i].add(gltf.scene);
        purpleScenes.push(scenePurple[i]);
      });
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
          mapOptions.heading += 0.7;
          mapOptions.zoom -= 0.005;
        } else {
          renderer.setAnimationLoop(null);
        }
      });
    };
  };

  webGLOverlayView.onDraw = ({ gl, transformer }) => {
    // update camera matrix to ensure the model is georeferenced correctly on the map

    let matrixRed = [];
    let matrixGreen = [];
    let matrixBlue = [];
    let matrixOrange = [];
    let matrixPurple = [];

    let latLngAltitudeLiteral = {};

    for (let i = 0; i < mapCoordinatesRed.length; i++) {
      latLngAltitudeLiteral = {
        lat: mapCoordinatesRed[i].lat,
        lng: mapCoordinatesRed[i].lng,
        altitude: 90,
      };

      matrixRed = transformer.fromLatLngAltitude(latLngAltitudeLiteral);
      cameraRed[i].projectionMatrix = new THREE.Matrix4().fromArray(matrixRed);
    }

    for (let i = 0; i < mapCoordinatesGreen.length; i++) {
      latLngAltitudeLiteral = {
        lat: mapCoordinatesGreen[i].lat,
        lng: mapCoordinatesGreen[i].lng,
        altitude: 90,
      };

      matrixGreen = transformer.fromLatLngAltitude(latLngAltitudeLiteral);
      cameraGreen[i].projectionMatrix = new THREE.Matrix4().fromArray(
        matrixGreen
      );
    }

    for (let i = 0; i < mapCoordinatesBlue.length; i++) {
      latLngAltitudeLiteral = {
        lat: mapCoordinatesBlue[i].lat,
        lng: mapCoordinatesBlue[i].lng,
        altitude: 90,
      };

      matrixBlue = transformer.fromLatLngAltitude(latLngAltitudeLiteral);
      cameraBlue[i].projectionMatrix = new THREE.Matrix4().fromArray(
        matrixBlue
      );
    }

    for (let i = 0; i < mapCoordinatesOrange.length; i++) {
      latLngAltitudeLiteral = {
        lat: mapCoordinatesOrange[i].lat,
        lng: mapCoordinatesOrange[i].lng,
        altitude: 90,
      };

      matrixOrange = transformer.fromLatLngAltitude(latLngAltitudeLiteral);
      cameraOrange[i].projectionMatrix = new THREE.Matrix4().fromArray(
        matrixOrange
      );
    }

    for (let i = 0; i < mapCoordinatesPurple.length; i++) {
      latLngAltitudeLiteral = {
        lat: mapCoordinatesPurple[i].lat,
        lng: mapCoordinatesPurple[i].lng,
        altitude: 90,
      };

      matrixPurple = transformer.fromLatLngAltitude(latLngAltitudeLiteral);
      cameraPurple[i].projectionMatrix = new THREE.Matrix4().fromArray(
        matrixPurple
      );
    }

    webGLOverlayView.requestRedraw();
    try {
      for (let i = 0; i < mapCoordinatesRed.length; i++) {
        renderer.render(redScenes[i], cameraRed[i]);
      }
      for (let i = 0; i < mapCoordinatesGreen.length; i++) {
        renderer.render(greenScenes[i], cameraGreen[i]);
      }
      for (let i = 0; i < mapCoordinatesBlue.length; i++) {
        renderer.render(blueScenes[i], cameraBlue[i]);
      }
      for (let i = 0; i < mapCoordinatesOrange.length; i++) {
        renderer.render(orangeScenes[i], cameraOrange[i]);
      }

      for (let i = 0; i < mapCoordinatesPurple.length; i++) {
        renderer.render(purpleScenes[i], cameraPurple[i]);
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
  initWebGLOverlayView(map);
})();
