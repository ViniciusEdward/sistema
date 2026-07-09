import { PrismaClient } from '@prisma/client';
import { env } from '../config/env';

function withSafeMysqlPoolParams(databaseUrl: string) {
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
  } catch {
    return databaseUrl;
  }
}

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: withSafeMysqlPoolParams(env.DATABASE_URL),
    },
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});
