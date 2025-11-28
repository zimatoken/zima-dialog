import { IsPhoneNumber } from 'class-validator';

export class SendCodeDto {
  @IsPhoneNumber(null)
  phone!: string;
}