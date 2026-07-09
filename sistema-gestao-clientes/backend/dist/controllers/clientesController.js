"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientesController = void 0;
const clientesService_1 = require("../services/clientesService");
const clienteSchemas_1 = require("../validators/clienteSchemas");
exports.clientesController = {
    async list(req, res) {
        const filters = clienteSchemas_1.clienteQuerySchema.parse(req.query);
        const result = await clientesService_1.clientesService.list(filters);
        return res.json({ success: true, ...result });
    },
    async getById(req, res) {
        const cliente = await clientesService_1.clientesService.getById(Number(req.params.id));
        return res.json({ success: true, data: cliente });
    },
    async create(req, res) {
        const data = clienteSchemas_1.clienteCreateSchema.parse(req.body);
        const cliente = await clientesService_1.clientesService.create(data);
        return res.status(201).json({ success: true, data: cliente });
    },
    async update(req, res) {
        const data = clienteSchemas_1.clienteUpdateSchema.parse(req.body);
        const cliente = await clientesService_1.clientesService.update(Number(req.params.id), data);
        return res.json({ success: true, data: cliente });
    },
    async remove(req, res) {
        const result = await clientesService_1.clientesService.remove(Number(req.params.id));
        return res.json({ success: true, data: result });
    },
};
