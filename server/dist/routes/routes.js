"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const GetAllSubwayCarCoordinates_1 = require("../controllers/GetAllSubwayCarCoordinates");
const router = (0, express_1.Router)();
router.get('/', GetAllSubwayCarCoordinates_1.GetAllSubwayCarCoordinates);
exports.default = router;
