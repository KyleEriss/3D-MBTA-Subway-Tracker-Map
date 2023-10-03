"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllVehiclesEventSource = void 0;
const EventSource = require("eventsource");
const { MBTA_API_KEY } = require("../config");
// Create a connection pool
const eventSourcePool = {};
async function getAllVehiclesEventSource() {
    let vehiclesEventSource = `https://api-v3.mbta.com/vehicles?api_key=${MBTA_API_KEY}`;
    if (!eventSourcePool[vehiclesEventSource]) {
        // If the connection doesn't exist, create a new one
        eventSourcePool[vehiclesEventSource] = new EventSource(vehiclesEventSource.toString());
    }
    return eventSourcePool[vehiclesEventSource];
}
exports.getAllVehiclesEventSource = getAllVehiclesEventSource;
//# sourceMappingURL=SubwayRepository.js.map