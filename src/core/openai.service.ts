import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class OpenAIService {
  private readonly openai: OpenAI;
  private readonly logger = new Logger(OpenAIService.name);

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async createChatCompletion(messages: any[], model = 'gpt-4o-mini', temperature = 0.3) {
    try {
      const completion = await this.openai.chat.completions.create({
        model,
        messages,
        temperature,
        max_tokens: 1000,
      });

      return completion.choices[0]?.message?.content;
    } catch (error) {
      this.logger.error('OpenAI API error:', error);
      throw error;
    }
  }
}