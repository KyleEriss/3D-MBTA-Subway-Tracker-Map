require("dotenv").config();
import express, { Request, Response, NextFunction, request } from "express";
import { json } from "body-parser";
const { PORT, MBTA_API_KEY } = require("./config");
const cors = require("cors");
import routes from "./routes/routes";
const app = express();
const https = require("https");

app.use(cors());

//TODO refactor proxy stream

const EventSource = require("eventsource");

let vehiclesEventSource = `https://api-v3.mbta.com/vehicles?api_key=${MBTA_API_KEY}`;

app.get("/", (req, res) => res.send("hello!"));

app.get("/stream", async (req: any, res) => {
  const sse = await new EventSource(vehiclesEventSource.toString());
  
  sse.onerror = function (error: any) {
    console.log("sse failed:", error);
  };
  sse.onopen = function () {
    console.log("Connected to server");
  };
  sse.onmessage = function (message: any) {
    console.log("recevied sse message:", message);
  };

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Access-Control-Allow-Origin", "*");

  sse.addEventListener("reset", (event: any) => {
    console.log("reset sending");
    let data = JSON.parse(event.data);
    res.write("event: reset\n");
    res.write("data: " + `${JSON.stringify(data)}\n\n`);
    console.log("reset sent");
  });

  setTimeout(() => {
    sse.addEventListener("update", (event: any) => {
      let data = JSON.parse(event.data);
      res.write("event: update\n");
      res.write("data: " + `${JSON.stringify(data)}\n\n`);
    });
    sse.addEventListener("add", (event: any) => {
      let data = JSON.parse(event.data);
      res.write("event: add\n");
      res.write("data: " + `${JSON.stringify(data)}\n\n`);
    });
    sse.addEventListener("remove", (event: any) => {
      let data = JSON.parse(event.data);
      res.write("event: remove\n");
      res.write("data: " + `${JSON.stringify(data)}\n\n`);
    });
  }, 2000);
});

app.listen(PORT);