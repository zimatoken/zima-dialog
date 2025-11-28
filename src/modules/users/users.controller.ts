import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../core/jwt.guard';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CurrentUser } from '../../core/current-user.decorator';

@Controller('v0/users')
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  me(@CurrentUser('userId') userId: string) {
    return this.usersService.getProfile(userId);
  }

  @Put('profile')
  updateProfile(
    @CurrentUser('userId') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(userId, dto);
  }

  @Get('devices')
  getDevices(@CurrentUser('userId') userId: string) {
    return this.usersService.getDevices(userId);
  }

  @Put('devices/revoke')
  revokeDevice(
    @CurrentUser('userId') userId: string,
    @Body('deviceId') deviceId: string,
  ) {
    return this.usersService.revokeDevice(userId, deviceId);
  }
}