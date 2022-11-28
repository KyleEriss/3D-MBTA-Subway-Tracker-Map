"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const GetAllSubwayCars_1 = require("../controllers/GetAllSubwayCars");
const router = (0, express_1.Router)();
router.get('/', GetAllSubwayCars_1.GetAllSubwayCars);
exports.default = router;
//# sourceMappingURL=routes.js.map