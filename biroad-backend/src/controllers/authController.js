const jwt = require('jsonwebtoken');
const supabase = require('../services/supabase');

// Генерация JWT токена
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Отправка OTP (временно заглушка)
const sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }
    
    // Временно отправляем тестовый код
    console.log(`OTP для ${phone}: 123456`);
    
    res.json({ 
      message: 'OTP sent successfully',
      // Временно возвращаем код для теста
      otp: '123456',
      phone: phone
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Проверка OTP и регистрация/вход
const verifyOTP = async (req, res) => {
  try {
    const { phone, otp, name } = req.body;
    
    if (!phone || !otp) {
      return res.status(400).json({ error: 'Phone and OTP are required' });
    }
    
    // Временно проверяем тестовый код
    if (otp !== '123456') {
      return res.status(400).json({ error: 'Invalid OTP' });
    }
    
    // Проверяем существующего пользователя
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();
    
    let user;
    
    if (existingUser) {
      // Существующий пользователь
      user = existingUser;
    } else {
      // Новый пользователь
      if (!name) {
        return res.status(400).json({ error: 'Name is required for registration' });
      }
      
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([{
          phone,
          name,
          is_verified: true
        }])
        .select()
        .single();
      
      if (insertError) throw insertError;
      user = newUser;
    }
    
    // Генерируем JWT токен
    const token = generateToken(user.id);
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        photo_url: user.photo_url,
        district: user.district,
        school_id: user.school_id,
        child_class: user.child_class,
        has_car: user.has_car,
        car_seats: user.car_seats
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  sendOTP,
  verifyOTP
};
