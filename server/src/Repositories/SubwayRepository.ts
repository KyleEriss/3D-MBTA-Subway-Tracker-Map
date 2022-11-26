import SubwayCars from "../models/SubwaysCars";
import MbtaData from "../models/MbtaData";


const EventSource = require('eventsource');

export async function getAllVehiclesEventSource(): Promise<EventSource | null> {
  let vehiclesEventSource = new EventSource(
    `https://api-v3.mbta.com/vehicles?api_key=${process.env.MBTA_API_KEY}`
  );

  return vehiclesEventSource;
}