# AI Chatbot Integration Guide

## Overview
BIRoad includes an AI-powered chatbot for user assistance.

## Features
- Natural language processing
- Trip planning assistance
- Real-time help
- Multi-language support

## API Endpoints
- POST /api/chatbot/message
- GET /api/chatbot/history

## Integration
```javascript
// Send message to chatbot
const response = await fetch('/api/chatbot/message', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'Hello!' })
});
```

## Configuration
- AI model: Google Gemini
- Context awareness
- Safety filters
