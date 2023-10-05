"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllVehiclesEventSource = void 0;
const EventSource = require("eventsource");
const { MBTA_API_KEY } = require("../config");
// TODO: Implement connection pooling. Need to resetMaxEventListenters per event.
async function getAllVehiclesEventSource() {
    let vehiclesEventSource = `https://api-v3.mbta.com/vehicles?api_key=${MBTA_API_KEY}`;
    const serverSentEvent = await new EventSource(vehiclesEventSource.toString());
    return serverSentEvent;
}
exports.getAllVehiclesEventSource = getAllVehiclesEventSource;
//# sourceMappingURL=SubwayRepository.js.map