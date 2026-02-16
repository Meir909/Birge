const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const supabase = require('../services/supabase');

// Получение профиля пользователя
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.user.userId)
      .single();
    
    if (error) throw error;
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Обновление профиля
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const updates = req.body;
    
    const { data: user, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', req.user.userId)
      .select()
      .single();
    
    if (error) throw error;
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
