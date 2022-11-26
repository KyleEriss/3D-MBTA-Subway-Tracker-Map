"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const { PORT, MBTA_API_KEY } = require("./config");
const cors = require("cors");
const app = (0, express_1.default)();
const https = require("https");
app.use(cors());
const EventSource = require("eventsource");
// let vehiclesEventSource = `https://api-v3.mbta.com/vehicles?api_key=${MBTA_API_KEY}`;
// const sse = new EventSource(vehiclesEventSource.toString());
// sse.onerror = function (error: any) {
//   console.log("sse failed:", error);
// };
// sse.onopen = function () {
//   console.log("Connected to server");
// };
// sse.onmessage = function (message: any) {
//   console.log("recevied sse message:", message);
// };
let vehiclesEventSource = `https://api-v3.mbta.com/vehicles?api_key=${MBTA_API_KEY}`;
app.get("/", (req, res) => res.send("hello!"));
app.get("/stream", async (req, res) => {
    const sse = await new EventSource(vehiclesEventSource.toString());
    sse.onerror = function (error) {
        console.log("sse failed:", error);
    };
    sse.onopen = function () {
        console.log("Connected to server");
    };
    sse.onmessage = function (message) {
        console.log("recevied sse message:", message);
    };
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Access-Control-Allow-Origin", "*");
    // res.write("data: " + `${vehicleData}\n\n`);
    // req.pipe(request.get(vehiclesEventSource)).pipe(res);
    sse.addEventListener("reset", (event) => {
        console.log("reset sending");
        let data = JSON.parse(event.data);
        res.write("event: reset\n");
        res.write("data: " + `${JSON.stringify(data)}\n\n`);
        console.log("reset sent");
    });
    setTimeout(() => {
        sse.addEventListener("update", (event) => {
            let data = JSON.parse(event.data);
            res.write("event: update\n");
            res.write("data: " + `${JSON.stringify(data)}\n\n`);
        });
        sse.addEventListener("add", (event) => {
            let data = JSON.parse(event.data);
            res.write("event: add\n");
            res.write("data: " + `${JSON.stringify(data)}\n\n`);
        });
        sse.addEventListener("remove", (event) => {
            let data = JSON.parse(event.data);
            res.write("event: remove\n");
            res.write("data: " + `${JSON.stringify(data)}\n\n`);
        });
    }, 2000);
});
app.listen(PORT);
// app.get("/sse", (req: Request, res: Response) => {
//   res.set("Content-Type", "text/event-stream");
//   res.set("Connection", "keep-alive");
//   res.set("Cache-Control", "no-cache");
//   res.set("Access-Control-Allow-Origin", "*");
//   console.log("client connected to sse");
//   let vehiclesEventSource = new EventSource(
//     `https://api-v3.mbta.com/vehicles?api_key=${process.env.MBTA_API_KEY}`
//   );
//   // setInterval(function() {
//   //   res.status(200).write(`data: ${JSON.stringify(vehiclesEventSource)}\n\n`);
//   // })
// app.use(json());
// app.use(cors());
// app.use("/subway", routes);
// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//   res.status(500).json({ message: err.message });
// });
// app.listen(8000);
// app.get("/subscribe", (req, res) => {
//   console.log(`Subscribed to event server`)
//   res.status(200).json({"message":`subscribed to event server`})
// })
// app.get("/sse", (req: Request, res: Response) => {
//   res.set("Content-Type", "text/event-stream");
//   res.set("Connection", "keep-alive");
//   res.set("Cache-Control", "no-cache");
//   res.set("Access-Control-Allow-Origin", "*");
//   console.log("client connected to sse");
//   let vehiclesEventSource = new EventSource(
//     `https://api-v3.mbta.com/vehicles?api_key=${process.env.MBTA_API_KEY}`
//   );
//   // setInterval(function() {
//   //   res.status(200).write(`data: ${JSON.stringify(vehiclesEventSource)}\n\n`);
//   // })
// });
// eventsource test - doesn't work
// const events = require('events');
// let vehiclesEventSource = new EventSource(
//   `https://api-v3.mbta.com/vehicles?api_key=${process.env.MBTA_API_KEY}`
// );
// const fetchTarget = async () => {
//   const target = await fetch(vehiclesEventSource, {
//     method: "GET",
//   });
// }
// fetchTarget();
// const target = new EventSource(vehiclesEventSource);
// http.request((vehiclesEventSource: any, res: { headers: { location: any } }) => {
//   //   if(resp.statusCode == 302) {
//   //     vehiclesEventSource = resp.headers.location;
//   //   }
//   vehiclesEventSource = res.headers.location;
// });
// vehiclesEventSource.onmessage = console.log
//const vehicleData = https.request(vehiclesEventSource, (response: any) => {
// 	// array to hold all chunks
// 	let all_chunks: any[] = [];
//   console.log(all_chunks);
// 	// gather chunks
// 	response.on('data', (chunk: any) => {
// 		all_chunks.push(chunk);
// 	});
// 	// no more data to come
// 	// combine all chunks to a buffer
// 	response.on('end', () => {
// 		let response_body = Buffer.concat(all_chunks);
// 		// response body as string
// 		console.log(response_body.toString());
// 		// read the response body now
// 	});
// 	// handle error while getting response
// 	response.on('error', (error: any) => {
// 		console.log(error.message);
// 	});
// });
// const vehicleData = https.get({
//   agent: false,
//   hostname: vehiclesEventSource,
// }, (res: any) => {
//   res.on('data', (data: any) => {
//     return data.toString()
//   })
// })
