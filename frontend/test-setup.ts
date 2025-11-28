import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Создаем тестового пользователя
  const user = await prisma.user.create({
    data: {
      email: 'test@zima.com',
      name: 'Test User',
    },
  });

  // Создаем тестовый чат
  const chat = await prisma.chat.create({
    data: {
      name: 'Test Chat',
      type: 'DIRECT',
    },
  });

  // Добавляем пользователя в чат
  await prisma.chatMember.create({
    data: {
      userId: user.id,
      chatId: chat.id,
      role: 'OWNER',
    },
  });

  console.log('✅ Test data created:', { userId: user.id, chatId: chat.id });
}

main();