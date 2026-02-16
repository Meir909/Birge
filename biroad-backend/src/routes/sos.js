const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const supabase = require('../services/supabase');

// Создание SOS инцидента
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { rideId, lat, lng, message } = req.body;
    
    const { data: incident, error } = await supabase
      .from('sos_incidents')
      .insert([{
        user_id: req.user.userId,
        ride_id: rideId,
        lat,
        lng,
        message
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    // Здесь можно добавить логику отправки уведомлений
    
    res.json({
      incident,
      message: 'SOS alert sent successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
