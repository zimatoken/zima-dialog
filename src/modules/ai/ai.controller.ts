import { Controller, Post, Body, Get, Query, Param } from '@nestjs/common';
import { AiService } from './ai.service';
import { EnqueueAiDto } from './dto/enqueue-ai.dto';
import { AiTaskQueryDto } from './dto/ai-task-query.dto';

@Controller('v0/ai')
export class AiController {
  constructor(private readonly ai: AiService) {}

  @Post('enqueue')
  enqueue(@Body() dto: EnqueueAiDto) {
    return this.ai.enqueueJob({
      chatId: dto.chatId || 'standalone',
      messageId: 'standalone-' + Date.now(),
      senderId: 'system',
      text: dto.prompt
    });
  }

  @Get('tasks')
  listTasks(@Query() query: AiTaskQueryDto) {
    return this.ai.listTasks(query);
  }

  @Get('tasks/:taskId')
  getTask(@Param('taskId') taskId: string) {
    return this.ai.getTask(taskId);
  }
}