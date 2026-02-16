// API сервис для взаимодействия с бэкендом
class APIService {
    constructor() {
        this.baseUrl = window.CONFIG.BACKEND.BASE_URL;
        this.wsUrl = window.CONFIG.BACKEND.WS_URL;
        this.timeout = window.CONFIG.BACKEND.TIMEOUTS.API;
        this.websocket = null;
        this.init();
    }

    init() {
        this.setupInterceptors();
        this.connectWebSocket();
    }

    // Настройка перехватчиков запросов
    setupInterceptors() {
        // Добавляем токен ко всем запросам
        const originalFetch = window.fetch;
        window.fetch = async (url, options = {}) => {
            const token = localStorage.getItem('biroad_token');
            
            if (token && url.includes(this.baseUrl)) {
                options.headers = {
                    ...options.headers,
                    'Authorization': `Bearer ${token}`
                };
            }

            try {
                const response = await originalFetch(url, options);
                
                // Обновляем токен если получен новый
                const newToken = response.headers.get('X-New-Token');
                if (newToken) {
                    localStorage.setItem('biroad_token', newToken);
                }

                return response;
            } catch (error) {
                console.error('API request failed:', error);
                throw error;
            }
        };
    }

    // WebSocket соединение для реального времени
    connectWebSocket() {
        try {
            this.websocket = new WebSocket(this.wsUrl);
            
            this.websocket.onopen = () => {
                console.log('WebSocket соединение установлено');
                this.authenticateWebSocket();
            };

            this.websocket.onmessage = (event) => {
                this.handleWebSocketMessage(event);
            };

            this.websocket.onclose = () => {
                console.log('WebSocket соединение закрыто');
                // Переподключение через 5 секунд
                setTimeout(() => this.connectWebSocket(), 5000);
            };

            this.websocket.onerror = (error) => {
                console.error('WebSocket ошибка:', error);
            };
        } catch (error) {
            console.error('Ошибка WebSocket:', error);
        }
    }

    // Аутентификация WebSocket
    authenticateWebSocket() {
        const token = localStorage.getItem('biroad_token');
        if (token && this.websocket.readyState === WebSocket.OPEN) {
            this.websocket.send(JSON.stringify({
                type: 'auth',
                token: token
            }));
        }
    }

    // Обработка WebSocket сообщений
    handleWebSocketMessage(event) {
        try {
            const data = JSON.parse(event.data);
            
            switch (data.type) {
                case 'trip_update':
                    this.handleTripUpdate(data.payload);
                    break;
                case 'message':
                    this.handleNewMessage(data.payload);
                    break;
                case 'group_update':
                    this.handleGroupUpdate(data.payload);
                    break;
                case 'notification':
                    this.handleNotification(data.payload);
                    break;
                default:
                    console.log('Неизвестный тип сообщения:', data.type);
            }
        } catch (error) {
            console.error('Ошибка обработки WebSocket сообщения:', error);
        }
    }

    // Обработчики событий
    handleTripUpdate(tripData) {
        window.dispatchEvent(new CustomEvent('tripUpdate', { detail: tripData }));
    }

    handleNewMessage(messageData) {
        window.dispatchEvent(new CustomEvent('newMessage', { detail: messageData }));
    }

    handleGroupUpdate(groupData) {
        window.dispatchEvent(new CustomEvent('groupUpdate', { detail: groupData }));
    }

    handleNotification(notificationData) {
        window.dispatchEvent(new CustomEvent('notification', { detail: notificationData }));
    }

    // HTTP запросы с таймаутом
    async request(url, options = {}) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            clearTimeout(timeoutId);
            
            if (error.name === 'AbortError') {
                throw new Error('Request timeout');
            }
            
            throw error;
        }
    }

    // Аутентификация
    async login(phoneNumber, smsCode) {
        try {
            const response = await this.request(`${this.baseUrl}/auth/login`, {
                method: 'POST',
                headers: window.getApiHeaders('backend'),
                body: JSON.stringify({
                    phone: phoneNumber,
                    code: smsCode
                })
            });

            // Сохраняем токен
            localStorage.setItem('biroad_token', response.token);
            localStorage.setItem('biroad_user', JSON.stringify(response.user));

            return response;
        } catch (error) {
            console.error('Ошибка входа:', error);
            throw error;
        }
    }

    // Регистрация
    async register(userData) {
        try {
            const response = await this.request(`${this.baseUrl}/auth/register`, {
                method: 'POST',
                headers: window.getApiHeaders('backend'),
                body: JSON.stringify(userData)
            });

            // Сохраняем токен
            localStorage.setItem('biroad_token', response.token);
            localStorage.setItem('biroad_user', JSON.stringify(response.user));

            return response;
        } catch (error) {
            console.error('Ошибка регистрации:', error);
            throw error;
        }
    }

    // Отправка SMS кода
    async sendSMSCode(phoneNumber) {
        try {
            return await this.request(`${this.baseUrl}/auth/send-sms`, {
                method: 'POST',
                headers: window.getApiHeaders('backend'),
                body: JSON.stringify({ phone: phoneNumber })
            });
        } catch (error) {
            console.error('Ошибка отправки SMS:', error);
            throw error;
        }
    }

    // Выход
    logout() {
        localStorage.removeItem('biroad_token');
        localStorage.removeItem('biroad_user');
        
        if (this.websocket) {
            this.websocket.close();
        }
    }

    // Получение профиля пользователя
    async getUserProfile() {
        try {
            return await this.request(`${this.baseUrl}/user/profile`, {
                headers: window.getApiHeaders('backend', true)
            });
        } catch (error) {
            console.error('Ошибка получения профиля:', error);
            throw error;
        }
    }

    // Обновление профиля
    async updateUserProfile(profileData) {
        try {
            return await this.request(`${this.baseUrl}/user/profile`, {
                method: 'PUT',
                headers: window.getApiHeaders('backend', true),
                body: JSON.stringify(profileData)
            });
        } catch (error) {
            console.error('Ошибка обновления профиля:', error);
            throw error;
        }
    }

    // Поиск групп
    async searchGroups(filters = {}) {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            return await this.request(`${this.baseUrl}/groups/search?${queryParams}`, {
                headers: window.getApiHeaders('backend', true)
            });
        } catch (error) {
            console.error('Ошибка поиска групп:', error);
            throw error;
        }
    }

    // Получение деталей группы
    async getGroupDetails(groupId) {
        try {
            return await this.request(`${this.baseUrl}/groups/${groupId}`, {
                headers: window.getApiHeaders('backend', true)
            });
        } catch (error) {
            console.error('Ошибка получения деталей группы:', error);
            throw error;
        }
    }

    // Присоединение к группе
    async joinGroup(groupId) {
        try {
            return await this.request(`${this.baseUrl}/groups/${groupId}/join`, {
                method: 'POST',
                headers: window.getApiHeaders('backend', true)
            });
        } catch (error) {
            console.error('Ошибка присоединения к группе:', error);
            throw error;
        }
    }

    // Выход из группы
    async leaveGroup(groupId) {
        try {
            return await this.request(`${this.baseUrl}/groups/${groupId}/leave`, {
                method: 'POST',
                headers: window.getApiHeaders('backend', true)
            });
        } catch (error) {
            console.error('Ошибка выхода из группы:', error);
            throw error;
        }
    }

    // Создание группы
    async createGroup(groupData) {
        try {
            return await this.request(`${this.baseUrl}/groups`, {
                method: 'POST',
                headers: window.getApiHeaders('backend', true),
                body: JSON.stringify(groupData)
            });
        } catch (error) {
            console.error('Ошибка создания группы:', error);
            throw error;
        }
    }

    // Получение поездок пользователя
    async getUserTrips(status = 'all') {
        try {
            return await this.request(`${this.baseUrl}/trips?status=${status}`, {
                headers: window.getApiHeaders('backend', true)
            });
        } catch (error) {
            console.error('Ошибка получения поездок:', error);
            throw error;
        }
    }

    // Создание поездки
    async createTrip(tripData) {
        try {
            return await this.request(`${this.baseUrl}/trips`, {
                method: 'POST',
                headers: window.getApiHeaders('backend', true),
                body: JSON.stringify(tripData)
            });
        } catch (error) {
            console.error('Ошибка создания поездки:', error);
            throw error;
        }
    }

    // Обновление статуса поездки
    async updateTripStatus(tripId, status) {
        try {
            return await this.request(`${this.baseUrl}/trips/${tripId}/status`, {
                method: 'PUT',
                headers: window.getApiHeaders('backend', true),
                body: JSON.stringify({ status })
            });
        } catch (error) {
            console.error('Ошибка обновления статуса поездки:', error);
            throw error;
        }
    }

    // Получение сообщений группы
    async getGroupMessages(groupId, limit = 50) {
        try {
            return await this.request(`${this.baseUrl}/groups/${groupId}/messages?limit=${limit}`, {
                headers: window.getApiHeaders('backend', true)
            });
        } catch (error) {
            console.error('Ошибка получения сообщений:', error);
            throw error;
        }
    }

    // Отправка сообщения
    async sendMessage(groupId, message) {
        try {
            return await this.request(`${this.baseUrl}/groups/${groupId}/messages`, {
                method: 'POST',
                headers: window.getApiHeaders('backend', true),
                body: JSON.stringify({ message })
            });
        } catch (error) {
            console.error('Ошибка отправки сообщения:', error);
            throw error;
        }
    }

    // Отправка сообщения через WebSocket
    sendWebSocketMessage(type, payload) {
        if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
            this.websocket.send(JSON.stringify({
                type: type,
                payload: payload
            }));
        }
    }

    // Получение уведомлений
    async getNotifications(unreadOnly = false) {
        try {
            const url = unreadOnly ? 
                `${this.baseUrl}/notifications?unread=true` : 
                `${this.baseUrl}/notifications`;
                
            return await this.request(url, {
                headers: window.getApiHeaders('backend', true)
            });
        } catch (error) {
            console.error('Ошибка получения уведомлений:', error);
            throw error;
        }
    }

    // Отметка уведомления как прочитанного
    async markNotificationRead(notificationId) {
        try {
            return await this.request(`${this.baseUrl}/notifications/${notificationId}/read`, {
                method: 'PUT',
                headers: window.getApiHeaders('backend', true)
            });
        } catch (error) {
            console.error('Ошибка отметки уведомления:', error);
            throw error;
        }
    }

    // Получение статистики
    async getUserStats() {
        try {
            return await this.request(`${this.baseUrl}/user/stats`, {
                headers: window.getApiHeaders('backend', true)
            });
        } catch (error) {
            console.error('Ошибка получения статистики:', error);
            throw error;
        }
    }

    // Загрузка аватара
    async uploadAvatar(file) {
        try {
            const formData = new FormData();
            formData.append('avatar', file);

            const response = await fetch(`${this.baseUrl}/user/avatar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('biroad_token')}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Ошибка загрузки аватара');
            }

            return await response.json();
        } catch (error) {
            console.error('Ошибка загрузки аватара:', error);
            throw error;
        }
    }

    // Получение настроек
    async getUserSettings() {
        try {
            return await this.request(`${this.baseUrl}/user/settings`, {
                headers: window.getApiHeaders('backend', true)
            });
        } catch (error) {
            console.error('Ошибка получения настроек:', error);
            throw error;
        }
    }

    // Обновление настроек
    async updateUserSettings(settings) {
        try {
            return await this.request(`${this.baseUrl}/user/settings`, {
                method: 'PUT',
                headers: window.getApiHeaders('backend', true),
                body: JSON.stringify(settings)
            });
        } catch (error) {
            console.error('Ошибка обновления настроек:', error);
            throw error;
        }
    }

    // Мок данные для демонстрации
    getMockData(endpoint) {
        const mockData = {
            '/auth/login': {
                token: 'mock-token-123',
                user: {
                    id: 1,
                    name: 'Тестовый пользователь',
                    phone: '+7 (999) 123-45-67',
                    role: 'parent'
                }
            },
            '/groups/search': [
                {
                    id: 'group1',
                    name: 'Школа №123 - Утренняя группа',
                    driver: 'Анна Петрова',
                    availableSeats: 2,
                    totalSeats: 4,
                    departureTime: '08:00',
                    route: 'ул. Ленина → Школа №123'
                }
            ],
            '/user/profile': {
                id: 1,
                name: 'Тестовый пользователь',
                phone: '+7 (999) 123-45-67',
                email: 'test@example.com',
                role: 'parent',
                avatar: 'https://picsum.photos/seed/user/100/100'
            }
        };

        return mockData[endpoint] || null;
    }
}

// Инициализация API сервиса
window.apiService = new APIService();
