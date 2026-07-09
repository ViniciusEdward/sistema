"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagamentosRoutes = void 0;
const express_1 = require("express");
const pagamentosController_1 = require("../controllers/pagamentosController");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.pagamentosRoutes = (0, express_1.Router)();
exports.pagamentosRoutes.get('/', (0, asyncHandler_1.asyncHandler)(pagamentosController_1.pagamentosController.list));
