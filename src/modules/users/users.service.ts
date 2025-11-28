import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../core/prisma.service';

@Injectable()
export class UsersService {
  private logger = new Logger('UsersService');
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { id: true, phone: true, name: true, avatarUrl: true, createdAt: true },
    });
  }

  async updateProfile(userId: string, dto: { name?: string; avatarUrl?: string }) {
    const data: any = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.avatarUrl !== undefined) data.avatarUrl = dto.avatarUrl;
    
    const updated = await this.prisma.user.update({ 
      where: { id: userId }, 
      data 
    });
    
    this.logger.log(`Profile updated for ${userId}`);
    return updated;
  }

  async getDevices(userId: string) {
    return this.prisma.device.findMany({ 
      where: { userId } 
    });
  }

  async revokeDevice(userId: string, deviceId: string) {
    await this.prisma.device.updateMany({ 
      where: { userId, id: deviceId }, 
      data: { revokedAt: new Date() } 
    });
    
    this.logger.log(`Device ${deviceId} revoked for ${userId}`);
    return { ok: true };
  }
}