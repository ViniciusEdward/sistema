"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const env_1 = require("./config/env");
const routes_1 = require("./routes");
const errorMiddleware_1 = require("./middlewares/errorMiddleware");
exports.app = (0, express_1.default)();
exports.app.set('trust proxy', 1);
exports.app.use((0, helmet_1.default)());
exports.app.use((0, cors_1.default)({
    origin: env_1.env.FRONTEND_URL,
    credentials: true,
}));
exports.app.use(express_1.default.json({ limit: '1mb' }));
exports.app.use((0, cookie_parser_1.default)());
exports.app.use((0, morgan_1.default)(env_1.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
exports.app.get('/health', (_req, res) => {
    res.json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
});
exports.app.use('/api', routes_1.routes);
exports.app.use(errorMiddleware_1.notFoundMiddleware);
exports.app.use(errorMiddleware_1.errorMiddleware);
