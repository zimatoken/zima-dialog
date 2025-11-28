import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../core/jwt.guard';
import { MediaService } from './media.service';
import { GetUploadUrlDto } from './dto/get-upload-url.dto';
import { ConfirmUploadDto } from './dto/confirm-upload.dto';
import { CurrentUser } from '../../core/current-user.decorator';

@Controller('v0/media')
@UseGuards(JwtGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload-url')
  getUploadUrl(
    @CurrentUser('userId') userId: string,
    @Body() dto: GetUploadUrlDto,
  ) {
    return this.mediaService.getUploadUrl(userId, dto);
  }

  @Post('confirm')
  confirmUpload(@Body() dto: ConfirmUploadDto) {
    return this.mediaService.confirmUpload(dto.mediaId);
  }
}