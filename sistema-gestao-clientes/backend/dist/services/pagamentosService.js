"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagamentosService = void 0;
const pagamentosRepository_1 = require("../repositories/pagamentosRepository");
exports.pagamentosService = {
    list(page, perPage) {
        return pagamentosRepository_1.pagamentosRepository.list(page, perPage);
    },
};
