import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SendCodeDto } from './dto/send-code.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtGuard } from '../../core/jwt.guard';
import { CurrentUser } from '../../core/current-user.decorator';

@Controller('v0/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-code')
  sendCode(@Body() dto: SendCodeDto) {
    return this.authService.sendCode(dto.phone);
  }

  @Post('verify')
  verifyCode(@Body() dto: VerifyCodeDto) {
    return this.authService.verify(dto.phone, dto.code, dto.deviceInfo);
  }

  @Post('refresh')
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @Post('revoke')
  @UseGuards(JwtGuard)
  revokeDevice(@CurrentUser('userId') userId: string, @Body('deviceId') deviceId: string) {
    return this.authService.revokeDevice(userId, deviceId);
  }
}