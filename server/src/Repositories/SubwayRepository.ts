const EventSource = require("eventsource");
const { MBTA_API_KEY } = require("../config");

export async function getAllVehiclesEventSource(): Promise<EventSource> {
  let vehiclesEventSource = `https://api-v3.mbta.com/vehicles?api_key=${MBTA_API_KEY}`;

  const serverSentEvent = await new EventSource(vehiclesEventSource.toString());

  return serverSentEvent;
}
