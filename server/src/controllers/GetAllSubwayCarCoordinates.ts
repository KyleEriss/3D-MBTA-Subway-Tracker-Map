import { RequestHandler } from 'express';
import SubwayCars from '../models/SubwaysCars';
import getAllSubwayCars from '../Repositories/SubwayRepository'


export const GetAllSubwayCarCoordinates: RequestHandler = async (req, res, next) => {
  const subwayCars: SubwayCars|void = await getAllSubwayCars();
  
  res.json({ subwayCars });
};
