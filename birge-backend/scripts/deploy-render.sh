#!/bin/bash

# Render Deployment Automation Script
# Usage: ./deploy-render.sh [environment]

set -e

ENVIRONMENT=${1:-production}
echo "🚀 Deploying Birge Backend to Render ($ENVIRONMENT)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if required tools are installed
check_dependencies() {
    echo "🔍 Checking dependencies..."
    
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}Docker is not installed${NC}"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        echo -e "${RED}Docker Compose is not installed${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✓ All dependencies are installed${NC}"
}

# Build the application
build_app() {
    echo "🏗️ Building application..."
    
    # Install dependencies
    echo "Installing dependencies..."
    npm ci
    
    # Run tests
    echo "Running tests..."
    npm run test
    
    # Build the application
    echo "Building production bundle..."
    npm run build
    
    echo -e "${GREEN}✓ Application built successfully${NC}"
}

# Create Render services
create_render_services() {
    echo "☁️ Creating Render services..."
    
    # This would typically use Render CLI or API
    # For now, we'll output the commands needed
    
    echo -e "${YELLOW}Please create the following services in Render:${NC}"
    echo ""
    echo "1. PostgreSQL Database:"
    echo "   - Name: birge-postgres"
    echo "   - Database: birge_db"
    echo "   - Plan: Free/Standard"
    echo ""
    echo "2. Redis Instance:"
    echo "   - Name: birge-redis"
    echo "   - Plan: Free/Standard"
    echo ""
    echo "3. Web Service:"
    echo "   - Name: birge-backend"
    echo "   - Build Command: npm ci && npm run build"
    echo "   - Start Command: npm run start:prod"
    echo "   - Plan: Starter (512MB)"
    echo ""
    echo "Environment Variables needed:"
    cat .env.render.example
}

# Deploy to Render
deploy_to_render() {
    echo "📤 Deploying to Render..."
    
    # This would use Render CLI in a real implementation
    echo "Please deploy using Render dashboard or CLI:"
    echo "render deploy --env=$ENVIRONMENT"
}

# Main execution
main() {
    echo -e "${GREEN}🚀 Birge Backend Deployment Script${NC}"
    echo "=================================="
    echo ""
    
    check_dependencies
    build_app
    create_render_services
    deploy_to_render
    
    echo ""
    echo -e "${GREEN}✅ Deployment process completed!${NC}"
    echo "Next steps:"
    echo "1. Set up services in Render dashboard"
    echo "2. Configure environment variables"
    echo "3. Deploy the web service"
    echo "4. Monitor the deployment logs"
}

# Run main function
main "$@"