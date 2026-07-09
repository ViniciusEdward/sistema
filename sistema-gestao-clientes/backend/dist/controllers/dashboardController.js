"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardController = void 0;
const dashboardService_1 = require("../services/dashboardService");
exports.dashboardController = {
    async get(_req, res) {
        const data = await dashboardService_1.dashboardService.get();
        return res.json({ success: true, data });
    },
};
