#!/bin/bash

# 🚀 BIRoad Render Deployment Script
# Автоматический деплой на Render

set -e

echo "🚀 Деплой BIRoad на Render..."

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
    log_step "Подготовка проекта к деплою на Render..."
    
    # Проверяем структуру
    if [ ! -d "server" ]; then
        log_error "Папка server не найдена"
        exit 1
    fi
    
    if [ ! -d "biroad-front" ]; then
        log_error "Папка biroad-front не найдена"
        exit 1
    fi
    
    # Очистка и установка зависимостей
    log_info "Установка зависимостей сервера..."
    cd server
    npm install --production
    cd ..
    
    log_info "Установка зависимостей фронтенда..."
    cd biroad-front
    npm install
    npm run build
    cd ..
    
    log_success "Проект подготовлен"
}

# Проверка переменных окружения
check_env_vars() {
    log_step "Проверка переменных окружения..."
    
    # Проверяем .env файлы
    if [ ! -f "server/.env" ]; then
        log_error "server/.env файл не найден"
        exit 1
    fi
    
    # Проверяем ключевые переменные
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

# Создание render.yaml
create_render_config() {
    log_step "Создание Render конфигурации..."
    
    cat > render.yaml << 'EOF'
# 🚀 BIRoad Render Configuration
services:
  # Frontend Static Site
  - type: web
    name: biroad-frontend
    env: static
    rootDir: biroad-front
    buildCommand: npm install && npm run build
    publishDir: dist
    routes:
      - type: rewrite
        src: /api/(.*)
        dest: https://biroad-backend.onrender.com/api/$1
      - type: rewrite
        src: /socket.io/(.*)
        dest: https://biroad-backend.onrender.com/socket.io/$1
    envVars:
      - key: NODE_ENV
        value: production
      - key: GOOGLE_MAPS_API_KEY
        sync: false
      - key: GEMINI_API_KEY
        sync: false
      - key: NEXT_PUBLIC_API_URL
        value: https://biroad-backend.onrender.com
      - key: NEXT_PUBLIC_WS_URL
        value: wss://biroad-backend.onrender.com

  # Backend Web Service
  - type: web
    name: biroad-backend
    runtime: node
    rootDir: server
    buildCommand: npm install --production
    startCommand: npm start
    healthCheckPath: /api/health
    healthCheckGracePeriod: 60
    autoDeploy: true
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: MONGODB_URI
        fromDatabase:
          name: biroad-mongodb
          property: connectionString
      - key: JWT_SECRET
        generateValue: true
      - key: GOOGLE_MAPS_API_KEY
        sync: false
      - key: GEMINI_API_KEY
        sync: false
      - key: TWILIO_ACCOUNT_SID
        sync: false
      - key: TWILIO_AUTH_TOKEN
        sync: false
      - key: TWILIO_PHONE_NUMBER
        sync: false

# База данных MongoDB
databases:
  - name: biroad-mongodb
    databaseName: biroad
    user: biroad_user
    plan: free
EOF
    
    log_success "Render конфигурация создана"
}

# Git операции
git_operations() {
    log_step "Выполнение Git операций..."
    
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
    
    # Добавляем render.yaml
    git add render.yaml
    git commit -m "Add Render configuration" || true
    
    # Пуш в репозиторий
    log_info "Отправка изменений в репозиторий..."
    git push origin main
    
    log_success "Git операции завершены"
}

# Инструкции по деплою
show_deploy_instructions() {
    echo ""
    echo "🎯 **Инструкции по деплою на Render:**"
    echo ""
    echo "1. 🌐 Откройте [render.com](https://render.com)"
    echo "2. 🔐 Войдите через GitHub"
    echo "3. 📁 Выберите репозиторий BIRoad"
    echo ""
    echo "🚀 **Backend Service:**"
    echo "- New → Web Service"
    echo "- Root Directory: server"
    echo "- Build Command: npm install --production"
    echo "- Start Command: npm start"
    echo "- Instance Type: Free"
    echo ""
    echo "🗄️ **Database:**"
    echo "- New → Database"
    echo "- Выберите MongoDB"
    echo "- Name: biroad-mongodb"
    echo "- Instance Type: Free"
    echo ""
    echo "🎨 **Frontend:**"
    echo "- New → Static Site"
    echo "- Root Directory: biroad-front"
    echo "- Build Command: npm install && npm run build"
    echo "- Publish Directory: dist"
    echo ""
    echo "📋 **Environment Variables:**"
    echo "- GOOGLE_MAPS_API_KEY: AIzaSyABXU6o38OxHCQPLCIvlMCn0dy_krVr60I"
    echo "- GEMINI_API_KEY: AQ.Ab8RN6IDR2Y76xkoviNCdeBLl4U7IdCWjoRq7zB1yHKfVqZbjg"
    echo "- NEXT_PUBLIC_API_URL: https://biroad-backend.onrender.com"
    echo "- NEXT_PUBLIC_WS_URL: wss://biroad-backend.onrender.com"
    echo ""
    echo "🔄 **После деплоя:**"
    echo "- Frontend: https://biroad-frontend.onrender.com"
    echo "- Backend: https://biroad-backend.onrender.com"
    echo ""
    echo "📚 **Подробнее:** см. RENDER_DEPLOY.md"
    echo ""
}

# Проверка готовности
check_readiness() {
    log_step "Проверка готовности к деплою..."
    
    echo "✅ Проект готов к деплою на Render!"
    echo ""
    echo "📋 Что проверено:"
    echo "  ✅ Структура проекта"
    echo "  ✅ Зависимости установлены"
    echo "  ✅ Переменные окружения"
    echo "  ✅ Git репозиторий"
    echo "  ✅ Render конфигурация"
    echo ""
    echo "🚀 Следующие шаги:"
    echo "  1. Откройте render.com"
    echo "  2. Войдите через GitHub"
    echo "  3. Следуйте инструкциям выше"
    echo ""
}

# Главное меню
main_menu() {
    echo "🚀 BIRoad Render Deployment Menu"
    echo "1. Полная подготовка к деплою"
    echo "2. Только проверка окружения"
    echo "3. Создать Render конфигурацию"
    echo "4. Показать инструкции по деплою"
    echo "5. Выход"
    
    read -p "Выберите опцию (1-5): " choice
    
    case $choice in
        1)
            check_dependencies
            prepare_project
            check_env_vars
            create_render_config
            git_operations
            check_readiness
            show_deploy_instructions
            ;;
        2)
            check_dependencies
            check_env_vars
            ;;
        3)
            create_render_config
            ;;
        4)
            show_deploy_instructions
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
    create_render_config
    git_operations
    check_readiness
    show_deploy_instructions
else
    main_menu
fi
