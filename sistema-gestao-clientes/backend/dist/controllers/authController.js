"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const authService_1 = require("../services/authService");
const authSchemas_1 = require("../validators/authSchemas");
const cookie_1 = require("../utils/cookie");
exports.authController = {
    async login(req, res) {
        const data = authSchemas_1.loginSchema.parse(req.body);
        const result = await authService_1.authService.login(data.email, data.senha);
        // Mantém o cookie httpOnly para navegadores que aceitam cookies normalmente.
        res.cookie(cookie_1.authCookieName, result.token, (0, cookie_1.getAuthCookieOptions)());
        // Também retorna o token para fallback mobile. Alguns navegadores móveis bloqueiam
        // cookies em fluxos com proxy/rewrite, então o frontend envia Authorization Bearer.
        return res.json({
            success: true,
            data: {
                usuario: result.usuario,
                token: result.token,
            },
        });
    },
    async me(req, res) {
        const usuario = await authService_1.authService.getMe(req.user.id);
        return res.json({ success: true, data: usuario });
    },
    async logout(_req, res) {
        res.clearCookie(cookie_1.authCookieName, (0, cookie_1.getClearCookieOptions)());
        return res.json({ success: true, message: 'Logout realizado.' });
    },
};
