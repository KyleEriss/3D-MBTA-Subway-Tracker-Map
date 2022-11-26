import * as THREE from "three";
import TransitType from "./TransitType";

class VehicleMarker {
  camera;
  compassBearing;
  id;
  lat;
  lng;
  scene;
  transitType;

  constructor(camera, compassBearing, id, lat, lng, scene, transitType) {
    this.camera = camera;
    this.compassBearing = compassBearing;
    this.id = id;
    this.lat = lat;
    this.lng = lng;
    this.scene = scene;
    this.transitType = transitType;
  }

  get camera() {
    return this.camera;
  }

  get compassBearing() {
    return this.compassBearing;
  }

  get id() {
    return this.id;
  }

  get isRed() {
    return this.transitType === "red";
  }

  get isGreen() {
    return this.transitType === "green";
  }

  get isBlue() {
    return this.transitType === "blue";
  }

  get isOrange() {
    return this.transitType === "orange";
  }

  get isPurple() {
    return this.transitType === "purple";
  }

  get lat() {
    return this.lat;
  }

  get lng() {
    return this.lng;
  }

  get scene() {
    return this.scene;
  }

  get transitType() {
    return this.transitType;
  }

  set camera(newCamera) {
    return (this.camera = newCamera);
  }

  set compassBearing(newCompassBearing) {
    return (this.compassBearing = newCompassBearing);
  }

  set id(newId) {
    this.id = newId;
  }

  set lat(newLat) {
    this.lat = newLat;
  }

  set lng(newLng) {
    this.lng = newLng;
  }

  set scene(newScene) {
    this.scene = newScene;
  }

  set transitType(newTransitType) {
    this.transitType = newTransitType;
  }
}

export default VehicleMarker;
