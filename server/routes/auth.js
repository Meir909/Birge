const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const router = express.Router();

// Генерация SMS кода
const generateSMSCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Отправка SMS (заглушка для демонстрации)
const sendSMS = async (phone, code) => {
  console.log(`SMS код для ${phone}: ${code}`);
  
  // В реальном приложении здесь будет интеграция с Twilio или другим SMS сервисом
  /*
  const twilio = require('twilio');
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  
  await client.messages.create({
    body: `Ваш код подтверждения BIRoad: ${code}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone
  });
  */
  
  return true;
};

// Отправка SMS кода
router.post('/send-sms', [
  body('phone').notEmpty().withMessage('Телефон обязателен')
    .matches(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/).withMessage('Неверный формат телефона')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { phone } = req.body;
    
    // Генерируем и сохраняем код
    const smsCode = generateSMSCode();
    const codeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 минут
    
    // Сохраняем в Redis или базе данных (для демонстрации используем память)
    const smsData = {
      phone,
      code: smsCode,
      expiry: codeExpiry,
      attempts: 0
    };
    
    // В реальном приложении сохраняем в Redis:
    // await redis.setex(`sms_${phone}`, 600, JSON.stringify(smsData));
    
    // Для демонстрации сохраняем в глобальную переменную
    if (!global.smsCodes) global.smsCodes = new Map();
    global.smsCodes.set(phone, smsData);
    
    // Отправляем SMS
    await sendSMS(phone, smsCode);
    
    res.json({
      success: true,
      message: 'Код подтверждения отправлен'
    });
    
  } catch (error) {
    console.error('Ошибка отправки SMS:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка отправки SMS кода'
    });
  }
});

// Вход по SMS коду
router.post('/login', [
  body('phone').notEmpty().withMessage('Телефон обязателен')
    .matches(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/).withMessage('Неверный формат телефона'),
  body('code').notEmpty().withMessage('Код обязателен')
    .isLength({ min: 6, max: 6 }).withMessage('Код должен состоять из 6 цифр')
    .isNumeric().withMessage('Код должен содержать только цифры')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { phone, code } = req.body;
    
    // Проверяем SMS код
    let smsData;
    if (global.smsCodes && global.smsCodes.has(phone)) {
      smsData = global.smsCodes.get(phone);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Сначала запросите SMS код'
      });
    }
    
    // Проверяем срок действия кода
    if (new Date() > smsData.expiry) {
      global.smsCodes.delete(phone);
      return res.status(400).json({
        success: false,
        message: 'Срок действия кода истек'
      });
    }
    
    // Проверяем количество попыток
    if (smsData.attempts >= 3) {
      global.smsCodes.delete(phone);
      return res.status(400).json({
        success: false,
        message: 'Слишком много попыток. Запросите новый код'
      });
    }
    
    // Проверяем код
    if (code !== smsData.code) {
      smsData.attempts++;
      return res.status(400).json({
        success: false,
        message: 'Неверный код подтверждения'
      });
    }
    
    // Удаляем использованный код
    global.smsCodes.delete(phone);
    
    // Ищем или создаем пользователя
    let user = await User.findOne({ phone });
    
    if (!user) {
      // Создаем нового пользователя
      user = new User({
        phone,
        name: 'Пользователь', // Будет обновлено при регистрации
        role: 'parent',
        school: 'Не указана', // Будет обновлено при регистрации
        lastLogin: new Date()
      });
      
      await user.save();
    } else {
      // Обновляем время последнего входа
      user.lastLogin = new Date();
      await user.save();
    }
    
    // Генерируем JWT токен
    const token = jwt.sign(
      { 
        id: user._id, 
        phone: user.phone,
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );
    
    // Обновляем токен в базе данных
    user.token = token;
    await user.save();
    
    res.json({
      success: true,
      message: 'Вход выполнен успешно',
      token: token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        school: user.school,
        grade: user.grade,
        avatar: user.avatar,
        isVerified: user.verification.isVerified,
        lastLogin: user.lastLogin
      }
    });
    
  } catch (error) {
    console.error('Ошибка входа:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка входа'
    });
  }
});

// Регистрация (обновление профиля)
router.post('/register', [
  body('name').notEmpty().withMessage('Имя обязательно')
    .isLength({ min: 2, max: 50 }).withMessage('Имя должно быть от 2 до 50 символов'),
  body('phone').notEmpty().withMessage('Телефон обязателен')
    .matches(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/).withMessage('Неверный формат телефона'),
  body('email').optional().isEmail().withMessage('Неверный формат email'),
  body('school').notEmpty().withMessage('Школа обязательна'),
  body('grade').optional().isString(),
  body('district').optional().isString(),
  body('role').isIn(['driver', 'parent', 'both']).withMessage('Неверная роль'),
  body('vehicle.make').optional().isString(),
  body('vehicle.model').optional().isString(),
  body('vehicle.color').optional().isString(),
  body('vehicle.licensePlate').optional().isString(),
  body('vehicle.capacity').optional().isInt({ min: 1, max: 8 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const {
      name,
      phone,
      email,
      school,
      grade,
      district,
      role,
      vehicle,
      preferences
    } = req.body;
    
    // Проверяем авторизацию
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Требуется авторизация'
      });
    }
    
    const token = authHeader.substring(7);
    let decoded;
    
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Неверный токен'
      });
    }
    
    // Ищем пользователя
    let user = await User.findOne({ phone });
    
    if (!user || user._id.toString() !== decoded.id) {
      return res.status(404).json({
        success: false,
        message: 'Пользователь не найден'
      });
    }
    
    // Обновляем профиль
    user.name = name;
    user.email = email;
    user.school = school;
    user.grade = grade;
    user.district = district;
    user.role = role;
    
    if (vehicle && (role === 'driver' || role === 'both')) {
      user.vehicle = {
        ...user.vehicle,
        ...vehicle
      };
    }
    
    if (preferences) {
      user.preferences = {
        ...user.preferences,
        ...preferences
      };
    }
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Профиль успешно обновлен',
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        school: user.school,
        grade: user.grade,
        district: user.district,
        avatar: user.avatar,
        vehicle: user.vehicle,
        preferences: user.preferences,
        isVerified: user.verification.isVerified
      }
    });
    
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка регистрации'
    });
  }
});

// Обновление токена
router.post('/refresh', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Требуется авторизация'
      });
    }
    
    const token = authHeader.substring(7);
    let decoded;
    
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Неверный токен'
      });
    }
    
    // Генерируем новый токен
    const newToken = jwt.sign(
      { 
        id: decoded.id, 
        phone: decoded.phone,
        role: decoded.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );
    
    res.json({
      success: true,
      token: newToken
    });
    
  } catch (error) {
    console.error('Ошибка обновления токена:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка обновления токена'
    });
  }
});

// Выход
router.post('/logout', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      // В реальном приложении можно добавить токен в черный список
      // await redis.setex(`blacklist_${token}`, 30 * 24 * 60 * 60, 'true');
    }
    
    res.json({
      success: true,
      message: 'Выход выполнен успешно'
    });
    
  } catch (error) {
    console.error('Ошибка выхода:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка выхода'
    });
  }
});

// Проверка токена
router.get('/verify', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Требуется авторизация'
      });
    }
    
    const token = authHeader.substring(7);
    let decoded;
    
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Неверный токен'
      });
    }
    
    // Получаем актуальные данные пользователя
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Пользователь не найден'
      });
    }
    
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        school: user.school,
        grade: user.grade,
        avatar: user.avatar,
        isVerified: user.verification.isVerified,
        lastLogin: user.lastLogin
      }
    });
    
  } catch (error) {
    console.error('Ошибка проверки токена:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка проверки токена'
    });
  }
});

module.exports = router;
