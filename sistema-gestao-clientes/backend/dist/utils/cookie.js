"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authCookieName = void 0;
exports.getAuthCookieOptions = getAuthCookieOptions;
exports.getClearCookieOptions = getClearCookieOptions;
const env_1 = require("../config/env");
exports.authCookieName = 'sgc_token';
function getAuthCookieOptions() {
    const isProduction = env_1.env.NODE_ENV === 'production';
    return {
        httpOnly: true,
        secure: isProduction || env_1.env.COOKIE_SECURE,
        sameSite: isProduction || env_1.env.COOKIE_SECURE ? 'none' : 'lax',
        domain: env_1.env.COOKIE_DOMAIN || undefined,
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7,
    };
}
function getClearCookieOptions() {
    const isProduction = env_1.env.NODE_ENV === 'production';
    return {
        httpOnly: true,
        secure: isProduction || env_1.env.COOKIE_SECURE,
        sameSite: isProduction || env_1.env.COOKIE_SECURE ? 'none' : 'lax',
        domain: env_1.env.COOKIE_DOMAIN || undefined,
        path: '/',
    };
}
