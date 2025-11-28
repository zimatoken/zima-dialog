import { Injectable, Inject, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { PrismaService } from '../../core/prisma.service';

@Injectable()
export class AiService {
  private logger = new Logger('AiService');
  
  constructor(
    @Inject('AI_QUEUE') private queue: Queue, 
    private prisma: PrismaService
  ) {}

  async enqueueJob(payload: { 
    chatId: string; 
    messageId: string; 
    senderId: string; 
    text?: string; 
    mediaIds?: string[] 
  }) {
    const job = await this.queue.add('process-message', payload, { 
      removeOnComplete: true, 
      attempts: 3, 
      backoff: { type: 'exponential', delay: 500 } 
    });
    
    this.logger.debug(`Enqueued AI job ${job.id}`);
    
    await this.prisma.aiJob.create({
      data: {
        id: job.id as string,
        type: 'COMPLETION',
        status: 'QUEUED',
        model: process.env.AI_MODEL || 'gpt-4o-mini',
        prompt: payload.text ?? '',
      },
    }).catch(() => null);
    
    return job.id;
  }

  async listTasks(query: { limit?: number; offset?: number; status?: string } = {}) {
    const { limit = 50, offset = 0, status } = query;
    
    const where = status ? { status } : {};
    
    return this.prisma.aiJob.findMany({ 
      where,
      orderBy: { createdAt: 'desc' }, 
      take: limit, 
      skip: offset 
    });
  }

  async getTask(taskId: string) {
    return this.prisma.aiJob.findUnique({
      where: { id: taskId }
    });
  }
}