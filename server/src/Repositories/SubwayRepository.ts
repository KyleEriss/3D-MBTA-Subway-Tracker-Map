import SubwayCars from "../models/SubwaysCars";
import MbtaData from "../models/MbtaData";

export default async function getAllSubwayCars(): Promise<SubwayCars | void> {
  const response = await fetch(
    `https://api-v3.mbta.com/vehicles?api_key=${process.env.MBTA_API_KEY}`
  )
    .then((response) => response.json())
    .then((data) => data.data);

  if (Array.isArray(response)) {
    const subways: SubwayCars = response.map((subway) => ({
      bearing: subway.attributes.bearing,
      id: subway.id,
      latitude: subway.attributes.latitude,
      longitude: subway.attributes.longitude,
    }));

    return subways;
  }

  return;
}
