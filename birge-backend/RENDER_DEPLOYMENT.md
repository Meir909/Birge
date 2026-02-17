# Render.com Deployment Configuration

## Services Configuration

### 1. Web Service (Backend API)
```
Service Type: Web Service
Name: birge-backend
Runtime: Docker
Root Directory: ./
Dockerfile Path: ./Dockerfile
Plan: Starter (512 MB RAM)
Region: Frankfurt (fra)
Environment Variables:
  - NODE_ENV=production
  - PORT=3000
  - DATABASE_HOST=${DATABASE_HOST}
  - DATABASE_PORT=5432
  - DATABASE_USERNAME=${DATABASE_USERNAME}
  - DATABASE_PASSWORD=${DATABASE_PASSWORD}
  - DATABASE_NAME=${DATABASE_NAME}
  - REDIS_HOST=${REDIS_HOST}
  - REDIS_PORT=6379
  - REDIS_PASSWORD=${REDIS_PASSWORD}
  - JWT_SECRET=${JWT_SECRET}
  - JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
  - GOOGLE_MAPS_API_KEY=${GOOGLE_MAPS_API_KEY}
  - GEMINI_API_KEY=${GEMINI_API_KEY}
  - TWILIO_ACCOUNT_SID=${TWILIO_ACCOUNT_SID}
  - TWILIO_AUTH_TOKEN=${TWILIO_AUTH_TOKEN}
  - SENDGRID_API_KEY=${SENDGRID_API_KEY}
  - AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
  - AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
```

### 2. PostgreSQL Database
```
Service Type: PostgreSQL
Name: birge-postgres
Version: 15
Plan: Free
Database Name: birge_db
```

### 3. Redis Cache
```
Service Type: Redis
Name: birge-redis
Version: 7
Plan: Free
```

## Environment Variables (.env.render)

```bash
# Application
NODE_ENV=production
PORT=3000
BASE_URL=https://your-app.onrender.com

# Database (Render PostgreSQL)
DATABASE_HOST=${DATABASE_HOST}
DATABASE_PORT=5432
DATABASE_USERNAME=${DATABASE_USERNAME}
DATABASE_PASSWORD=${DATABASE_PASSWORD}
DATABASE_NAME=${DATABASE_NAME}

# Redis (Render Redis)
REDIS_HOST=${REDIS_HOST}
REDIS_PORT=6379
REDIS_PASSWORD=${REDIS_PASSWORD}
REDIS_DB=0

# Security
JWT_SECRET=your-very-long-jwt-secret-key-here-change-in-production
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-very-long-refresh-secret-key-here-change-in-production
JWT_REFRESH_EXPIRES_IN=7d
BcryptSaltRounds=12
THROTTLE_TTL=60
THROTTLE_LIMIT=100

# External APIs
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
GEMINI_API_KEY=your-gemini-api-key

# SMS (Twilio)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number

# Email (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=noreply@birge.kz

# AWS S3
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-s3-bucket-name

# AI Configuration
AI_DEFAULT_STYLE=friendly
AI_DEFAULT_FREQUENCY=moderate
```

## Deployment Steps

1. **Create Render Account**: https://render.com

2. **Create PostgreSQL Database**:
   - Go to Dashboard → New → PostgreSQL
   - Configure database settings
   - Note the connection details

3. **Create Redis Instance**:
   - Go to Dashboard → New → Redis
   - Configure Redis settings

4. **Deploy Web Service**:
   - Go to Dashboard → New → Web Service
   - Connect your GitHub repository
   - Set Build Command: `npm run build`
   - Set Start Command: `npm run start:prod`
   - Add environment variables
   - Deploy

## Health Check Endpoint

Add this to your main.ts for Render health checks:

```typescript
// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});
```

## Domain Configuration

1. **Custom Domain** (Optional):
   - In Render dashboard → your service → Settings → Custom Domains
   - Add your domain
   - Configure DNS records as instructed

2. **SSL Certificate**:
   - Automatically provided by Render for custom domains

## Monitoring

- Render provides built-in monitoring
- Check logs in Render dashboard
- Set up alerts for your service

## Scaling

- **Starter Plan**: 512MB RAM, 1 CPU
- **Standard Plan**: 1GB RAM, 1 CPU
- **Pro Plans**: More resources available

## CI/CD

Render automatically deploys on:
- Git push to main branch
- Manual deployment from dashboard

## Backup Strategy

- Render automatically backs up databases
- Regular exports recommended for critical data
- Set up automated backups in Render dashboard