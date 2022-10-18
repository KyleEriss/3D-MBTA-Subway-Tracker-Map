"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllSubwayCarCoordinates = void 0;
const SubwayRepository_1 = __importDefault(require("../Repositories/SubwayRepository"));
const GetAllSubwayCarCoordinates = async (req, res, next) => {
    const subwayCars = await (0, SubwayRepository_1.default)();
    res.json({ subwayCars });
};
exports.GetAllSubwayCarCoordinates = GetAllSubwayCarCoordinates;
