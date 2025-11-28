import { IsString, IsOptional } from 'class-validator';

export class DeviceInfoDto {
  @IsString()
  deviceId!: string;

  @IsOptional()
  @IsString()
  platform?: 'ios'|'android'|'web'|'desktop';

  @IsOptional()
  @IsString()
  appVersion?: string;
}