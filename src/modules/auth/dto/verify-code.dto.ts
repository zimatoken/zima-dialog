import { IsString, IsNotEmpty } from 'class-validator';

export class VerifyCodeDto {
  @IsString() @IsNotEmpty()
  phone!: string;

  @IsString() @IsNotEmpty()
  code!: string;

  @IsNotEmpty()
  deviceInfo!: {
    deviceId: string;
    platform: 'ios' | 'android' | 'web' | 'desktop';
    appVersion?: string;
  };
}