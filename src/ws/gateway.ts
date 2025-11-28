import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '../core/redis.service';
import { MessagesService } from '../modules/messages/messages.service';

const allowedWsOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

@WebSocketGateway({ 
  path: '/v0/ws', 
  cors: { origin: allowedWsOrigins.length ? allowedWsOrigins : '*' } 
})
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger = new Logger('WsGateway');
  private userSockets = new Map<string, Set<Socket>>();

  constructor(
    private jwtService: JwtService,
    private redisService: RedisService,
    private messagesService: MessagesService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = (client.handshake.query?.token as string) || (client.handshake.auth?.token as string);
      if (!token) {
        client.disconnect();
        return;
      }

      const payload: any = this.jwtService.verify(token.replace('Bearer ', ''));

      if (payload.tokenType && payload.tokenType !== 'access') {
        throw new Error('Invalid token type for WebSocket connection');
      }

      client.data.userId = payload.userId;
      client.data.deviceId = payload.deviceId;

      // Сохраняем сокет пользователя
      if (!this.userSockets.has(payload.userId)) {
        this.userSockets.set(payload.userId, new Set());
      }
      this.userSockets.get(payload.userId)!.add(client);

      // Подписываемся на комнаты пользователя
      client.join(payload.userId);

      this.logger.log(`User ${payload.userId} connected (socket ${client.id})`);
      
      client.emit('connection_established', { 
        userId: payload.userId, 
        deviceId: payload.deviceId 
      });

    } catch (error) {
      this.logger.warn('WebSocket auth failed:', error.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    if (userId) {
      const userSockets = this.userSockets.get(userId);
      if (userSockets) {
        userSockets.delete(client);
        if (userSockets.size === 0) {
          this.userSockets.delete(userId);
        }
      }
    }
    this.logger.log(`Client disconnected ${client.id}`);
  }

  @SubscribeMessage('message_send')
  async onMessageSend(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const { chatId, type, text, mediaId, replyToId, messageId } = data;
      const userId = client.data.userId;

      const message = await this.messagesService.sendMessage(chatId, userId, {
        type, text, mediaId, replyToId
      });

      // Подтверждаем доставку отправителю
      client.emit('message_delivered', {
        messageId,
        payload: {
          serverMessageId: message.id,
          timestamp: message.createdAt
        }
      });

      // Вступаем в комнату чата для получения обновлений
      client.join(chatId);

    } catch (error) {
      this.logger.error('Message send error:', error);
      client.emit('error', {
        code: 'MESSAGE_SEND_FAILED',
        message: error.message
      });
    }
  }

  @SubscribeMessage('typing_start')
  onTypingStart(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    const { chatId } = data;
    const userId = client.data.userId;

    // Рассылаем уведомление о начале набора другим участникам
    client.to(chatId).emit('typing_start', {
      chatId,
      userId,
      timestamp: new Date().toISOString()
    });
  }

  @SubscribeMessage('typing_end')
  onTypingEnd(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    const { chatId } = data;
    const userId = client.data.userId;

    client.to(chatId).emit('typing_end', {
      chatId,
      userId
    });
  }

  @SubscribeMessage('join_chat')
  onJoinChat(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    const { chatId } = data;
    client.join(chatId);
    this.logger.log(`User ${client.data.userId} joined chat ${chatId}`);
  }

  @SubscribeMessage('leave_chat')
  onLeaveChat(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    const { chatId } = data;
    client.leave(chatId);
    this.logger.log(`User ${client.data.userId} left chat ${chatId}`);
  }

  // Вспомогательный метод для рассылки сообщений конкретному пользователю
  sendToUser(userId: string, event: string, data: any) {
    const userSockets = this.userSockets.get(userId);
    if (userSockets) {
      userSockets.forEach(socket => {
        if (socket.connected) {
          socket.emit(event, data);
        }
      });
    }
  }
}