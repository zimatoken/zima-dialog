import { IsString, IsInt, Min, Max } from 'class-validator';

export class GetUploadUrlDto {
  @IsString()
  mimeType!: string;

  @IsString()
  fileName!: string;

  @IsInt()
  @Min(1)
  @Max(50 * 1024 * 1024)
  fileSize!: number;
}