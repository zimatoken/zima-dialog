import { IsOptional, IsString, Length, IsUrl } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @Length(1, 60)
  name?: string;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}