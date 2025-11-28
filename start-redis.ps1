# Скрипт для запуска Redis на Windows

Write-Host "🔍 Проверка доступных способов запуска Redis..." -ForegroundColor Cyan

# Вариант 1: Docker
Write-Host "`n1️⃣ Попытка запустить через Docker..." -ForegroundColor Yellow
try {
    $dockerCheck = docker ps 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Docker доступен" -ForegroundColor Green
        
        # Проверяем, есть ли уже контейнер
        $existing = docker ps -a --filter "name=redis-zima" --format "{{.Names}}" 2>&1
        if ($existing -eq "redis-zima") {
            Write-Host "   🔄 Запускаю существующий контейнер..." -ForegroundColor Yellow
            docker start redis-zima
        } else {
            Write-Host "   🚀 Создаю новый контейнер Redis..." -ForegroundColor Yellow
            docker run -d -p 6379:6379 --name redis-zima redis:alpine
        }
        
        Start-Sleep -Seconds 2
        $redisCheck = Test-NetConnection -ComputerName localhost -Port 6379 -WarningAction SilentlyContinue
        if ($redisCheck.TcpTestSucceeded) {
            Write-Host "   ✅ Redis запущен и доступен на порту 6379!" -ForegroundColor Green
            exit 0
        }
    }
} catch {
    Write-Host "   ❌ Docker недоступен или не запущен" -ForegroundColor Red
}

# Вариант 2: WSL
Write-Host "`n2️⃣ Попытка запустить через WSL..." -ForegroundColor Yellow
try {
    $wslCheck = wsl --list --quiet 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ WSL доступен" -ForegroundColor Green
        Write-Host "   🔄 Запускаю Redis в WSL..." -ForegroundColor Yellow
        
        wsl bash -c "sudo service redis-server start 2>&1 || (echo 'Redis не установлен в WSL. Установите: sudo apt-get update && sudo apt-get install -y redis-server')"
        
        Start-Sleep -Seconds 2
        $redisCheck = Test-NetConnection -ComputerName localhost -Port 6379 -WarningAction SilentlyContinue
        if ($redisCheck.TcpTestSucceeded) {
            Write-Host "   ✅ Redis запущен через WSL!" -ForegroundColor Green
            exit 0
        }
    }
} catch {
    Write-Host "   ❌ WSL недоступен" -ForegroundColor Red
}

# Вариант 3: Проверка, может Redis уже запущен
Write-Host "`n3️⃣ Проверка, может Redis уже запущен..." -ForegroundColor Yellow
$redisCheck = Test-NetConnection -ComputerName localhost -Port 6379 -WarningAction SilentlyContinue
if ($redisCheck.TcpTestSucceeded) {
    Write-Host "   ✅ Redis уже запущен!" -ForegroundColor Green
    exit 0
}

# Если ничего не сработало
Write-Host "`n❌ Не удалось автоматически запустить Redis" -ForegroundColor Red
Write-Host "`n💡 Ручные варианты:" -ForegroundColor Cyan
Write-Host "   1. Запусти Docker Desktop и выполни:" -ForegroundColor White
Write-Host "      docker run -d -p 6379:6379 --name redis-zima redis:alpine" -ForegroundColor Gray
Write-Host "`n   2. Или установи Redis для Windows:" -ForegroundColor White
Write-Host "      https://github.com/microsoftarchive/redis/releases" -ForegroundColor Gray
Write-Host "`n   3. Или используй WSL:" -ForegroundColor White
Write-Host "      wsl" -ForegroundColor Gray
Write-Host "      sudo apt-get update" -ForegroundColor Gray
Write-Host "      sudo apt-get install -y redis-server" -ForegroundColor Gray
Write-Host "      sudo service redis-server start" -ForegroundColor Gray

exit 1


