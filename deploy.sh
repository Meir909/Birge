#!/bin/bash

# 🚀 BIRoad Deployment Script
# Автоматический деплой на Vercel + Railway

set -e

echo "🚀 Начинаем деплой BIRoad..."

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

# Проверка зависимостей
check_dependencies() {
    log_info "Проверка зависимостей..."
    
    if ! command -v git &> /dev/null; then
        log_error "Git не установлен"
        exit 1
    fi
    
    if ! command -v node &> /dev/null; then
        log_error "Node.js не установлен"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        log_error "NPM не установлен"
        exit 1
    fi
    
    log_success "Все зависимости установлены"
}

# Подготовка проекта
prepare_project() {
    log_info "Подготовка проекта к деплою..."
    
    # Проверяем что мы в корневой директории
    if [ ! -f "package.json" ] && [ ! -d "server" ]; then
        log_error "Не в корневой директории проекта"
        exit 1
    fi
    
    # Очистка и установка зависимостей
    log_info "Установка зависимостей фронтенда..."
    npm install
    
    log_info "Установка зависимостей сервера..."
    cd server
    npm install --production
    cd ..
    
    # Сборка фронтенда
    log_info "Сборка фронтенда..."
    cd biroad-front
    npm run build
    cd ..
    
    log_success "Проект подготовлен"
}

# Проверка переменных окружения
check_env_vars() {
    log_info "Проверка переменных окружения..."
    
    # Проверяем .env файлы
    if [ ! -f ".env" ]; then
        log_error ".env файл не найден"
        exit 1
    fi
    
    if [ ! -f "server/.env" ]; then
        log_error "server/.env файл не найден"
        exit 1
    fi
    
    # Проверяем ключевые переменные
    source .env
    source server/.env
    
    if [ -z "$GOOGLE_MAPS_API_KEY" ] || [ "$GOOGLE_MAPS_API_KEY" = "YOUR_GOOGLE_MAPS_API_KEY_HERE" ]; then
        log_error "GOOGLE_MAPS_API_KEY не настроен"
        exit 1
    fi
    
    if [ -z "$GEMINI_API_KEY" ] || [ "$GEMINI_API_KEY" = "YOUR_GEMINI_API_KEY_HERE" ]; then
        log_error "GEMINI_API_KEY не настроен"
        exit 1
    fi
    
    log_success "Переменные окружения проверены"
}

# Git операции
git_operations() {
    log_info "Выполнение Git операций..."
    
    # Проверяем статус git
    if [ -n "$(git status --porcelain)" ]; then
        log_warning "Есть незакоммиченные изменения"
        
        read -p "Хотите закоммитить их? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git add .
            read -p "Введите сообщение коммита: " commit_msg
            git commit -m "$commit_msg"
        fi
    fi
    
    # Пуш в репозиторий
    log_info "Отправка изменений в репозиторий..."
    git push origin main
    
    log_success "Git операции завершены"
}

# Деплой фронтенда на Vercel
deploy_frontend() {
    log_info "Деплой фронтенда на Vercel..."
    
    # Проверяем Vercel CLI
    if ! command -v vercel &> /dev/null; then
        log_info "Установка Vercel CLI..."
        npm install -g vercel
    fi
    
    # Деплой
    cd biroad-front
    vercel --prod
    
    # Получаем URL
    FRONTEND_URL=$(vercel ls | grep biroad | head -1 | awk '{print $2}')
    cd ..
    
    log_success "Фронтенд задеплоен: $FRONTEND_URL"
}

# Деплой бэкенда на Railway
deploy_backend() {
    log_info "Деплой бэкенда на Railway..."
    
    # Проверяем Railway CLI
    if ! command -v railway &> /dev/null; then
        log_info "Установка Railway CLI..."
        npm install -g @railway/cli
    fi
    
    # Логин в Railway
    railway login
    
    # Деплой
    cd server
    railway up
    
    # Получаем URL
    BACKEND_URL=$(railway status | grep "Your project is available at" | awk '{print $6}')
    cd ..
    
    log_success "Бэкенд задеплоен: $BACKEND_URL"
}

# Обновление переменных окружения
update_env_vars() {
    log_info "Обновление переменных окружения..."
    
    # Обновляем URL в фронтенде
    sed -i "s|NEXT_PUBLIC_API_URL=http://localhost:3002|NEXT_PUBLIC_API_URL=$BACKEND_URL|g" .env
    sed -i "s|NEXT_PUBLIC_WS_URL=ws://localhost:3002|NEXT_PUBLIC_WS_URL=wss://$(echo $BACKEND_URL | sed 's/https:\/\///g')|g" .env
    
    log_success "Переменные окружения обновлены"
}

# Финальная проверка
final_check() {
    log_info "Финальная проверка деплоя..."
    
    # Проверка API
    if curl -f "$BACKEND_URL/api/health" > /dev/null 2>&1; then
        log_success "API отвечает корректно"
    else
        log_error "API не отвечает"
        exit 1
    fi
    
    # Проверка фронтенда
    if curl -f "$FRONTEND_URL" > /dev/null 2>&1; then
        log_success "Фронтенд доступен"
    else
        log_error "Фронтенд не доступен"
        exit 1
    fi
    
    log_success "Деплой успешно завершен!"
}

# Главное меню
main_menu() {
    echo "🚀 BIRoad Deployment Menu"
    echo "1. Полный деплой (Vercel + Railway)"
    echo "2. Только фронтенд (Vercel)"
    echo "3. Только бэкенд (Railway)"
    echo "4. Проверка окружения"
    echo "5. Выход"
    
    read -p "Выберите опцию (1-5): " choice
    
    case $choice in
        1)
            check_dependencies
            prepare_project
            check_env_vars
            git_operations
            deploy_frontend
            deploy_backend
            update_env_vars
            final_check
            ;;
        2)
            check_dependencies
            prepare_project
            git_operations
            deploy_frontend
            ;;
        3)
            check_dependencies
            prepare_project
            git_operations
            deploy_backend
            ;;
        4)
            check_dependencies
            check_env_vars
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
    prepare_project
    check_env_vars
    git_operations
    deploy_frontend
    deploy_backend
    update_env_vars
    final_check
else
    main_menu
fi
