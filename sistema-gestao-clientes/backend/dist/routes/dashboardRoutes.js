"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardRoutes = void 0;
const express_1 = require("express");
const dashboardController_1 = require("../controllers/dashboardController");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.dashboardRoutes = (0, express_1.Router)();
exports.dashboardRoutes.get('/', (0, asyncHandler_1.asyncHandler)(dashboardController_1.dashboardController.get));
