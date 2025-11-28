import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma.service';
import { RedisService } from '../../core/redis.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class MessagesService {
  private logger = new Logger('MessagesService');
  private redis;
  
  constructor(
    private prisma: PrismaService, 
    private redisService: RedisService, 
    private ai: AiService
  ) {
    this.redis = this.redisService.getClient();
  }

  async sendMessage(chatId: string, senderId: string, dto: { 
    type: string; 
    text?: string; 
    mediaId?: string; 
    replyToId?: string; 
  }) {
    const chat = await this.prisma.chat.findUnique({ 
      where: { id: chatId },
      include: { participants: true }
    });
    
    if (!chat) throw new NotFoundException('Chat not found');
    
    const isMember = chat.participants.some(p => p.userId === senderId);
    if (!isMember) throw new BadRequestException('Not a chat member');

    if (dto.replyToId) {
      const replied = await this.prisma.message.findUnique({
        where: { id: dto.replyToId },
      });
      if (!replied || replied.chatId !== chatId) {
        throw new BadRequestException('Invalid replyToId');
      }
    }

    const msg = await this.prisma.message.create({
      data: {
        chatId,
        senderId,
        type: dto.type,
        content: dto.text,
        deliveredTo: [senderId],
        seenBy: [],
      },
    });

    if (dto.mediaId) {
      await this.prisma.media.updateMany({
        where: { id: dto.mediaId },
        data: { messageId: msg.id },
      });
    }

    await this.redis.publish(
      `chat:${chatId}`, 
      JSON.stringify({ 
        type: 'message_new', 
        payload: { 
          message: msg,
          replyToId: dto.replyToId || null,
          mediaId: dto.mediaId || null,
        } 
      })
    );

    await this.prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() }
    });

    if (chat.ai_enabled && dto.text) {
      await this.ai.enqueueJob({ 
        chatId, 
        messageId: msg.id, 
        senderId, 
        text: dto.text
      });
    }

    this.logger.log(`Message ${msg.id} sent in chat ${chatId} by ${senderId}`);
    return msg;
  }

  async markRead(userId: string, messageId: string) {
    const msg = await this.prisma.message.findUnique({ where: { id: messageId } });
    if (!msg) throw new NotFoundException('Message not found');

    const deliveredTo = Array.isArray(msg.deliveredTo) ? msg.deliveredTo : [];
    const seenBy = Array.isArray(msg.seenBy) ? msg.seenBy : [];

    if (!deliveredTo.includes(userId)) deliveredTo.push(userId);
    if (!seenBy.includes(userId)) seenBy.push(userId);

    await this.prisma.message.update({
      where: { id: messageId },
      data: { deliveredTo: deliveredTo as any, seenBy: seenBy as any }
    });

    await this.redis.publish(
      `chat:${msg.chatId}`, 
      JSON.stringify({ type: 'message_read', payload: { messageId, userId } })
    );

    this.logger.log(`Message ${messageId} marked read by ${userId}`);
    return { ok: true };
  }

  async editMessage(userId: string, messageId: string, text: string) {
    const updated = await this.prisma.message.updateMany({ 
      where: { id: messageId, senderId: userId }, 
      data: { content: text, edited: true } 
    });
    
    if (updated.count === 0) throw new BadRequestException('Not allowed or not found');
    
    const msg = await this.prisma.message.findUnique({ where: { id: messageId } });
    if (msg) {
      await this.redis.publish(
        `chat:${msg.chatId}`, 
        JSON.stringify({ type: 'message_edited', payload: { message: msg } })
      );
    }
    
    return msg;
  }

  async deleteMessage(userId: string, messageId: string) {
    const exists = await this.prisma.message.findUnique({ where: { id: messageId } });
    if (!exists) throw new NotFoundException('Message not found');
    if (exists.senderId !== userId) throw new BadRequestException('Not allowed');
    
    await this.prisma.message.delete({ where: { id: messageId } });
    
    await this.redis.publish(
      `chat:${exists.chatId}`, 
      JSON.stringify({ type: 'message_deleted', payload: { messageId } })
    );
    
    return { ok: true };
  }

  async listMessages(chatId: string, query: { limit?: number; offset?: number } = {}) {
    const { limit = 50, offset = 0 } = query;
    
    return this.prisma.message.findMany({ 
      where: { chatId }, 
      orderBy: { createdAt: 'desc' }, 
      take: limit, 
      skip: offset,
      include: {
        sender: {
          select: { id: true, name: true, avatarUrl: true }
        },
        media: true
      }
    });
  }
}