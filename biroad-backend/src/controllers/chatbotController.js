const { GoogleGenerativeAI } = require('@google/generative-ai');
const supabase = require('../services/supabase');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class ChatbotController {
  // Основной AI-чат помощник
  static async chatWithAssistant(req, res) {
    try {
      const { message, userId } = req.body;
      
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-exp' });
      
      // Получаем данные пользователя для контекста
      const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      // Анализируем намерение пользователя
      const intent = await this.analyzeIntent(message);
      
      let response;
      
      switch (intent.type) {
        case 'find_route':
          response = await this.handleRouteSearch(message, user);
          break;
        case 'find_parents':
          response = await this.handleParentSearch(message, user);
          break;
        case 'ride_help':
          response = await this.handleRideHelp(message, user);
          break;
        case 'technical_help':
          response = await this.handleTechnicalHelp(message);
          break;
        case 'eco_info':
          response = await this.handleEcoInfo(message);
          break;
        default:
          response = await this.handleGeneralChat(message, user);
      }
      
      res.json({
        success: true,
        response,
        intent: intent.type,
        suggestions: this.getSuggestions(intent.type)
      });
    } catch (error) {
      console.error('Chatbot error:', error);
      res.status(500).json({ error: 'Chatbot temporarily unavailable' });
    }
  }
  
  // Анализ намерения пользователя
  static async analyzeIntent(message) {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-exp' });
    
    const prompt = `
      Проанализируй сообщение пользователя и определи его намерение.
      
      Сообщение: "${message}"
      
      Верни JSON с типом намерения:
      {
        "type": "find_route" | "find_parents" | "ride_help" | "technical_help" | "eco_info" | "general",
        "confidence": 0.9,
        "entities": {
          "time": "8:00",
          "location": "школа №1",
          "date": "завтра"
        }
      }
      
      Типы:
      - find_route: поиск маршрута, как доехать, путь
      - find_parents: поиск родителей, водителей, попутчиков
      - ride_help: помощь с поездками, бронирование, отмена
      - technical_help: технические проблемы, баги, ошибки
      - eco_info: экология, CO2, экономия
      - general: общий вопрос, приветствие, другое
    `;
    
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Intent analysis error:', error);
    }
    
    return { type: 'general', confidence: 0.5, entities: {} };
  }
  
  // Обработка поиска маршрута
  static async handleRouteSearch(message, user) {
    try {
      // Ищем доступные поездки
      const { data: rides } = await supabase
        .from('rides')
        .select(`
          *,
          driver:driver_id(name, photo_url, car_seats),
          school:school_id(name, lat, lng)
        `)
        .eq('status', 'active')
        .gte('date', new Date().toISOString().split('T')[0]);
      
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-exp' });
      
      const prompt = `
        Пользователь спрашивает: "${message}"
        Найденные поездки: ${JSON.stringify(rides)}
        Пользователь: ${JSON.stringify(user)}
        
        Помоги пользователю найти подходящий маршрут. Учти:
        - Близость к его адресу
        - Время отправления
        - Школу
        - Свободные места
        
        Ответь на русском языке дружелюбно и конструктивно.
      `;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      return {
        type: 'route_search',
        text: response.text(),
        rides: rides?.slice(0, 3) || []
      };
    } catch (error) {
      return {
        type: 'route_search',
        text: 'Извините, не удалось найти маршруты. Попробуйте изменить параметры поиска.',
        rides: []
      };
    }
  }
  
  // Обработка поиска родителей
  static async handleParentSearch(message, user) {
    try {
      // Ищем родителей из той же школы
      const { data: parents } = await supabase
        .from('users')
        .select('*')
        .eq('school_id', user.school_id)
        .neq('id', user.id)
        .limit(10);
      
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-exp' });
      
      const prompt = `
        Пользователь ищет родителей: "${message}"
        Найденные родители: ${JSON.stringify(parents)}
        Текущий пользователь: ${JSON.stringify(user)}
        
        Помоги найти подходящих родителей для совместных поездок. Учти:
        - Близость проживания
        - Наличие автомобиля
        - Совпадение школы
        - Время отправления
        
        Ответь на русском языке предложениями и рекомендациями.
      `;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      return {
        type: 'parent_search',
        text: response.text(),
        parents: parents?.slice(0, 5) || []
      };
    } catch (error) {
      return {
        type: 'parent_search',
        text: 'Не удалось найти родителей. Попробуйте расширить радиус поиска.',
        parents: []
      };
    }
  }
  
  // Помощь с поездками
  static async handleRideHelp(message, user) {
    const helpTopics = {
      'создать': 'Чтобы создать поездку: 1) Зайдите в раздел "Поездки" 2) Нажмите "Создать поездку" 3) Укажите школу, время, количество мест',
      'отменить': 'Для отмены поездки: зайдите в "Мои поездки" → выберите поездку → "Отменить"',
      'забронировать': 'Чтобы забронировать место: найдите подходящую поездку → нажмите "Забронировать" → дождитесь подтверждения водителя',
      'оптимизировать': 'AI-оптимизация маршрута доступна после создания поездки. Нажмите "Оптимизировать маршрут" для лучшего порядка остановок.'
    };
    
    return {
      type: 'ride_help',
      text: 'Я помогу вам с поездками! Выберите интересующую тему:',
      topics: helpTopics
    };
  }
  
  // Техническая помощь
  static async handleTechnicalHelp(message) {
    const techHelp = {
      'не работает': 'Попробуйте: 1) Обновить страницу 2) Проверить интернет 3) Очистить кэш браузера',
      'вход': 'Проблемы со входом: 1) Проверьте номер телефона 2) Убедитесь что OTP код 123456 3) Попробуйте снова',
      'карта': 'Если карта не загружается: 1) Проверьте разрешение геолокации 2) Обновите страницу 3) Проверьте интернет',
      'уведомления': 'Для уведомлений: 1) Разрешите уведомления в браузере 2) Проверьте настройки профиля'
    };
    
    return {
      type: 'technical_help',
      text: 'Техническая поддержка BIRoad:',
      solutions: techHelp,
      contact: 'Если проблема осталась, напишите нам: support@biroad.kz'
    };
  }
  
  // Экологическая информация
  static async handleEcoInfo(message) {
    return {
      type: 'eco_info',
      text: '🌱 BIRoad помогает экологии! Каждая совместная поездка экономит ~2.3 кг CO2. За месяц можно сэкономить 50+ кг CO2 - это как посаженное дерево!',
      stats: {
        co2_per_ride: '2.3 кг',
        trees_per_month: '1 дерево',
        fuel_saved: '15 литров',
        cars_off_road: '1-2 машины'
      }
    };
  }
  
  // Общий чат
  static async handleGeneralChat(message, user) {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-exp' });
    
    const prompt = `
      Ты - дружелюбный помощник BIRoad, платформы для безопасных поездок детей в школу.
      
      Пользователь: ${user.name}
      Сообщение: "${message}"
      
      Отвечай на русском языке:
      - Будь дружелюбным и полезным
      - Помогай с платформой BIRoad
      - Предлагай релевантные функции
      - Если нужно, направляй к правильным разделам
      
      Длина ответа: 2-3 предложения.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return {
      type: 'general',
      text: response.text()
    };
  }
  
  // Получить предложения для пользователя
  static getSuggestions(intentType) {
    const suggestions = {
      'find_route': [
        'Найти поездки на завтра',
        'Маршрут до школы №1',
        'Попутчики в 8:00'
      ],
      'find_parents': [
        'Найти родителей из моего района',
        'Водители со свободными местами',
        'Попутчики в ту же школу'
      ],
      'ride_help': [
        'Как создать поездку',
        'Отменить бронирование',
        'Оптимизировать маршрут'
      ],
      'technical_help': [
        'Проблемы со входом',
        'Не работает карта',
        'Нет уведомлений'
      ],
      'eco_info': [
        'Сколько CO2 экономлю',
        'Экологический вклад',
        'Статистика платформы'
      ],
      'general': [
        'Расскажи о BIRoad',
        'Как начать пользоваться',
        'Безопасность платформы'
      ]
    };
    
    return suggestions[intentType] || suggestions['general'];
  }
}

module.exports = ChatbotController;
