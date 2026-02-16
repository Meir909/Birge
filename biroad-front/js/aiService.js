// AI сервис для умных рекомендаций и анализа
class AIService {
    constructor() {
        this.apiKey = window.CONFIG.AI.OPENAI_API_KEY;
        this.baseUrl = window.CONFIG.AI.AI_API_BASE_URL;
        this.model = window.CONFIG.AI_SETTINGS.CHAT_MODEL;
        this.systemPrompt = window.CONFIG.AI_SETTINGS.SYSTEM_PROMPT;
        this.init();
    }

    init() {
        // Проверяем наличие API ключа
        if (!this.apiKey || this.apiKey === 'YOUR_OPENAI_API_KEY_HERE') {
            console.warn('OpenAI API ключ не настроен. Используем мок данные.');
            this.useMockData = true;
        }
    }

    // Основной метод для отправки запросов к AI
    async sendRequest(messages, options = {}) {
        if (this.useMockData) {
            return this.getMockResponse(messages[messages.length - 1].content);
        }

        try {
            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: options.model || this.model,
                    messages: [
                        { role: 'system', content: this.systemPrompt },
                        ...messages
                    ],
                    temperature: options.temperature || window.CONFIG.AI_SETTINGS.TEMPERATURE,
                    max_tokens: options.max_tokens || window.CONFIG.AI_SETTINGS.MAX_TOKENS
                })
            });

            if (!response.ok) {
                throw new Error(`AI API Error: ${response.status}`);
            }

            const result = await response.json();
            return result.choices[0].message.content;
        } catch (error) {
            console.error('Ошибка AI сервиса:', error);
            return this.getMockResponse(messages[messages.length - 1].content);
        }
    }

    // Анализ и оптимизация маршрута
    async optimizeRoute(routeData) {
        const prompt = `
        Проанализируй и оптимизируй маршрут для карпула:
        
        Исходные данные:
        - Начальная точка: ${routeData.origin}
        - Конечная точка: ${routeData.destination}
        - Промежуточные точки: ${routeData.waypoints ? routeData.waypoints.join(', ') : 'нет'}
        - Время отправления: ${routeData.departureTime}
        - Количество пассажиров: ${routeData.passengers}
        - Тип автомобиля: ${routeData.vehicleType || 'не указан'}
        
        Предоставь рекомендации по:
        1. Оптимальному порядку остановок
        2. Времени отправления с учетом пробок
        3. Альтернативным маршрутам
        4. Экономии топлива
        5. Безопасности маршрута
        
        Ответь в формате JSON с полями: recommendations, estimatedTime, fuelSavings, safetyScore.
        `;

        const response = await this.sendRequest([
            { role: 'user', content: prompt }
        ]);

        try {
            return JSON.parse(response);
        } catch {
            return this.parseTextResponse(response);
        }
    }

    // Подбор совместимых групп
    async findCompatibleGroups(userProfile, availableGroups) {
        const prompt = `
        Проанализируй профиль пользователя и подбери наиболее подходящие группы для карпула:
        
        Профиль пользователя:
        - Имя: ${userProfile.name}
        - Роль: ${userProfile.role} // водитель или пассажир
        - Местоположение: ${userProfile.location}
        - Школа/Учебное заведение: ${userProfile.school}
        - Время отправления: ${userProfile.preferredTime}
        - Дни недели: ${userProfile.days}
        - Предпочтения: ${userProfile.preferences}
        
        Доступные группы:
        ${availableGroups.map(group => `
        Группа ${group.id}:
        - Название: ${group.name}
        - Водитель: ${group.driver}
        - Маршрут: ${group.route}
        - Время: ${group.time}
        - Места: ${group.availableSeats}/${group.totalSeats}
        - Требования: ${group.requirements}
        `).join('\n')}
        
        Оцени совместимость каждой группы по шкале от 0 до 100 и объясни свой выбор.
        Ответь в формате JSON с массивом рекомендаций.
        `;

        const response = await this.sendRequest([
            { role: 'user', content: prompt }
        ]);

        try {
            return JSON.parse(response);
        } catch {
            return this.parseGroupRecommendations(response);
        }
    }

    // Анализ безопасности маршрута
    async analyzeRouteSafety(routeData) {
        const prompt = `
        Проанализируй безопасность маршрута для школьного карпула:
        
        Маршрут: ${routeData.origin} → ${routeData.destination}
        Промежуточные точки: ${routeData.waypoints ? routeData.waypoints.join(', ') : 'нет'}
        Время: ${routeData.time}
        
        Оцени риски и предоставь рекомендации по безопасности:
        1. Опасные участки дороги
        2. Рекомендуемая скорость
        3. Места для безопасной посадки/высадки
        4. Время суток и погодные условия
        5. Советы для водителя
        
        Ответь в формате JSON с полями: safetyScore, risks, recommendations, safeZones.
        `;

        const response = await this.sendRequest([
            { role: 'user', content: prompt }
        ]);

        try {
            return JSON.parse(response);
        } catch {
            return this.parseSafetyAnalysis(response);
        }
    }

    // Эко-рекомендации
    async getEcoRecommendations(tripData) {
        const prompt = `
        Рассчитай экологический эффект и предоставь эко-рекомендации для поездки:
        
        Данные поездки:
        - Расстояние: ${tripData.distance} км
        - Тип автомобиля: ${tripData.vehicleType}
        - Количество пассажиров: ${tripData.passengers}
        - Время: ${tripData.duration} минут
        - Стиль вождения: ${tripData.drivingStyle || 'обычный'}
        
        Рассчитай:
        1. Экономию CO2 по сравнению с индивидуальными поездками
        2. Эффект от карпула
        3. Рекомендации по экологии
        4. Экологический рейтинг
        
        Ответь в формате JSON.
        `;

        const response = await this.sendRequest([
            { role: 'user', content: prompt }
        ]);

        try {
            return JSON.parse(response);
        } catch {
            return this.parseEcoRecommendations(response);
        }
    }

    // Чат-бот для поддержки
    async chatWithAI(message, context = {}) {
        const contextPrompt = context.userProfile ? 
            `Пользователь: ${context.userProfile.name}, роль: ${context.userProfile.role}` : '';
        
        const response = await this.sendRequest([
            { role: 'user', content: `${contextPrompt}\n\nВопрос: ${message}` }
        ]);

        return response;
    }

    // Анализ тональности сообщений
    async analyzeSentiment(text) {
        const prompt = `
        Проанализируй тональность сообщения в чате карпула:
        
        Сообщение: "${text}"
        
        Определи:
        1. Тональность (positive, neutral, negative)
        2. Эмоции (радость, беспокойство, благодарность и т.д.)
        3. Уровень срочности (low, medium, high)
        4. Намерение (информация, вопрос, жалоба, благодарность)
        
        Ответь в формате JSON.
        `;

        const response = await this.sendRequest([
            { role: 'user', content: prompt }
        ]);

        try {
            return JSON.parse(response);
        } catch {
            return this.parseSentimentAnalysis(response);
        }
    }

    // Генерация отчета о поездке
    async generateTripReport(tripData) {
        const prompt = `
        Сгенерируй подробный отчет о поездке карпула:
        
        Данные:
        - Дата: ${tripData.date}
        - Маршрут: ${tripData.route}
        - Время: ${tripData.duration}
        - Участники: ${tripData.participants}
        - Расстояние: ${tripData.distance} км
        - Топливо: ${tripData.fuelConsumption} л
        - CO2: ${tripData.co2Emissions} кг
        
        Включи в отчет:
        1. Общая статистика
        2. Экологический эффект
        3. Экономия для участников
        4. Рекомендации на будущее
        5. Интересные факты
        
        Ответь в структурированном формате.
        `;

        const response = await this.sendRequest([
            { role: 'user', content: prompt }
        ]);

        return response;
    }

    // Мок ответы для демонстрации
    getMockResponse(prompt) {
        if (prompt.includes('оптимизируй маршрут')) {
            return JSON.stringify({
                recommendations: [
                    'Изменить порядок остановок для оптимизации времени',
                    'Отправиться на 15 минут раньше для избежания пробок'
                ],
                estimatedTime: '25 минут',
                fuelSavings: '15%',
                safetyScore: 9.2
            });
        }

        if (prompt.includes('подбери наиболее подходящие группы')) {
            return JSON.stringify({
                recommendations: [
                    {
                        groupId: 'group1',
                        compatibility: 95,
                        reasons: ['Совпадение времени', 'Оптимальный маршрут', 'Хороший рейтинг водителя']
                    },
                    {
                        groupId: 'group2',
                        compatibility: 87,
                        reasons: ['Близкое расположение', 'Свободные места']
                    }
                ]
            });
        }

        if (prompt.includes('безопасность маршрута')) {
            return JSON.stringify({
                safetyScore: 8.5,
                risks: ['Плотный трафик на ул. Ленина', 'Школа рядом с оживленным перекрестком'],
                recommendations: [
                    'Снизить скорость до 40 км/ч у школы',
                    'Использовать пешеходные переходы',
                    'Проверить детские кресла'
                ],
                safeZones: ['Остановки с хорошей видимостью', 'Зоны с низким трафиком']
            });
        }

        if (prompt.includes('экологический эффект')) {
            return JSON.stringify({
                co2Saved: '12.5 кг',
                treesEquivalent: 2,
                ecoScore: 9.8,
                recommendations: [
                    'Поддерживать постоянную скорость',
                    'Избегать резких ускорений',
                    'Правильно накачивать шины'
                ]
            });
        }

        return 'Извините, я не могу обработать этот запрос. Попробуйте переформулировать.';
    }

    // Вспомогательные методы для парсинга
    parseTextResponse(response) {
        return {
            recommendations: [response],
            estimatedTime: '30 минут',
            fuelSavings: '10%',
            safetyScore: 8.0
        };
    }

    parseGroupRecommendations(response) {
        return [
            {
                groupId: 'group1',
                compatibility: 85,
                reasons: ['Хорошее совпадение по времени и маршруту']
            }
        ];
    }

    parseSafetyAnalysis(response) {
        return {
            safetyScore: 8.0,
            risks: ['Стандартные дорожные риски'],
            recommendations: ['Соблюдать ПДД', 'Проверять ремни безопасности'],
            safeZones: ['Школьные зоны']
        };
    }

    parseEcoRecommendations(response) {
        return {
            co2Saved: '10 кг',
            treesEquivalent: 1,
            ecoScore: 8.5,
            recommendations: ['Экономичное вождение']
        };
    }

    parseSentimentAnalysis(response) {
        return {
            sentiment: 'neutral',
            emotions: ['спокойствие'],
            urgency: 'low',
            intent: 'информация'
        };
    }
}

// Инициализация AI сервиса
window.aiService = new AIService();
