import { RequestHandler } from 'express';
import SubwayCars from '../models/SubwaysCars';
import { getAllVehiclesEventSource } from '../Repositories/SubwayRepository'

export const GetAllSubwayCarCoordinates: RequestHandler = async (req, res, next) => {
  const subwayCars: EventSource | null = await getAllVehiclesEventSource();

  console.log(subwayCars);

  let data;
  
  subwayCars?.addEventListener("reset", (event) => {
    data = JSON.parse(event.data);
    res.json({ subwayCars });
  });

  // res.json({ subwayCars });
};

