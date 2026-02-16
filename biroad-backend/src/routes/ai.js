const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { optimizeRoute, findOptimalGroups, getEcoAnalytics } = require('../controllers/aiController');

// Оптимизация маршрута поездки
router.post('/optimize-route/:rideId', authMiddleware, optimizeRoute);

// Подбор оптимальных групп
router.get('/find-groups', authMiddleware, findOptimalGroups);

// Экологическая аналитика
router.get('/eco-analytics', authMiddleware, getEcoAnalytics);

module.exports = router;
