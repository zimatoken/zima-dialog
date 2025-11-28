import { Worker } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';
import Redis from 'ioredis';

// Проверка переменных окружения
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ ERROR: OPENAI_API_KEY is not set in environment variables');
  console.error('   Please set OPENAI_API_KEY in your .env file');
  process.exit(1);
}

const redisHost = process.env.REDIS_HOST || '127.0.0.1';
const redisPort = Number(process.env.REDIS_PORT) || 6379;

// Проверка подключения к Redis перед запуском воркера
async function checkRedisConnection() {
  const testRedis = new Redis({
    host: redisHost,
    port: redisPort,
    retryStrategy: () => null,
    maxRetriesPerRequest: 1,
    connectTimeout: 3000,
  });

  return new Promise<void>((resolve, reject) => {
    testRedis.on('error', (err) => {
      console.error('❌ ERROR: Cannot connect to Redis');
      console.error(`   Host: ${redisHost}:${redisPort}`);
      console.error(`   Error: ${err.message}`);
      console.error('');
      console.error('💡 SOLUTION: Please start Redis server:');
      console.error('   Windows: Download and run Redis from https://redis.io/download');
      console.error('   Or use Docker: docker run -d -p 6379:6379 redis:alpine');
      console.error('   Or use WSL: sudo service redis-server start');
      testRedis.quit();
      reject(err);
    });

    testRedis.ping()
      .then(() => {
        console.log(`✅ Redis connected: ${redisHost}:${redisPort}`);
        testRedis.quit();
        resolve();
      })
      .catch((err) => {
        console.error('❌ Redis connection test failed:', err.message);
        testRedis.quit();
        reject(err);
      });
  });
}

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Создаем воркер после проверки Redis
let worker: Worker;

checkRedisConnection()
  .then(() => {
    worker = new Worker(
  'ai-jobs',
  async (job) => {
    console.log(`Processing AI job ${job.id}`, job.data);
    
    const { chatId, messageId, senderId, text, mediaIds } = job.data;
    
    try {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY is not set');
      }

      // Получаем историю чата
      const messages = await prisma.message.findMany({
        where: { chatId },
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: {
          sender: {
            select: { name: true }
          }
        }
      });

      // Получаем настройки AI чата
      const chat = await prisma.chat.findUnique({
        where: { id: chatId },
        select: { ai_mode: true, ai_instructions: true, ai_model: true, ai_temperature: true }
      });

      const baseInstructions =
        chat?.ai_instructions ||
        [
          'Ты ZIMA-Dialog — карманный секретарь пользователя.',
          'Говоришь вежливо, по-деловому и дружелюбно, на русском языке, если пользователь не пишет на другом.',
          'Помогаешь планировать день, структурировать задачи, напоминания, идеи, черновики сообщений и писем.',
          'Отвечай кратко и по делу, без лишней «воды».',
          'Если нужно что-то уточнить — сначала задавай конкретные уточняющие вопросы.',
        ].join(' ');

      const model = chat?.ai_model || 'gpt-4o-mini';
      const temperature = chat?.ai_temperature ?? 0.3;

      // Форматируем историю для AI
      const conversation = messages.reverse().map(msg => ({
        role: (msg.senderId === 'system' ? 'assistant' : 'user') as 'user' | 'assistant',
        content: msg.content || '',
      }));

      const response = await openai.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: baseInstructions },
          ...conversation,
          { role: 'user', content: text || '' },
        ],
        temperature,
        max_tokens: 1000,
      });

      const aiResponse =
        response.choices[0]?.message?.content ||
        'Извини, сейчас я не могу ответить. Попробуй, пожалуйста, ещё раз позже.';

      // Сохраняем ответ AI как сообщение
      const aiMessage = await prisma.message.create({
        data: {
          chatId,
          senderId: 'system',
          type: 'text',
          content: aiResponse,
          deliveredTo: [] as any,
          seenBy: [] as any,
        },
      });

      // Обновляем статус AI задачи
      await prisma.aiJob.update({
        where: { id: job.id },
        data: { 
          status: 'COMPLETED',
          result: aiResponse
        }
      });

      // Публикуем сообщение через Redis
      const redisPub = new Redis({
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: Number(process.env.REDIS_PORT) || 6379,
      });

      await redisPub.publish(
        `chat:${chatId}`,
        JSON.stringify({
          type: 'message_new',
          payload: { message: aiMessage }
        })
      );

      await redisPub.quit();

      console.log(`AI job ${job.id} completed successfully`);
      
      return { success: true, messageId: aiMessage.id };
      
    } catch (error) {
      console.error(`AI job ${job.id} failed:`, error);

      const safeMessage =
        'Извини, сейчас ассистент временно недоступен. Попробуй, пожалуйста, ещё раз позже.';

      try {
        await prisma.aiJob.update({
          where: { id: job.id as string },
          data: {
            status: 'FAILED',
            result: error instanceof Error ? error.message : String(error),
          },
        });

        // Пишем в чат системное сообщение об ошибке ассистента
        if (chatId) {
          await prisma.message.create({
            data: {
              chatId,
              senderId: 'system',
              type: 'text',
              content: safeMessage,
              deliveredTo: [] as any,
              seenBy: [] as any,
            },
          });
        }
      } catch (persistError) {
        console.error(`Failed to persist AI job failure for ${job.id}:`, persistError);
      }

      throw error;
    }
  },
      {
        connection: {
          host: redisHost,
          port: redisPort,
          retryStrategy: (times) => {
            const delay = Math.min(times * 50, 2000);
            console.log(`⏳ Redis reconnecting... (attempt ${times}, delay ${delay}ms)`);
            return delay;
          },
        },
        concurrency: Number(process.env.AI_WORKER_CONCURRENCY) || 2,
      }
    );

    console.log('🚀 AI Worker starting...');
    console.log(`   Queue: ai-jobs`);
    console.log(`   Redis: ${redisHost}:${redisPort}`);
    console.log(`   OpenAI: ${process.env.OPENAI_API_KEY ? '✅ Configured' : '❌ Not set'}`);
    console.log('');

    worker.on('completed', (job) => {
      console.log(`✅ AI job ${job.id} completed successfully`);
    });

    worker.on('failed', (job, err) => {
      console.error(`❌ AI job ${job?.id} failed:`, err.message || err);
    });

    worker.on('error', (err) => {
      console.error('❌ Worker error:', err.message || err);
    });

    process.on('SIGINT', async () => {
      console.log('Shutting down AI worker...');
      await worker.close();
      await prisma.$disconnect();
      process.exit(0);
    });
  })
  .catch((err) => {
    console.error('Failed to start AI worker:', err.message);
    process.exit(1);
  });