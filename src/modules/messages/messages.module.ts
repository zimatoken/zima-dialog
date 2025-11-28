import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { PrismaService } from '../../core/prisma.service';
import { RedisModule } from '../../core/redis.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    RedisModule,
    AiModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  providers: [MessagesService, PrismaService],
  controllers: [MessagesController],
  exports: [MessagesService],
})
export class MessagesModule {}