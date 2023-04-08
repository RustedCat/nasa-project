"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.abortLaunch = exports.scheduleNewLaunch = exports.getAllLaunches = exports.launchExist = exports.loadLaunchData = void 0;
const axios_1 = __importDefault(require("axios"));
const launches_mongo_1 = require("./launches.mongo");
const planets_mongo_1 = require("./planets.mongo");
const DEFAULT_FLIGHT_NUMBER = 99;
const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';
async function populateLaunches() {
    const response = await axios_1.default.post(SPACEX_API_URL, {
        query: {},
        options: {
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1,
                    },
                },
                {
                    path: 'payloads',
                    select: {
                        customers: 1,
                    },
                },
            ],
            pagination: false,
        },
    });
    if (response.status !== 200) {
        console.error('Error downloading launch data');
        throw new Error('Launch data download failed');
    }
    const launchDocs = response.data.docs;
    for (const launchDoc of launchDocs) {
        const payloads = launchDoc.payloads;
        const customers = payloads.flatMap((payload) => payload.customers);
        const launch = {
            flightNumber: launchDoc.flight_number,
            mission: launchDoc.name,
            rocket: launchDoc.rocket.name,
            launchDate: launchDoc.date_local,
            upcoming: launchDoc.upcoming,
            success: launchDoc.success,
            customers,
        };
        console.log(`${launch.flightNumber} - ${launch.mission}`);
        saveLaunch(launch);
    }
}
async function loadLaunchData() {
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat',
    });
    if (!firstLaunch) {
        await populateLaunches();
    }
}
exports.loadLaunchData = loadLaunchData;
async function findLaunch(filter, options = {}) {
    return await launches_mongo_1.Launch.findOne(filter, options);
}
async function launchExist(flightNumber) {
    return await findLaunch({ flightNumber }, { _id: 0, __v: 0 });
}
exports.launchExist = launchExist;
async function getLatestFlightNumber() {
    try {
        const leastLaunch = await launches_mongo_1.Launch.findOne({}).sort('-flightNumber');
        return leastLaunch ? leastLaunch.flightNumber : DEFAULT_FLIGHT_NUMBER;
    }
    catch (error) {
        return DEFAULT_FLIGHT_NUMBER;
    }
}
async function getAllLaunches(skip, limit) {
    return await launches_mongo_1.Launch.find({}, { _id: 0, __v: 0 })
        .populate({
        path: 'target',
        select: 'keplerName -_id',
    })
        .sort({ flightNumber: 1 })
        .skip(skip)
        .limit(limit);
}
exports.getAllLaunches = getAllLaunches;
async function scheduleNewLaunch(launch) {
    const target = await planets_mongo_1.Planet.findOne({ keplerName: launch.target });
    if (!target) {
        throw new Error('No matching planet not found');
    }
    const newFlightNumber = (await getLatestFlightNumber()) + 1;
    const newLaunch = Object.assign(launch, {
        flightNumber: newFlightNumber,
        success: true,
        upcoming: true,
        target,
        customers: ['NASA', 'NOAA'],
    });
    await saveLaunch(newLaunch);
}
exports.scheduleNewLaunch = scheduleNewLaunch;
async function saveLaunch(launch) {
    await launches_mongo_1.Launch.findOneAndUpdate({ flightNumber: launch.flightNumber }, launch, {
        upsert: true,
    });
}
async function abortLaunch(flightNumber) {
    try {
        const aborted = await launches_mongo_1.Launch.updateOne({ flightNumber }, {
            aborted: true,
            upcoming: false,
            success: false,
        });
        return aborted.modifiedCount === 1;
    }
    catch (err) {
        throw new Error(`Error on aborting the mission: ${err}`);
    }
}
exports.abortLaunch = abortLaunch;
