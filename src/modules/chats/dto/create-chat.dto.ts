import { IsArray, ArrayNotEmpty, IsUUID, ArrayMinSize } from 'class-validator';

export class CreateChatDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  userIds!: string[];
}