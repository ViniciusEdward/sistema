"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = require("./config/env");
const client_1 = require("./prisma/client");
const bootstrapService_1 = require("./services/bootstrapService");
async function start() {
    await client_1.prisma.$connect();
    await (0, bootstrapService_1.bootstrapAdminUser)();
    app_1.app.listen(env_1.env.PORT, () => {
        console.log(`API rodando na porta ${env_1.env.PORT}`);
    });
}
start().catch((error) => {
    console.error('Falha ao iniciar servidor:', error);
    process.exit(1);
});
process.on('SIGINT', async () => {
    await client_1.prisma.$disconnect();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    await client_1.prisma.$disconnect();
    process.exit(0);
});
