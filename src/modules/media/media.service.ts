import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../core/prisma.service';
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MediaService {
  private s3: S3Client;
  private logger = new Logger('MediaService');

  constructor(private prisma: PrismaService) {
    this.s3 = new S3Client({
      endpoint: process.env.S3_ENDPOINT,
      region: process.env.S3_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.S3_KEY || '',
        secretAccessKey: process.env.S3_SECRET || '',
      },
      forcePathStyle: true,
    });
  }

  async getUploadUrl(ownerId: string, dto: { fileName: string; mimeType: string; fileSize: number }) {
    if (!dto.fileName || !dto.mimeType) throw new BadRequestException('Invalid params');
    
    const id = uuidv4();
    const key = `uploads/${id}-${dto.fileName}`;
    
    await this.prisma.media.create({ 
      data: { 
        id, 
        key, 
        mimeType: dto.mimeType, 
        size: dto.fileSize, 
        type: this.getMediaType(dto.mimeType),
        status: 'uploading' 
      } 
    });

    const cmd = new PutObjectCommand({ 
      Bucket: process.env.S3_BUCKET || 'zima', 
      Key: key, 
      ContentType: dto.mimeType 
    });
    
    const signed = await getSignedUrl(this.s3, cmd, { expiresIn: 300 });
    
    this.logger.log(`Presigned URL for media ${id}`);
    return { mediaId: id, uploadUrl: signed, key };
  }

  async confirmUpload(mediaId: string) {
    const rec = await this.prisma.media.findUnique({ where: { id: mediaId } });
    if (!rec) throw new BadRequestException('Media not found');
    
    try {
      await this.s3.send(new HeadObjectCommand({ 
        Bucket: process.env.S3_BUCKET || 'zima', 
        Key: rec.key 
      }));
      
      await this.prisma.media.update({ 
        where: { id: mediaId }, 
        data: { status: 'ready' } 
      });
      
      const cdn = `${process.env.CDN_URL || 'https://cdn.zima.chat'}/${rec.key}`;
      
      this.logger.log(`Media ${mediaId} confirmed and ready`);
      return { url: cdn };
    } catch (err) {
      this.logger.warn('S3 missing', err?.message || err);
      throw new BadRequestException('File not present in S3');
    }
  }

  private getMediaType(mimeType: string): string {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    return 'file';
  }
}