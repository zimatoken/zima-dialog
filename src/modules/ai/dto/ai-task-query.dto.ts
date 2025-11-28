import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min } from 'class-validator';

export class AiTaskQueryDto {
  @IsOptional()
  status?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit = 20;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset = 0;
}