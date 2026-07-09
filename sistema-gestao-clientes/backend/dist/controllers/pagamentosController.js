"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagamentosController = void 0;
const zod_1 = require("zod");
const pagamentosService_1 = require("../services/pagamentosService");
const querySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    perPage: zod_1.z.coerce.number().int().min(1).max(100).default(20),
});
exports.pagamentosController = {
    async list(req, res) {
        const query = querySchema.parse(req.query);
        const result = await pagamentosService_1.pagamentosService.list(query.page, query.perPage);
        return res.json({ success: true, ...result, page: query.page, perPage: query.perPage });
    },
};
