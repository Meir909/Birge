# Birge Backend - School Carpooling Platform

Full backend implementation for Birge - a smart school carpooling platform with AI integration.

## Technology Stack

- **Runtime**: Node.js 20+ LTS
- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL 15+
- **Cache**: Redis 7+
- **Real-time**: Socket.io
- **AI**: Google Gemini Flash 2.5 API
- **SMS**: Twilio
- **Email**: SendGrid
- **File Storage**: AWS S3
- **Maps**: Google Maps API
- **Queue**: Bull (Redis-based)
- **Monitoring**: Prometheus + Grafana
- **Logging**: Winston + ELK Stack

## Features Implemented

### Core Modules
- ✅ Authentication & Authorization (JWT)
- ✅ User Management
- ✅ School Management
- ✅ Trip Creation & Management
- ✅ Trip Requests System
- ✅ Real-time Tracking
- ✅ AI-Powered Route Optimization
- ✅ Chat System
- ✅ Notifications (SMS & Email)
- ✅ Ratings & Reviews
- ✅ Gamification System
- ✅ Admin Panel
- ✅ Analytics & Reporting

### AI Integration
- Google Gemini Flash 2.0 for:
  - Route optimization
  - Passenger matching
  - Safety recommendations
  - Driver behavior analysis
  - Real-time trip suggestions

### Security Features
- JWT-based authentication
- Role-based access control
- Rate limiting
- Input validation
- Secure password hashing
- Refresh tokens

## Project Structure

```
/src
├── /config                 # Configuration files
├── /common                 # Shared utilities
│   ├── /decorators         # Custom decorators
│   ├── /guards             # Auth guards
│   ├── /interceptors       # Response interceptors
│   ├── /filters            # Exception filters
│   ├── /pipes              # Validation pipes
│   └── /utils              # Helper utilities
├── /modules                # Feature modules
│   ├── /auth              # Authentication
│   ├── /users             # User management
│   ├── /schools           # School management
│   ├── /trips             # Trip management
│   ├── /requests          # Trip requests
│   ├── /ai                # AI services
│   ├── /chat              # Chat system
│   ├── /notifications     # Notifications
│   ├── /ratings           # Ratings system
│   ├── /realtime          # Real-time tracking
│   ├── /maps              # Maps integration
│   ├── /files             # File management
│   ├── /gamification      # Gamification
│   └── /admin             # Admin panel
└── /database              # Database entities
    ├── /entities          # TypeORM entities
    ├── /migrations        # Database migrations
    └── /seeds             # Seed data
```

## Database Schema

### Core Entities
1. **Users** - User profiles with roles (driver/passenger)
2. **Schools** - School information and schedules
3. **Trips** - Trip definitions and routing
4. **TripParticipants** - Trip participant details
5. **TripRequests** - Request to join trips
6. **TripInstances** - Actual trip instances
7. **Ratings** - User ratings and reviews

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- Docker (optional)

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd birge-backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start database services:**
```bash
docker-compose up -d postgres redis
```

5. **Run database migrations:**
```bash
npm run migration:run
```

6. **Start development server:**
```bash
npm run start:dev
```

### API Documentation
Swagger documentation available at: `http://localhost:3000/api`

### Default Ports
- API: `3000`
- PostgreSQL: `5432`
- Redis: `6379`

## Development Commands

```bash
# Development
npm run start:dev

# Production build
npm run build
npm run start:prod

# Testing
npm run test
npm run test:e2e

# Linting
npm run lint
npm run format
```

## Environment Variables

See `.env.example` for all required environment variables.

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh token

### Trips
- `GET /api/v1/trips` - List trips
- `POST /api/v1/trips` - Create trip
- `GET /api/v1/trips/:id` - Get trip details
- `PUT /api/v1/trips/:id` - Update trip
- `DELETE /api/v1/trips/:id` - Delete trip

### Requests
- `POST /api/v1/requests` - Create trip request
- `GET /api/v1/requests` - List requests
- `PUT /api/v1/requests/:id/accept` - Accept request
- `PUT /api/v1/requests/:id/reject` - Reject request

### Real-time Features
- Socket.io connections for live tracking
- Real-time notifications
- Instant messaging

## Testing

The project includes comprehensive tests:
- Unit tests
- Integration tests
- End-to-end tests

Run tests with:
```bash
npm test
npm run test:e2e
```

## Monitoring & Logging

- Winston logging with file rotation
- ELK stack integration
- Prometheus metrics
- Grafana dashboards

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is proprietary and confidential.