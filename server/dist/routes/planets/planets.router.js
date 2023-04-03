"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const planets_controller_1 = require("./planets.controller");
const planetsRouter = (0, express_1.Router)();
planetsRouter.get('/', planets_controller_1.httpGetAllPlanets);
exports.default = planetsRouter;
