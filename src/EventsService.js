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

      
      //PARK STREET
      if (
        vehicles[i].relationships?.stop?.data?.id === "70075" ||
        vehicles[i].relationships?.stop?.data?.id === "70076" ||
        vehicles[i].relationships?.stop?.data?.id === "70196" ||
        vehicles[i].relationships?.stop?.data?.id === "70197" ||
        vehicles[i].relationships?.stop?.data?.id === "70198" ||
        vehicles[i].relationships?.stop?.data?.id === "70199" ||
        vehicles[i].relationships?.stop?.data?.id === "70200" ||
        vehicles[i].relationships?.stop?.data?.id === "71199" &&
        vehicles[i].attributes.current_status === "STOPPED_AT"
      ) {
        compassBearing = 45;
      }

      //BLOYSTON
      if (
        vehicles[i].relationships?.stop?.data?.id === "70158" ||
        vehicles[i].relationships?.stop?.data?.id === "70159" &&
        vehicles[i].attributes.current_status === "STOPPED_AT"
      ) {
        compassBearing = 90;
      }

      //GOVERNMENT CENTER
      if (
        vehicles[i].relationships?.stop?.data?.id === "70039" ||
        vehicles[i].relationships?.stop?.data?.id === "70040" ||
        vehicles[i].relationships?.stop?.data?.id === "70201" ||
        vehicles[i].relationships?.stop?.data?.id === "70202" &&
        vehicles[i].attributes.current_status === "STOPPED_AT"
      ) {
        compassBearing = 315;
      }
      else {
        compassBearing = vehicles[i].attributes.bearing;
      }

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
    const parkStreetStation = [
      "70075",
      "70076",
      "70196",
      "70197",
      "70198",
      "70199",
      "70200",
      "71199",
    ];
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
      vehicleToUpdate.oldCompassBearing = vehicleToUpdate.compassBearing;
      vehicleToUpdate.oldMatrix = new THREE.Matrix4();
      vehicleToUpdate.oldMatrix.copy(vehicleToUpdate.camera.projectionMatrix);
    }

    vehicleToUpdate.lat = updatedVehicle.map(
      (vehicle) => vehicle.attributes.latitude
    )[0];

    vehicleToUpdate.lng = updatedVehicle.map(
      (vehicle) => vehicle.attributes.longitude
    )[0];
  
    //PARK STREET
    if (
      updatedVehicle[0].relationships?.stop?.data?.id === "70075" ||
      updatedVehicle[0].relationships?.stop?.data?.id === "70076" ||
      updatedVehicle[0].relationships?.stop?.data?.id === "70196" ||
      updatedVehicle[0].relationships?.stop?.data?.id === "70197" ||
      updatedVehicle[0].relationships?.stop?.data?.id === "70198" ||
      updatedVehicle[0].relationships?.stop?.data?.id === "70199" ||
      updatedVehicle[0].relationships?.stop?.data?.id === "70200" ||
      updatedVehicle[0].relationships?.stop?.data?.id === "71199" &&
      updatedVehicle[0].attributes.current_status === "STOPPED_AT"
    ) {
      vehicleToUpdate.compassBearing = 45;
    }

    //BOYLSTON
    if (
      updatedVehicle[0].relationships?.stop?.data?.id === "70158" ||
      updatedVehicle[0].relationships?.stop?.data?.id === "70159" &&
      updatedVehicle[0].attributes.current_status === "STOPPED_AT"
    ) {
      vehicleToUpdate.compassBearing = 90;
    }

    //GOVERNMENT CENTER
    if (
      updatedVehicle[0].relationships?.stop?.data?.id === "70039" ||
      updatedVehicle[0].relationships?.stop?.data?.id === "70040" ||
      updatedVehicle[0].relationships?.stop?.data?.id === "70201" ||
      updatedVehicle[0].relationships?.stop?.data?.id === "70202" &&
      updatedVehicle[0].attributes.current_status === "STOPPED_AT"
    ) {
      vehicleToUpdate.compassBearing = 315;
    }
    
    
    else {
      vehicleToUpdate.compassBearing = updatedVehicle.map(
        (vehicle) => vehicle.attributes.bearing
      )[0];
    }

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
