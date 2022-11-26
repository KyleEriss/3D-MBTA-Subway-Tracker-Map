"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllVehiclesEventSource = void 0;
const EventSource = require('eventsource');
async function getAllVehiclesEventSource() {
    let vehiclesEventSource = new EventSource(`https://api-v3.mbta.com/vehicles?api_key=${process.env.MBTA_API_KEY}`);
    return vehiclesEventSource;
}
exports.getAllVehiclesEventSource = getAllVehiclesEventSource;
// const response = await fetch(
//   `https://api-v3.mbta.com/vehicles?api_key=${process.env.MBTA_API_KEY}`
// )
//   .then((response) => response.json())
//   .then((data) => data.data);
// if (Array.isArray(response)) {
//   const subways: SubwayCars = response.map((subway) => ({
//     bearing: subway.attributes.bearing,
//     id: subway.id,
//     latitude: subway.attributes.latitude,
//     longitude: subway.attributes.longitude,
//   }));
//   return subways;
// }
// return;
