import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma.service';
import { AiService } from '../ai/ai.service';
import { RedisService } from '../../core/redis.service';

@Injectable()
export class ChatsService {
  private logger = new Logger('ChatsService');
  private redis;
  
  constructor(
    private prisma: PrismaService, 
    private ai: AiService, 
    private redisService: RedisService
  ) {
    this.redis = this.redisService.getClient();
  }

  async createChat(creatorId: string, userIds: string[]) {
    if (!userIds || userIds.length === 0) {
      throw new BadRequestException('User IDs required');
    }

    // Для DIRECT чатов проверяем существующий
    if (userIds.length === 1) {
      const otherUserId = userIds[0];
      const existingChat = await this.prisma.chat.findFirst({
        where: {
          type: 'direct',
          participants: {
            every: {
              userId: { in: [creatorId, otherUserId] }
            }
          }
        }
      });

      if (existingChat) {
        this.logger.log(`Existing DIRECT chat found: ${existingChat.id}`);
        return existingChat;
      }
    }

    // Создаем новый чат
    const chat = await this.prisma.chat.create({ 
      data: { 
        type: userIds.length === 1 ? 'direct' : 'group'
      } 
    });

    // Добавляем участников (создатель + указанные пользователи)
    const allUserIds = [...new Set([creatorId, ...userIds])];
    const membersData = allUserIds.map(userId => ({
      chatId: chat.id,
      userId,
      joinedAt: new Date()
    }));

    await this.prisma.chatParticipant.createMany({ data: membersData });

    this.logger.log(`Chat ${chat.id} created by ${creatorId} with ${allUserIds.length} members`);
    return chat;
  }

  async listChats(userId: string, query: { limit?: number; offset?: number } = {}) {
    const { limit = 50, offset = 0 } = query;
    
    const chats = await this.prisma.chat.findMany({
      where: {
        participants: {
          some: { userId }
        }
      },
      include: {
        participants: {
          include: {
            user: {
              select: { id: true, name: true, avatarUrl: true }
            }
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: limit,
      skip: offset
    });

    return chats.map(chat => ({
      id: chat.id,
      type: chat.type,
      ai_enabled: chat.ai_enabled,
      ai_mode: chat.ai_mode,
      participants: chat.participants.map(p => ({
        userId: p.user.id,
        name: p.user.name,
        avatarUrl: p.user.avatarUrl,
        lastReadAt: p.lastReadAt
      })),
      lastMessage: chat.messages[0] || null,
      updatedAt: chat.updatedAt
    }));
  }

  async updateAiSettings(chatId: string, dto: any) {
    const chat = await this.prisma.chat.findUnique({ where: { id: chatId } });
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    const updated = await this.prisma.chat.update({ 
      where: { id: chatId }, 
      data: dto 
    });
    
    this.logger.log(`Chat ${chatId} AI settings updated`);
    return updated;
  }
}