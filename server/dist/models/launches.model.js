"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.abortLaunch = exports.addNewLaunch = exports.getAllLaunches = exports.launchExist = void 0;
let latestFlightNumber = 100;
const launches = new Map();
const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'),
    target: 'Kepler-442 b',
    customer: ['NOAA', 'NASA'],
    upcoming: true,
    success: true,
};
launches.set(launch.flightNumber, launch);
function launchExist(id) {
    return launches.has(id);
}
exports.launchExist = launchExist;
function getAllLaunches() {
    return Array.from(launches.values());
}
exports.getAllLaunches = getAllLaunches;
function addNewLaunch(launch) {
    latestFlightNumber++;
    launches.set(latestFlightNumber, Object.assign(launch, {
        flightNumber: latestFlightNumber,
        success: true,
        upcoming: true,
        customers: ['NOAA', 'NASA'],
    }));
    return launches.get(latestFlightNumber);
}
exports.addNewLaunch = addNewLaunch;
function abortLaunch(flightNumber) {
    console.log(flightNumber);
    const aborted = launches.get(flightNumber);
    aborted.upcoming = false;
    aborted.success = false;
    return aborted;
}
exports.abortLaunch = abortLaunch;
