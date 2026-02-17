# Render Web Service Configuration for Monolithic Deployment

## Option 1: Single Web Service (Recommended for small projects)

**Service Type:** Web Service
**Build Command:** `npm ci && npm run build`
**Start Command:** `npm run start:prod`
**Plan:** Starter (512 MB RAM)
**Environment Variables:**

```bash
# Required Environment Variables
NODE_ENV=production
PORT=3000
BASE_URL=https://your-app.onrender.com

# Database Configuration (Render PostgreSQL)
DATABASE_HOST=${DATABASE_HOST}
DATABASE_PORT=5432
DATABASE_USERNAME=${DATABASE_USERNAME}
DATABASE_PASSWORD=${DATABASE_PASSWORD}
DATABASE_NAME=${DATABASE_NAME}

# Redis Configuration (Render Redis)
REDIS_HOST=${REDIS_HOST}
REDIS_PORT=6379
REDIS_PASSWORD=${REDIS_PASSWORD}
REDIS_DB=0

# Security
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-super-secret-refresh-key-minimum-32-characters
JWT_REFRESH_EXPIRES_IN=7d
BcryptSaltRounds=12
THROTTLE_TTL=60
THROTTLE_LIMIT=100

# External Services
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
GEMINI_API_KEY=your-gemini-api-key
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=noreply@birge.kz
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-s3-bucket-name

# AI Configuration
AI_DEFAULT_STYLE=friendly
AI_DEFAULT_FREQUENCY=moderate
```

## Option 2: Docker Deployment

**Service Type:** Web Service
**Runtime:** Docker
**Dockerfile Path:** `./Dockerfile`
**Environment Variables:** Same as above

## Render Services Setup

### 1. Create PostgreSQL Database
1. Go to Render Dashboard
2. Click "New" → "PostgreSQL"
3. Choose:
   - Name: `birge-postgres`
   - Database: `birge_db`
   - Region: Your preferred region
   - Plan: Free (for development) or Standard (for production)

### 2. Create Redis Instance
1. Go to Render Dashboard
2. Click "New" → "Redis"
3. Choose:
   - Name: `birge-redis`
   - Region: Same as PostgreSQL
   - Plan: Free (for development) or Standard (for production)

### 3. Deploy Web Service
1. Go to Render Dashboard
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - Name: `birge-backend`
   - Region: Same as database services
   - Branch: `main`
   - Build Command: `npm ci && npm run build`
   - Start Command: `npm run start:prod`
   - Plan: Starter (512MB RAM)
5. Add all environment variables from above
6. Click "Create Web Service"

## Health Check Configuration

The service includes a health check endpoint at `/api/health` that returns:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "memory": {
    "rss": 123456789,
    "heapTotal": 98765432,
    "heapUsed": 54321098,
    "external": 1234567
  }
}
```

## Domain and SSL

1. **Custom Domain** (Optional):
   - In your web service → Settings → Custom Domains
   - Add your domain
   - Follow Render's DNS configuration instructions

2. **SSL Certificate**:
   - Automatically provided by Render for custom domains
   - Free SSL for all Render services

## Monitoring and Logs

- **Logs**: Available in Render Dashboard → Your Service → Logs
- **Metrics**: CPU, Memory, and Response time graphs
- **Alerts**: Configure in Settings → Alerts

## Scaling Options

- **Auto Scaling**: Available in Standard and Pro plans
- **Manual Scaling**: Upgrade plan and adjust instance count
- **Cron Jobs**: Use Render Cron Jobs for scheduled tasks

## Backup and Recovery

- **Database Backups**: Automatic daily backups by Render
- **Manual Exports**: Available in database service settings
- **Point-in-time Recovery**: Available in paid plans

## Cost Estimation

**Free Tier**:
- Web Service: 512MB RAM (sleeps after 15 min inactivity)
- PostgreSQL: 1GB storage
- Redis: 25MB storage

**Paid Options**:
- Starter: $7/month (512MB RAM, always on)
- Standard: $20/month (1GB RAM)
- Pro: $75/month (4GB RAM)