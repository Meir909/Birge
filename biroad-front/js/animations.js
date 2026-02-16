// Управление анимациями при загрузке и взаимодействии
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupLoadingAnimations();
        this.setupHoverAnimations();
        this.setupFormAnimations();
        this.setupPageTransitions();
    }

    // Анимации при прокрутке
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, observerOptions);

        // Наблюдаем за элементами с классом scroll-reveal
        document.addEventListener('DOMContentLoaded', () => {
            const revealElements = document.querySelectorAll('.scroll-reveal');
            revealElements.forEach(el => observer.observe(el));
        });
    }

    // Анимации загрузки
    setupLoadingAnimations() {
        // Добавляем классы анимации при загрузке страницы
        document.addEventListener('DOMContentLoaded', () => {
            // Анимация для карточек
            const cards = document.querySelectorAll('.card-hover');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('fade-in');
                }, index * 100);
            });

            // Анимация для кнопок
            const buttons = document.querySelectorAll('.btn-hover');
            buttons.forEach((button, index) => {
                setTimeout(() => {
                    button.classList.add('scale-in');
                }, index * 50);
            });

            // Анимация для форм
            const formInputs = document.querySelectorAll('.form-input');
            formInputs.forEach((input, index) => {
                setTimeout(() => {
                    input.classList.add('slide-in-up');
                }, index * 100);
            });
        });
    }

    // Hover анимации
    setupHoverAnimations() {
        // Добавляем пульсацию к важным элементам
        const pulseElements = document.querySelectorAll('.pulse-on-hover');
        pulseElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.classList.add('pulse');
            });
            element.addEventListener('mouseleave', () => {
                element.classList.remove('pulse');
            });
        });

        // Добавляем свечение к активным элементам
        const glowElements = document.querySelectorAll('.glow-on-hover');
        glowElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.classList.add('glow');
            });
            element.addEventListener('mouseleave', () => {
                element.classList.remove('glow');
            });
        });
    }

    // Анимации форм
    setupFormAnimations() {
        // Анимация фокуса на полях ввода
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('scale-in');
            });
            
            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('scale-in');
            });
        });

        // Анимация валидации
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.classList.add('loading');
                    submitBtn.disabled = true;
                }
            });
        });
    }

    // Анимации переходов между страницами
    setupPageTransitions() {
        // Плавная прокрутка к якорям
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(e.target.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    }

    // Анимация появления уведомлений
    showNotification(message, type = 'info') {
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

        document.body.appendChild(notification);

        // Автоматическое удаление
        setTimeout(() => {
            notification.classList.add('hiding');
            setTimeout(() => {
                notification.remove();
            }, 400);
        }, 3000);
    }

    // Анимация загрузки контента
    showLoading(element) {
        element.classList.add('loading');
    }

    hideLoading(element) {
        element.classList.remove('loading');
    }

    // Анимация переключения вкладок
    switchTab(tabId, activeClass = 'active') {
        const tabs = document.querySelectorAll(`[data-tab="${tabId}"]`);
        const contents = document.querySelectorAll(`[data-tab-content="${tabId}"]`);

        tabs.forEach(tab => {
            tab.classList.remove(activeClass);
        });

        contents.forEach(content => {
            content.classList.remove(activeClass);
        });

        // Активируем выбранные элементы
        const activeTab = document.querySelector(`[data-tab="${tabId}"].active`);
        const activeContent = document.querySelector(`[data-tab-content="${tabId}"].active`);

        if (activeTab) {
            activeTab.classList.add(activeClass);
        }
        if (activeContent) {
            activeContent.classList.add(activeClass);
        }
    }

    // Анимация аккордеона
    toggleAccordion(element) {
        const content = element.nextElementSibling;
        const isOpen = content.classList.contains('open');

        // Закрываем все другие аккордеоны
        const allContents = document.querySelectorAll('.accordion-content');
        allContents.forEach(otherContent => {
            if (otherContent !== content) {
                otherContent.classList.remove('open');
            }
        });

        // Переключаем текущий аккордеон
        if (isOpen) {
            content.classList.remove('open');
        } else {
            content.classList.add('open');
        }
    }

    // Анимация прогресс-бара
    animateProgressBar(element, targetWidth, duration = 1000) {
        element.style.width = '0%';
        
        setTimeout(() => {
            element.style.width = targetWidth;
        }, 100);
    }

    // Анимация счетчика
    animateCounter(element, target, duration = 1000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString();
        }, 16);
    }

    // Анимация появления чат-сообщений
    addChatMessage(message, type = 'sent') {
        const messagesContainer = document.querySelector('.chat-messages');
        if (!messagesContainer) return;

        const messageEl = document.createElement('div');
        messageEl.className = `chat-message chat-message-${type}`;
        messageEl.textContent = message;

        messagesContainer.appendChild(messageEl);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Анимация для карточек с задержкой
    animateCards(cards, delay = 100) {
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade-in');
            }, index * delay);
        });
    }

    // Анимация параллакса
    setupParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.parallax');

            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }

    // Анимация для модальных окон
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        const backdrop = document.querySelector('.modal-backdrop');

        if (modal && backdrop) {
            modal.classList.add('show');
            backdrop.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        const backdrop = document.querySelector('.modal-backdrop');

        if (modal && backdrop) {
            modal.classList.remove('show');
            backdrop.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    // Анимация для выпадающих меню
    toggleDropdown(dropdownId) {
        const dropdown = document.getElementById(dropdownId);
        
        if (dropdown) {
            dropdown.classList.toggle('show');
        }
    }

    // Закрытие выпадающих меню при клике вне
    setupDropdownClose() {
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown')) {
                const dropdowns = document.querySelectorAll('.dropdown.show');
                dropdowns.forEach(dropdown => {
                    dropdown.classList.remove('show');
                });
            }
        });
    }
}

// Инициализация менеджера анимаций
document.addEventListener('DOMContentLoaded', () => {
    window.animationManager = new AnimationManager();
});

// Экспорт функций для использования в других скриптах
window.showNotification = (message, type) => {
    if (window.animationManager) {
        window.animationManager.showNotification(message, type);
    }
};

window.showLoading = (element) => {
    if (window.animationManager) {
        window.animationManager.showLoading(element);
    }
};

window.hideLoading = (element) => {
    if (window.animationManager) {
        window.animationManager.hideLoading(element);
    }
};
