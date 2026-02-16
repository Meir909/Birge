const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTP } = require('../controllers/authController');

// Отправка OTP
router.post('/send-otp', sendOTP);

// Проверка OTP и вход/регистрация
router.post('/verify-otp', verifyOTP);

module.exports = router;
