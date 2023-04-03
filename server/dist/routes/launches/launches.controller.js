"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpAbortLaunch = exports.httpAddNewLaunch = exports.httpGetAllLaunches = void 0;
const launches_model_1 = require("../../models/launches.model");
function httpGetAllLaunches(_req, res) {
    return res.status(200).json((0, launches_model_1.getAllLaunches)());
}
exports.httpGetAllLaunches = httpGetAllLaunches;
function httpAddNewLaunch(req, res) {
    const launch = req.body;
    launch.launchDate = new Date(launch.launchDate);
    if (isNaN(launch.launchDate) ||
        !launch.mission ||
        !launch.rocket ||
        !launch.target) {
        return res.status(400).json({ error: 'Invalid data' });
    }
    const savedLaunch = (0, launches_model_1.addNewLaunch)(launch);
    return res.status(201).json(savedLaunch);
}
exports.httpAddNewLaunch = httpAddNewLaunch;
function httpAbortLaunch(req, res) {
    const { id } = req.body;
    const flight = (0, launches_model_1.abortLaunch)(id);
    if (flight) {
        res.status(200).json(flight);
    }
    else {
        return res.status(400).json({ error: 'Launch not found' });
    }
}
exports.httpAbortLaunch = httpAbortLaunch;
