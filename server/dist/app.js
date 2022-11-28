"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const { PORT } = require("./config");
const cors = require("cors");
const routes_1 = __importDefault(require("./routes/routes"));
const app = (0, express_1.default)();
app.use(cors());
app.use('/subway', routes_1.default);
app.listen(PORT);
//# sourceMappingURL=app.js.map