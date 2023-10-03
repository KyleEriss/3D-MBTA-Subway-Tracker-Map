const EventSource = require("eventsource");
const { MBTA_API_KEY } = require("../config");

// Define a type for the connection pool
type EventSourcePool = {
  [key: string]: EventSource;
};

// Create a connection pool
const eventSourcePool: EventSourcePool = {};

export async function getAllVehiclesEventSource(): Promise<EventSource> {
  let vehiclesEventSource = `https://api-v3.mbta.com/vehicles?api_key=${MBTA_API_KEY}`;

  // const serverSentEvent = await new EventSource(vehiclesEventSource.toString());

  // return serverSentEvent;

  if (!eventSourcePool[vehiclesEventSource]) {
    // If the connection doesn't exist, create a new one
    eventSourcePool[vehiclesEventSource] = new EventSource(
      vehiclesEventSource.toString()
    );
  }

  return eventSourcePool[vehiclesEventSource];
}