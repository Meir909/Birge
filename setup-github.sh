#!/bin/bash

# 🚀 BIRoad GitHub Setup Script
# Автоматическая настройка GitHub репозитория

set -e

echo "🚀 Настройка GitHub репозитория для BIRoad..."

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Функции для вывода
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_step() {
    echo -e "${PURPLE}🔧 $1${NC}"
}

# Проверка зависимостей
check_dependencies() {
    log_info "Проверка зависимостей..."
    
    if ! command -v git &> /dev/null; then
        log_error "Git не установлен"
        exit 1
    fi
    
    log_success "Git установлен"
}

# Проверка Git конфигурации
check_git_config() {
    log_step "Проверка Git конфигурации..."
    
    if [ -z "$(git config user.name)" ]; then
        log_warning "Git user.name не настроен"
        read -p "Введите ваше имя: " git_name
        git config --global user.name "$git_name"
    fi
    
    if [ -z "$(git config user.email)" ]; then
        log_warning "Git user.email не настроен"
        read -p "Введите ваш email: " git_email
        git config --global user.email "$git_email"
    fi
    
    log_success "Git конфигурация проверена"
}

# Настройка remote
setup_remote() {
    log_step "Настройка GitHub remote..."
    
    echo "📋 Введите ваш GitHub username:"
    read -p "GitHub username: " github_username
    
    if [ -z "$github_username" ]; then
        log_error "GitHub username обязателен"
        exit 1
    fi
    
    # Удаление существующего remote если есть
    if git remote get-url origin &> /dev/null; then
        git remote remove origin
        log_info "Существующий remote удален"
    fi
    
    # Добавление нового remote
    git remote add origin "https://github.com/$github_username/biroad.git"
    log_success "Remote добавлен: https://github.com/$github_username/biroad.git"
    
    # Сохранение username для следующих шагов
    echo "$github_username" > .github_username
}

# Создание main ветки
create_main_branch() {
    log_step "Создание main ветки..."
    
    # Проверяем текущую ветку
    current_branch=$(git branch --show-current)
    
    if [ "$current_branch" != "main" ]; then
        git branch -M main
        log_success "Ветка переименована в main"
    else
        log_success "Ветка main уже существует"
    fi
}

# Push на GitHub
push_to_github() {
    log_step "Отправка файлов на GitHub..."
    
    github_username=$(cat .github_username 2>/dev/null || echo "")
    
    if [ -z "$github_username" ]; then
        log_error "GitHub username не найден"
        exit 1
    fi
    
    echo "🌐 Отправка на https://github.com/$github_username/biroad.git"
    
    # Попытка пуша
    if git push -u origin main; then
        log_success "Файлы успешно отправлены на GitHub!"
    else
        log_error "Ошибка при отправке на GitHub"
        echo ""
        echo "📋 Возможные решения:"
        echo "1. Убедитесь что репозиторий создан на GitHub"
        echo "2. Проверьте правильность username: $github_username"
        echo "3. Убедитесь что вы аутентифицированы в Git"
        echo ""
        echo "🔗 Создайте репозиторий: https://github.com/new"
        echo "📝 Название: biroad"
        echo "📋 Описание: BIRoad - Умный карпул-сервис"
        echo ""
        echo "После создания репозитория выполните:"
        echo "git push -u origin main"
        exit 1
    fi
}

# Показ следующих шагов
show_next_steps() {
    github_username=$(cat .github_username 2>/dev/null || echo "")
    
    echo ""
    echo "🎉 **Отлично! Проект готов к деплою!**"
    echo ""
    echo "📋 **Что сделано:**"
    echo "  ✅ Git репозиторий настроен"
    echo "  ✅ Файлы отправлены на GitHub"
    echo "  ✅ Main ветка создана"
    echo ""
    echo "🔗 **Ссылки:**"
    echo "  🌐 GitHub: https://github.com/$github_username/biroad"
    echo "  📊 GitHub Pages: https://$github_username.github.io/biroad"
    echo ""
    echo "🚀 **Следующие шаги:**"
    echo "  1. 🌐 Откройте [render.com](https://render.com)"
    echo "  2. 🔐 Войдите через GitHub"
    echo "  3. 📁 Выберите репозиторий 'biroad'"
    echo "  4. 📋 Следуйте инструкциям из RENDER_DEPLOY.md"
    echo ""
    echo "🎯 **Результат деплоя:**"
    echo "  🎨 Frontend: https://biroad-frontend.onrender.com"
    echo "  🔧 Backend: https://biroad-backend.onrender.com"
    echo ""
    echo "📚 **Документация:**"
    echo "  📖 RENDER_DEPLOY.md - инструкция по деплою"
    echo "  📖 GITHUB_SETUP.md - эта инструкция"
    echo ""
}

# Главное меню
main_menu() {
    echo "🚀 BIRoad GitHub Setup Menu"
    echo "1. Полная настройка GitHub"
    echo "2. Только push на GitHub"
    echo "3. Проверить Git конфигурацию"
    echo "4. Показать инструкции"
    echo "5. Выход"
    
    read -p "Выберите опцию (1-5): " choice
    
    case $choice in
        1)
            check_dependencies
            check_git_config
            setup_remote
            create_main_branch
            push_to_github
            show_next_steps
            ;;
        2)
            github_username=$(cat .github_username 2>/dev/null || echo "")
            if [ -z "$github_username" ]; then
                log_error "Сначала выполните полную настройку (опция 1)"
                exit 1
            fi
            push_to_github
            show_next_steps
            ;;
        3)
            check_dependencies
            check_git_config
            ;;
        4)
            cat GITHUB_SETUP.md
            ;;
        5)
            log_info "Выход"
            exit 0
            ;;
        *)
            log_error "Неверная опция"
            main_menu
            ;;
    esac
}

# Запуск
if [ "$1" = "--full" ]; then
    check_dependencies
    check_git_config
    setup_remote
    create_main_branch
    push_to_github
    show_next_steps
else
    main_menu
fi
