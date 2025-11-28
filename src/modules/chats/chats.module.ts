import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { PrismaService } from '../../core/prisma.service';
import { AiModule } from '../ai/ai.module';
import { RedisModule } from '../../core/redis.module';

@Module({
  imports: [
    AiModule,
    RedisModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  providers: [ChatsService, PrismaService],
  controllers: [ChatsController],
  exports: [ChatsService],
})
export class ChatsModule {}