// Локальная конфигурация API ключей
// Скопируйте этот файл в config.local.js и добавьте реальные ключи

const LOCAL_CONFIG = {
    // Google Maps API ключ
    // Получить: https://console.cloud.google.com/
    GOOGLE_MAPS_API_KEY: 'YOUR_GOOGLE_MAPS_API_KEY_HERE',
    
    // OpenAI API ключ  
    // Получить: https://platform.openai.com/
    OPENAI_API_KEY: 'YOUR_OPENAI_API_KEY_HERE',
    
    // Here Maps API ключ (альтернатива Google Maps)
    // Получить: https://developer.here.com/
    HERE_API_KEY: 'YOUR_HERE_API_KEY_HERE',
    
    // OpenWeatherMap API ключ
    // Получить: https://openweathermap.org/api
    OPENWEATHER_API_KEY: 'YOUR_OPENWEATHER_API_KEY_HERE',
    
    // Mapbox Access Token (альтернатива)
    // Получить: https://mapbox.com/
    MAPBOX_ACCESS_TOKEN: 'YOUR_MAPBOX_ACCESS_TOKEN_HERE',
    
    // TomTom API ключ
    // Получить: https://developer.tomtom.com/
    TOMTOM_API_KEY: 'YOUR_TOMTOM_API_KEY_HERE',
    
    // OneSignal App ID (для push-уведомлений)
    // Получить: https://onesignal.com/
    ONESIGNAL_APP_ID: 'YOUR_ONESIGNAL_APP_ID_HERE',
    
    // Firebase Cloud Messaging (для push-уведомлений)
    // Получить: https://firebase.google.com/
    FCM_SERVER_KEY: 'YOUR_FCM_SERVER_KEY_HERE'
};

// Перезаписываем глобальную конфигурацию
if (typeof window !== 'undefined') {
    // Объединяем с основной конфигурацией
    window.CONFIG = {
        ...window.CONFIG,
        MAPS: {
            ...window.CONFIG.MAPS,
            GOOGLE_MAPS_API_KEY: LOCAL_CONFIG.GOOGLE_MAPS_API_KEY,
            MAPBOX_ACCESS_TOKEN: LOCAL_CONFIG.MAPBOX_ACCESS_TOKEN
        },
        AI: {
            ...window.CONFIG.AI,
            OPENAI_API_KEY: LOCAL_CONFIG.OPENAI_API_KEY
        },
        GEO: {
            ...window.CONFIG.GEO,
            HERE_API_KEY: LOCAL_CONFIG.HERE_API_KEY,
            TOMTOM_API_KEY: LOCAL_CONFIG.TOMTOM_API_KEY
        },
        WEATHER: {
            ...window.CONFIG.WEATHER,
            OPENWEATHER_API_KEY: LOCAL_CONFIG.OPENWEATHER_API_KEY
        },
        NOTIFICATIONS: {
            ...window.CONFIG.NOTIFICATIONS,
            ONESIGNAL_APP_ID: LOCAL_CONFIG.ONESIGNAL_APP_ID,
            FCM_SERVER_KEY: LOCAL_CONFIG.FCM_SERVER_KEY
        }
    };
    
    console.log('Локальная конфигурация загружена');
    
    // Проверяем наличие ключей
    const missingKeys = [];
    
    if (!LOCAL_CONFIG.GOOGLE_MAPS_API_KEY || LOCAL_CONFIG.GOOGLE_MAPS_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
        missingKeys.push('Google Maps API');
    }
    
    if (!LOCAL_CONFIG.OPENAI_API_KEY || LOCAL_CONFIG.OPENAI_API_KEY === 'YOUR_OPENAI_API_KEY_HERE') {
        missingKeys.push('OpenAI API');
    }
    
    if (missingKeys.length > 0) {
        console.warn('Отсутствуют следующие API ключи:', missingKeys);
        console.log('Пожалуйста, добавьте их в config.local.js');
        console.log('Инструкции: см. файл API_SETUP.md');
    } else {
        console.log('✅ Все API ключи настроены');
    }
}
