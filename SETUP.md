# 🚀 Настройка и запуск ZIMA-Dialog

## 📋 Предварительные требования

### 1. Установить зависимости проекта
```bash
npm install
```

### 2. Настроить базу данных PostgreSQL

Убедись, что PostgreSQL запущен и создана база данных.

**Создать базу данных:**
```sql
CREATE DATABASE zima_dialog;
```

**Настроить миграции Prisma:**
```bash
npm run prisma:migrate
```

**Сгенерировать Prisma Client:**
```bash
npm run prisma:generate
```

### 3. Установить и запустить Redis

Redis необходим для:
- Очереди задач AI (BullMQ)
- Кэширования SMS-кодов
- WebSocket адаптера

#### Вариант A: Windows (через WSL или Docker)

**Docker (рекомендуется):**
```bash
docker run -d -p 6379:6379 --name redis-zima redis:alpine
```

**Или через WSL:**
```bash
wsl
sudo apt-get update
sudo apt-get install redis-server
sudo service redis-server start
```

#### Вариант B: Windows Native

1. Скачай Redis для Windows: https://github.com/microsoftarchive/redis/releases
2. Распакуй и запусти `redis-server.exe`

#### Проверка Redis:
```bash
# В PowerShell
Test-NetConnection -ComputerName localhost -Port 6379

# Или через Redis CLI (если установлен)
redis-cli ping
# Должен ответить: PONG
```

### 4. Настроить переменные окружения

Создай файл `.env` в корне проекта:

```env
# Обязательные
JWT_SECRET=твой_очень_сложный_секретный_ключ_минимум_32_символа
DATABASE_URL=postgresql://user:password@localhost:5432/zima_dialog
OPENAI_API_KEY=sk-твой_ключ_openai

# Redis (опционально, если не стандартные)
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# S3 для медиа (опционально, если не используешь)
S3_ENDPOINT=https://s3.amazonaws.com
S3_REGION=us-east-1
S3_BUCKET=zima-media
S3_KEY=твой_access_key
S3_SECRET=твой_secret_key
CDN_URL=https://cdn.zima.chat

# CORS (опционально)
CORS_ORIGINS=http://localhost:3001,http://localhost:5173

# Rate limiting (опционально)
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=120

# Порт сервера (опционально)
PORT=3000
```

## 🚀 Запуск проекта

### Шаг 1: Запустить основной сервер

В **первом терминале**:
```bash
npm run dev
```

Ожидаемый вывод:
```
❄️ ZIMA-Dialog running on port 3000
Pocket secretary alive.
```

### Шаг 2: Запустить AI-воркер

В **втором терминале**:
```bash
npm run worker:ai
```

Ожидаемый вывод:
```
✅ Redis connected: 127.0.0.1:6379
🚀 AI Worker starting...
   Queue: ai-jobs
   Redis: 127.0.0.1:6379
   OpenAI: ✅ Configured
```

### Шаг 3: Проверить работу

**Проверка сервера:**
```powershell
# PowerShell
Invoke-RestMethod -Uri "http://localhost:3000/v0/auth/send-code" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"phone": "+79990000000"}'
```

**Ожидаемый ответ:**
```json
{"ttl":300}
```

**В логах сервера увидишь:**
```
(DEV) SMS code for +79990000000: 1234
```

## 🔧 Решение проблем

### Ошибка: "ECONNREFUSED 127.0.0.1:6379"

**Проблема:** Redis не запущен

**Решение:**
1. Проверь, что Redis запущен:
   ```bash
   # Docker
   docker ps | grep redis
   
   # WSL
   wsl
   sudo service redis-server status
   ```

2. Запусти Redis:
   ```bash
   # Docker
   docker start redis-zima
   
   # WSL
   sudo service redis-server start
   ```

### Ошибка: "Connection refused" на порту 3000

**Проблема:** Основной сервер не запущен

**Решение:**
1. Убедись, что запущен `npm run dev`
2. Проверь, не занят ли порт 3000 другим процессом:
   ```powershell
   netstat -ano | findstr :3000
   ```

### Ошибка: "OPENAI_API_KEY is not set"

**Проблема:** Не задан ключ OpenAI

**Решение:**
1. Добавь `OPENAI_API_KEY` в `.env`
2. Перезапусти воркер

### Ошибка: "JWT_SECRET environment variable is required"

**Проблема:** Не задан JWT секрет

**Решение:**
1. Добавь `JWT_SECRET` в `.env` (минимум 32 символа)
2. Перезапусти сервер

### Ошибка: "Cannot connect to database"

**Проблема:** PostgreSQL не запущен или неправильный DATABASE_URL

**Решение:**
1. Проверь, что PostgreSQL запущен
2. Проверь `DATABASE_URL` в `.env`
3. Убедись, что база данных создана:
   ```sql
   CREATE DATABASE zima_dialog;
   ```
4. Запусти миграции:
   ```bash
   npm run prisma:migrate
   ```

## 📝 Проверка всех компонентов

### Чеклист перед тестированием:

- [ ] PostgreSQL запущен и база данных создана
- [ ] Redis запущен (проверь: `redis-cli ping`)
- [ ] `.env` файл настроен со всеми обязательными переменными
- [ ] Prisma миграции применены (`npm run prisma:migrate`)
- [ ] Основной сервер запущен (`npm run dev`)
- [ ] AI-воркер запущен (`npm run worker:ai`)

### Быстрая проверка:

```powershell
# 1. Проверка Redis
Test-NetConnection -ComputerName localhost -Port 6379

# 2. Проверка сервера
Invoke-RestMethod -Uri "http://localhost:3000" -Method GET

# 3. Проверка auth endpoint
Invoke-RestMethod -Uri "http://localhost:3000/v0/auth/send-code" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"phone": "+79990000000"}'
```

## 🎯 Следующие шаги

После успешного запуска:
1. ✅ Следуй инструкциям из `TEST_AI.md` для тестирования AI-секретаря
2. ✅ Настрой фронтенд (React + Socket.IO)
3. ✅ Интегрируй UI с API


