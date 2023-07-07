require("dotenv").config();
import express from "express";
const { PORT } = require("./config");
const cors = require("cors");
import routes from "./routes/routes";

const app = express();

app.use(
  cors({
    origin: "https://kyleeriss.github.io",
  })
);

app.use("/subway", routes);

app.listen(PORT);
