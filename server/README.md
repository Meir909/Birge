# BIRoad Server

Полнофункциональный бэкенд сервер для карпул-сервиса BIRoad с поддержкой MongoDB, WebSocket, аутентификации и готовностью к продакшену.

## 🚀 Возможности

- **🔐 Аутентификация**: JWT токены, SMS верификация
- **📱 WebSocket**: Реальное время для чатов и отслеживания поездок
- **🗄️ MongoDB**: Мощная NoSQL база данных с геолокацией
- **🚗 Управление группами**: Создание, поиск, управление карпул-группами
- **🛣️ Поездки**: Отслеживание, маршруты, статистика
- **💬 Сообщения**: Чаты в группах с реакциями и ответами
- **📍 Геолокация**: Поиск nearby групп, оптимизация маршрутов
- **🔔 Уведомления**: Push, email, SMS уведомления
- **📊 Мониторинг**: Prometheus + Grafana
- **🐳 Docker**: Полная контейнеризация
- **🔒 Безопасность**: Rate limiting, CORS, Helmet

## 📋 Требования

- Node.js 16+
- MongoDB 6.0+
- Redis 7+ (опционально)
- Docker & Docker Compose (опционально)

## 🛠️ Установка и запуск

### 1. Клонирование и установка

```bash
# Клонируем репозиторий
git clone https://github.com/your-username/biroad.git
cd biroad/server

# Устанавливаем зависимости
npm install
```

### 2. Настройка окружения

```bash
# Копируем файл окружения
cp .env.example .env

# Редактируем .env файл
nano .env
```

**Обязательные переменные:**
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/biroad
JWT_SECRET=your-super-secret-jwt-key
```

### 3. Запуск с Docker (рекомендуется)

```bash
# Запускаем все сервисы
docker-compose up -d

# Проверяем статус
docker-compose ps

# Смотрим логи
docker-compose logs -f app
```

### 4. Запуск без Docker

```bash
# Запускаем MongoDB и Redis (если локально)
mongod
redis-server

# Запускаем миграции
npm run migrate

# Наполняем тестовыми данными
npm run seed

# Запускаем сервер
npm run dev
```

## 🗂️ Структура проекта

```
server/
├── models/                 # Mongoose модели
│   ├── User.js            # Пользователи
│   ├── Group.js           # Группы
│   ├── Trip.js            # Поездки
│   └── Message.js         # Сообщения
├── routes/                # API маршруты
│   ├── auth.js            # Аутентификация
│   ├── users.js           # Пользователи
│   ├── groups.js          # Группы
│   ├── trips.js           # Поездки
│   ├── messages.js        # Сообщения
│   └── notifications.js   # Уведомления
├── middleware/            # Middleware
│   ├── auth.js            # Аутентификация
│   └── errorHandler.js    # Обработка ошибок
├── scripts/               # Скрипты
│   ├── seed.js            # Тестовые данные
│   └── migrate.js         # Миграции
├── uploads/               # Загрузки файлов
├── logs/                  # Логи
├── docker-compose.yml     # Docker конфигурация
├── Dockerfile            # Docker образ
├── package.json          # Зависимости
└── server.js             # Главный файл
```

## 📡 API Эндпоинты

### Аутентификация
```
POST /api/auth/send-sms      # Отправка SMS кода
POST /api/auth/login         # Вход по SMS коду
POST /api/auth/register      # Регистрация/обновление профиля
POST /api/auth/refresh       # Обновление токена
POST /api/auth/logout        # Выход
GET  /api/auth/verify        # Проверка токена
```

### Пользователи
```
GET    /api/users/profile    # Профиль пользователя
PUT    /api/users/profile    # Обновление профиля
POST   /api/users/avatar     # Загрузка аватара
GET    /api/users/settings   # Настройки
PUT    /api/users/settings   # Обновление настроек
GET    /api/users/stats      # Статистика
```

### Группы
```
GET    /api/groups           # Поиск групп
POST   /api/groups           # Создание группы
GET    /api/groups/:id       # Детали группы
PUT    /api/groups/:id       # Обновление группы
DELETE /api/groups/:id       # Удаление группы
POST   /api/groups/:id/join  # Присоединение к группе
POST   /api/groups/:id/leave # Выход из группы
```

### Поездки
```
GET    /api/trips            # Поездки пользователя
POST   /api/trips            # Создание поездки
GET    /api/trips/:id        # Детали поездки
PUT    /api/trips/:id        # Обновление поездки
DELETE /api/trips/:id        # Отмена поездки
PUT    /api/trips/:id/status # Обновление статуса
```

### Сообщения
```
GET    /api/messages/:groupId # Сообщения группы
POST   /api/messages/:groupId # Отправка сообщения
PUT    /api/messages/:id     # Редактирование сообщения
DELETE /api/messages/:id     # Удаление сообщения
POST   /api/messages/:id/reaction # Добавление реакции
```

## 🔌 WebSocket События

### Клиент → Сервер
```javascript
socket.emit('authenticate', token)           // Аутентификация
socket.emit('join_group', groupId)            // Присоединение к группе
socket.emit('send_message', data)             // Отправка сообщения
socket.emit('trip_update', data)              // Обновление поездки
```

### Сервер → Клиент
```javascript
socket.on('authenticated', data)             // Успешная аутентификация
socket.on('new_message', data)                // Новое сообщение
socket.on('trip_status_update', data)         // Обновление поездки
socket.on('group_update', data)               // Обновление группы
socket.on('notification', data)               // Уведомление
```

## 🗄️ Модели данных

### User
```javascript
{
  name: String,
  phone: String,
  email: String,
  role: 'driver' | 'parent' | 'both',
  school: String,
  grade: String,
  vehicle: {
    make: String,
    model: String,
    color: String,
    licensePlate: String,
    capacity: Number
  },
  location: {
    type: 'Point',
    coordinates: [Number, Number]
  },
  verification: {
    isVerified: Boolean,
    documents: [String]
  },
  rating: {
    average: Number,
    count: Number
  }
}
```

### Group
```javascript
{
  name: String,
  school: String,
  type: 'morning' | 'evening' | 'both',
  creator: ObjectId,
  driver: ObjectId,
  members: [{
    user: ObjectId,
    role: 'driver' | 'parent' | 'admin'
  }],
  route: {
    origin: Object,
    destination: Object,
    waypoints: [Object]
  },
  schedule: Object,
  capacity: {
    total: Number,
    available: Number
  }
}
```

### Trip
```javascript
{
  group: ObjectId,
  driver: ObjectId,
  passengers: [Object],
  route: Object,
  schedule: Object,
  status: 'scheduled' | 'in_progress' | 'completed',
  progress: {
    percentage: Number,
    currentLocation: Object
  },
  metrics: {
    distance: Object,
    duration: Object,
    co2: Object
  }
}
```

## 🐳 Docker Развертывание

### Продакшен
```bash
# Создаем .env файл для продакшена
cp .env.example .env.production

# Редактируем переменные
nano .env.production

# Собираем и запускаем
docker-compose -f docker-compose.prod.yml up -d
```

### Мониторинг
```bash
# Prometheus
http://localhost:9090

# Grafana
http://localhost:3001
# Логин: admin
# Пароль: admin123
```

## 🚀 Деплоймент

### Heroku
```bash
# Устанавливаем Heroku CLI
heroku login

# Создаем приложение
heroku create biroad-server

# Добавляем MongoDB addon
heroku addons:create mongolab

# Устанавливаем переменные окружения
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret

# Деплой
git subtree push --prefix server heroku main
```

### AWS
```bash
# Используем AWS ECS или Elastic Beanstalk
# См. документацию по развертыванию Node.js приложений
```

### VPS
```bash
# Устанавливаем PM2
npm install -g pm2

# Запускаем приложение
pm2 start server.js --name biroad-server

# Сохраняем конфигурацию
pm2 save
pm2 startup
```

## 📊 Мониторинг и логирование

### Winston логирование
```javascript
// Уровни логов
error: 0,
warn: 1,
info: 2,
http: 3,
debug: 4
```

### Метрики Prometheus
- HTTP запросы
- Время ответа
- Количество пользователей
- Активные поездки
- Ошибки API

## 🔧 Разработка

### Тестирование
```bash
# Запуск тестов
npm test

# Тесты в режиме watch
npm run test:watch

# Покрытие кода
npm run test:coverage
```

### Линтинг
```bash
# Проверка кода
npm run lint

# Автофикс
npm run lint:fix
```

### Миграции
```bash
# Создание миграции
npm run migrate:create add_new_field

# Запуск миграций
npm run migrate

# Откат миграции
npm run migrate:rollback
```

## 🔒 Безопасность

- **JWT токены** с истечением срока действия
- **Rate limiting** для предотвращения атак
- **CORS** настройка для доменов
- **Helmet** для HTTP заголовков
- **bcryptjs** для хеширования паролей
- **Валидация** входных данных
- **Санитизация** пользовательского контента

## 📈 Производительность

- **MongoDB индексы** для быстрых запросов
- **Redis кэширование** для частых данных
- **Compression** для ответов
- **Connection pooling** для базы данных
- **CDN** для статических файлов

## 🐛 Отладка

```bash
# Включение debug логов
DEBUG=biroad:* npm run dev

# Просмотр логов Docker
docker-compose logs -f app

# Мониторинг MongoDB
mongostat
mongotop
```

## 📝 Лицензия

MIT License - см. файл LICENSE

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit изменения (`git commit -m 'Add some AmazingFeature'`)
4. Push в branch (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

## 📞 Поддержка

- Email: support@biroad.com
- Telegram: @biroad_support
- Документация: https://docs.biroad.com

---

**BIRoad** - Умный способ организации школьных поездок 🚗👨‍👩‍👧‍👦
