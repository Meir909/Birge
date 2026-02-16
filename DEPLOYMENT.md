# BIRoad Deployment Guide

## Render.com Deployment

### Prerequisites
- Node.js 18+
- Supabase project
- Twilio account (optional)

### Steps
1. Connect GitHub repository to Render
2. Add environment variables
3. Deploy automatically

### Environment Variables
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret
PORT=3002
NODE_ENV=production
```

### Troubleshooting
Check logs for deployment issues.
