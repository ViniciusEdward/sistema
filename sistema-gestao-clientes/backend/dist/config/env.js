"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'test', 'production']).default('development'),
    PORT: zod_1.z.coerce.number().default(4000),
    DATABASE_URL: zod_1.z.string().min(1, 'DATABASE_URL é obrigatória'),
    FRONTEND_URL: zod_1.z.string().url().default('http://localhost:5173'),
    JWT_SECRET: zod_1.z.string().min(32, 'JWT_SECRET precisa ter pelo menos 32 caracteres'),
    JWT_EXPIRES_IN: zod_1.z.string().default('7d'),
    COOKIE_SECURE: zod_1.z
        .string()
        .optional()
        .transform((value) => value === 'true'),
    COOKIE_DOMAIN: zod_1.z.string().optional(),
    ADMIN_EMAIL: zod_1.z.string().email().optional(),
    ADMIN_NAME: zod_1.z.string().optional(),
    ADMIN_PASSWORD: zod_1.z.string().optional(),
    ADMIN_PASSWORD_HASH: zod_1.z.string().optional(),
});
exports.env = envSchema.parse(process.env);
