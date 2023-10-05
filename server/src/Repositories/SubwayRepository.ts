const EventSource = require("eventsource");
const { MBTA_API_KEY } = require("../config");

// TODO: Implement connection pooling. Need to resetMaxEventListenters per event.

export async function getAllVehiclesEventSource(): Promise<EventSource> {
  let vehiclesEventSource = `https://api-v3.mbta.com/vehicles?api_key=${MBTA_API_KEY}`;

  const serverSentEvent = await new EventSource(vehiclesEventSource.toString());

  return serverSentEvent;
}