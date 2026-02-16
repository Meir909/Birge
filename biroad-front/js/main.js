// BIRoad - Основной JavaScript файл
class BIRoad {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupFormValidation();
        this.setupLocalStorage();
        this.loadUserData();
        this.setupEventListeners();
    }

    // Навигация между страницами
    setupNavigation() {
        // Обработка кликов по навигационным ссылкам
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' && e.target.getAttribute('href')) {
                const href = e.target.getAttribute('href');
                if (href.startsWith('#') || href.includes('.html')) {
                    e.preventDefault();
                    this.navigateTo(href);
                }
            }
        });
    }

    navigateTo(page) {
        // Убираем # если есть
        const cleanPage = page.replace('#', '');
        
        // Определяем путь к файлу
        let filePath;
        switch(cleanPage) {
            case 'home':
            case 'main':
                filePath = 'index.html';
                break;
            case 'login':
            case 'vhod':
                filePath = 'vhod.html';
                break;
            case 'register':
            case 'rega':
                filePath = 'rega.html';
                break;
            case 'search':
            case 'poisk':
                filePath = 'poisk.html';
                break;
            case 'dashboard':
                filePath = 'dashboard.html';
                break;
            case 'groups':
            case 'gruppa':
                filePath = 'gruppa.html';
                break;
            case 'trip':
            case 'poezdka':
                filePath = 'poezdka.html';
                break;
            case 'profile':
                filePath = 'profile.html';
                break;
            case 'messages':
                filePath = 'messages.html';
                break;
            case 'settings':
                filePath = 'settings.html';
                break;
            case 'help':
                filePath = 'help.html';
                break;
            case 'create-group':
                filePath = 'create-group.html';
                break;
            default:
                filePath = cleanPage + '.html';
        }

        // Переходим на страницу
        window.location.href = filePath;
    }

    // Валидация форм
    setupFormValidation() {
        // Валидация телефона
        const phoneInputs = document.querySelectorAll('input[type="tel"]');
        phoneInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                this.formatPhone(e.target);
            });
        });

        // Валидация SMS кода
        const smsInputs = document.querySelectorAll('input[maxlength="6"]');
        smsInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                this.formatSmsCode(e.target);
            });
        });
    }

    formatPhone(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length > 0) {
            if (value.length <= 3) {
                value = `+7 (${value}`;
            } else if (value.length <= 6) {
                value = `+7 (${value.slice(0, 3)}) ${value.slice(3)}`;
            } else if (value.length <= 8) {
                value = `+7 (${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
            } else {
                value = `+7 (${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 8)}-${value.slice(8, 10)}`;
            }
        }
        input.value = value;
    }

    formatSmsCode(input) {
        let value = input.value.replace(/\D/g, '');
        input.value = value.slice(0, 6);
    }

    // LocalStorage для хранения данных
    setupLocalStorage() {
        if (!localStorage.getItem('biroad_users')) {
            localStorage.setItem('biroad_users', JSON.stringify([]));
        }
        if (!localStorage.getItem('biroad_current_user')) {
            localStorage.setItem('biroad_current_user', null);
        }
    }

    // Загрузка данных пользователя
    loadUserData() {
        const userData = localStorage.getItem('biroad_current_user');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.updateUIForLoggedInUser();
        }
    }

    // Обновление UI для авторизованного пользователя
    updateUIForLoggedInUser() {
        if (!this.currentUser) return;

        // Обновляем аватары и имена пользователя
        const avatarElements = document.querySelectorAll('.user-avatar');
        const nameElements = document.querySelectorAll('.user-name');

        avatarElements.forEach(el => {
            if (this.currentUser.avatar) {
                el.style.backgroundImage = `url(${this.currentUser.avatar})`;
            }
        });

        nameElements.forEach(el => {
            if (this.currentUser.name) {
                el.textContent = this.currentUser.name;
            }
        });
    }

    // Настройка обработчиков событий
    setupEventListeners() {
        // Кнопка "Получить код" на странице входа
        const getCodeBtn = document.querySelector('.get-code-btn');
        if (getCodeBtn) {
            getCodeBtn.addEventListener('click', () => this.sendSmsCode());
        }

        // Кнопка "Войти"
        const loginBtn = document.querySelector('.login-btn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.login());
        }

        // Кнопка "Завершить регистрацию"
        const registerBtn = document.querySelector('.register-btn');
        if (registerBtn) {
            registerBtn.addEventListener('click', () => this.register());
        }

        // Кнопка "Выйти"
        const logoutBtns = document.querySelectorAll('.logout-btn');
        logoutBtns.forEach(btn => {
            btn.addEventListener('click', () => this.logout());
        });
    }

    // Отправка SMS кода
    sendSmsCode() {
        const phoneInput = document.querySelector('input[type="tel"]');
        if (!phoneInput || !this.validatePhone(phoneInput.value)) {
            this.showError('Пожалуйста, введите корректный номер телефона');
            return;
        }

        // Имитация отправки SMS
        this.showSuccess('Код отправлен на ' + phoneInput.value);
        
        // Показываем поле для ввода кода
        const smsSection = document.querySelector('.sms-section');
        if (smsSection) {
            smsSection.style.display = 'block';
        }

        // Блокируем кнопку на 60 секунд
        const getCodeBtn = document.querySelector('.get-code-btn');
        if (getCodeBtn) {
            getCodeBtn.disabled = true;
            let countdown = 60;
            const interval = setInterval(() => {
                countdown--;
                getCodeBtn.textContent = `Повторить через ${countdown} сек`;
                if (countdown <= 0) {
                    clearInterval(interval);
                    getCodeBtn.disabled = false;
                    getCodeBtn.textContent = 'Получить код';
                }
            }, 1000);
        }
    }

    // Вход в систему
    login() {
        const phoneInput = document.querySelector('input[type="tel"]');
        const smsInput = document.querySelector('input[maxlength="6"]');

        if (!this.validatePhone(phoneInput.value)) {
            this.showError('Пожалуйста, введите корректный номер телефона');
            return;
        }

        if (!smsInput || smsInput.value.length !== 6) {
            this.showError('Пожалуйста, введите 6-значный код из SMS');
            return;
        }

        // Имитация проверки кода (для демо принимаем любой 6-значный код)
        if (smsInput.value.length === 6) {
            // Создаем пользователя
            const user = {
                phone: phoneInput.value,
                name: 'Пользователь',
                avatar: `https://picsum.photos/seed/${phoneInput.value}/100/100`,
                loginTime: new Date().toISOString()
            };

            // Сохраняем в localStorage
            this.currentUser = user;
            localStorage.setItem('biroad_current_user', JSON.stringify(user));

            // Добавляем в список пользователей
            const users = JSON.parse(localStorage.getItem('biroad_users') || '[]');
            if (!users.find(u => u.phone === user.phone)) {
                users.push(user);
                localStorage.setItem('biroad_users', JSON.stringify(users));
            }

            this.showSuccess('Вход выполнен успешно!');
            setTimeout(() => {
                this.navigateTo('dashboard');
            }, 1000);
        }
    }

    // Регистрация
    register() {
        const nameInput = document.querySelector('input[placeholder*="Иван"]');
        const phoneInput = document.querySelector('input[type="tel"]');
        const schoolInput = document.querySelector('input[placeholder*="учебное заведение"]');
        const roleRadios = document.querySelectorAll('input[name="role"]');

        if (!nameInput || !nameInput.value.trim()) {
            this.showError('Пожалуйста, введите ваше имя');
            return;
        }

        if (!this.validatePhone(phoneInput.value)) {
            this.showError('Пожалуйста, введите корректный номер телефона');
            return;
        }

        if (!schoolInput || !schoolInput.value.trim()) {
            this.showError('Пожалуйста, укажите учебное заведение');
            return;
        }

        // Получаем выбранную роль
        let selectedRole = 'passenger';
        roleRadios.forEach(radio => {
            if (radio.checked) {
                selectedRole = radio.id === 'role-driver' ? 'driver' : 'passenger';
            }
        });

        // Создаем пользователя
        const user = {
            name: nameInput.value.trim(),
            phone: phoneInput.value,
            school: schoolInput.value.trim(),
            role: selectedRole,
            avatar: `https://picsum.photos/seed/${phoneInput.value}/100/100`,
            registrationTime: new Date().toISOString()
        };

        // Сохраняем в localStorage
        this.currentUser = user;
        localStorage.setItem('biroad_current_user', JSON.stringify(user));

        // Добавляем в список пользователей
        const users = JSON.parse(localStorage.getItem('biroad_users') || '[]');
        if (!users.find(u => u.phone === user.phone)) {
            users.push(user);
            localStorage.setItem('biroad_users', JSON.stringify(users));
        }

        this.showSuccess('Регистрация завершена успешно!');
        setTimeout(() => {
            this.navigateTo('dashboard');
        }, 1000);
    }

    // Выход из системы
    logout() {
        this.currentUser = null;
        localStorage.setItem('biroad_current_user', null);
        this.showSuccess('Вы вышли из системы');
        setTimeout(() => {
            this.navigateTo('vhod');
        }, 1000);
    }

    // Валидация телефона
    validatePhone(phone) {
        const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
        return phoneRegex.test(phone);
    }

    // Показать уведомление об успехе
    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    // Показать уведомление об ошибке
    showError(message) {
        this.showNotification(message, 'error');
    }

    // Показать уведомление
    showNotification(message, type = 'info') {
        // Удаляем существующие уведомления
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">
                    ${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}
                </span>
                <span class="notification-message">${message}</span>
            </div>
        `;

        // Стили для уведомления
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            max-width: 400px;
            animation: slideIn 0.3s ease-out;
        `;

        // Добавляем стили анимации
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .notification-icon {
                font-weight: bold;
                font-size: 18px;
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // Автоматически удаляем через 3 секунды
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Проверка авторизации
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Получение текущего пользователя
    getCurrentUser() {
        return this.currentUser;
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    window.biroad = new BIRoad();
});

// Дополнительные утилиты
const Utils = {
    // Форматирование даты
    formatDate(date) {
        return new Date(date).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    },

    // Форматирование времени
    formatTime(date) {
        return new Date(date).toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // Генерация случайного ID
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    },

    // Валидация email
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Debounce для поиска
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};
