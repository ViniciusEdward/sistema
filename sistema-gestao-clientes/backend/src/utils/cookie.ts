import { CookieOptions } from 'express';
import { env } from '../config/env';

export const authCookieName = 'sgc_token';

export function getAuthCookieOptions(): CookieOptions {
  const isProduction = env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    secure: isProduction || env.COOKIE_SECURE,
    sameSite: isProduction || env.COOKIE_SECURE ? 'none' : 'lax',
    domain: env.COOKIE_DOMAIN || undefined,
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  };
}

export function getClearCookieOptions(): CookieOptions {
  const isProduction = env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    secure: isProduction || env.COOKIE_SECURE,
    sameSite: isProduction || env.COOKIE_SECURE ? 'none' : 'lax',
    domain: env.COOKIE_DOMAIN || undefined,
    path: '/',
  };
}
