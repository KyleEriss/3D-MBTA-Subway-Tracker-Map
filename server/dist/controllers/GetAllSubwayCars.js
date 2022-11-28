"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllSubwayCars = void 0;
const SubwayRepository_1 = require("../Repositories/SubwayRepository");
const GetAllSubwayCars = async (req, res, next) => {
    const serverSentEvent = await (0, SubwayRepository_1.getAllVehiclesEventSource)();
    serverSentEvent.onerror = function (error) {
        console.log("serverSentEvent failed:", error);
    };
    serverSentEvent.onopen = function () {
        console.log("Connected to server");
    };
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Access-Control-Allow-Origin", "*");
    serverSentEvent.addEventListener("reset", async (event) => {
        let data = JSON.parse(event.data);
        res.write("event: reset\n");
        res.write("data: " + `${JSON.stringify(data)}\n\n`);
    });
    setTimeout(() => {
        serverSentEvent.addEventListener("update", (event) => {
            let data = JSON.parse(event.data);
            res.write("event: update\n");
            res.write("data: " + `${JSON.stringify(data)}\n\n`);
        });
        serverSentEvent.addEventListener("add", (event) => {
            let data = JSON.parse(event.data);
            res.write("event: add\n");
            res.write("data: " + `${JSON.stringify(data)}\n\n`);
        });
        serverSentEvent.addEventListener("remove", (event) => {
            let data = JSON.parse(event.data);
            res.write("event: remove\n");
            res.write("data: " + `${JSON.stringify(data)}\n\n`);
        });
    }, 2000);
};
exports.GetAllSubwayCars = GetAllSubwayCars;
//# sourceMappingURL=GetAllSubwayCars.js.map