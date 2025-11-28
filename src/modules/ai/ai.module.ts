import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { PrismaService } from '../../core/prisma.service';
import { BullModuleCore } from '../../core/bull.module';

@Module({
  imports: [BullModuleCore],
  providers: [AiService, PrismaService],
  controllers: [AiController],
  exports: [AiService],
})
export class AiModule {}