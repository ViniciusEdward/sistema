import { CookieOptions } from 'express';
import { env } from '../config/env';

export const authCookieName = 'sgc_token';

export function getAuthCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SECURE ? 'none' : 'lax',
    domain: env.COOKIE_DOMAIN || undefined,
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  };
}
