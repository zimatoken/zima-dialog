import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import { PrismaService } from './core/prisma.service';
import { WsRedisAdapter } from './core/ws.adapter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, { cors: true });

  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60_000,
      max: Number(process.env.RATE_LIMIT_MAX) || 120,
    }),
  );

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const prisma = app.get(PrismaService);
  process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

  app.useWebSocketAdapter(new WsRedisAdapter(app));

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);

  logger.log(`❄️ ZIMA-Dialog running on port ${port}`);
  console.log(`
    ❄️ ZIMA-Dialog ❄️
    Pocket secretary alive.
  `);
}

bootstrap().catch(e => {
  console.error('Bootstrap failed', e);
  process.exit(1);
});