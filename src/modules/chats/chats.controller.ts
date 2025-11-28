import { Controller, Get, Post, Body, Param, UseGuards, Query, Put } from '@nestjs/common';
import { JwtGuard } from '../../core/jwt.guard';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { AiSettingsDto } from './dto/update-ai-settings.dto';
import { CurrentUser } from '../../core/current-user.decorator';
import { LimitOffsetDto } from '../../modules/common/dto/pagination.dto';

@Controller('v0/chats')
@UseGuards(JwtGuard)
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post()
  createChat(
    @CurrentUser('userId') userId: string,
    @Body() dto: CreateChatDto,
  ) {
    return this.chatsService.createChat(userId, dto.userIds);
  }

  @Get()
  listChats(
    @CurrentUser('userId') userId: string,
    @Query() query: LimitOffsetDto,
  ) {
    return this.chatsService.listChats(userId, query);
  }

  @Put(':chatId/ai-settings')
  updateAiSettings(
    @Param('chatId') chatId: string,
    @Body() dto: AiSettingsDto,
  ) {
    return this.chatsService.updateAiSettings(chatId, dto);
  }
}