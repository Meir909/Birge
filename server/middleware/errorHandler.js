const mongoose = require('mongoose');

// Обработка ошибок Mongoose
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map(error => ({
    field: error.path,
    message: error.message
  }));
  
  return {
    success: false,
    message: 'Ошибка валидации',
    errors: errors
  };
};

// Обработка ошибок дублирования ключей
const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  
  return {
    success: false,
    message: `${field} со значением "${value}" уже существует`
  };
};

// Обработка ошибок кастомных валидаций
const handleCastError = (err) => {
  return {
    success: false,
    message: `Неверный формат ${err.path}: ${err.value}`
  };
};

// Обработка ошибок JWT
const handleJWTError = () => {
  return {
    success: false,
    message: 'Неверный токен. Пожалуйста, войдите снова'
  };
};

// Обработка истечения JWT
const handleJWTExpiredError = () => {
  return {
    success: false,
    message: 'Срок действия токена истек. Пожалуйста, войдите снова'
  };
};

// Обработка ошибок загрузки файлов
const handleMulterError = (err) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return {
      success: false,
      message: 'Файл слишком большой'
    };
  }
  
  if (err.code === 'LIMIT_FILE_COUNT') {
    return {
      success: false,
      message: 'Слишком много файлов'
    };
  }
  
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return {
      success: false,
      message: 'Неподдерживаемый тип файла'
    };
  }
  
  return {
    success: false,
    message: 'Ошибка загрузки файла'
  };
};

// Основной обработчик ошибок
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Логирование ошибки
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userId: req.user ? req.user._id : null,
    timestamp: new Date().toISOString()
  });

  // Ошибка валидации Mongoose
  if (err.name === 'ValidationError') {
    const validationError = handleValidationError(err);
    return res.status(400).json(validationError);
  }

  // Ошибка дублирования ключа
  if (err.code === 11000) {
    const duplicateError = handleDuplicateKeyError(err);
    return res.status(400).json(duplicateError);
  }

  // Ошибка приведения типов
  if (err.name === 'CastError') {
    const castError = handleCastError(err);
    return res.status(400).json(castError);
  }

  // Ошибка JWT
  if (err.name === 'JsonWebTokenError') {
    const jwtError = handleJWTError();
    return res.status(401).json(jwtError);
  }

  // Истечение JWT
  if (err.name === 'TokenExpiredError') {
    const expiredError = handleJWTExpiredError();
    return res.status(401).json(expiredError);
  }

  // Ошибка Multer
  if (err.name === 'MulterError') {
    const multerError = handleMulterError(err);
    return res.status(400).json(multerError);
  }

  // Ошибка синтаксиса MongoDB
  if (err.name === 'MongoSyntaxError') {
    return res.status(400).json({
      success: false,
      message: 'Ошибка в запросе к базе данных'
    });
  }

  // Ошибка подключения к MongoDB
  if (err.name === 'MongoNetworkError' || err.name === 'MongoTimeoutError') {
    return res.status(503).json({
      success: false,
      message: 'Ошибка подключения к базе данных'
    });
  }

  // Ошибка валидации Express Validator
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      message: 'Неверный формат JSON'
    });
  }

  // Ошибка ограничения размера запроса
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      message: 'Запрос слишком большой'
    });
  }

  // Ошибка кодировки
  if (err.type === 'entity.encoding.failed') {
    return res.status(400).json({
      success: false,
      message: 'Неверная кодировка'
    });
  }

  // Кастомные ошибки приложения
  if (err.isOperational) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message
    });
  }

  // Ошибка по умолчанию
  res.status(err.statusCode || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'Внутренняя ошибка сервера'
  });
};

// Класс для кастомных ошибок
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Async error wrapper
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 404 handler
const notFound = (req, res, next) => {
  const error = new AppError(`Маршрут ${req.originalUrl} не найден`, 404);
  next(error);
};

// Глобальный обработчик необработанных Promise rejection
process.on('unhandledRejection', (err, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', err);
  
  // В продакшене можно завершить процесс
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

// Глобальный обработчик необработанных исключений
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  
  // Завершаем процесс
  process.exit(1);
});

// Обработка сигналов для graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received');
  process.exit(0);
});

module.exports = {
  errorHandler,
  AppError,
  catchAsync,
  notFound
};
