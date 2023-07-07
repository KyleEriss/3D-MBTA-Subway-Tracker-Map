require("dotenv").config();
import express from "express";
const { PORT } = require("./config");
const cors = require("cors");
import routes from "./routes/routes";

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://kyleeriss.github.io");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use("/subway", routes);

app.listen(PORT);
