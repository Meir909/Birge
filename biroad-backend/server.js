const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config({ path: '../.env' });

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'BIRoad backend is running!', timestamp: new Date().toISOString() });
});

app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/users', require('./src/routes/users'));
app.use('/api/rides', require('./src/routes/rides'));
app.use('/api/chat', require('./src/routes/chat'));
app.use('/api/sos', require('./src/routes/sos'));
app.use('/api/ai', require('./src/routes/ai'));
app.use('/api/chatbot', require('./src/routes/chatbot'));

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join-ride', (rideId) => {
    socket.join(`ride-${rideId}`);
    console.log(`User ${socket.id} joined ride ${rideId}`);
  });
  
  socket.on('location-update', (data) => {
    socket.to(`ride-${data.rideId}`).emit('location-update', data);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`BIRoad backend running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
