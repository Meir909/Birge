# 🚀 BIRoad Render Configuration (Fixed)
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

# MongoDB Database
databases:
  - name: biroad-mongodb
    databaseName: biroad
    user: biroad_user
    plan: free
