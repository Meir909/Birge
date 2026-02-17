import { writeFileSync } from 'fs';
import { join } from 'path';

const envExample = `# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=birge_dev

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_REFRESH_EXPIRES_IN=7d

# Google Maps API
GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Google Gemini API
GEMINI_API_KEY=your-gemini-api-key

# Twilio SMS
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number

# Email Configuration (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=noreply@birge.kz

# AWS S3
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-s3-bucket-name

# Application Configuration
PORT=3000
NODE_ENV=development
BASE_URL=http://localhost:3000

# Security
BcryptSaltRounds=12
THROTTLE_TTL=60
THROTTLE_LIMIT=10

# AI Configuration
AI_DEFAULT_STYLE=friendly
AI_DEFAULT_FREQUENCY=moderate
`;

writeFileSync(join(process.cwd(), '.env.example'), envExample);
console.log('.env.example created successfully');