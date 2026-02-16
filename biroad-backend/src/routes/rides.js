const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const supabase = require('../services/supabase');

// Получение всех поездок
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { data: rides, error } = await supabase
      .from('rides')
      .select(`
        *,
        driver:driver_id(name, photo_url),
        school:school_id(name, lat, lng)
      `)
      .eq('status', 'active');
    
    if (error) throw error;
    
    res.json(rides);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Создание поездки
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const rideData = {
      ...req.body,
      driver_id: req.user.userId
    };
    
    const { data: ride, error } = await supabase
      .from('rides')
      .insert([rideData])
      .select()
      .single();
    
    if (error) throw error;
    
    res.json(ride);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Бронирование поездки
router.post('/:rideId/book', authMiddleware, async (req, res) => {
  try {
    const { rideId } = req.params;
    
    const { data: booking, error } = await supabase
      .from('bookings')
      .insert([{
        ride_id: rideId,
        passenger_id: req.user.userId,
        status: 'requested'
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
