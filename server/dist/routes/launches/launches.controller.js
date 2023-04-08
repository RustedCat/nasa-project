"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpAbortLaunch = exports.httpAddNewLaunch = exports.httpGetAllLaunches = void 0;
const launches_model_1 = require("../../models/launches.model");
const query_service_1 = require("../../services/query.service");
async function httpGetAllLaunches(req, res) {
    const { skip, limit } = (0, query_service_1.getPagination)(req.query);
    const launches = await (0, launches_model_1.getAllLaunches)(skip, limit);
    return res.status(200).json(launches);
}
exports.httpGetAllLaunches = httpGetAllLaunches;
async function httpAddNewLaunch(req, res) {
    const launch = req.body;
    if (!launch.launchDate ||
        !launch.mission ||
        !launch.rocket ||
        !launch.target) {
        return res.status(400).json({ error: 'Missing required launch property' });
    }
    launch.launchDate = new Date(launch.launchDate);
    if (isNaN(launch.launchDate)) {
        return res.status(400).json({ error: 'Invalid launch date' });
    }
    try {
        await (0, launches_model_1.scheduleNewLaunch)(launch);
        Object.assign(launch, { target: launch.target.keplerName });
        return res.status(201).json(launch);
    }
    catch (err) {
        return res
            .status(500)
            .json({ error: `Error on scheduling new launch: ${err}` });
    }
}
exports.httpAddNewLaunch = httpAddNewLaunch;
async function httpAbortLaunch(req, res) {
    const { id } = req.params;
    try {
        if (!(await (0, launches_model_1.launchExist)(+id))) {
            return res.status(400).json({ error: 'Launch not found' });
        }
        const aborted = await (0, launches_model_1.abortLaunch)(+id);
        if (aborted) {
            return res.status(200).json({ ok: true });
        }
        else {
            return res.status(500).json({ error: 'Launch not aborted' });
        }
    }
    catch (err) {
        return res.status(500).json({ error: `Internal server error: ${err}` });
    }
}
exports.httpAbortLaunch = httpAbortLaunch;
