require("dotenv").config();
import express from "express";
const { PORT } = require("./config");
const cors = require("cors");
import routes from "./routes/routes";
const app = express();

app.use(cors());

app.use('/subway', routes);

app.listen(PORT);