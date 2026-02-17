# 🚀 Deployment Guide

## Deploying to Render.com

This guide explains how to deploy the Birge backend to Render with different deployment options.

## 📋 Prerequisites

1. **Render Account**: Create a free account at [render.com](https://render.com)
2. **GitHub Repository**: Your code should be pushed to GitHub
3. **API Keys**: Prepare all required API keys (Twilio, SendGrid, Google Maps, etc.)

## 🎯 Deployment Options

### Option 1: Monolithic Deployment (Recommended)

Deploy everything as a single web service using Render's managed databases.

**Pros:**
- Simple setup
- Easy maintenance
- Cost-effective
- Automatic scaling

**Cons:**
- Single point of failure
- Limited customization

**Steps:**
1. Create PostgreSQL database on Render
2. Create Redis instance on Render
3. Deploy web service with environment variables

### Option 2: Docker Compose Deployment

Deploy using Docker Compose with all services in one container.

**Pros:**
- Full control over services
- Consistent environment
- Easy local testing

**Cons:**
- More complex setup
- Higher resource usage

### Option 3: Microservices Deployment

Deploy each service separately (database, cache, app).

**Pros:**
- Maximum scalability
- Independent scaling
- Better fault isolation

**Cons:**
- Complex setup
- Higher costs
- More maintenance

## 🔧 Step-by-Step Deployment

### 1. Create Render Services

#### PostgreSQL Database
```bash
# In Render Dashboard
New → PostgreSQL
Name: birge-postgres
Database: birge_db
Plan: Free (development) or Standard (production)
```

#### Redis Instance
```bash
# In Render Dashboard
New → Redis
Name: birge-redis
Plan: Free (development) or Standard (production)
```

### 2. Configure Environment Variables

Copy `.env.render.example` to `.env.render` and fill in your values:

```bash
cp .env.render.example .env.render
# Edit .env.render with your actual values
```

### 3. Deploy Web Service

#### Using Render Dashboard:
1. Go to Render Dashboard
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `birge-backend`
   - **Region**: Choose your preferred region
   - **Branch**: `main`
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm run start:prod`
   - **Plan**: Starter (512MB RAM)
5. Add environment variables from your `.env.render` file
6. Click "Create Web Service"

#### Using Render CLI:
```bash
# Install Render CLI
npm install -g render-cli

# Deploy
render deploy --env=production
```

### 4. Verify Deployment

Check the deployment status:
```bash
# Health check
curl https://your-app.onrender.com/api/health

# API documentation
curl https://your-app.onrender.com/api
```

## 🛠️ Environment Configuration

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_HOST` | PostgreSQL host | `dpg-xxxxx.render.com` |
| `DATABASE_USERNAME` | Database username | `birge_user` |
| `DATABASE_PASSWORD` | Database password | `your-password` |
| `REDIS_HOST` | Redis host | `redis-xxxxx.render.com` |
| `REDIS_PASSWORD` | Redis password | `your-redis-password` |
| `JWT_SECRET` | JWT secret key | `32+ character string` |
| `GEMINI_API_KEY` | Google Gemini API key | `AIzaSy...` |

### Optional Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `production` |
| `PORT` | Server port | `3000` |
| `THROTTLE_LIMIT` | Rate limit | `100` |
| `LOG_LEVEL` | Logging level | `info` |

## 📊 Monitoring and Maintenance

### Health Checks
The application includes a health check endpoint at `/api/health` that monitors:
- Application status
- Memory usage
- Uptime
- Database connectivity

### Logs
View logs in the Render dashboard:
- Real-time logs
- Historical logs
- Error tracking

### Alerts
Configure alerts in Render:
- CPU usage
- Memory usage
- Response time
- Error rate

## 🔒 Security Best Practices

1. **Environment Variables**: Never commit `.env` files to version control
2. **Secrets Management**: Use Render's secret management
3. **HTTPS**: Always use HTTPS (automatically provided by Render)
4. **Rate Limiting**: Configure appropriate rate limits
5. **Database Security**: Use strong passwords and limit connections

## 💰 Cost Estimation

### Free Tier
- Web Service: 512MB RAM (sleeps after 15min inactivity)
- PostgreSQL: 1GB storage
- Redis: 25MB storage
- **Total: $0/month**

### Paid Options
- **Starter**: $7/month (512MB RAM, always on)
- **Standard**: $20/month (1GB RAM)
- **Pro**: $75/month (4GB RAM)

## 🆘 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Check build logs in Render dashboard
   # Ensure all dependencies are in package.json
   ```

2. **Database Connection Errors**
   ```bash
   # Verify database credentials
   # Check if database service is running
   # Ensure correct connection string format
   ```

3. **Environment Variables Not Loading**
   ```bash
   # Check variable names match exactly
   # Verify no extra spaces or quotes
   # Restart service after updating variables
   ```

4. **Health Check Failures**
   ```bash
   # Check if port 3000 is exposed
   # Verify health check endpoint exists
   # Check application logs for errors
   ```

### Debugging Commands

```bash
# Check application status
curl https://your-app.onrender.com/api/health

# View recent logs
render logs --service=your-service-name

# Restart service
render restart --service=your-service-name
```

## 🔄 CI/CD Integration

### GitHub Actions Example
```yaml
name: Deploy to Render
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        run: |
          curl -X POST https://api.render.com/deploy/your-service-id \
          -H "Authorization: Bearer ${{ secrets.RENDER_API_KEY }}"
```

## 📈 Scaling

### Auto Scaling
Available in Standard and Pro plans:
- CPU-based scaling
- Memory-based scaling
- Request-based scaling

### Manual Scaling
- Upgrade service plan
- Increase instance count
- Add more resources

## 🎯 Next Steps

1. **Domain Setup**: Configure custom domain in Render
2. **SSL Certificate**: Automatically provided by Render
3. **Monitoring**: Set up alerts and monitoring
4. **Backup Strategy**: Configure automated backups
5. **Performance Optimization**: Monitor and optimize performance

## 📞 Support

- **Render Support**: https://render.com/help
- **Documentation**: https://docs.render.com
- **Community**: https://community.render.com