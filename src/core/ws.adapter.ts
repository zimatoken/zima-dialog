import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import Redis from 'ioredis';

export class WsRedisAdapter extends IoAdapter {
  private pub: Redis;
  private sub: Redis;
  constructor(app) {
    super(app);
    const host = process.env.REDIS_HOST || '127.0.0.1';
    const port = Number(process.env.REDIS_PORT) || 6379;
    this.pub = new Redis({ host, port });
    this.sub = this.pub.duplicate();
  }

  createIOServer(port: number, options?: any) {
    const server = super.createIOServer(port, options);
    server.adapter(createAdapter(this.pub, this.sub));
    return server;
  }
}