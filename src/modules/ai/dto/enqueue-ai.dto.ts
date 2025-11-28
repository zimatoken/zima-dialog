import { IsString, IsOptional, IsUUID } from 'class-validator';

export class EnqueueAiDto {
  @IsString()
  prompt!: string;

  @IsOptional()
  @IsUUID()
  chatId?: string;

  @IsOptional()
  @IsString()
  model?: string;
}