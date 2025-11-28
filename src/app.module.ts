import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './core/prisma.service';
import { RedisModule } from './core/redis.module';
import { BullModuleCore } from './core/bull.module';
import { WsModule } from './ws/gateway.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ChatsModule } from './modules/chats/chats.module';
import { MessagesModule } from './modules/messages/messages.module';
import { MediaModule } from './modules/media/media.module';
import { AiModule } from './modules/ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RedisModule,
    BullModuleCore,
    WsModule,
    AuthModule,
    UsersModule,
    ChatsModule,
    MessagesModule,
    MediaModule,
    AiModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}