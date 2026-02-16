// Функциональность для страницы поиска
class SearchPage {
    constructor() {
        this.groups = this.initializeGroups();
        this.filters = {
            search: '',
            school: 'all',
            class: 'all',
            time: 'all'
        };
        this.init();
    }

    init() {
        this.setupSearch();
        this.setupFilters();
        this.setupJoinButtons();
        this.updateResults();
    }

    initializeGroups() {
        return [
            {
                id: 'westside-express',
                name: 'Westside Express',
                driver: 'Дэвид Миллер',
                rating: 4.9,
                match: 98,
                time: '07:15',
                school: 'Академия Хайтс',
                grades: 'K-5 классы',
                seats: 2,
                totalSeats: 3,
                avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBO17TJeYGfAfAsa2ay6r4eoZWRY5i8JE-93UpnSVWWkOEgFdFQBu3fFWNzJbPm5x_YGHsTRAMxcRxb9XIDQkPqHHTvoJlGkFRzgaGA738B4KH4k03frR4SYr8LIjQqabamqF3w4TiNAeTL7K93SrCDdRxQggHjQ-0u4ekGbRYBtnRf7z3X75uQ0IGGCPwh6KjVWWRaUmwjQyzcOeqcUHBI8LEfTyh05pLXwhkd3SAOUognQzATr-FPLq1PKWlFKhTb5KxKQdCcOYY'
            },
            {
                id: 'morning-commuters',
                name: 'Morning Commuters',
                driver: 'Сара Чен',
                rating: 4.8,
                match: 92,
                time: '07:45',
                school: 'Академия Хайтс',
                grades: '6-12 классы',
                seats: 1,
                totalSeats: 3,
                avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGnaQinD-uzJE6hNCY5vnyhPDMBCZdqqrUt9OOCeEaFaY2TOq72BuAsmHgmoa-iXCIttc2DCjk06lhjQUWUb2yTFc4PNuPZnUsVED_eQvlKJom2YTH-HFu9kKPoWogP3PDKFMVo-4hq0O1ER2XlgJSaPZnLLTNPl8UxcTNWAyCy_LuxPS0hbVmU0lSe1mKNMV15NTcsrEGhERweNozFzVaB-qqvqtolF9gqvJr5iI3yp2LE5pn0nqgv1W_jXyslTYlqLmIltO9gpo'
            },
            {
                id: 'valley-route-kids',
                name: 'Valley Route Kids',
                driver: 'Марк Уилсон',
                rating: 5.0,
                match: 85,
                time: '08:00',
                school: 'Академия Хайтс',
                grades: 'Все классы',
                seats: 3,
                totalSeats: 3,
                avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0QoYQucw0Uld0Z9V8khRsDbF1N1C0rzma_8oCRypZThmoTjtVgyb7SXbfhHOHgJmltcITwsYA9Kb6EHKD_ZA98LTeMVkl_JB7_VI1Ylzr6gNGHjRG07j2fn5v4Rvh4zi_lz_TA57jyW33_EhFkHvaj567uzlcCqYHeynvaRZwB3oJrf41Ky23bnzjhIvpvSSrceYpWbFgs_al6mAj3hwDTOEfofrCIGr2EAoz3rZ21qKVg5uZ_CihKwYP6tTme4YQULGs8h7D9K0'
            }
        ];
    }

    setupSearch() {
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', Utils.debounce((e) => {
                this.filters.search = e.target.value.toLowerCase();
                this.updateResults();
            }, 300));
        }
    }

    setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filterType = btn.dataset.filter;
                this.toggleFilter(btn, filterType);
                this.updateResults();
            });
        });
    }

    toggleFilter(button, filterType) {
        const isActive = button.classList.contains('bg-primary/10');
        
        // Сбрасываем все фильтры этого типа
        document.querySelectorAll(`[data-filter="${filterType}"]`).forEach(btn => {
            btn.classList.remove('bg-primary/10', 'text-primary', 'border-primary/20');
            btn.classList.add('bg-background-light/50', 'text-neutral-text');
        });

        // Если был неактивен, активируем
        if (!isActive) {
            button.classList.remove('bg-background-light/50', 'text-neutral-text');
            button.classList.add('bg-primary/10', 'text-primary', 'border-primary/20');
            
            // Устанавливаем значение фильтра
            if (filterType === 'school') {
                this.filters.school = 'Академия Хайтс';
            } else if (filterType === 'class') {
                this.filters.class = 'all'; // Можно расширить
            } else if (filterType === 'time') {
                this.filters.time = '7-8'; // Можно расширить
            }
        } else {
            // Сбрасываем фильтр
            if (filterType === 'school') {
                this.filters.school = 'all';
            } else if (filterType === 'class') {
                this.filters.class = 'all';
            } else if (filterType === 'time') {
                this.filters.time = 'all';
            }
        }
    }

    setupJoinButtons() {
        const joinButtons = document.querySelectorAll('.join-btn');
        joinButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const groupId = btn.dataset.group;
                this.joinGroup(groupId);
            });
        });
    }

    joinGroup(groupId) {
        const group = this.groups.find(g => g.id === groupId);
        if (!group) return;

        // Проверяем авторизацию
        if (!window.biroad || !window.biroad.isAuthenticated()) {
            window.biroad.showError('Пожалуйста, войдите в систему для присоединения к группе');
            return;
        }

        // Проверяем наличие мест
        if (group.seats <= 0) {
            window.biroad.showError('В этой группе нет свободных мест');
            return;
        }

        // Имитация присоединения к группе
        group.seats--;
        
        // Обновляем UI
        this.updateGroupCard(groupId);
        
        // Показываем уведомление
        window.biroad.showSuccess(`Вы присоединились к группе "${group.name}"`);

        // Сохраняем в localStorage
        this.saveJoinedGroup(groupId);
    }

    saveJoinedGroup(groupId) {
        const joinedGroups = JSON.parse(localStorage.getItem('biroad_joined_groups') || '[]');
        if (!joinedGroups.includes(groupId)) {
            joinedGroups.push(groupId);
            localStorage.setItem('biroad_joined_groups', JSON.stringify(joinedGroups));
        }
    }

    updateResults() {
        const filteredGroups = this.filterGroups();
        this.renderGroups(filteredGroups);
        this.updateResultsCount(filteredGroups.length);
    }

    filterGroups() {
        return this.groups.filter(group => {
            // Поиск по названию или водителю
            if (this.filters.search) {
                const searchMatch = group.name.toLowerCase().includes(this.filters.search) ||
                                  group.driver.toLowerCase().includes(this.filters.search) ||
                                  group.school.toLowerCase().includes(this.filters.search);
                if (!searchMatch) return false;
            }

            // Фильтр по школе
            if (this.filters.school !== 'all' && group.school !== this.filters.school) {
                return false;
            }

            // Фильтр по времени
            if (this.filters.time !== 'all') {
                const hour = parseInt(group.time.split(':')[0]);
                if (this.filters.time === '7-8' && (hour < 7 || hour >= 8)) {
                    return false;
                }
            }

            return true;
        });
    }

    renderGroups(groups) {
        const container = document.querySelector('.bg-slate-50.dark\\:bg-background-dark\\/50');
        if (!container) return;

        // Находим существующие карточки групп
        const groupCards = container.querySelectorAll('.bg-white.dark\\:bg-slate-800');
        
        groupCards.forEach((card, index) => {
            if (index < groups.length) {
                const group = groups[index];
                this.updateGroupCardElement(card, group);
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    updateGroupCardElement(card, group) {
        // Обновляем информацию о группе
        const nameEl = card.querySelector('h4');
        const driverEl = card.querySelector('p');
        const matchEl = card.querySelector('.bg-primary\\/10');
        const timeEl = card.querySelector('.text-sm.font-medium');
        const schoolEl = card.querySelector('.text-sm.font-medium:last-of-type');
        const seatsEl = card.querySelector('.text-\\[10px\\].font-bold');
        const joinBtn = card.querySelector('.join-btn');

        if (nameEl) nameEl.textContent = group.name;
        if (driverEl) driverEl.textContent = `Водитель: ${group.driver}`;
        if (matchEl) matchEl.textContent = `${group.match}% СОВПАДЕНИЕ`;
        if (timeEl) timeEl.textContent = `Выезд в ${group.time}`;
        if (schoolEl) schoolEl.textContent = `${group.school} (${group.grades})`;
        if (seatsEl) seatsEl.textContent = `${group.seats} места осталось`;
        
        if (joinBtn) {
            joinBtn.dataset.group = group.id;
            if (group.seats <= 0) {
                joinBtn.textContent = 'Нет мест';
                joinBtn.disabled = true;
                joinBtn.classList.add('opacity-50', 'cursor-not-allowed');
            } else {
                joinBtn.textContent = 'Присоединиться';
                joinBtn.disabled = false;
                joinBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        }
    }

    updateGroupCard(groupId) {
        const group = this.groups.find(g => g.id === groupId);
        if (!group) return;

        const joinBtn = document.querySelector(`[data-group="${groupId}"]`);
        if (joinBtn) {
            if (group.seats <= 0) {
                joinBtn.textContent = 'Нет мест';
                joinBtn.disabled = true;
                joinBtn.classList.add('opacity-50', 'cursor-not-allowed');
            } else {
                joinBtn.textContent = 'Присоединиться';
                joinBtn.disabled = false;
                joinBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        }

        // Обновляем количество мест
        const seatsEl = joinBtn?.closest('.bg-white')?.querySelector('.text-\\[10px\\].font-bold');
        if (seatsEl) {
            seatsEl.textContent = `${group.seats} места осталось`;
        }
    }

    updateResultsCount(count) {
        const countEl = document.querySelector('.text-xs.font-semibold.text-slate-500');
        if (countEl) {
            countEl.textContent = `Найдено ${count} совпадений`;
        }
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.search-input')) {
        window.searchPage = new SearchPage();
    }
});
