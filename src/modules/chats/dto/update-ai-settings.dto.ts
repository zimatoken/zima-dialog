import { IsOptional, IsBoolean, IsEnum, IsString, IsNumber, Min, Max } from 'class-validator';

export class AiSettingsDto {
  @IsOptional() @IsBoolean() ai_enabled?: boolean;
  @IsOptional() @IsEnum(['assistant','analyst','coder','summary','pdf-reader']) 
  ai_mode?: 'assistant'|'analyst'|'coder'|'summary'|'pdf-reader';
  @IsOptional() @IsString() ai_instructions?: string;
  @IsOptional() @IsString() ai_model?: string;
  @IsOptional() @IsNumber() @Min(0) @Max(2) ai_temperature?: number;
}