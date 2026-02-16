const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const ChatbotController = require('../controllers/chatbotController');

// Основной чат с AI-помощником
router.post('/chat', authMiddleware, ChatbotController.chatWithAssistant);

// Получение быстрых ответов/предложений
router.get('/suggestions', authMiddleware, (req, res) => {
  const suggestions = [
    'Найти маршрут до школы',
    'Искать родителей из моего района',
    'Как создать поездку?',
    'Оптимизировать маршрут',
    'Сколько CO2 я сэкономил?',
    'Проблемы со входом'
  ];
  
  res.json({ suggestions });
});

// История чата пользователя (опционально)
router.get('/history', authMiddleware, async (req, res) => {
  try {
    // Здесь можно добавить сохранение истории чата в БД
    res.json({ 
      history: [],
      message: 'История чата будет доступна в следующем обновлении'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
