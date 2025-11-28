import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../../core/prisma.service';
import { RedisModule } from '../../core/redis.module';

@Module({
  imports: [
    JwtModule.register({ 
      // секрет обязателен и должен задаваться через окружение
      secret: process.env.JWT_SECRET,
    }),
    RedisModule
  ],
  providers: [AuthService, PrismaService],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}