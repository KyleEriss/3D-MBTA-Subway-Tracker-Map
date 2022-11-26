"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllSubwayCarCoordinates = void 0;
const SubwayRepository_1 = require("../Repositories/SubwayRepository");
const GetAllSubwayCarCoordinates = async (req, res, next) => {
    const subwayCars = await (0, SubwayRepository_1.getAllVehiclesEventSource)();
    console.log(subwayCars);
    let data;
    subwayCars === null || subwayCars === void 0 ? void 0 : subwayCars.addEventListener("reset", (event) => {
        data = JSON.parse(event.data);
        res.json({ subwayCars });
    });
    // res.json({ subwayCars });
};
exports.GetAllSubwayCarCoordinates = GetAllSubwayCarCoordinates;
