import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from './prisma.service';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private jwt: JwtService, 
    private prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const auth = request.headers['authorization'];
    
    if (!auth) return false;
    
    const token = auth.replace('Bearer ', '');
    
    try {
      const payload: any = await this.jwt.verifyAsync(token);

      // допускаем только access-токены
      if (payload.tokenType && payload.tokenType !== 'access') {
        return false;
      }
      
      const device = await this.prisma.device.findUnique({ 
        where: { id: payload.deviceId } 
      });
      
      if (device?.revokedAt) return false;
      
      request.user = payload;
      return true;
    } catch (error) {
      return false;
    }
  }
}