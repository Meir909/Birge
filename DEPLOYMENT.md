# 🚀 Развертывание BIRoad

## 📋 Выбор платформы хостинга

### 🌐 Рекомендуемые варианты:

#### 1. **Vercel** (рекомендуется для фронтенда)
- ✅ Бесплатный план
- ✅ Автоматический деплой из Git
- ✅ CDN по всему миру
- ✅ SSL сертификаты
- ❌ Только для фронтенда

#### 2. **Heroku** (рекомендуется для бэкенда)
- ✅ Бесплатный план
- ✅ Поддержка Node.js
- ✅ MongoDB addon
- ✅ Простая настройка
- ❌ Ограничения бесплатного плана

#### 3. **Railway** (современная альтернатива Heroku)
- ✅ Более щедрый бесплатный план
- ✅ Поддержка Docker
- ✅ Встроенная база данных
- ✅ Простая настройка

#### 4. **DigitalOcean** (для продакшена)
- ✅ Полный контроль
- ✅ Высокая производительность
- ✅ Доступная цена
- ❌ Требует настройки

## 🎯 План развертывания:

### **Вариант 1: Vercel + Railway (рекомендуется)**
- Фронтенд: Vercel
- Бэкенд: Railway
- База данных: Railway PostgreSQL

### **Вариант 2: Heroku (полностью)**
- Фронтенд: Heroku Static Sites
- Бэкенд: Heroku Dyno
- База данных: MongoDB Atlas

### **Вариант 3: DigitalOcean (продакшен)**
- Все на одном VPS сервере
- Docker контейнеры
- Nginx reverse proxy

---

## 🚀 **Вариант 1: Vercel + Railway**

### Шаг 1: Подготовка к деплою

```bash
# 1. Убедитесь что все изменения сохранены
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Обновите package.json для продакшена
cd server
npm install --production
```

### Шаг 2: Деплой фронтенда на Vercel

1. **Зарегистрируйтесь на [vercel.com](https://vercel.com)**
2. **Импортируйте проект из GitHub**
3. **Настройте переменные окружения:**

```bash
# Vercel Environment Variables
GOOGLE_MAPS_API_KEY=AIzaSyABXU6o38OxHCQPLCIvlMCn0dy_krVr60I
GEMINI_API_KEY=AQ.Ab8RN6IDR2Y76xkoviNCdeBLl4U7IdCWjoRq7zB1yHKfVqZbjg
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_WS_URL=wss://your-backend.railway.app
```

4. **Разверните проект** - Vercel автоматически соберет и опубликует

### Шаг 3: Деплой бэкенда на Railway

1. **Зарегистрируйтесь на [railway.app](https://railway.app)**
2. **Создайте новый проект из GitHub**
3. **Настройте переменные окружения:**

```bash
# Railway Environment Variables
NODE_ENV=production
PORT=3002
MONGODB_URI=mongodb://mongo:mongo@mongo:27017/railway
JWT_SECRET=your-super-secret-jwt-key
GOOGLE_MAPS_API_KEY=AIzaSyABXU6o38OxHCQPLCIvlMCn0dy_krVr60I
GEMINI_API_KEY=AQ.Ab8RN6IDR2Y76xkoviNCdeBLl4U7IdCWjoRq7zB1yHKfVqZbjg
TWILIO_ACCOUNT_SID=VAeda970d028406bd20c7fa145e0ca9659
TWILIO_AUTH_TOKEN=ff4cf0893f9e98d875e4eb80d2b4f480
```

4. **Добавьте MongoDB сервис:**
   - Нажмите "+ New Service"
   - Выберите "MongoDB"
   - Railway автоматически настроит подключение

5. **Разверните проект** - Railway автоматически соберет и запустит

### Шаг 4: Настройка доменов

1. **Vercel:** Получите бесплатный домен `your-project.vercel.app`
2. **Railway:** Получите домен `your-backend.railway.app`
3. **Обновите фронтенд URL в Railway переменных**

---

## 🚀 **Вариант 2: Heroku**

### Шаг 1: Подготовка

```bash
# Установите Heroku CLI
npm install -g heroku

# Войдите в Heroku
heroku login

# Создайте приложение
heroku create biroad-app
```

### Шаг 2: Настройка переменных

```bash
# Добавьте переменные окружения
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-super-secret-jwt-key
heroku config:set GOOGLE_MAPS_API_KEY=AIzaSyABXU6o38OxHCQPLCIvlMCn0dy_krVr60I
heroku config:set GEMINI_API_KEY=AQ.Ab8RN6IDR2Y76xkoviNCdeBLl4U7IdCWjoRq7zB1yHKfVqZbjg
heroku config:set TWILIO_ACCOUNT_SID=VAeda970d028406bd20c7fa145e0ca9659
heroku config:set TWILIO_AUTH_TOKEN=ff4cf0893f9e98d875e4eb80d2b4f480
```

### Шаг 3: Добавьте MongoDB

```bash
# Добавьте MongoDB addon
heroku addons:create mongolab:sandbox
```

### Шаг 4: Деплой

```bash
# Добавьте buildpack для Node.js
heroku buildpacks:set heroku/nodejs

# Деплой
git push heroku main
```

---

## 🚀 **Вариант 3: DigitalOcean VPS**

### Шаг 1: Создание сервера

1. **Создайте VPS на DigitalOcean**
2. **Выберите Ubuntu 22.04**
3. **Минимум 2GB RAM, 1 CPU**

### Шаг 2: Настройка сервера

```bash
# Подключитесь к серверу
ssh root@your-server-ip

# Обновите систему
apt update && apt upgrade -y

# Установите Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Установите Docker Compose
curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

### Шаг 3: Развертывание

```bash
# Склонируйте проект
git clone https://github.com/your-username/biroad.git
cd biroad/server

# Создайте .env файл
cp .env.example .env
# Отредактируйте .env с реальными ключами

# Запустите Docker Compose
docker-compose up -d
```

### Шаг 4: Настройка Nginx

```bash
# Установите Nginx
apt install nginx -y

# Создайте конфигурацию
nano /etc/nginx/sites-available/biroad
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Фронтенд
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # API
    location /api {
        proxy_pass http://localhost:3002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # WebSocket
    location /socket.io {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

```bash
# Активируйте сайт
ln -s /etc/nginx/sites-available/biroad /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

---

## 🔧 **Проверка деплоя**

### Тестирование API:

```bash
# Health check
curl https://your-backend.railway.app/api/health

# Проверка аутентификации
curl -X POST https://your-backend.railway.app/api/auth/send-sms \
  -H "Content-Type: application/json" \
  -d '{"phone": "+7 (916) 123-45-67"}'
```

### Тестирование фронтенда:

1. Откройте `https://your-project.vercel.app`
2. Проверьте загрузку карт
3. Проверьте подключение к API
4. Протестируйте регистрацию/вход

---

## 📊 **Мониторинг**

### Vercel Analytics:
- Автоматически включен
- Посещаемость, производительность
- Ошибки и метрики

### Railway Logs:
```bash
# Просмотр логов
railway logs

# Мониторинг
railway status
```

### DigitalOcean:
```bash
# Логи Docker
docker-compose logs -f

# Мониторинг ресурсов
htop
docker stats
```

---

## 🔄 **CI/CD Автоматизация**

### GitHub Actions (Vercel + Railway):

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        uses: railway-app/railway-action@v1
        with:
          api-token: ${{ secrets.RAILWAY_TOKEN }}
          service: your-service-id
```

---

## 🚨 **Траблшутинг**

### Частые проблемы:

1. **CORS ошибки:**
   ```bash
   # Убедитесь что CLIENT_URL правильный
   # Проверьте CORS настройки в server.js
   ```

2. **MongoDB подключение:**
   ```bash
   # Проверьте строку подключения
   # Убедитесь что IP в белом списке MongoDB Atlas
   ```

3. **API ключи:**
   ```bash
   # Проверьте что все ключи правильные
   # Убедитесь что нет пробелов в значениях
   ```

4. **WebSocket подключение:**
   ```bash
   # Проверьте WebSocket URL
   # Убедитесь что порт открыт
   ```

---

## 🎯 **Рекомендации**

### Для начала:
- **Vercel + Railway** - самый простой и бесплатный вариант
- Быстрый старт, минимум настроек
- Хорошая масштабируемость

### Для продакшена:
- **DigitalOcean VPS** - полный контроль
- Высокая производительность
- Экономично при росте

### Для команды:
- **Heroku** - простота для команды
- Хорошие инструменты разработки
- Легкий коллаборейшн

---

## 📞 **Поддержка**

Если возникнут проблемы:
1. Проверьте логи
2. Проверьте переменные окружения
3. Проверьте сетевые настройки
4. Напишите в поддержку платформы

**Удачи с деплоем!** 🚀✨
