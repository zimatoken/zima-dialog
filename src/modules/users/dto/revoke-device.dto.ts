import { IsString } from 'class-validator';

export class RevokeDeviceDto {
  @IsString()
  deviceId!: string;
}