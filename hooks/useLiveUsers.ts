import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { LiveStats, UserActivityStatus, AppState } from '../types';

// URL Server Backend (Port 3001)
const SOCKET_URL = 'http://localhost:3001';

export const useLiveUsers = (currentAppState: AppState) => {
  const [stats, setStats] = useState<LiveStats>({
    online: 1, 
    uploading: 0,
    analyzing: 0,
    reading: 0,
    chatting: 0
  });
  
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnectionAttempts: 5
    });

    setSocket(newSocket);

    newSocket.on('live:update', (newStats: LiveStats) => {
      setStats(newStats);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    let status: UserActivityStatus = 'idle';

    // Mapping AppState kamu ke status simple
    switch (currentAppState) {
      case AppState.LANDING:
      case AppState.ABOUT_WEBSITE:
      case AppState.ABOUT_CREATOR:
        status = 'idle';
        break;
      case AppState.UPLOAD:
      case AppState.INSTRUCTIONS:
        status = 'uploading';
        break;
      case AppState.PROCESSING:
        status = 'analyzing';
        break;
      case AppState.INSIGHTS:
        status = 'reading';
        break;
      case AppState.CHAT:
        status = 'chatting';
        break;
      default:
        status = 'idle';
    }

    socket.emit('user:status', status);

  }, [currentAppState, socket]);

  // Ping server tiap 20 detik
  useEffect(() => {
    if (!socket) return;
    const interval = setInterval(() => {
      socket.emit('user:heartbeat');
    }, 20000);
    return () => clearInterval(interval);
  }, [socket]);

  return stats;
};   