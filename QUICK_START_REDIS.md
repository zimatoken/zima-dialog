# 🚀 Быстрый запуск Redis

## Вариант 1: Docker (Самый простой)

### Шаг 1: Запусти Docker Desktop
Открой Docker Desktop и дождись, пока он полностью запустится (иконка в трее станет зеленой).

### Шаг 2: Запусти Redis контейнер
```powershell
docker run -d -p 6379:6379 --name redis-zima redis:alpine
```

### Шаг 3: Проверь, что Redis работает
```powershell
Test-NetConnection -ComputerName localhost -Port 6379
```

Должно показать: `TcpTestSucceeded : True`

---

## Вариант 2: WSL (Если Docker не работает)

### Шаг 1: Открой WSL
```powershell
wsl
```

### Шаг 2: Установи Redis (если еще не установлен)
```bash
sudo apt-get update
sudo apt-get install -y redis-server
```

### Шаг 3: Запусти Redis
```bash
sudo service redis-server start
```

### Шаг 4: Проверь (в PowerShell)
```powershell
Test-NetConnection -ComputerName localhost -Port 6379
```

---

## Вариант 3: Windows Native Redis

1. Скачай Redis для Windows: https://github.com/microsoftarchive/redis/releases
2. Распакуй архив
3. Запусти `redis-server.exe`

---

## ✅ После запуска Redis

1. **Запусти основной сервер** (в первом терминале):
   ```bash
   npm run dev
   ```

2. **Запусти AI-воркер** (во втором терминале):
   ```bash
   npm run worker:ai
   ```

   Теперь должно показать:
   ```
   ✅ Redis connected: 127.0.0.1:6379
   🚀 AI Worker starting...
   ```

3. **Проверь работу**:
   ```powershell
   Invoke-RestMethod -Uri "http://localhost:3000/v0/auth/send-code" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"phone": "+79990000000"}'
   ```

---

## 🔧 Если Redis уже запущен в Docker

Если контейнер уже существует, просто запусти его:
```powershell
docker start redis-zima
```

Проверь статус:
```powershell
docker ps | findstr redis
```


