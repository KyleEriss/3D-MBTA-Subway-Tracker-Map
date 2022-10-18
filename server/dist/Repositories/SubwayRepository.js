"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function getAllSubwayCars() {
    const response = await fetch("https://api-v3.mbta.com/vehicles?api_key=83a6a62eca054340b3c58d7c8bfe5e2c")
        .then((response) => response.json())
        .then((data) => data.data);
    if (Array.isArray(response)) {
        const subways = response.map((subway) => ({
            bearing: subway.attributes.bearing,
            id: subway.id,
            latitude: subway.attributes.latitude,
            longitude: subway.attributes.longitude,
        }));
        return subways;
    }
    return;
}
exports.default = getAllSubwayCars;
