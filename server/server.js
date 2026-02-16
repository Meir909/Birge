const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');
require('dotenv').config();

// Импорт маршрутов
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const groupRoutes = require('./routes/groups');
const tripRoutes = require('./routes/trips');
const messageRoutes = require('./routes/messages');
const notificationRoutes = require('./routes/notifications');

// Импорт middleware
const errorHandler = require('./middleware/errorHandler');
const authMiddleware = require('./middleware/auth');

// Создание Express приложения
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Порт
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://maps.googleapis.com"],
      connectSrc: ["'self'", "ws:", "wss:", "https://api.openai.com", "https://maps.googleapis.com"]
    }
  }
}));

app.use(compression());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // лимит запросов с одного IP
  message: 'Слишком много запросов с этого IP, попробуйте позже.'
});
app.use('/api/', limiter);

// Парсинг JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Статические файлы фронтенда
app.use(express.static(path.join(__dirname, '../biroad-front')));

// API маршруты
app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/groups', authMiddleware, groupRoutes);
app.use('/api/trips', authMiddleware, tripRoutes);
app.use('/api/messages', authMiddleware, messageRoutes);
app.use('/api/notifications', authMiddleware, notificationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Обработка фронтенда routes (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../biroad-front/index.html'));
});

// WebSocket обработчики
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('Пользователь подключился:', socket.id);

  // Аутентификация WebSocket
  socket.on('authenticate', async (token) => {
    try {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      connectedUsers.set(decoded.id, socket);
      
      socket.emit('authenticated', { success: true });
      console.log(`Пользователь ${decoded.id} аутентифицирован`);
    } catch (error) {
      socket.emit('authentication_error', { message: 'Invalid token' });
    }
  });

  // Присоединение к комнате группы
  socket.on('join_group', (groupId) => {
    socket.join(`group_${groupId}`);
    console.log(`Пользователь ${socket.userId} присоединился к группе ${groupId}`);
  });

  // Отправка сообщения в реальном времени
  socket.on('send_message', async (data) => {
    try {
      const { groupId, message, senderId } = data;
      
      // Сохранение сообщения в базу данных
      const Message = require('./models/Message');
      const newMessage = new Message({
        groupId,
        senderId,
        content: message,
        timestamp: new Date()
      });
      
      await newMessage.save();
      
      // Отправка сообщения всем в группе
      io.to(`group_${groupId}`).emit('new_message', {
        id: newMessage._id,
        groupId,
        senderId,
        content: message,
        timestamp: newMessage.timestamp
      });
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Обновление статуса поездки
  socket.on('trip_update', async (data) => {
    try {
      const { tripId, status, location } = data;
      
      // Обновление в базе данных
      const Trip = require('./models/Trip');
      await Trip.findByIdAndUpdate(tripId, {
        status,
        lastLocation: location,
        updatedAt: new Date()
      });
      
      // Отправка обновления всем участникам
      io.emit('trip_status_update', {
        tripId,
        status,
        location,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Ошибка обновления поездки:', error);
    }
  });

  // Отключение
  socket.on('disconnect', () => {
    if (socket.userId) {
      connectedUsers.delete(socket.userId);
      console.log(`Пользователь ${socket.userId} отключился`);
    }
  });
});

// Глобальная переменная для WebSocket
global.io = io;

// Обработка ошибок
app.use(errorHandler);

// Подключение к MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/biroad', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Подключено к MongoDB');
})
.catch((error) => {
  console.error('Ошибка подключения к MongoDB:', error);
  process.exit(1);
});

// Запуск сервера
server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`Frontend: http://localhost:${PORT}`);
    console.log(`API: http://localhost:${PORT}/api`);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

module.exports = app;
