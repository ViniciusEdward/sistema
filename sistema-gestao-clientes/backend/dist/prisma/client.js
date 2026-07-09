"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const env_1 = require("../config/env");
function withSafeMysqlPoolParams(databaseUrl) {
    try {
        const url = new URL(databaseUrl);
        if (url.protocol.startsWith('mysql')) {
            if (!url.searchParams.has('connection_limit')) {
                url.searchParams.set('connection_limit', '1');
            }
            if (!url.searchParams.has('pool_timeout')) {
                url.searchParams.set('pool_timeout', '30');
            }
            if (!url.searchParams.has('connect_timeout')) {
                url.searchParams.set('connect_timeout', '30');
            }
        }
        return url.toString();
    }
    catch {
        return databaseUrl;
    }
}
exports.prisma = new client_1.PrismaClient({
    datasources: {
        db: {
            url: withSafeMysqlPoolParams(env_1.env.DATABASE_URL),
        },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});
