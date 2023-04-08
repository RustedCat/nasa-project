"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const PORT = +(process.env.PORT || 8000);
const node_http_1 = __importDefault(require("node:http"));
const app_1 = require("./app");
const mongo_service_1 = require("./services/mongo.service");
const launches_model_1 = require("./models/launches.model");
const server = node_http_1.default.createServer(app_1.app);
(async function () {
    await (0, mongo_service_1.mongoConnect)();
    await (0, launches_model_1.loadLaunchData)();
    server.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
})();
