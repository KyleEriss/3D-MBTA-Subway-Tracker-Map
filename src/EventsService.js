import * as THREE from "three";
import VehicleMarker from "./VehicleMarkerClass";
import { addScene } from "./AddScene";
import { loadScene } from "./LoadScene";

export async function resetMarkersMethod(vehicles) {
  let vehicleMarkersArray = [];
  let newVehicle;

  let camera;
  let compassBearing;
  let id;
  let lat;
  let lng;
  let scene;

  try {
    for (let i = 0; i < vehicles.length; i++) {
      let transitType;

      if (
        vehicles[i].relationships?.route.data.id === "Red" ||
        vehicles[i].relationships?.route.data.id === "Shuttle-Generic-Red"
      ) {
        transitType = "red";
      }

      if (
        vehicles[i].relationships?.route.data.id === "Green-B" ||
        vehicles[i].relationships?.route.data.id === "Green-C" ||
        vehicles[i].relationships?.route.data.id === "Green-D" ||
        vehicles[i].relationships?.route.data.id === "Green-E" ||
        vehicles[i].relationships?.route.data.id === "Shuttle-Generic-Green"
      ) {
        transitType = "green";
      }
      if (
        vehicles[i].relationships?.route.data.id === "Blue" ||
        vehicles[i].relationships?.route.data.id === "Shuttle-Generic-Blue"
      ) {
        transitType = "blue";
      }

      if (
        vehicles[i].relationships?.route.data.id === "Orange" ||
        vehicles[i].relationships?.route.data.id === "Shuttle-Generic-Orange"
      ) {
        transitType = "orange";
      }

      if (vehicles[i].links.self.includes("/vehicles/1")) {
        transitType = "purple";
      }

      if (transitType === undefined) {
        continue;
      }

      camera = new THREE.PerspectiveCamera();
      compassBearing = vehicles[i].attributes.bearing;
      id = vehicles[i].id;
      lat = vehicles[i].attributes.latitude;
      lng = vehicles[i].attributes.longitude;
      scene = await addScene();

      newVehicle = new VehicleMarker(
        camera,
        compassBearing,
        id,
        lat,
        lng,
        scene,
        transitType
      );

      vehicleMarkersArray.push(newVehicle);
    }
    return vehicleMarkersArray;
  } catch (error) {
    console.log(`resetMarkers error: ${error}`);
  }
}

export function updateMarkersMethod(updatedVehicle, vehicles) {
  try {
    const updatedVehicleId = updatedVehicle
      .map((vehicle) => vehicle.id)
      .join(",");

    const vehiclesIndex = vehicles.findIndex(
      (vehicle) => vehicle.id === updatedVehicleId
    );

    if (vehiclesIndex === -1) {
      return vehicles;
    }

    let vehicleToUpdate = vehicles[vehiclesIndex];

    // Check if the vehicleToUpdate has an old matrix
    if (!vehicleToUpdate.oldMatrix) {
      // If it doesn't have an old matrix, create it and copy the current projection matrix
      vehicleToUpdate.oldCompassBearing = vehicleToUpdate.compassBearing
      vehicleToUpdate.oldMatrix = new THREE.Matrix4();
      vehicleToUpdate.oldMatrix.copy(vehicleToUpdate.camera.projectionMatrix);
    }


    vehicleToUpdate.lat = updatedVehicle.map(
      (vehicle) => vehicle.attributes.latitude
    )[0];

    vehicleToUpdate.lng = updatedVehicle.map(
      (vehicle) => vehicle.attributes.longitude
    )[0];

    vehicleToUpdate.compassBearing = updatedVehicle.map(
      (vehicle) => vehicle.attributes.bearing
    )[0];

    // vehicleToUpdate.scene.rotation.z =
    //   (vehicleToUpdate.compassBearing * Math.PI) / 180;

    return vehicles;
  } catch (error) {
    console.log(`updateMarkers error: ${error}`);
  }
}

export async function addMarkerMethod(addedVehicle, vehicles) {
  let camera;
  let compassBearing;
  let id;
  let lat;
  let lng;
  let scene;
  let transitType;

  try {
    for (let i = 0; i < addedVehicle.length; i++) {
      if (
        addedVehicle[i].relationships?.route.data.id === "Red" ||
        addedVehicle[i].relationships?.route.data.id === "Shuttle-Generic-Red"
      ) {
        transitType = "red";
      }

      if (
        addedVehicle[i].relationships?.route.data.id === "Green-B" ||
        addedVehicle[i].relationships?.route.data.id === "Green-C" ||
        addedVehicle[i].relationships?.route.data.id === "Green-D" ||
        addedVehicle[i].relationships?.route.data.id === "Green-E" ||
        addedVehicle[i].relationships?.route.data.id === "Shuttle-Generic-Green"
      ) {
        transitType = "green";
      }
      if (
        addedVehicle[i].relationships?.route.data.id === "Blue" ||
        addedVehicle[i].relationships?.route.data.id === "Shuttle-Generic-Blue"
      ) {
        transitType = "blue";
      }

      if (
        addedVehicle[i].relationships?.route.data.id === "Orange" ||
        addedVehicle[i].relationships?.route.data.id ===
          "Shuttle-Generic-Orange"
      ) {
        transitType = "orange";
      }

      if (addedVehicle[i].links?.self.includes("/addedVehicle/1")) {
        transitType = "purple";
      }

      if (transitType === undefined) {
        return vehicles;
      }

      camera = new THREE.PerspectiveCamera();
      compassBearing = addedVehicle[i].attributes.bearing;
      id = addedVehicle[i].id;
      lat = addedVehicle[i].attributes.latitude;
      lng = addedVehicle[i].attributes.longitude;
      scene = await addScene();

      let newVehicle = new VehicleMarker(
        camera,
        compassBearing,
        id,
        lat,
        lng,
        scene,
        transitType
      );

      await loadScene(newVehicle);
      vehicles.push(newVehicle);
    }
    return vehicles;
  } catch (error) {
    console.log(`addMarker error: ${error}`);
  }
}

export async function removeMarkerMethod(removedVehicle, vehicles) {
  try {
    const removedVehicleId = removedVehicle
      .map((vehicle) => vehicle.id)
      .join(",");

    const vehiclesIndex = vehicles.findIndex(
      (vehicle) => vehicle.id === removedVehicleId
    );

    if (vehiclesIndex === -1) {
      return vehicles;
    }

    vehicles.splice(vehiclesIndex, 1);

    return vehicles;
  } catch (error) {
    console.log(`removeMarker error: ${error}`);
  }
}
