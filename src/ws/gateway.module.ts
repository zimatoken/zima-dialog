import { Module } from '@nestjs/common';
import { WsGateway } from './gateway';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from '../core/redis.module';
import { MessagesModule } from '../modules/messages/messages.module';

@Module({
  imports: [
    JwtModule.register({ 
      secret: process.env.JWT_SECRET,
    }),
    RedisModule,
    MessagesModule,
  ],
  providers: [WsGateway],
  exports: [WsGateway],
})
export class WsModule {}