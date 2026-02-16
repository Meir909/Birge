const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware для проверки JWT токена
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Требуется авторизация'
      });
    }
    
    const token = authHeader.substring(7);
    
    // Проверяем токен в черном списке (если используется Redis)
    if (global.redis) {
      const isBlacklisted = await global.redis.get(`blacklist_${token}`);
      if (isBlacklisted) {
        return res.status(401).json({
          success: false,
          message: 'Токен недействителен'
        });
      }
    }
    
    // Декодируем токен
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Неверный токен'
      });
    }
    
    // Получаем пользователя
    const user = await User.findById(decoded.id);
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Пользователь не найден или неактивен'
      });
    }
    
    // Добавляем пользователя в запрос
    req.user = user;
    req.token = token;
    
    next();
  } catch (error) {
    console.error('Ошибка аутентификации:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка аутентификации'
    });
  }
};

// Middleware для проверки роли
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Требуется авторизация'
      });
    }
    
    const userRole = req.user.role;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Недостаточно прав'
      });
    }
    
    next();
  };
};

// Middleware для проверки верификации
const requireVerification = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Требуется авторизация'
    });
  }
  
  if (!req.user.verification.isVerified) {
    return res.status(403).json({
      success: false,
      message: 'Требуется верификация профиля'
    });
  }
  
  next();
};

// Middleware для проверки доступа к ресурсу
const requireOwnership = (resourceField = 'user') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Требуется авторизация'
      });
    }
    
    // Проверяем, является ли пользователь владельцем ресурса
    const resourceUserId = req.params.userId || req.body[resourceField] || req.query[resourceField];
    
    if (resourceUserId && resourceUserId !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Доступ запрещен'
      });
    }
    
    next();
  };
};

// Middleware для проверки членства в группе
const requireGroupMembership = async (req, res, next) => {
  try {
    const groupId = req.params.groupId || req.body.groupId;
    
    if (!groupId) {
      return res.status(400).json({
        success: false,
        message: 'ID группы обязателен'
      });
    }
    
    const Group = require('../models/Group');
    const group = await Group.findById(groupId);
    
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Группа не найдена'
      });
    }
    
    // Проверяем, является ли пользователь участником группы
    const isMember = group.isMember(req.user._id);
    
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'Вы не являетесь участником этой группы'
      });
    }
    
    req.group = group;
    next();
  } catch (error) {
    console.error('Ошибка проверки членства в группе:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка проверки членства в группе'
    });
  }
};

// Middleware для проверки роли в группе
const requireGroupRole = (roles) => {
  return (req, res, next) => {
    if (!req.group) {
      return res.status(400).json({
        success: false,
        message: 'Группа не найдена'
      });
    }
    
    const userRole = req.group.getMemberRole(req.user._id);
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Недостаточно прав в группе'
      });
    }
    
    next();
  };
};

// Middleware для проверки доступа к поездке
const requireTripAccess = async (req, res, next) => {
  try {
    const tripId = req.params.tripId || req.body.tripId;
    
    if (!tripId) {
      return res.status(400).json({
        success: false,
        message: 'ID поездки обязателен'
      });
    }
    
    const Trip = require('../models/Trip');
    const trip = await Trip.findById(tripId).populate('group driver passengers.user');
    
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Поездка не найдена'
      });
    }
    
    // Проверяем, имеет ли пользователь доступ к поездке
    const hasAccess = 
      trip.driver._id.toString() === req.user._id.toString() ||
      trip.passengers.some(p => p.user._id.toString() === req.user._id.toString()) ||
      trip.group.isMember(req.user._id);
    
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Доступ к поездке запрещен'
      });
    }
    
    req.trip = trip;
    next();
  } catch (error) {
    console.error('Ошибка проверки доступа к поездке:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка проверки доступа к поездке'
    });
  }
};

// Middleware для rate limiting
const createRateLimit = (windowMs, max, message) => {
  const attempts = new Map();
  
  return (req, res, next) => {
    const key = req.ip + (req.user ? req.user._id : '');
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Очищаем старые попытки
    if (attempts.has(key)) {
      const userAttempts = attempts.get(key).filter(time => time > windowStart);
      attempts.set(key, userAttempts);
    }
    
    const userAttempts = attempts.get(key) || [];
    
    if (userAttempts.length >= max) {
      return res.status(429).json({
        success: false,
        message: message || 'Слишком много запросов'
      });
    }
    
    userAttempts.push(now);
    attempts.set(key, userAttempts);
    
    next();
  };
};

// Middleware для логирования запросов
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.user ? req.user._id : null
    };
    
    console.log('Request:', log);
    
    // В продакшене можно отправлять в логгинг сервис
    if (process.env.NODE_ENV === 'production') {
      // Winston или другой логгер
    }
  });
  
  next();
};

// Middleware для CORS
const corsHandler = (req, res, next) => {
  const origin = req.get('Origin');
  const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : ['http://localhost:3000'];
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
};

// Middleware для валидации ID
const validateId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Неверный формат ID'
      });
    }
    
    next();
  };
};

module.exports = {
  authenticateToken,
  requireRole,
  requireVerification,
  requireOwnership,
  requireGroupMembership,
  requireGroupRole,
  requireTripAccess,
  createRateLimit,
  requestLogger,
  corsHandler,
  validateId
};
