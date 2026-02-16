// Конфигурация API ключей и сервисов для BIRoad
const CONFIG = {
    // API ключи (замените на реальные ключи)
    MAPS: {
        // Google Maps API ключ
        GOOGLE_MAPS_API_KEY: 'YOUR_GOOGLE_MAPS_API_KEY_HERE',
        // Yandex Maps API ключ (альтернатива для России)
        YANDEX_MAPS_API_KEY: 'YOUR_YANDEX_MAPS_API_KEY_HERE',
        // Mapbox API ключ (альтернатива)
        MAPBOX_ACCESS_TOKEN: 'YOUR_MAPBOX_ACCESS_TOKEN_HERE'
    },
    
    // AI сервисы
    AI: {
        // OpenAI API ключ
        OPENAI_API_KEY: 'YOUR_OPENAI_API_KEY_HERE',
        // Google AI API ключ
        GOOGLE_AI_API_KEY: 'YOUR_GOOGLE_AI_API_KEY_HERE',
        // URL для AI API
        AI_API_BASE_URL: 'https://api.openai.com/v1'
    },
    
    // Геолокация и маршруты
    GEO: {
        // Here Maps API ключ
        HERE_API_KEY: 'YOUR_HERE_API_KEY_HERE',
        // TomTom API ключ
        TOMTOM_API_KEY: 'YOUR_TOMTOM_API_KEY_HERE',
        // OpenRouteService API ключ
        OPENROUTESERVICE_API_KEY: 'YOUR_OPENROUTESERVICE_API_KEY_HERE'
    },
    
    // Погода
    WEATHER: {
        // OpenWeatherMap API ключ
        OPENWEATHER_API_KEY: 'YOUR_OPENWEATHER_API_KEY_HERE',
        // WeatherAPI ключ
        WEATHERAPI_KEY: 'YOUR_WEATHERAPI_KEY_HERE'
    },
    
    // Уведомления
    NOTIFICATIONS: {
        // Firebase Cloud Messaging
        FCM_SERVER_KEY: 'YOUR_FCM_SERVER_KEY_HERE',
        // OneSignal API ключ
        ONESIGNAL_APP_ID: 'YOUR_ONESIGNAL_APP_ID_HERE'
    },
    
    // Бэкенд API
    BACKEND: {
        // URL вашего бэкенд API
        BASE_URL: 'http://localhost:3000/api',
        // WebSocket URL для реального времени
        WS_URL: 'ws://localhost:3000',
        // Заголовки по умолчанию
        DEFAULT_HEADERS: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    },
    
    // Настройки приложения
    APP: {
        // Версия приложения
        VERSION: '1.0.0',
        // Окружение (development/production)
        ENVIRONMENT: 'development',
        // Отладка
        DEBUG: true,
        // Кэширование
        CACHE_DURATION: 3600000, // 1 час в миллисекундах
        // Таймауты
        TIMEOUTS: {
            API: 10000, // 10 секунд
            MAP: 15000, // 15 секунд
            AI: 30000  // 30 секунд
        }
    },
    
    // Настройки карт
    MAP_SETTINGS: {
        // Центр Москвы по умолчанию
        DEFAULT_CENTER: { lat: 55.7558, lng: 37.6173 },
        // Масштаб по умолчанию
        DEFAULT_ZOOM: 12,
        // Стиль карты
        MAP_STYLE: 'roadmap',
        // Ограничения для России
        BOUNDS: {
            north: 69.0,
            south: 41.0,
            east: 169.0,
            west: 19.0
        }
    },
    
    // Настройки AI
    AI_SETTINGS: {
        // Модель для чата
        CHAT_MODEL: 'gpt-3.5-turbo',
        // Модель для анализа маршрутов
        ROUTE_MODEL: 'gpt-4',
        // Температура для генерации
        TEMPERATURE: 0.7,
        // Максимальное количество токенов
        MAX_TOKENS: 1000,
        // Системный промпт
        SYSTEM_PROMPT: `Ты - умный помощник для карпул-сервиса BIRoad. 
        Помогай пользователям с:
        - Поиском оптимальных маршрутов
        - Координацией поездок
        - Безопасностью детей
        - Эко-рекомендациями
        Отвечай дружелюбно и профессионально.`
    }
};

// Получение конфигурации для окружения
function getConfig() {
    if (CONFIG.APP.ENVIRONMENT === 'production') {
        // В продакшене можно загружать из переменных окружения
        return {
            ...CONFIG,
            MAPS: {
                GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || CONFIG.MAPS.GOOGLE_MAPS_API_KEY,
                YANDEX_MAPS_API_KEY: process.env.YANDEX_MAPS_API_KEY || CONFIG.MAPS.YANDEX_MAPS_API_KEY,
                MAPBOX_ACCESS_TOKEN: process.env.MAPBOX_ACCESS_TOKEN || CONFIG.MAPS.MAPBOX_ACCESS_TOKEN
            },
            AI: {
                OPENAI_API_KEY: process.env.OPENAI_API_KEY || CONFIG.AI.OPENAI_API_KEY,
                GOOGLE_AI_API_KEY: process.env.GOOGLE_AI_API_KEY || CONFIG.AI.GOOGLE_AI_API_KEY
            }
        };
    }
    return CONFIG;
}

// Валидация API ключей
function validateApiKeys() {
    const config = getConfig();
    const warnings = [];
    
    if (!config.MAPS.GOOGLE_MAPS_API_KEY || config.MAPS.GOOGLE_MAPS_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
        warnings.push('Google Maps API ключ не настроен');
    }
    
    if (!config.AI.OPENAI_API_KEY || config.AI.OPENAI_API_KEY === 'YOUR_OPENAI_API_KEY_HERE') {
        warnings.push('OpenAI API ключ не настроен');
    }
    
    if (warnings.length > 0 && config.APP.DEBUG) {
        console.warn('Предупреждения конфигурации:', warnings);
    }
    
    return warnings.length === 0;
}

// Получение URL для API
function getApiUrl(service, endpoint = '') {
    const config = getConfig();
    
    switch (service) {
        case 'backend':
            return `${config.BACKEND.BASE_URL}${endpoint}`;
        case 'ai':
            return `${config.AI.AI_API_BASE_URL}${endpoint}`;
        case 'maps':
            return `https://maps.googleapis.com/maps/api${endpoint}`;
        default:
            throw new Error(`Неизвестный сервис: ${service}`);
    }
}

// Получение заголовков для API
function getApiHeaders(service, includeAuth = false) {
    const config = getConfig();
    const headers = { ...config.BACKEND.DEFAULT_HEADERS };
    
    if (includeAuth) {
        const token = localStorage.getItem('biroad_token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }
    
    switch (service) {
        case 'ai':
            headers['Authorization'] = `Bearer ${config.AI.OPENAI_API_KEY}`;
            break;
        case 'maps':
            headers['X-Goog-Api-Key'] = config.MAPS.GOOGLE_MAPS_API_KEY;
            break;
    }
    
    return headers;
}

// Экспорт конфигурации
window.CONFIG = getConfig();
window.validateApiKeys = validateApiKeys;
window.getApiUrl = getApiUrl;
window.getApiHeaders = getApiHeaders;

// Инициализация конфигурации
if (typeof window !== 'undefined') {
    validateApiKeys();
}
