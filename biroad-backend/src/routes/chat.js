const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const supabase = require('../services/supabase');

// Получение сообщений чата
router.get('/:rideId/messages', authMiddleware, async (req, res) => {
  try {
    const { rideId } = req.params;
    
    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select(`
        *,
        user:user_id(name, photo_url)
      `)
      .eq('ride_id', rideId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Отправка сообщения
router.post('/:rideId/messages', authMiddleware, async (req, res) => {
  try {
    const { rideId } = req.params;
    const { message } = req.body;
    
    const { data: newMessage, error } = await supabase
      .from('chat_messages')
      .insert([{
        ride_id: rideId,
        user_id: req.user.userId,
        message
      }])
      .select(`
        *,
        user:user_id(name, photo_url)
      `)
      .single();
    
    if (error) throw error;
    
    res.json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
