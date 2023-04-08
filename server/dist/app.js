"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const node_path_1 = __importDefault(require("node:path"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const api_1 = require("./routes/api");
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)({
    origin: ['http://localhost:3000'],
}));
// -- middleware
// logging
exports.app.use((0, morgan_1.default)('combined'));
// parse json body
exports.app.use(express_1.default.json());
// serve static files
exports.app.use(express_1.default.static(node_path_1.default.join(__dirname, '..', 'public')));
exports.app.use('/v1', api_1.api);
exports.app.get('/*', (_, res) => {
    res.sendFile(node_path_1.default.join(__dirname, '..', 'public', 'index.html'));
});
