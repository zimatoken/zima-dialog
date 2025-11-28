import { Module, Global } from '@nestjs/common';
import { RedisService } from './redis.service';
import { Queue } from 'bullmq';

@Global()
@Module({
  providers: [
    {
      provide: 'AI_QUEUE',
      useFactory: (redisService: RedisService) => {
        return new Queue('ai-jobs', {
          connection: {
            host: process.env.REDIS_HOST || '127.0.0.1',
            port: Number(process.env.REDIS_PORT) || 6379,
          },
        });
      },
      inject: [RedisService],
    },
  ],
  exports: ['AI_QUEUE'],
})
export class BullModuleCore {}