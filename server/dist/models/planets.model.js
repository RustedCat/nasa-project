"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPlanets = exports.loadPlanetsData = void 0;
const csv_parse_1 = require("csv-parse");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const planets_mongo_1 = require("./planets.mongo");
function isHabitablePlanet(planet) {
    return (planet['koi_disposition'] === 'CONFIRMED' &&
        planet['koi_insol'] > 0.36 &&
        planet['koi_insol'] < 1.11 &&
        planet['koi_prad'] < 1.6);
}
async function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        (0, fs_1.createReadStream)(path_1.default.join(__dirname, '..', '..', 'data', 'kepler_data.csv'), {
            encoding: 'utf-8',
        })
            .pipe((0, csv_parse_1.parse)({
            comment: '#',
            columns: true,
        }))
            .on('data', async (data) => {
            savePlanet(data);
        })
            .on('error', (err) => {
            console.error(err);
            reject(err);
        })
            .on('end', async () => {
            console.log(`${(await planets_mongo_1.Planet.find({})).length} Habitable found!`);
            resolve();
        });
    });
}
exports.loadPlanetsData = loadPlanetsData;
async function savePlanet(planet) {
    try {
        if (isHabitablePlanet(planet)) {
            const update = { keplerName: planet.kepler_name };
            await planets_mongo_1.Planet.findOneAndUpdate(update, update, { upsert: true });
        }
    }
    catch (err) {
        console.error(`Could not save the planet ${err}`);
    }
}
async function getAllPlanets() {
    return await planets_mongo_1.Planet.find({}, { _id: 0, __v: 0 });
}
exports.getAllPlanets = getAllPlanets;
