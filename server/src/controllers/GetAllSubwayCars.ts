import { RequestHandler } from "express";
import { getAllVehiclesEventSource } from "../Repositories/SubwayRepository";

export const GetAllSubwayCars: RequestHandler = async (req, res, next) => {
  const serverSentEvent: EventSource = await getAllVehiclesEventSource();

  serverSentEvent.onerror = function (error: any) {
    console.log("serverSentEvent failed:", error);
  };
  serverSentEvent.onopen = function () {
    console.log("Connected to server");
  };

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Access-Control-Allow-Origin", "*");

  serverSentEvent.addEventListener("reset", async (event: any) => {
    let data = JSON.parse(event.data);
    res.write("event: reset\n");
    res.write("data: " + `${JSON.stringify(data)}\n\n`);
  });

  serverSentEvent.addEventListener("update", (event: any) => {
    let data = JSON.parse(event.data);
    res.write("event: update\n");
    res.write("data: " + `${JSON.stringify(data)}\n\n`);
  });
  serverSentEvent.addEventListener("add", (event: any) => {
    let data = JSON.parse(event.data);
    res.write("event: add\n");
    res.write("data: " + `${JSON.stringify(data)}\n\n`);
  });
  serverSentEvent.addEventListener("remove", (event: any) => {
    let data = JSON.parse(event.data);
    res.write("event: remove\n");
    res.write("data: " + `${JSON.stringify(data)}\n\n`);
  });

  // Close the SSE connection after 5 min
  setTimeout(() => {
    serverSentEvent.close();
  }, 120000);
};
