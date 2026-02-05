import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Configure CORS for frontend access
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow all origins for simplicity in this demo
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// --- IN-MEMORY DATA STORE (No Database) ---
// Structure: Map<socketId, { status: string, lastHeartbeat: number }>
const activeUsers = new Map();

// Helper to calculate stats
const calculateStats = () => {
  const stats = {
    online: 0,
    uploading: 0,
    analyzing: 0,
    reading: 0,
    chatting: 0
  };

  stats.online = activeUsers.size;

  activeUsers.forEach((userData) => {
    if (userData.status === 'uploading') stats.uploading++;
    else if (userData.status === 'analyzing') stats.analyzing++;
    else if (userData.status === 'reading') stats.reading++;
    else if (userData.status === 'chatting') stats.chatting++;
  });

  return stats;
};

// Broadcast stats to all connected clients
const broadcastStats = () => {
  const stats = calculateStats();
  io.emit('live:update', stats);
};

io.on('connection', (socket) => {
  // 1. Register new user
  activeUsers.set(socket.id, { status: 'idle', lastHeartbeat: Date.now() });
  broadcastStats();

  // 2. Handle Status Update from Client
  socket.on('user:status', (status) => {
    const user = activeUsers.get(socket.id);
    if (user) {
      user.status = status;
      activeUsers.set(socket.id, user);
      broadcastStats();
    }
  });

  // 3. Heartbeat to keep connection alive logic (optional extended logic)
  socket.on('user:heartbeat', () => {
    const user = activeUsers.get(socket.id);
    if (user) {
      user.lastHeartbeat = Date.now();
      activeUsers.set(socket.id, user);
    }
  });

  // 4. Handle Disconnect
  socket.on('disconnect', () => {
    activeUsers.delete(socket.id);
    broadcastStats();
  });
});

// Basic Health Check
app.get('/', (req, res) => {
  res.send('Recap Chat Realtime Server is Running');
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});