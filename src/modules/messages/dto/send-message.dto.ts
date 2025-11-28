import { IsEnum, IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class SendMessageDto {
  @IsEnum(['text','image','video','file','voice'] as any)
  type!: 'text'|'image'|'video'|'file'|'voice';

  @IsOptional()
  @IsString()
  @Length(1, 2000)
  text?: string;

  @IsOptional()
  @IsUUID()
  mediaId?: string;

  @IsOptional()
  @IsUUID()
  replyToId?: string;
}