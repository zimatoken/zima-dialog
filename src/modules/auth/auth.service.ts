import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../core/prisma.service';
import { RedisService } from '../../core/redis.service';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
  private redis;

  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
    private redisService: RedisService,
  ) {
    this.redis = this.redisService.getClient();

    if (!process.env.JWT_SECRET) {
      this.logger.error('JWT_SECRET is not set. Refusing to start AuthService in insecure mode.');
      throw new Error('JWT_SECRET environment variable is required');
    }
  }

  async sendCode(phone: string) {
    if (!phone) throw new BadRequestException('phone required');

    const attemptsKey = `auth:sms_attempts:${phone}`;
    const attempts = await this.redis.incr(attemptsKey);
    if (attempts === 1) {
      // ограничиваем окно попыток 5 минутами
      await this.redis.expire(attemptsKey, 300);
    }
    if (attempts > 5) {
      throw new BadRequestException('Too many attempts, please try again later');
    }

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    await this.redis.setex(`code:${phone}`, 300, code);

    if (process.env.NODE_ENV !== 'production') {
      this.logger.log(`(DEV) SMS code for ${phone}: ${code}`);
    }

    return { ttl: 300 };
  }

  async verify(phone: string, code: string, deviceInfo: { deviceId: string; platform?: string; appVersion?: string }) {
    const attemptsKey = `auth:sms_verify_attempts:${phone}`;
    const attempts = await this.redis.incr(attemptsKey);
    if (attempts === 1) {
      await this.redis.expire(attemptsKey, 300);
    }
    if (attempts > 10) {
      throw new BadRequestException('Too many verification attempts, please try again later');
    }

    const cached = await this.redis.get(`code:${phone}`);
    if (!cached || cached !== code) throw new BadRequestException('Invalid code');
    
    let user = await this.prisma.user.findUnique({ where: { phone } });
    if (!user) {
      user = await this.prisma.user.create({ 
        data: { phone, name: `User ${phone.slice(-4)}` } 
      });
    }

    const device = await this.prisma.device.upsert({
      where: { deviceId: deviceInfo.deviceId },
      update: {
        platform: deviceInfo.platform || 'web',
        appVersion: deviceInfo.appVersion || '0.0.0',
        lastActiveAt: new Date(),
      },
      create: {
        userId: user.id,
        deviceId: deviceInfo.deviceId,
        platform: deviceInfo.platform || 'web',
        appVersion: deviceInfo.appVersion || '0.0.0',
        lastActiveAt: new Date(),
      },
    });

    const accessToken = this.jwt.sign(
      { userId: user.id, deviceId: device.id, tokenType: 'access' }, 
      { expiresIn: '15m' }
    );
    
    const refreshToken = this.jwt.sign(
      { userId: user.id, deviceId: device.id, tokenType: 'refresh' }, 
      { expiresIn: '7d' }
    );

    return { 
      accessToken, 
      refreshToken, 
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        avatarUrl: user.avatarUrl
      }
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload: any = await this.jwt.verifyAsync(refreshToken);

      if (payload.tokenType !== 'refresh') {
        throw new BadRequestException('Invalid refresh token');
      }
      const device = await this.prisma.device.findUnique({ 
        where: { id: payload.deviceId } 
      });
      
      if (!device || device.revokedAt) throw new BadRequestException('Device revoked');
      
      const user = await this.prisma.user.findUnique({ 
        where: { id: payload.userId } 
      });
      
      const accessToken = this.jwt.sign(
        { userId: user.id, deviceId: device.id }, 
        { expiresIn: '15m' }
      );
      
      return { accessToken, expiresIn: 900 };
    } catch (err) {
      this.logger.warn('refresh failed', err?.message || err);
      throw new BadRequestException('Invalid refresh token');
    }
  }

  async revokeDevice(userId: string, deviceId: string) {
    await this.prisma.device.updateMany({ 
      where: { id: deviceId, userId }, 
      data: { revokedAt: new Date() } 
    });
    this.logger.log(`Device revoked ${deviceId} for user ${userId}`);
    return { ok: true };
  }
}