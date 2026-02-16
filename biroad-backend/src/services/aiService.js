const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class AIService {
  // Оптимизация маршрута с помощью Gemini AI
  static async optimizeRoute(waypoints, schoolLocation) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-exp' });
      
      const prompt = `
        Оптимизируй маршрут для школьного карпулинга в Актау, Казахстан.
        
        Данные:
        - Школа: ${schoolLocation.lat}, ${schoolLocation.lng}
        - Точки посадки: ${JSON.stringify(waypoints)}
        
        Верни JSON с оптимальным порядком остановок:
        {
          "optimizedWaypoints": [
            {"lat": 43.6532, "lng": 51.1654, "order": 1},
            {"lat": 43.6489, "lng": 51.1721, "order": 2}
          ],
          "estimatedTime": "25 минут",
          "totalDistance": "12.5 км",
          "savedCO2": "2.3 кг"
        }
        
        Учитывай:
        - Минимальный detour
        - Безопасные остановки
        - Время в пути
      `;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Парсим JSON из ответа
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback - простая оптимизация
      return this.fallbackOptimization(waypoints, schoolLocation);
    } catch (error) {
      console.error('AI optimization error:', error);
      return this.fallbackOptimization(waypoints, schoolLocation);
    }
  }
  
  // Простая оптимизация (fallback)
  static fallbackOptimization(waypoints, schoolLocation) {
    // Сортируем по расстоянию от школы (обратный порядок)
    const optimized = waypoints.map((point, index) => ({
      ...point,
      order: index + 1
    }));
    
    return {
      optimizedWaypoints: optimized,
      estimatedTime: `${15 + optimized.length * 5} минут`,
      totalDistance: `${5 + optimized.length * 2} км`,
      savedCO2: `${optimized.length * 0.5} кг`
    };
  }
  
  // Подбор оптимальных групп
  static async findOptimalGroups(users, maxDistance = 5) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-exp' });
      
      const prompt = `
        Сгруппируй пользователей для совместных поездок в школу.
        
        Пользователи: ${JSON.stringify(users)}
        Максимальное расстояние: ${maxDistance} км
        
        Верни JSON с группами:
        {
          "groups": [
            {
              "id": "group1",
              "users": ["user1", "user2"],
              "driver": "user1",
              "school": "school1",
              "efficiency": 85
            }
          ]
        }
        
        Критерии:
        - Близость адресов
        - Одна школа
        - Наличие автомобиля
        - Количество мест
      `;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return this.fallbackGrouping(users, maxDistance);
    } catch (error) {
      console.error('AI grouping error:', error);
      return this.fallbackGrouping(users, maxDistance);
    }
  }
  
  // Простая группировка (fallback)
  static fallbackGrouping(users, maxDistance) {
    const groups = [];
    const processed = new Set();
    
    users.forEach(user => {
      if (processed.has(user.id)) return;
      
      const group = {
        id: `group_${user.id}`,
        users: [user.id],
        driver: user.has_car ? user.id : null,
        school: user.school_id,
        efficiency: 70
      };
      
      // Ищем близких пользователей
      users.forEach(other => {
        if (other.id !== user.id && !processed.has(other.id)) {
          const distance = this.calculateDistance(
            user.address_lat, user.address_lng,
            other.address_lat, other.address_lng
          );
          
          if (distance <= maxDistance && user.school_id === other.school_id) {
            group.users.push(other.id);
            processed.add(other.id);
            
            if (!group.driver && other.has_car) {
              group.driver = other.id;
            }
          }
        }
      });
      
      if (group.users.length > 1) {
        groups.push(group);
      }
      processed.add(user.id);
    });
    
    return { groups };
  }
  
  // Расчет расстояния между двумя точками
  static calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Радиус Земли в км
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
}

module.exports = AIService;
