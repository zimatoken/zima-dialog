import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { PrismaService } from '../../core/prisma.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  providers: [MediaService, PrismaService],
  controllers: [MediaController],
  exports: [MediaService],
})
export class MediaModule {}