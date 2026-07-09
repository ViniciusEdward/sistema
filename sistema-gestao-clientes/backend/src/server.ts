import { app } from './app';
import { env } from './config/env';
import { prisma } from './prisma/client';
import { bootstrapAdminUser } from './services/bootstrapService';

async function start() {
  await prisma.$connect();
  await bootstrapAdminUser();

  app.listen(env.PORT, () => {
    console.log(`API rodando na porta ${env.PORT}`);
  });
}

start().catch((error) => {
  console.error('Falha ao iniciar servidor:', error);
  process.exit(1);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
