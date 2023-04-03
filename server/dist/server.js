"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PORT = +(process.env.PORT || 8000);
const node_http_1 = __importDefault(require("node:http"));
const app_1 = require("./app");
const planets_model_1 = require("./models/planets.model");
const server = node_http_1.default.createServer(app_1.app);
(async function () {
    await (0, planets_model_1.loadPlanetsData)();
    server.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
})();
