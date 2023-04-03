"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPlanets = exports.loadPlanetsData = void 0;
const csv_parse_1 = require("csv-parse");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const habitablePlanets = [];
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
            .on('data', (data) => {
            if (isHabitablePlanet(data)) {
                habitablePlanets.push(data);
            }
        })
            .on('error', (err) => {
            console.error(err);
            reject(err);
        })
            .on('end', () => {
            resolve();
        });
    });
}
exports.loadPlanetsData = loadPlanetsData;
function getAllPlanets() {
    return habitablePlanets;
}
exports.getAllPlanets = getAllPlanets;
