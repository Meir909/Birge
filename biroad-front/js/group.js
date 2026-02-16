// Функциональность для страницы групп
class GroupPage {
    constructor() {
        this.groupData = this.initializeGroupData();
        this.messages = this.initializeMessages();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupChat();
        this.setupSchedule();
        this.loadGroupData();
    }

    initializeGroupData() {
        return {
            id: 'licey-15',
            name: 'Лицей №15',
            members: [
                {
                    id: 1,
                    name: 'Анна Петрова',
                    role: 'admin',
                    type: 'driver',
                    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWHdL_qPKmxE9kHx5sEJI9-aQoRutqn3NF7_8xZNLNzGK3uYUStRJ9BSvxCQaiR6eON9IfK-McMRP5FpnNNJw60x-x0remvclI_wvhjtAHJe3nw-Vk_Cvm-MVQYg10V43PV_O34YOMgtIC8ragLrdW_Pl8Kjoz2kS0chet-WrfEsLiva20FqUVpp4ia0ysM8nDzfQkudGBg935fVwctBC97iBHrY-C6uZNzvCitRgy4-rbx8FBLn_h9jkAGfomh4ri7Ioz30EWyhQ'
                },
                {
                    id: 2,
                    name: 'Иван Сидоров',
                    role: 'member',
                    type: 'parent',
                    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9KY6xZeft0ARgVy0ZINNqIB6xyafMnmn5aDB-G-tmLFbSRRLrYOJh7P3N_0q0W3xVHiZYUY7Sd1pbX-DM66nhiVGRN5d73rXyj1S01CX8ER4GBWlPjjQT9Po46QpW3ufNfZqY-xilsl3CodkuxootNFGe08deMvzF_KJu_bSNWWfNiO9HeHGCRqapiMB5dY8JvnwfYqBGs2XWj6YFqbEo2O9KBuE3cROnq-bSgQQO2DsCBTAWJM4wb7HkybKPm0MH6HivftvSr6U'
                },
                {
                    id: 3,
                    name: 'Елена Волкова',
                    role: 'member',
                    type: 'driver',
                    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAldp67t9hL0V4c6_KqjkOoy79Adk-mFX-ZECg89ZOwRIr1VdwdQSTZcfJrzLfx44uoxph3w9kwM3gq1NTBaI3maf94Bbz4sbf1FcfEzhAX2w4cm8V6lPmrHSkuIAwZ4b_gaNs2Z98Ld-iySbA4CJlNiIl6txQnuTkzYUbBlBcd1w3lW6oGlT96nb1j8308qiqfIm3gVYujuYdABuh5KahwwQAsGwNh6g5aHdqyzXT7J4-Yeley7DEYh5FJs2ZHi2ze_QNBk9XWnrI'
                },
                {
                    id: 4,
                    name: 'Дмитрий Морозов',
                    role: 'member',
                    type: 'parent',
                    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEzPPpVi-2IczqZSIt05jY3kopKNoo8yj4hS97uLY-v-y59QvDHP2Txeb9Ob9UV77Ecis7s62QEgL7-NwjflRpiz8QYsMSHPwrTcT4TJIpNCTLtyqlmqbIGIwlrNmKRwqLExNP2a46bNVV13kjdlYb4MYUwRGepodsnZ6y4tYd6nPjiH9d5VWAJrp2HGD80qqZUz7fUQH4JhvFV-zWuLWdJo25_Iaexb0Nt-tTKcSdJ9gVUVypYeR-W-vCMGA7d3tVGgtOq-SsEz4'
                }
            ],
            schedule: {
                'ПН': { driver: 'Анна П.', active: true },
                'ВТ': { driver: 'Елена В.', active: true, current: true },
                'СР': { driver: 'Дмитрий М.', active: false },
                'ЧТ': { driver: 'Иван С.', active: false },
                'ПТ': { driver: 'Анна П.', active: true }
            },
            currentTrip: {
                driver: 'Елена Волкова',
                departureTime: '15:45',
                progress: 66,
                stopsRemaining: 2
            }
        };
    }

    initializeMessages() {
        return [
            {
                id: 1,
                sender: 'Иван',
                senderType: 'parent',
                text: 'Мы будем вовремя сегодня! 👍',
                time: '10:15',
                type: 'received'
            },
            {
                id: 2,
                sender: 'Вы',
                senderType: 'user',
                text: 'Отлично, спасибо что предупредили!',
                time: '10:18',
                type: 'sent'
            },
            {
                id: 3,
                sender: 'Система',
                senderType: 'system',
                text: 'Елена выехала из школы',
                time: '15:52',
                type: 'broadcast'
            },
            {
                id: 4,
                sender: 'Елена',
                senderType: 'driver',
                text: 'Пробки на Проспекте Мира, задержимся на 5 минут.',
                time: '15:52',
                type: 'received'
            }
        ];
    }

    setupEventListeners() {
        // Кнопка выхода из группы
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.leaveGroup());
        }

        // Кнопка приглашения
        const inviteBtn = document.querySelector('.invite-btn');
        if (inviteBtn) {
            inviteBtn.addEventListener('click', () => this.inviteMember());
        }

        // Кнопки управления картой
        const zoomInBtn = document.querySelector('.absolute.right-4 button:first-child');
        const zoomOutBtn = document.querySelector('.absolute.right-4 button:last-child');
        
        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', () => this.zoomMap('in'));
        }
        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', () => this.zoomMap('out'));
        }
    }

    setupChat() {
        const chatInput = document.querySelector('.border-t input[type="text"]');
        const sendBtn = document.querySelector('.border-t button:last-child');

        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }

        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendMessage());
        }
    }

    setupSchedule() {
        const scheduleGrid = document.getElementById('schedule-grid');
        if (scheduleGrid) {
            scheduleGrid.addEventListener('click', (e) => {
                const dayElement = e.target.closest('.flex-col');
                if (dayElement) {
                    this.toggleDaySchedule(dayElement);
                }
            });
        }
    }

    leaveGroup() {
        if (!confirm('Вы уверены, что хотите покинуть группу?')) return;

        // Показываем уведомление
        if (window.biroad) {
            window.biroad.showSuccess('Вы покинули группу');
        }

        // Перенаправляем на страницу поиска
        setTimeout(() => {
            if (window.biroad) {
                window.biroad.navigateTo('poisk');
            } else {
                window.location.href = 'poisk.html';
            }
        }, 1000);
    }

    inviteMember() {
        const email = prompt('Введите email родителя для приглашения:');
        if (!email) return;

        // Валидация email
        if (!Utils.validateEmail(email)) {
            if (window.biroad) {
                window.biroad.showError('Пожалуйста, введите корректный email');
            }
            return;
        }

        // Имитация отправки приглашения
        if (window.biroad) {
            window.biroad.showSuccess(`Приглашение отправлено на ${email}`);
        }

        // Сохраняем приглашение
        this.saveInvitation(email);
    }

    saveInvitation(email) {
        const invitations = JSON.parse(localStorage.getItem('biroad_invitations') || '[]');
        invitations.push({
            id: Utils.generateId(),
            email: email,
            groupId: this.groupData.id,
            groupName: this.groupData.name,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('biroad_invitations', JSON.stringify(invitations));
    }

    sendMessage() {
        const chatInput = document.querySelector('.border-t input[type="text"]');
        if (!chatInput || !chatInput.value.trim()) return;

        const message = {
            id: Utils.generateId(),
            sender: 'Вы',
            senderType: 'user',
            text: chatInput.value.trim(),
            time: Utils.formatTime(new Date()),
            type: 'sent'
        };

        this.messages.push(message);
        this.renderMessage(message);
        chatInput.value = '';

        // Прокручиваем чат вниз
        this.scrollToBottom();

        // Сохраняем сообщение
        this.saveMessage(message);
    }

    renderMessage(message) {
        const messagesContainer = document.querySelector('.flex-1.overflow-y-auto');
        if (!messagesContainer) return;

        const messageEl = document.createElement('div');
        
        if (message.type === 'broadcast') {
            messageEl.className = 'mx-auto rounded-full bg-slate-50 px-4 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-tighter';
            messageEl.textContent = message.text;
        } else if (message.type === 'sent') {
            messageEl.className = 'flex flex-col items-end';
            messageEl.innerHTML = `
                <div class="flex max-w-[85%] flex-col items-end">
                    <div class="rounded-2xl rounded-br-none bg-primary p-3 text-sm text-white chat-message-text">
                        ${message.text}
                    </div>
                    <div class="mt-1 flex items-center gap-1">
                        <span class="text-[9px] text-slate-400">${message.time}</span>
                        <span class="material-symbols-outlined text-[12px] text-primary">done_all</span>
                    </div>
                </div>
            `;
        } else {
            messageEl.className = 'flex items-end gap-2';
            messageEl.innerHTML = `
                <img class="size-8 rounded-full border border-slate-200" src="${this.getCurrentUserAvatar()}" alt="User avatar">
                <div class="flex max-w-[85%] flex-col">
                    <span class="ml-1 text-[10px] font-bold text-primary">${message.sender}</span>
                    <div class="rounded-2xl rounded-bl-none bg-slate-100 p-3 text-sm text-slate-800 chat-message-text">
                        ${message.text}
                    </div>
                    <span class="mt-1 text-[9px] text-slate-400">${message.time}</span>
                </div>
            `;
        }

        messagesContainer.appendChild(messageEl);
    }

    getCurrentUserAvatar() {
        if (window.biroad && window.biroad.getCurrentUser()) {
            return window.biroad.getCurrentUser().avatar || 'https://picsum.photos/seed/default/100/100';
        }
        return 'https://picsum.photos/seed/default/100/100';
    }

    saveMessage(message) {
        const chatMessages = JSON.parse(localStorage.getItem(`biroad_chat_${this.groupData.id}`) || '[]');
        chatMessages.push(message);
        localStorage.setItem(`biroad_chat_${this.groupData.id}`, JSON.stringify(chatMessages));
    }

    scrollToBottom() {
        const messagesContainer = document.querySelector('.flex-1.overflow-y-auto');
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    toggleDaySchedule(dayElement) {
        const dayName = dayElement.querySelector('span:first-child').textContent;
        const schedule = this.groupData.schedule[dayName];
        
        if (schedule) {
            schedule.active = !schedule.active;
            this.updateDayUI(dayElement, schedule);
            this.saveSchedule();
        }
    }

    updateDayUI(dayElement, schedule) {
        const personCircle = dayElement.querySelector('.size-8');
        const personName = dayElement.querySelector('.text-\\[10px\\]');
        
        if (schedule.active) {
            dayElement.classList.remove('border-neutral-border', 'bg-background-light/50');
            dayElement.classList.add('border-2', 'border-primary', 'bg-white');
            personCircle.classList.remove('bg-slate-200', 'text-slate-500');
            personCircle.classList.add('bg-primary', 'text-white');
        } else {
            dayElement.classList.remove('border-2', 'border-primary', 'bg-white');
            dayElement.classList.add('border-neutral-border', 'bg-background-light/50');
            personCircle.classList.remove('bg-primary', 'text-white');
            personCircle.classList.add('bg-slate-200', 'text-slate-500');
        }
    }

    saveSchedule() {
        localStorage.setItem(`biroad_schedule_${this.groupData.id}`, JSON.stringify(this.groupData.schedule));
    }

    zoomMap(direction) {
        const mapContainer = document.querySelector('.relative.overflow-hidden');
        if (!mapContainer) return;

        const currentScale = parseFloat(mapContainer.dataset.scale || 1);
        const newScale = direction === 'in' ? Math.min(currentScale + 0.2, 2) : Math.max(currentScale - 0.2, 0.5);
        
        mapContainer.dataset.scale = newScale;
        mapContainer.style.transform = `scale(${newScale})`;
    }

    loadGroupData() {
        // Загружаем сохраненные сообщения
        const savedMessages = localStorage.getItem(`biroad_chat_${this.groupData.id}`);
        if (savedMessages) {
            this.messages = JSON.parse(savedMessages);
            this.renderAllMessages();
        }

        // Загружаем сохраненное расписание
        const savedSchedule = localStorage.getItem(`biroad_schedule_${this.groupData.id}`);
        if (savedSchedule) {
            this.groupData.schedule = JSON.parse(savedSchedule);
            this.updateScheduleUI();
        }

        // Обновляем информацию о текущей поездке
        this.updateCurrentTripInfo();
    }

    renderAllMessages() {
        const messagesContainer = document.querySelector('.flex-1.overflow-y-auto');
        if (!messagesContainer) return;

        // Очищаем существующие сообщения (кроме системных)
        const existingMessages = messagesContainer.querySelectorAll('.flex.items-end, .flex.flex-col');
        existingMessages.forEach(el => el.remove());

        // Рендерим все сообщения
        this.messages.forEach(message => {
            this.renderMessage(message);
        });

        this.scrollToBottom();
    }

    updateScheduleUI() {
        const scheduleGrid = document.getElementById('schedule-grid');
        if (!scheduleGrid) return;

        const dayElements = scheduleGrid.querySelectorAll('.flex-col');
        dayElements.forEach(dayElement => {
            const dayName = dayElement.querySelector('span:first-child').textContent;
            const schedule = this.groupData.schedule[dayName];
            if (schedule) {
                this.updateDayUI(dayElement, schedule);
            }
        });
    }

    updateCurrentTripInfo() {
        const trip = this.groupData.currentTrip;
        if (!trip) return;

        // Обновляем время выезда
        const timeEl = document.querySelector('.text-2xl.font-black');
        if (timeEl) timeEl.textContent = trip.departureTime;

        // Обновляем прогресс
        const progressBar = document.querySelector('.h-full.w-2\\/3');
        if (progressBar) {
            progressBar.style.width = `${trip.progress}%`;
        }

        // Обновляем информацию о водителе
        const driverInfo = document.querySelector('.text-xs.font-medium');
        if (driverInfo) {
            driverInfo.textContent = `${trip.driver} (${trip.stopsRemaining} остановки осталось)`;
        }
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.logout-btn')) {
        window.groupPage = new GroupPage();
    }
});
