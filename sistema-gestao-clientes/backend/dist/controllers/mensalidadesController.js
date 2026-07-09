"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mensalidadesController = void 0;
const mensalidadesService_1 = require("../services/mensalidadesService");
const mensalidadeSchemas_1 = require("../validators/mensalidadeSchemas");
function parseDateMaybe(value) {
    return value ? new Date(`${value}T00:00:00.000Z`) : undefined;
}
exports.mensalidadesController = {
    async list(req, res) {
        const query = mensalidadeSchemas_1.mensalidadeQuerySchema.parse(req.query);
        const result = await mensalidadesService_1.mensalidadesService.list({
            ...query,
            status: query.status,
            inicio: parseDateMaybe(query.inicio),
            fim: parseDateMaybe(query.fim),
        });
        return res.json({ success: true, ...result });
    },
    async getById(req, res) {
        const mensalidade = await mensalidadesService_1.mensalidadesService.getById(Number(req.params.id));
        return res.json({ success: true, data: mensalidade });
    },
    async create(req, res) {
        const data = mensalidadeSchemas_1.mensalidadeCreateSchema.parse(req.body);
        const mensalidade = await mensalidadesService_1.mensalidadesService.create(data);
        return res.status(201).json({ success: true, data: mensalidade });
    },
    async update(req, res) {
        const data = mensalidadeSchemas_1.mensalidadeUpdateSchema.parse(req.body);
        const mensalidade = await mensalidadesService_1.mensalidadesService.update(Number(req.params.id), data);
        return res.json({ success: true, data: mensalidade });
    },
    async remove(req, res) {
        const result = await mensalidadesService_1.mensalidadesService.remove(Number(req.params.id));
        return res.json({ success: true, data: result });
    },
    async pagar(req, res) {
        const data = mensalidadeSchemas_1.pagarMensalidadeSchema.parse(req.body);
        const result = await mensalidadesService_1.mensalidadesService.pagar(Number(req.params.id), data);
        return res.json({ success: true, data: result });
    },
};
