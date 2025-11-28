import { Controller, Post, Get, Body, Param, Query, UseGuards, Delete } from '@nestjs/common';
import { JwtGuard } from '../../core/jwt.guard';
import { MessagesService } from './messages.service';
import { SendMessageDto } from './dto/send-message.dto';
import { EditMessageDto } from './dto/edit-message.dto';
import { MarkReadDto } from './dto/mark-read.dto';
import { CurrentUser } from '../../core/current-user.decorator';
import { LimitOffsetDto } from '../common/dto/pagination.dto';

@Controller('v0/messages')
@UseGuards(JwtGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post(':chatId/send')
  sendMessage(
    @Param('chatId') chatId: string,
    @CurrentUser('userId') userId: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.messagesService.sendMessage(chatId, userId, dto);
  }

  @Post('edit')
  editMessage(
    @CurrentUser('userId') userId: string,
    @Body() dto: EditMessageDto,
  ) {
    return this.messagesService.editMessage(userId, dto.messageId, dto.text);
  }

  @Post('mark-read')
  markRead(
    @CurrentUser('userId') userId: string,
    @Body() dto: MarkReadDto,
  ) {
    return this.messagesService.markRead(userId, dto.messageId);
  }

  @Delete(':messageId')
  deleteMessage(
    @CurrentUser('userId') userId: string,
    @Param('messageId') messageId: string,
  ) {
    return this.messagesService.deleteMessage(userId, messageId);
  }

  @Get(':chatId')
  listMessages(
    @Param('chatId') chatId: string,
    @Query() query: LimitOffsetDto,
  ) {
    return this.messagesService.listMessages(chatId, query);
  }
}