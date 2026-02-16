const AIService = require('../services/aiService');
const supabase = require('../services/supabase');

// Оптимизация маршрута поездки
const optimizeRoute = async (req, res) => {
  try {
    const { rideId } = req.params;
    
    // Получаем поездку с бронированиями
    const { data: ride, error: rideError } = await supabase
      .from('rides')
      .select(`
        *,
        school:school_id(lat, lng),
        bookings:bookings(
          passenger_id,
          pickup_lat,
          pickup_lng,
          passenger:passenger_id(address_lat, address_lng, name)
        )
      `)
      .eq('id', rideId)
      .single();
    
    if (rideError) throw rideError;
    
    // Формируем точки для оптимизации
    const waypoints = ride.bookings.map(booking => ({
      lat: booking.pickup_lat || booking.passenger.address_lat,
      lng: booking.pickup_lng || booking.passenger.address_lng,
      userId: booking.passenger_id,
      userName: booking.passenger.name
    }));
    
    // Оптимизируем маршрут
    const optimized = await AIService.optimizeRoute(
      waypoints,
      { lat: ride.school.lat, lng: ride.school.lng }
    );
    
    // Сохраняем оптимизированный маршрут
    const { error: updateError } = await supabase
      .from('rides')
      .update({ optimized_route: optimized })
      .eq('id', rideId);
    
    if (updateError) throw updateError;
    
    res.json({
      success: true,
      optimized,
      rideId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Подбор оптимальных групп
const findOptimalGroups = async (req, res) => {
  try {
    const { schoolId, maxDistance = 5 } = req.query;
    
    // Получаем пользователей по школе
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('school_id', schoolId)
      .not('address_lat', 'is', null);
    
    if (error) throw error;
    
    // Находим оптимальные группы
    const groups = await AIService.findOptimalGroups(users, maxDistance);
    
    res.json({
      success: true,
      groups: groups.groups,
      totalUsers: users.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Расчет экологической аналитики
const getEcoAnalytics = async (req, res) => {
  try {
    const { userId } = req.user;
    
    // Получаем поездки пользователя
    const { data: rides, error } = await supabase
      .from('rides')
      .select(`
        *,
        bookings:bookings(passenger_id)
      `)
      .eq('driver_id', userId)
      .eq('status', 'completed');
    
    if (error) throw error;
    
    // Рассчитываем метрики
    const totalRides = rides.length;
    const totalPassengers = rides.reduce((sum, ride) => sum + ride.bookings.length, 0);
    const savedCars = totalPassengers; // Каждый пассажир = сэкономленная машина
    const savedKM = totalRides * 10; // Примерно 10 км на поездку
    const savedCO2 = savedKM * 0.12; // 120 г CO2 на км
    
    res.json({
      totalRides,
      totalPassengers,
      savedCars,
      savedKM,
      savedCO2,
      efficiency: totalRides > 0 ? Math.round((totalPassengers / totalRides) * 100) : 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  optimizeRoute,
  findOptimalGroups,
  getEcoAnalytics
};
